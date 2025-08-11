import { type User, type InsertUser, type Exchange, type Portfolio, type SentimentData, type Order, type Bot, type Activity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Exchange management
  getUserExchanges(userId: string): Promise<Exchange[]>;
  createExchange(exchange: Omit<Exchange, 'id' | 'createdAt'>): Promise<Exchange>;
  updateExchange(id: string, updates: Partial<Exchange>): Promise<Exchange | undefined>;
  deleteExchange(id: string): Promise<boolean>;

  // Portfolio management
  getUserPortfolios(userId: string): Promise<Portfolio[]>;
  updatePortfolio(userId: string, exchangeId: string, symbol: string, balance: string, usdValue: string, lastPrice?: string): Promise<Portfolio>;

  // Sentiment data
  getSentimentData(symbol: string): Promise<SentimentData | undefined>;
  updateSentimentData(symbol: string, score: number, socialSentiment: number, newsSentiment: number, marketRegime: number, volatility: string, signals: string[]): Promise<SentimentData>;

  // Order management
  getUserOrders(userId: string, limit?: number): Promise<Order[]>;
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;

  // Bot management
  getUserBots(userId: string): Promise<Bot[]>;
  createBot(bot: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bot>;
  updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined>;
  deleteBot(id: string): Promise<boolean>;

  // Activity management
  getUserActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private exchanges: Map<string, Exchange>;
  private portfolios: Map<string, Portfolio>;
  private sentimentData: Map<string, SentimentData>;
  private orders: Map<string, Order>;
  private bots: Map<string, Bot>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.exchanges = new Map();
    this.portfolios = new Map();
    this.sentimentData = new Map();
    this.orders = new Map();
    this.bots = new Map();
    this.activities = new Map();

    // Initialize with some sample sentiment data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample sentiment data for major cryptocurrencies
    const btcSentiment: SentimentData = {
      id: randomUUID(),
      symbol: 'BTC',
      score: 87,
      socialSentiment: 85,
      newsSentiment: 90,
      marketRegime: 82,
      volatility: "15.5",
      signals: ["News buzz ↑ (ETF approval rumors)", "Social polarity ↑ (+23% positive mentions)", "Volatility ↑ (institutional buying detected)"],
      lastUpdated: new Date(),
    };

    const ethSentiment: SentimentData = {
      id: randomUUID(),
      symbol: 'ETH',
      score: 34,
      socialSentiment: 28,
      newsSentiment: 35,
      marketRegime: 40,
      volatility: "22.3",
      signals: ["Gas fees concern ↓ (-18% negative sentiment)", "Developer activity ↓ (GitHub commits down)", "Funding rate neutral (wait signal)"],
      lastUpdated: new Date(),
    };

    this.sentimentData.set('BTC', btcSentiment);
    this.sentimentData.set('ETH', ethSentiment);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      paperTradingEnabled: insertUser.paperTradingEnabled ?? true,
      dailyLossLimit: insertUser.dailyLossLimit ?? "1000.00",
      positionSizeLimit: insertUser.positionSizeLimit ?? "5.00",
      circuitBreakerEnabled: insertUser.circuitBreakerEnabled ?? true,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserExchanges(userId: string): Promise<Exchange[]> {
    return Array.from(this.exchanges.values()).filter(
      (exchange) => exchange.userId === userId,
    );
  }

  async createExchange(exchange: Omit<Exchange, 'id' | 'createdAt'>): Promise<Exchange> {
    const id = randomUUID();
    const newExchange: Exchange = { 
      ...exchange, 
      id, 
      createdAt: new Date(),
    };
    this.exchanges.set(id, newExchange);
    return newExchange;
  }

  async updateExchange(id: string, updates: Partial<Exchange>): Promise<Exchange | undefined> {
    const exchange = this.exchanges.get(id);
    if (!exchange) return undefined;

    const updatedExchange = { ...exchange, ...updates };
    this.exchanges.set(id, updatedExchange);
    return updatedExchange;
  }

  async deleteExchange(id: string): Promise<boolean> {
    return this.exchanges.delete(id);
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(
      (portfolio) => portfolio.userId === userId,
    );
  }

  async updatePortfolio(userId: string, exchangeId: string, symbol: string, balance: string, usdValue: string, lastPrice?: string): Promise<Portfolio> {
    const key = `${userId}-${exchangeId}-${symbol}`;
    const existing = this.portfolios.get(key);

    const portfolio: Portfolio = {
      id: existing?.id || randomUUID(),
      userId,
      exchangeId,
      symbol,
      balance,
      usdValue,
      lastPrice: lastPrice || existing?.lastPrice || "0",
      updatedAt: new Date(),
    };

    this.portfolios.set(key, portfolio);
    return portfolio;
  }

  async getSentimentData(symbol: string): Promise<SentimentData | undefined> {
    return this.sentimentData.get(symbol);
  }

  async updateSentimentData(symbol: string, score: number, socialSentiment: number, newsSentiment: number, marketRegime: number, volatility: string, signals: string[]): Promise<SentimentData> {
    const existing = this.sentimentData.get(symbol);
    const data: SentimentData = {
      id: existing?.id || randomUUID(),
      symbol,
      score,
      socialSentiment,
      newsSentiment,
      marketRegime,
      volatility,
      signals,
      lastUpdated: new Date(),
    };

    this.sentimentData.set(symbol, data);
    return data;
  }

  async getUserOrders(userId: string, limit: number = 50): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = { 
      ...order, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getUserBots(userId: string): Promise<Bot[]> {
    return Array.from(this.bots.values()).filter(
      (bot) => bot.userId === userId,
    );
  }

  async createBot(bot: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bot> {
    const id = randomUUID();
    const newBot: Bot = { 
      ...bot, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bots.set(id, newBot);
    return newBot;
  }

  async updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined> {
    const bot = this.bots.get(id);
    if (!bot) return undefined;

    const updatedBot = { ...bot, ...updates, updatedAt: new Date() };
    this.bots.set(id, updatedBot);
    return updatedBot;
  }

  async deleteBot(id: string): Promise<boolean> {
    return this.bots.delete(id);
  }

  async getUserActivities(userId: string, limit: number = 20): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = { 
      ...activity, 
      id, 
      createdAt: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }
}

export const storage = new MemStorage();
