import crypto from 'crypto';

export interface KrakenConnectConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface KrakenOAuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
  scope: string;
  user_id: string;
}

export interface KrakenUserInfo {
  user_id: string;
  email: string;
  username: string;
  verification_tier: number;
  permissions: string[];
}

export class KrakenConnectService {
  private config: KrakenConnectConfig;
  private baseUrl = 'https://api.kraken.com';
  private oauthUrl = 'https://www.kraken.com/oauth';

  constructor(config: KrakenConnectConfig) {
    this.config = config;
  }

  // Generate OAuth authorization URL
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'read:account read:orders write:orders read:portfolio',
      state: state || crypto.randomUUID(),
    });

    return `${this.oauthUrl}/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, state?: string): Promise<KrakenOAuthToken> {
    const response = await global.fetch(`${this.oauthUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
        ...(state && { state }),
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OAuth token exchange failed: ${error}`);
    }

    return await response.json() as KrakenOAuthToken;
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<KrakenOAuthToken> {
    const response = await global.fetch(`${this.oauthUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    return await response.json() as KrakenOAuthToken;
  }

  // Get user information
  async getUserInfo(accessToken: string): Promise<KrakenUserInfo> {
    const response = await global.fetch(`${this.baseUrl}/0/private/user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user info: ${error}`);
    }

    const result = await response.json();
    return result.result as KrakenUserInfo;
  }

  // Get account balance using OAuth token
  async getAccountBalance(accessToken: string): Promise<Record<string, string>> {
    const response = await global.fetch(`${this.baseUrl}/0/private/Balance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get balance: ${error}`);
    }

    const result = await response.json();
    return result.result as Record<string, string>;
  }

  // Place order using OAuth token
  async placeOrder(accessToken: string, params: {
    pair: string;
    type: 'buy' | 'sell';
    ordertype: 'market' | 'limit';
    volume: string;
    price?: string;
  }): Promise<{ txid: string[] }> {
    const response = await global.fetch(`${this.baseUrl}/0/private/AddOrder`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to place order: ${error}`);
    }

    const result = await response.json();
    return result.result as { txid: string[] };
  }

  // Get open orders
  async getOpenOrders(accessToken: string): Promise<any> {
    const response = await global.fetch(`${this.baseUrl}/0/private/OpenOrders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get orders: ${error}`);
    }

    const result = await response.json();
    return result.result;
  }

  // Revoke OAuth token
  async revokeToken(accessToken: string): Promise<void> {
    const response = await global.fetch(`${this.oauthUrl}/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: new URLSearchParams({
        token: accessToken,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to revoke token: ${error}`);
    }
  }

  // Validate token and get permissions
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await this.getUserInfo(accessToken);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Demo/Mock implementation for development/testing
export class KrakenConnectDemo {
  // Generate a demo authorization URL that leads to a mock consent screen
  generateAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      demo: 'true',
      state: state || crypto.randomUUID(),
      client_name: 'PnL AI Trading Platform',
      permissions: 'read:account,read:orders,write:orders,read:portfolio',
    });

    return `/api/kraken-connect/demo-auth?${params.toString()}`;
  }

  // Simulate successful OAuth flow
  async mockExchangeCodeForToken(code: string): Promise<KrakenOAuthToken> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      access_token: `demo_access_${crypto.randomUUID().substring(0, 8)}`,
      refresh_token: `demo_refresh_${crypto.randomUUID().substring(0, 8)}`,
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'read:account read:orders write:orders read:portfolio',
      user_id: crypto.randomUUID(),
    };
  }

  // Mock user info
  async getMockUserInfo(): Promise<KrakenUserInfo> {
    return {
      user_id: crypto.randomUUID(),
      email: 'demo@example.com',
      username: 'demo_trader',
      verification_tier: 3,
      permissions: ['read:account', 'read:orders', 'write:orders', 'read:portfolio'],
    };
  }

  // Mock balance data
  async getMockBalance(): Promise<Record<string, string>> {
    return {
      'XXBT': '0.75234567',
      'XETH': '5.25',
      'ZUSD': '12543.89',
      'ADA': '1250.00',
      'DOT': '125.50',
    };
  }
}