// Token-based authentication for deployment compatibility
import { randomBytes } from 'crypto';
import { storage } from './storage';

export async function generateAuthToken(userId: string): Promise<string> {
  // Generate a secure random token
  const token = randomBytes(32).toString('hex');
  
  // Token expires in 24 hours
  const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000));
  
  await storage.createAuthToken(token, userId, expiresAt);
  
  // Clean up expired tokens periodically
  storage.cleanupExpiredTokens();
  
  return token;
}

export async function validateAuthToken(token: string): Promise<string | null> {
  return await storage.validateAuthToken(token);
}

export async function removeAuthToken(token: string): Promise<void> {
  await storage.deleteAuthToken(token);
}

// Token middleware for Express
export function tokenAuthMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.query.token || 
                req.body.token;
  
  if (token) {
    validateAuthToken(token).then(userId => {
      if (userId) {
        req.tokenUserId = userId;
      }
      next();
    }).catch(() => {
      next();
    });
  } else {
    next();
  }
}