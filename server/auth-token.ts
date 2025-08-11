// Token-based authentication for deployment compatibility
import { randomBytes, createHash } from 'crypto';

interface AuthToken {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory token storage (could be moved to database later)
const tokens = new Map<string, AuthToken>();

export function generateAuthToken(userId: string): string {
  // Generate a secure random token
  const token = randomBytes(32).toString('hex');
  
  const authToken: AuthToken = {
    token,
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  tokens.set(token, authToken);
  
  // Clean up expired tokens periodically
  cleanupExpiredTokens();
  
  return token;
}

export function validateAuthToken(token: string): string | null {
  const authToken = tokens.get(token);
  
  if (!authToken) {
    return null;
  }
  
  if (Date.now() > authToken.expiresAt) {
    tokens.delete(token);
    return null;
  }
  
  return authToken.userId;
}

export function removeAuthToken(token: string): void {
  tokens.delete(token);
}

function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [token, authToken] of tokens.entries()) {
    if (now > authToken.expiresAt) {
      tokens.delete(token);
    }
  }
}

// Token middleware for Express
export function tokenAuthMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.query.token || 
                req.body.token;
  
  if (token) {
    const userId = validateAuthToken(token);
    if (userId) {
      req.tokenUserId = userId;
    }
  }
  
  next();
}