import type { MemStorage } from "./storage";
import bcrypt from 'bcrypt';

export async function initializeDemoData(storage: MemStorage) {
  // Always create the user account on startup (in memory storage resets)
  const existingUserAccount = await storage.getUserByEmail("dom.ward1@hotmail.co.uk");
  if (!existingUserAccount) {
    const userAccount = await storage.createUser({
      username: "dom.ward1",
      email: "dom.ward1@hotmail.co.uk",
      password: "$2b$12$A0WuWGusI7znJGX6byaOuOe5xJJKUBUTiE.Z8k83CsmELxgfFWybu", // hashed "Horace82"
      paperTradingEnabled: true,
      dailyLossLimit: "1000.00",
      positionSizeLimit: "10.00",
      circuitBreakerEnabled: true,
    });
    console.log("User account created on startup for:", userAccount.username);
  }

  // Create demo user with known credentials for testing
  let demoUser = await storage.getUserByUsername('demo');
  if (!demoUser) {
    demoUser = await storage.createUser({
      username: 'demo',
      email: 'demo@pnlai.com',
      password: await bcrypt.hash('demo123', 12),
      paperTradingEnabled: true,
      dailyLossLimit: "1000.00",
      positionSizeLimit: "5.00",
      circuitBreakerEnabled: true,
    });
    console.log("Demo user created:", demoUser.username);
  } else {
    // Update existing demo user password to ensure it's correct
    await storage.updateUser(demoUser.id, {
      password: await bcrypt.hash('demo123', 12)
    });
    console.log("Demo user password updated");
  }

  // Create all expected users with proper credentials
  const users = [
    { username: 'Andy', password: 'Sharon12', email: 'andy@test.com' },
    { username: 'Dom.ward1', password: 'Horace82', email: 'dom.ward1@hotmail.co.uk' },
    { username: 'testuser', password: 'password123', email: 'test@test.com' }
  ];

  for (const userData of users) {
    let existingUser = await storage.getUserByUsername(userData.username);
    if (!existingUser) {
      existingUser = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 12),
        paperTradingEnabled: true,
        dailyLossLimit: "1000.00",
        positionSizeLimit: "5.00",
        circuitBreakerEnabled: true,
      });
      console.log(`User created: ${userData.username}`);
    } else {
      // Update password to ensure it's correct
      await storage.updateUser(existingUser.id, {
        password: await bcrypt.hash(userData.password, 12)
      });
      console.log(`User password updated: ${userData.username}`);
    }
  }

  // Get demo user for demo data creation
  const existingTestUser = demoUser;
  if (!existingTestUser) {
    const testUser = await storage.createUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123', // Note: In a real app, this should be hashed.
      paperTradingEnabled: true,
      dailyLossLimit: "1000.00",
      positionSizeLimit: "5.00",
      circuitBreakerEnabled: true,
    });
    console.log("Test user created:", testUser.username);
  }

  // Create demo exchanges
  await storage.createExchange({
    userId: demoUser.id,
    name: "Coinbase Pro",
    type: "coinbase",
    apiKey: null,
    apiSecret: null,
    passphrase: null,
    isActive: true,
    lastSync: new Date(),
  });

  await storage.createExchange({
    userId: demoUser.id,
    name: "Kraken",
    type: "kraken",
    apiKey: null,
    apiSecret: null,
    passphrase: null,
    isActive: false,
    lastSync: null,
  });

  // Initialize sentiment data using updateSentimentData (creates if not exists)
  await storage.updateSentimentData("BTC", 72, 68, 75, 80, "12.3", ["Strong social buzz", "Positive news flow"]);
  await storage.updateSentimentData("ETH", 65, 60, 70, 50, "8.7", ["Mixed sentiment", "Awaiting updates"]);

  // Create demo activities
  await storage.createActivity({
    userId: demoUser.id,
    type: "trade",
    title: "BUY BTC order executed",
    description: "Market order for 0.5 BTC executed successfully",
    reason: "Sentiment analysis triggered buy signal",
    symbol: "BTC",
    amount: "0.5",
  });

  await storage.createActivity({
    userId: demoUser.id,
    type: "bot_action",
    title: "Sentiment bot activated",
    description: "Grid trading bot started for ETH/USDT",
    reason: "High confidence sentiment signal detected",
    symbol: "ETH",
    amount: "0",
  });

  // Create demo trading bot
  await storage.createBot({
    userId: demoUser.id,
    name: "BTC Sentiment Grid",
    type: "grid",
    symbol: "BTC/USDT",
    config: {
      gridLevels: 10,
      upperPrice: 52000,
      lowerPrice: 48000,
      gridSpacing: 400
    },
    isActive: true,
    totalInvested: "5000.00",
    totalProfit: "245.67",
  });



  console.log("Demo data initialized successfully for user:", demoUser.username);
  return demoUser;
}