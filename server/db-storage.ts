import { eq, and, lt, desc } from "drizzle-orm";
import { db } from "./db";
import { users, exchanges, portfolios, sentimentData, orders, bots, activities, authTokens } from "@shared/schema";
import { type User, type InsertUser, type Exchange, type Portfolio, type SentimentData, type Order, type Bot, type Activity, type AuthToken } from "@shared/schema";
import { type IStorage } from "./storage";
import { randomUUID } from "crypto";

export class DatabaseStorage implements IStorage {
  
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Exchange management
  async getExchange(id: string): Promise<Exchange | undefined> {
    const result = await db.select().from(exchanges).where(eq(exchanges.id, id)).limit(1);
    return result[0];
  }

  async getUserExchanges(userId: string): Promise<Exchange[]> {
    return await db.select().from(exchanges).where(eq(exchanges.userId, userId));
  }

  async createExchange(exchange: Omit<Exchange, 'id' | 'createdAt'>): Promise<Exchange> {
    const result = await db.insert(exchanges).values(exchange).returning();
    return result[0];
  }

  async updateExchange(id: string, updates: Partial<Exchange>): Promise<Exchange | undefined> {
    const result = await db.update(exchanges).set(updates).where(eq(exchanges.id, id)).returning();
    return result[0];
  }

  async deleteExchange(id: string): Promise<boolean> {
    const result = await db.delete(exchanges).where(eq(exchanges.id, id));
    return result.rowCount > 0;
  }

  // Portfolio management
  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return await db.select().from(portfolios).where(eq(portfolios.userId, userId));
  }

  async createPortfolio(portfolio: Omit<Portfolio, 'id' | 'updatedAt'>): Promise<Portfolio> {
    const result = await db.insert(portfolios).values(portfolio).returning();
    return result[0];
  }

  async updatePortfolio(userId: string, exchangeId: string, symbol: string, balance: string, usdValue: string, lastPrice?: string): Promise<Portfolio> {
    const existing = await db.select().from(portfolios)
      .where(and(eq(portfolios.userId, userId), eq(portfolios.exchangeId, exchangeId), eq(portfolios.symbol, symbol)))
      .limit(1);

    if (existing.length > 0) {
      const result = await db.update(portfolios)
        .set({ balance, usdValue, lastPrice, updatedAt: new Date() })
        .where(eq(portfolios.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(portfolios)
        .values({
          userId,
          exchangeId,
          symbol,
          balance,
          usdValue,
          lastPrice,
        })
        .returning();
      return result[0];
    }
  }

  // Sentiment data
  async getSentimentData(symbol: string): Promise<SentimentData | undefined> {
    const result = await db.select().from(sentimentData).where(eq(sentimentData.symbol, symbol)).limit(1);
    return result[0];
  }

  async updateSentimentData(symbol: string, score: number, socialSentiment: number, newsSentiment: number, marketRegime: number, volatility: string, signals: string[]): Promise<SentimentData> {
    const existing = await db.select().from(sentimentData).where(eq(sentimentData.symbol, symbol)).limit(1);

    if (existing.length > 0) {
      const result = await db.update(sentimentData)
        .set({
          score,
          socialSentiment,
          newsSentiment,
          marketRegime,
          volatility,
          signals,
          lastUpdated: new Date(),
        })
        .where(eq(sentimentData.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(sentimentData)
        .values({
          symbol,
          score,
          socialSentiment,
          newsSentiment,
          marketRegime,
          volatility,
          signals,
        })
        .returning();
      return result[0];
    }
  }

  // Order management
  async getUserOrders(userId: string, limit: number = 50): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const result = await db.update(orders).set({ ...updates, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Bot management
  async getUserBots(userId: string): Promise<Bot[]> {
    return await db.select().from(bots).where(eq(bots.userId, userId));
  }

  async createBot(bot: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bot> {
    const result = await db.insert(bots).values(bot).returning();
    return result[0];
  }

  async updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined> {
    const result = await db.update(bots).set({ ...updates, updatedAt: new Date() }).where(eq(bots.id, id)).returning();
    return result[0];
  }

  async deleteBot(id: string): Promise<boolean> {
    const result = await db.delete(bots).where(eq(bots.id, id));
    return result.rowCount > 0;
  }

  // Activity management
  async getUserActivities(userId: string, limit: number = 20): Promise<Activity[]> {
    return await db.select().from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }

  // Auth token management - THIS IS THE KEY PART FOR PERSISTENT TOKENS
  async createAuthToken(token: string, userId: string, expiresAt: Date): Promise<void> {
    await db.insert(authTokens).values({
      token,
      userId,
      expiresAt,
    });
  }

  async validateAuthToken(token: string): Promise<string | null> {
    const result = await db.select().from(authTokens)
      .where(eq(authTokens.token, token))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const authToken = result[0];

    if (Date.now() > authToken.expiresAt.getTime()) {
      // Clean up expired token
      await db.delete(authTokens).where(eq(authTokens.token, token));
      return null;
    }

    // Update last used timestamp
    await db.update(authTokens)
      .set({ lastUsed: new Date() })
      .where(eq(authTokens.token, token));

    return authToken.userId;
  }

  async deleteAuthToken(token: string): Promise<void> {
    await db.delete(authTokens).where(eq(authTokens.token, token));
  }

  async cleanupExpiredTokens(): Promise<void> {
    await db.delete(authTokens).where(lt(authTokens.expiresAt, new Date()));
  }
}