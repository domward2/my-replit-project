import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  paperTradingEnabled: boolean("paper_trading_enabled").notNull().default(true),
  dailyLossLimit: decimal("daily_loss_limit", { precision: 10, scale: 2 }).notNull().default("1000.00"),
  positionSizeLimit: decimal("position_size_limit", { precision: 5, scale: 2 }).notNull().default("5.00"),
  circuitBreakerEnabled: boolean("circuit_breaker_enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const exchanges = pgTable("exchanges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'coinbase_oauth', 'kraken_api', etc.
  apiKey: text("api_key"), // encrypted
  apiSecret: text("api_secret"), // encrypted
  passphrase: text("passphrase"), // encrypted
  isActive: boolean("is_active").notNull().default(true),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exchangeId: varchar("exchange_id").notNull().references(() => exchanges.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).notNull().default("0"),
  usdValue: decimal("usd_value", { precision: 10, scale: 2 }).notNull().default("0"),
  lastPrice: decimal("last_price", { precision: 18, scale: 8 }),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const sentimentData = pgTable("sentiment_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  score: integer("score").notNull(), // 0-100
  socialSentiment: integer("social_sentiment").notNull(),
  newsSentiment: integer("news_sentiment").notNull(),
  marketRegime: integer("market_regime").notNull(),
  volatility: decimal("volatility", { precision: 5, scale: 2 }),
  signals: jsonb("signals").$type<string[]>().notNull().default([]),
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exchangeId: varchar("exchange_id").notNull().references(() => exchanges.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  side: text("side").notNull(), // 'buy', 'sell'
  type: text("type").notNull(), // 'market', 'limit'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }),
  stopLoss: decimal("stop_loss", { precision: 18, scale: 8 }),
  takeProfit: decimal("take_profit", { precision: 18, scale: 8 }),
  status: text("status").notNull().default("pending"), // 'pending', 'filled', 'cancelled', 'failed'
  fillPrice: decimal("fill_price", { precision: 18, scale: 8 }),
  fillAmount: decimal("fill_amount", { precision: 18, scale: 8 }),
  reason: text("reason"), // sentiment reasoning
  isPaperTrade: boolean("is_paper_trade").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const bots = pgTable("bots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'dca', 'grid', 'sentiment'
  symbol: text("symbol").notNull(),
  config: jsonb("config").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  totalInvested: decimal("total_invested", { precision: 10, scale: 2 }).notNull().default("0"),
  totalProfit: decimal("total_profit", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'trade', 'bot_action', 'alert'
  title: text("title").notNull(),
  description: text("description"),
  reason: text("reason"), // sentiment or bot reasoning
  amount: decimal("amount", { precision: 10, scale: 2 }),
  symbol: text("symbol"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const authTokens = pgTable("auth_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  token: text("token").notNull().unique(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  expiresAt: timestamp("expires_at").notNull(),
  lastUsed: timestamp("last_used"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExchangeSchema = createInsertSchema(exchanges).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBotSchema = createInsertSchema(bots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = insertUserSchema.extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Exchange = typeof exchanges.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type SentimentData = typeof sentimentData.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Bot = typeof bots.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type AuthToken = typeof authTokens.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
