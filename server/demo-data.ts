import type { MemStorage } from "./storage";

export async function initializeDemoData(storage: MemStorage) {
  // Create demo user with simple credentials for testing
  const demoUser = await storage.createUser({
    username: "demo",
    email: "demo@pnlai.com",
    password: "$2b$12$LQv3c1yqBwEHxv62kjPLTO.dUDL5GlVHQNxtcdFQvlFoSJ6i1nY2q", // hashed "demo123"
    paperTradingEnabled: true,
    dailyLossLimit: "1000.00",
    positionSizeLimit: "5.00",
    circuitBreakerEnabled: true,
  });

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
  await storage.updateSentimentData("BTC", 72, 68, 75, "bullish", 12.3, ["Strong social buzz", "Positive news flow"]);
  await storage.updateSentimentData("ETH", 65, 60, 70, "neutral", 8.7, ["Mixed sentiment", "Awaiting updates"]);

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