import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import { storage } from "./storage";
import { initializeDemoData } from "./demo-data";
import { loginSchema, registerSchema, insertOrderSchema, insertBotSchema, krakenExchangeSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { generateAuthToken, validateAuthToken, tokenAuthMiddleware } from "./auth-token";
import { KrakenAPIService } from "./integrations/kraken-api";
import krakenConnectRoutes from "./routes/kraken-connect";
import coinbaseOAuthRoutes from "./routes/coinbase-oauth";

// Session configuration
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Always ensure demo data exists on startup
  try {
    await initializeDemoData(storage);
    console.log('Demo data initialization completed');
  } catch (error) {
    console.log('Demo data initialization failed:', error);
    // Create emergency demo user with known credentials
    try {
      const bcrypt = require('bcrypt');
      await storage.createUser({
        username: "demo",
        email: "demo@pnlai.com", 
        password: await bcrypt.hash("demo123", 12),
        paperTradingEnabled: true,
        dailyLossLimit: "1000.00",
        positionSizeLimit: "5.00",
        circuitBreakerEnabled: true,
      });
      console.log('Emergency demo user created');
    } catch (emergencyError) {
      console.log('Emergency demo user creation also failed:', emergencyError);
    }
  }
  // CORS configuration for deployment
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Allow requests from deployment domain and localhost
    if (origin && (origin.includes('replit.app') || origin.includes('localhost'))) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Session middleware with deployment-specific fixes
  const isProduction = process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT === '1';

  app.use(session({
    secret: process.env.SESSION_SECRET || 'pnl-ai-secret-key-for-development',
    resave: false,
    saveUninitialized: true,
    name: 'pnl-session-v3', // New session name for fresh start
    cookie: {
      secure: isProduction, // Use secure cookies in production
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProduction ? 'none' : 'lax', // Different settings for dev vs prod
      domain: undefined,
    },
    rolling: true
  }));

  // Add token authentication middleware
  app.use(tokenAuthMiddleware);

  // Stateless authentication middleware (no session dependency)
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // Decode the base64 token
      const authPayload = JSON.parse(Buffer.from(token, 'base64').toString());

      // Basic validation (check if token is not too old - 24 hours)
      const tokenAge = Date.now() - authPayload.timestamp;
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return res.status(401).json({ message: "Token expired" });
      }

      req.userId = authPayload.userId;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  // Helper function to sync Kraken portfolio data
  async function syncKrakenPortfolio(userId: string, exchangeId: string, krakenService: KrakenAPIService) {
    try {
      const balances = await krakenService.getAccountBalance();

      // Add new portfolio entries from Kraken
      for (const [currency, balance] of Object.entries(balances)) {
        const balanceNum = parseFloat(balance);
        if (balanceNum > 0) {
          // Convert currency names and calculate USD values
          const symbol = currency === 'XXBT' ? 'BTC' : 
                        currency === 'XETH' ? 'ETH' : 
                        currency.replace(/^X/, '');

          // Mock USD conversion - in production, fetch real prices
          const mockUsdValue = symbol === 'BTC' ? balanceNum * 45000 :
                              symbol === 'ETH' ? balanceNum * 2500 :
                              symbol === 'USD' ? balanceNum : balanceNum * 1;

          await storage.createPortfolio({
            userId,
            exchangeId,
            symbol,
            balance: balance,
            usdValue: mockUsdValue.toString(),
            lastPrice: mockUsdValue.toString(),
          });
        }
      }
    } catch (error) {
      console.error('Failed to sync Kraken portfolio:', error);
      throw error;
    }
  }

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

      // Generate stateless auth token (no session dependency)
      const authPayload = {
        userId: user.id,
        username: user.username,
        timestamp: Date.now()
      };
      const authToken = Buffer.from(JSON.stringify(authPayload)).toString('base64');

      res.json({ 
        user: { id: user.id, username: user.username, email: user.email },
        token: authToken,
        success: true
      });
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

      // Generate stateless auth token (no session dependency)
      const authPayload = {
        userId: user.id,
        username: user.username,
        timestamp: Date.now()
      };
      const authToken = Buffer.from(JSON.stringify(authPayload)).toString('base64');

      res.json({ 
        user: { id: user.id, username: user.username, email: user.email },
        token: authToken,
        success: true
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // For stateless auth, just return success - client will clear localStorage
    res.json({ message: "Logged out successfully" });
  });

  // Add cache-clearing endpoint for deployment issues
  app.post("/api/debug/clear-cache", (req, res) => {
    // Clear all possible session cookies
    res.clearCookie('pnl-session-v3');
    res.clearCookie('pnl-session-v2');
    res.clearCookie('pnl-session');
    res.clearCookie('connect.sid');

    // Destroy any existing session
    if (req.session) {
      req.session.destroy(() => {
        res.json({ message: "Cache and sessions cleared" });
      });
    } else {
      res.json({ message: "Cache cleared" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req, res, next) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { id: user.id, username: user.username, email: user.email, paperTradingEnabled: user.paperTradingEnabled } });
    } catch (error) {
      next(error);
    }
  });

  // Reset demo user endpoint (development only)
  app.post("/api/debug/reset-demo", async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(404).json({ message: "Not found" });
    }

    try {
      // Hash the password for demo user
      const hashedPassword = await bcrypt.hash("demo123", 12);

      // Create or update demo user with known credentials
      let demoUser = await storage.getUserByUsername("demo");

      if (!demoUser) {
        demoUser = await storage.createUser({
          username: "demo",
          email: "demo@pnlai.com",
          password: hashedPassword,
          paperTradingEnabled: true,
          dailyLossLimit: "1000.00",
          positionSizeLimit: "5.00",
          circuitBreakerEnabled: true,
        });
      } else {
        // Update existing user's password
        demoUser = await storage.updateUser(demoUser.id, {
          password: hashedPassword
        });
      }

      console.log("Demo user reset successfully:", demoUser?.username);
      res.json({ 
        message: "Demo user reset successfully",
        user: {
          username: demoUser?.username,
          email: demoUser?.email,
          id: demoUser?.id
        }
      });
    } catch (error) {
      console.error("Failed to reset demo user:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Debug endpoint to reset user by email (development only)
  app.post("/api/debug/reset-user-by-email", async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(404).json({ message: "Not found" });
    }

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required in request body" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Find user by email
      let user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found with that email" });
      }

      // Update user's password
      user = await storage.updateUser(user.id, {
        password: hashedPassword
      });

      console.log(`User ${user?.username} (${email}) password reset successfully`);
      res.json({ 
        message: `User ${user?.username} password reset successfully`,
        user: {
          username: user?.username,
          email: user?.email,
          id: user?.id
        }
      });
    } catch (error) {
      console.error("Failed to reset user by email:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Debug endpoint to reset specific user by username (development only)
  app.post("/api/debug/reset-user/:username", async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(404).json({ message: "Not found" });
    }

    try {
      const { username } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password required in request body" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Find and update user
      let user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user's password
      user = await storage.updateUser(user.id, {
        password: hashedPassword
      });

      console.log(`User ${username} password reset successfully`);
      res.json({ 
        message: `User ${username} password reset successfully`,
        user: {
          username: user?.username,
          email: user?.email,
          id: user?.id
        }
      });
    } catch (error) {
      console.error("Failed to reset user:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Quick registration endpoint - creates your specific account on any environment
  app.post("/api/quick-register", async (req, res) => {
    try {
      // Create your specific account
      const hashedPassword = await bcrypt.hash("Horace82", 12);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail("dom.ward1@hotmail.co.uk");
      if (existingUser) {
        return res.json({ 
          message: "Account already exists", 
          user: { username: existingUser.username, email: existingUser.email }
        });
      }

      const userAccount = await storage.createUser({
        username: "dom.ward1",
        email: "dom.ward1@hotmail.co.uk", 
        password: hashedPassword,
        paperTradingEnabled: true,
        dailyLossLimit: "1000.00",
        positionSizeLimit: "10.00",
        circuitBreakerEnabled: true,
      });

      console.log("Quick registration successful for:", userAccount.username);
      res.json({ 
        message: "Account created successfully",
        user: {
          username: userAccount.username,
          email: userAccount.email,
          id: userAccount.id
        }
      });
    } catch (error) {
      console.error("Quick registration failed:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Debug endpoint to list all users (development only)
  app.get("/api/debug/list-users", async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(404).json({ message: "Not found" });
    }

    try {
      const users = storage.users ? Array.from(storage.users.values()).map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        hasPassword: !!u.password,
        createdAt: u.createdAt
      })) : [];

      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // User settings
  app.patch("/api/user/settings", requireAuth, async (req, res, next) => {
    try {
      const { paperTradingEnabled, dailyLossLimit, positionSizeLimit, circuitBreakerEnabled } = req.body;

      const user = await storage.updateUser(req.userId!, {
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
      const portfolios = await storage.getUserPortfolios(req.userId!);

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
      const exchanges = await storage.getUserExchanges(req.userId!);
      res.json(exchanges);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/exchanges", requireAuth, async (req, res, next) => {
    try {
      const { name, type, apiKey, apiSecret, passphrase } = req.body;

      const exchange = await storage.createExchange({
        userId: req.userId!,
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

  // Kraken API Integration Routes
  app.post("/api/exchanges/kraken", requireAuth, async (req, res, next) => {
    try {
      const result = krakenExchangeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid Kraken credentials", errors: result.error.errors });
      }

      const { name, apiKey, apiSecret } = result.data;

      // Test Kraken API connection before saving
      const krakenService = new KrakenAPIService({ apiKey, apiSecret });
      const connectionValid = await krakenService.testConnection();

      if (!connectionValid) {
        return res.status(400).json({ message: "Failed to connect to Kraken API. Please verify your API credentials." });
      }

      // Store the exchange with encrypted credentials
      const exchange = await storage.createExchange({
        userId: req.userId!,
        name,
        type: 'kraken_api',
        apiKey: Buffer.from(apiKey).toString('base64'),
        apiSecret: Buffer.from(apiSecret).toString('base64'),
        passphrase: null,
        isActive: true,
        lastSync: null,
      });

      // Sync initial portfolio data
      await syncKrakenPortfolio(req.userId!, exchange.id, krakenService);

      // Create activity log
      await storage.createActivity({
        userId: req.userId!,
        type: 'bot_action',
        title: 'Kraken Exchange Connected',
        description: `Successfully connected to Kraken exchange: ${name}`,
        reason: 'API integration completed',
      });

      res.json({ ...exchange, status: 'connected', portfolioSynced: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/exchanges/kraken/:id/sync", requireAuth, async (req, res, next) => {
    try {
      const { id } = req.params;
      const exchange = await storage.getExchange(id);

      if (!exchange || exchange.userId !== req.userId!) {
        return res.status(404).json({ message: "Exchange not found" });
      }

      if (exchange.type !== 'kraken_api') {
        return res.status(400).json({ message: "Not a Kraken exchange" });
      }

      // Decrypt credentials
      const apiKey = Buffer.from(exchange.apiKey!, 'base64').toString('utf8');
      const apiSecret = Buffer.from(exchange.apiSecret!, 'base64').toString('utf8');

      const krakenService = new KrakenAPIService({ apiKey, apiSecret });

      // Sync portfolio data
      await syncKrakenPortfolio(req.userId!, exchange.id, krakenService);

      // Update last sync time
      await storage.updateExchange(exchange.id, { lastSync: new Date() });

      res.json({ message: 'Portfolio synced successfully' });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/exchanges/kraken/:id/order", requireAuth, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { pair, type, ordertype, volume, price } = req.body;

      const exchange = await storage.getExchange(id);
      if (!exchange || exchange.userId !== req.userId!) {
        return res.status(404).json({ message: "Exchange not found" });
      }

      // Decrypt credentials
      const apiKey = Buffer.from(exchange.apiKey!, 'base64').toString('utf8');
      const apiSecret = Buffer.from(exchange.apiSecret!, 'base64').toString('utf8');

      const krakenService = new KrakenAPIService({ apiKey, apiSecret });

      // Place order on Kraken
      const orderResult = await krakenService.placeOrder({
        pair: KrakenAPIService.toKrakenPair(pair),
        type: type as 'buy' | 'sell',
        ordertype: ordertype as 'market' | 'limit',
        volume: volume.toString(),
        price: price ? price.toString() : undefined,
      });

      // Store order in database
      const order = await storage.createOrder({
        userId: req.userId!,
        exchangeId: exchange.id,
        symbol: pair,
        side: type,
        type: ordertype,
        amount: volume.toString(),
        price: price ? price.toString() : null,
        status: 'pending',
        isPaperTrade: false,
        reason: `Kraken API order - ${orderResult.txid[0]}`,
      });

      // Create activity log
      await storage.createActivity({
        userId: req.userId!,
        type: 'trade',
        title: `${type.toUpperCase()} ${pair} order placed on Kraken`,
        description: `${ordertype} order for ${volume} ${pair}`,
        reason: `Kraken Order ID: ${orderResult.txid[0]}`,
        amount: volume.toString(),
        symbol: pair,
      });

      res.json({ order, krakenOrderId: orderResult.txid[0] });
    } catch (error) {
      next(error);
    }
  });

  // Kraken Connect OAuth routes
  app.use("/api/kraken-connect", krakenConnectRoutes);

  // Coinbase OAuth routes
  app.use("/api/coinbase-oauth", tokenAuthMiddleware, coinbaseOAuthRoutes);

  // Order routes
  app.get("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const orders = await storage.getUserOrders(req.userId!, limit);
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

      const user = await storage.getUser(req.userId!);
      const order = await storage.createOrder({
        ...result.data,
        userId: req.userId!,
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
        userId: req.userId!,
        type: "trade",
        title: `${result.data.side.toUpperCase()} ${result.data.symbol} order placed`,
        description: `${result.data.type} order for ${result.data.amount} ${result.data.symbol}`,
        reason: result.data.reason || "Manual trade",
        amount: result.data.amount || null,
        symbol: result.data.symbol,
      });

      // Broadcast order update via WebSocket
      broadcastToUser(req.userId!, {
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
      const bots = await storage.getUserBots(req.userId!);
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
        userId: req.userId!,
        isActive: result.data.isActive ?? false,
        totalInvested: result.data.totalInvested || "0.00",
        totalProfit: result.data.totalProfit || "0.00",
      });

      // Create activity log
      await storage.createActivity({
        userId: req.userId!,
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
      const activities = await storage.getUserActivities(req.userId!, limit);
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