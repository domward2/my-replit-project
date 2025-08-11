import crypto from 'crypto';
import axios from 'axios';

export interface CoinbaseOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface CoinbaseTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface CoinbaseUserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  resource: string;
  resource_path: string;
}

export interface CoinbaseAccount {
  id: string;
  name: string;
  primary: boolean;
  type: string;
  currency: {
    code: string;
    name: string;
    color: string;
    sort_index: number;
    exponent: number;
    type: string;
    address_regex: string;
  };
  balance: {
    amount: string;
    currency: string;
  };
  created_at: string;
  updated_at: string;
  resource: string;
  resource_path: string;
}

export class CoinbaseOAuthService {
  private config: CoinbaseOAuthConfig;
  private baseUrl = 'https://api.coinbase.com';
  private authUrl = 'https://www.coinbase.com/oauth/authorize';
  private tokenUrl = 'https://api.coinbase.com/oauth/token';

  constructor(config: CoinbaseOAuthConfig) {
    this.config = config;
  }

  /**
   * Generate authorization URL for OAuth flow
   */
  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state: state,
      scope: 'wallet:user:read,wallet:accounts:read,wallet:transactions:read',
      account: 'all'
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(authorizationCode: string): Promise<CoinbaseTokenResponse> {
    try {
      const response = await axios.post(this.tokenUrl, {
        grant_type: 'authorization_code',
        code: authorizationCode,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PnL-AI/1.0',
          'CB-VERSION': '2023-12-01'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Token exchange error:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for token');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<CoinbaseTokenResponse> {
    try {
      const response = await axios.post(this.tokenUrl, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PnL-AI/1.0',
          'CB-VERSION': '2023-12-01'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Token refresh error:', error.response?.data || error.message);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string): Promise<CoinbaseUserProfile> {
    try {
      const response = await axios.get(`${this.baseUrl}/v2/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'PnL-AI/1.0',
          'CB-VERSION': '2023-12-01'
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Get user profile error:', error.response?.data || error.message);
      throw new Error('Failed to get user profile');
    }
  }

  /**
   * Get user's Coinbase accounts
   */
  async getUserAccounts(accessToken: string): Promise<CoinbaseAccount[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/v2/accounts`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'PnL-AI/1.0',
          'CB-VERSION': '2023-12-01'
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Get user accounts error:', error.response?.data || error.message);
      throw new Error('Failed to get user accounts');
    }
  }

  /**
   * Test the connection with a simple API call
   */
  async testConnection(accessToken: string): Promise<boolean> {
    try {
      await this.getUserProfile(accessToken);
      return true;
    } catch (error: any) {
      console.error('Coinbase connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Generate a secure random state parameter
   */
  static generateState(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}