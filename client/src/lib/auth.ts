// Robust authentication system for deployment environments
export interface User {
  id: string;
  username: string;
  email: string;
  paperTradingEnabled?: boolean;
}

const AUTH_KEY = 'pnl-ai-auth';
const TIMESTAMP_KEY = 'pnl-ai-timestamp';

export function setAuthUser(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
}

export function getAuthUser(): User | null {
  try {
    const userStr = localStorage.getItem(AUTH_KEY);
    const timestampStr = localStorage.getItem(TIMESTAMP_KEY);
    
    if (!userStr || !timestampStr) {
      return null;
    }

    const timestamp = parseInt(timestampStr);
    const now = Date.now();
    const authAge = now - timestamp;
    
    // Auth expires after 24 hours
    if (authAge > 24 * 60 * 60 * 1000) {
      clearAuthUser();
      return null;
    }

    return JSON.parse(userStr);
  } catch (error) {
    clearAuthUser();
    return null;
  }
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TIMESTAMP_KEY);
}

export function forceReload(): void {
  // Immediate execution of all redirect methods for maximum compatibility
  setTimeout(() => {
    try { window.location.replace('/'); } catch (e) {}
  }, 1);
  
  setTimeout(() => {
    try { window.location.href = '/'; } catch (e) {}
  }, 10);
  
  setTimeout(() => {
    try { window.location.assign('/'); } catch (e) {}  
  }, 50);
  
  setTimeout(() => {
    try { window.location.reload(); } catch (e) {}
  }, 200);
}