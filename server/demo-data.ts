import type { MemStorage } from "./storage";
import bcrypt from 'bcrypt';

export async function initializeDemoData(storage: MemStorage) {
  // Always create the user account on startup (in memory storage resets)
  try {
    // Create your specific account
    const hashedPassword = await bcrypt.hash("Horace82", 12);

    // Check if user already exists
import type { MemStorage } from "./storage";
import bcrypt from 'bcrypt';

export async function initializeDemoData(storage: MemStorage) {
  // Create your specific account on startup
  try {
    const hashedPassword = await bcrypt.hash("Horace82", 12);

    const existingUser = await storage.getUserByEmail("dom.ward1@hotmail.co.uk");
    if (!existingUser) {
      const userAccount = await storage.createUser({
        username: "dom.ward1",
        email: "dom.ward1@hotmail.co.uk",
        password: hashedPassword,
        paperTradingEnabled: true,
        dailyLossLimit: "1000.00",
        positionSizeLimit: "10.00",
        circuitBreakerEnabled: true,
      });
      console.log("User account created on startup for:", userAccount.username);
    } else {
      await storage.updateUser(existingUser.id, {
        password: hashedPassword
      });
      console.log("User password updated:", existingUser.username);
    }
  } catch (error) {
    console.log("User account setup error:", (error as Error).message);
  }

  console.log("✅ Demo data creation skipped — real users will start clean.");
  return null;
}

  return demoUser;
}
