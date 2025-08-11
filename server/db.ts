import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, exchanges, portfolios, sentimentData, orders, bots, activities, authTokens } from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, {
  schema: {
    users,
    exchanges,
    portfolios,
    sentimentData,
    orders,
    bots,
    activities,
    authTokens,
  },
});