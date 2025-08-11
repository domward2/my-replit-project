import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import { storage } from "./storage";
import { initializeDemoData } from "./demo-data";
import { loginSchema, registerSchema, insertOrderSchema, insertBotSchema } from "@shared/schema";
import bcrypt from "bcrypt";

// Session configuration
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize demo data
  await initializeDemoData(storage);
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'pnl-ai-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.errors });
      }

      const { username, email, password } = result.data;

      // Check if user exists
      const existingUser = await storage.getUserByUsername(username) || await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        paperTradingEnabled: true,
        dailyLossLimit: "1000.00",
        positionSizeLimit: "5.00",
        circuitBreakerEnabled: true,
      });

      req.session.userId = user.id;
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const { username, password } = result.data;
      const user = await storage.getUserByUsername(username);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res, next) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { id: user.id, username: user.username, email: user.email, paperTradingEnabled: user.paperTradingEnabled } });
    } catch (error) {
      next(error);
    }
  });

  // User settings
  app.patch("/api/user/settings", requireAuth, async (req, res, next) => {
    try {
      const { paperTradingEnabled, dailyLossLimit, positionSizeLimit, circuitBreakerEnabled } = req.body;
      
      const user = await storage.updateUser(req.session.userId!, {
        paperTradingEnabled,
        dailyLossLimit,
        positionSizeLimit,
        circuitBreakerEnabled,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  });

  // Portfolio routes
  app.get("/api/portfolio", requireAuth, async (req, res, next) => {
    try {
      const portfolios = await storage.getUserPortfolios(req.session.userId!);
      
      // Calculate totals
      const totalBalance = portfolios.reduce((sum, p) => sum + parseFloat(p.usdValue), 0);
      const activePositions = portfolios.filter(p => parseFloat(p.balance) > 0).length;
      
      res.json({ 
        portfolios, 
        totalBalance: totalBalance.toFixed(2),
        activePositions,
        dailyPnL: "2847.23", // This would be calculated based on historical data
        dailyPnLPercent: "12.34"
      });
    } catch (error) {
      next(error);
    }
  });

  // Sentiment routes
  app.get("/api/sentiment/:symbol", async (req, res, next) => {
    try {
      const { symbol } = req.params;
      const sentimentData = await storage.getSentimentData(symbol.toUpperCase());
      
      if (!sentimentData) {
        return res.status(404).json({ message: "Sentiment data not found" });
      }

      res.json(sentimentData);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/sentiment", async (req, res, next) => {
    try {
      const btcSentiment = await storage.getSentimentData('BTC');
      const ethSentiment = await storage.getSentimentData('ETH');
      
      res.json({
        BTC: btcSentiment,
        ETH: ethSentiment,
      });
    } catch (error) {
      next(error);
    }
  });

  // Exchange routes
  app.get("/api/exchanges", requireAuth, async (req, res, next) => {
    try {
      const exchanges = await storage.getUserExchanges(req.session.userId!);
      res.json(exchanges);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/exchanges", requireAuth, async (req, res, next) => {
    try {
      const { name, type, apiKey, apiSecret, passphrase } = req.body;
      
      const exchange = await storage.createExchange({
        userId: req.session.userId!,
        name,
        type,
        apiKey: apiKey ? Buffer.from(apiKey).toString('base64') : null, // Simple encoding (in production use proper encryption)
        apiSecret: apiSecret ? Buffer.from(apiSecret).toString('base64') : null,
        passphrase: passphrase ? Buffer.from(passphrase).toString('base64') : null,
        isActive: true,
        lastSync: null,
      });

      res.json(exchange);
    } catch (error) {
      next(error);
    }
  });

  // Order routes
  app.get("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const orders = await storage.getUserOrders(req.session.userId!, limit);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const result = insertOrderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid order data", errors: result.error.errors });
      }

      const user = await storage.getUser(req.session.userId!);
      const order = await storage.createOrder({
        ...result.data,
        userId: req.session.userId!,
        isPaperTrade: user?.paperTradingEnabled || false,
        status: "pending",
        price: result.data.price || null,
        stopLoss: result.data.stopLoss || null,
        takeProfit: result.data.takeProfit || null,
        fillPrice: null,
        fillAmount: null,
        reason: result.data.reason || null,
      });

      // Create activity log
      await storage.createActivity({
        userId: req.session.userId!,
        type: "trade",
        title: `${result.data.side.toUpperCase()} ${result.data.symbol} order placed`,
        description: `${result.data.type} order for ${result.data.amount} ${result.data.symbol}`,
        reason: result.data.reason || "Manual trade",
        amount: result.data.amount || null,
        symbol: result.data.symbol,
      });

      // Broadcast order update via WebSocket
      broadcastToUser(req.session.userId!, {
        type: 'order_placed',
        data: order
      });

      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  // Bot routes
  app.get("/api/bots", requireAuth, async (req, res, next) => {
    try {
      const bots = await storage.getUserBots(req.session.userId!);
      res.json(bots);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/bots", requireAuth, async (req, res, next) => {
    try {
      const result = insertBotSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid bot data", errors: result.error.errors });
      }

      const bot = await storage.createBot({
        ...result.data,
        userId: req.session.userId!,
        isActive: result.data.isActive ?? false,
        totalInvested: result.data.totalInvested || "0.00",
        totalProfit: result.data.totalProfit || "0.00",
      });

      // Create activity log
      await storage.createActivity({
        userId: req.session.userId!,
        type: "bot_action",
        title: `${result.data.type.toUpperCase()} bot created`,
        description: `New ${result.data.type} bot for ${result.data.symbol}`,
        reason: `Bot configuration: ${JSON.stringify(result.data.config)}`,
        symbol: result.data.symbol,
        amount: "0",
      });

      res.json(bot);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/bots/:id", requireAuth, async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const bot = await storage.updateBot(id, updates);
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }

      res.json(bot);
    } catch (error) {
      next(error);
    }
  });

  // Activity routes
  app.get("/api/activities", requireAuth, async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getUserActivities(req.session.userId!, limit);
      res.json(activities);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const userConnections = new Map<string, WebSocket[]>();

  wss.on('connection', (ws: WebSocket, request) => {
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'authenticate' && data.userId) {
          if (!userConnections.has(data.userId)) {
            userConnections.set(data.userId, []);
          }
          userConnections.get(data.userId)!.push(ws);
          
          ws.send(JSON.stringify({
            type: 'authenticated',
            message: 'Connected to real-time updates'
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      // Clean up user connections
      for (const [userId, connections] of Array.from(userConnections.entries())) {
        const index = connections.indexOf(ws);
        if (index > -1) {
          connections.splice(index, 1);
          if (connections.length === 0) {
            userConnections.delete(userId);
          }
        }
      }
    });
  });

  // Helper function to broadcast to specific user
  function broadcastToUser(userId: string, message: any) {
    const connections = userConnections.get(userId);
    if (connections) {
      const messageStr = JSON.stringify(message);
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(messageStr);
        }
      });
    }
  }

  // Periodic sentiment updates (simulate real-time data)
  setInterval(async () => {
    try {
      // Update BTC sentiment with slight variations
      const btcSentiment = await storage.getSentimentData('BTC');
      if (btcSentiment) {
        const newScore = Math.max(0, Math.min(100, btcSentiment.score + (Math.random() - 0.5) * 4));
        await storage.updateSentimentData(
          'BTC',
          Math.round(newScore),
          btcSentiment.socialSentiment,
          btcSentiment.newsSentiment,
          btcSentiment.marketRegime,
          btcSentiment.volatility || "0",
          btcSentiment.signals
        );
      }

      // Update ETH sentiment with slight variations
      const ethSentiment = await storage.getSentimentData('ETH');
      if (ethSentiment) {
        const newScore = Math.max(0, Math.min(100, ethSentiment.score + (Math.random() - 0.5) * 4));
        await storage.updateSentimentData(
          'ETH',
          Math.round(newScore),
          ethSentiment.socialSentiment,
          ethSentiment.newsSentiment,
          ethSentiment.marketRegime,
          ethSentiment.volatility || "0",
          ethSentiment.signals
        );
      }

      // Broadcast sentiment updates to all connected users
      const sentimentUpdate = {
        type: 'sentiment_update',
        data: {
          BTC: await storage.getSentimentData('BTC'),
          ETH: await storage.getSentimentData('ETH'),
        }
      };

      for (const connections of Array.from(userConnections.values())) {
        connections.forEach((ws: WebSocket) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(sentimentUpdate));
          }
        });
      }
    } catch (error) {
      console.error('Sentiment update error:', error);
    }
  }, 30000); // Update every 30 seconds

  return httpServer;
}
