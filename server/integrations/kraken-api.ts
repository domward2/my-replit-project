import crypto from 'crypto';

export interface KrakenCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface KrakenBalance {
  [currency: string]: string;
}

export interface KrakenOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: string;
  price?: string;
  status: string;
  timestamp: number;
}

export class KrakenAPIService {
  private baseUrl = 'https://api.kraken.com';
  private credentials: KrakenCredentials;

  constructor(credentials: KrakenCredentials) {
    this.credentials = credentials;
  }

  private generateNonce(): string {
    return Date.now().toString() + '000';
  }

  private generateSignature(path: string, data: Record<string, any>, nonce: string): string {
    const postdata = new URLSearchParams(data).toString();
    const message = nonce + postdata;
    const sha256Hash = crypto.createHash('sha256').update(message).digest();
    const pathBytes = Buffer.from(path, 'utf8');
    const hmacData = Buffer.concat([pathBytes, sha256Hash]);
    const signature = crypto
      .createHmac('sha512', Buffer.from(this.credentials.apiSecret, 'base64'))
      .update(hmacData)
      .digest('base64');
    
    return signature;
  }

  private async makePrivateRequest(endpoint: string, data: Record<string, any> = {}): Promise<any> {
    const path = `/0/private/${endpoint}`;
    const nonce = this.generateNonce();
    const requestData = { nonce, ...data };
    
    const signature = this.generateSignature(path, requestData, nonce);
    
    const response = await global.fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'API-Key': this.credentials.apiKey,
        'API-Sign': signature,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(requestData).toString(),
    });

    const result = await response.json();
    
    if (result.error && result.error.length > 0) {
      throw new Error(`Kraken API Error: ${result.error.join(', ')}`);
    }
    
    return result.result;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makePrivateRequest('Balance');
      return true;
    } catch (error) {
      console.error('Kraken connection test failed:', error);
      return false;
    }
  }

  async getAccountBalance(): Promise<KrakenBalance> {
    return await this.makePrivateRequest('Balance');
  }

  async getOpenOrders(): Promise<KrakenOrder[]> {
    const result = await this.makePrivateRequest('OpenOrders');
    const orders: KrakenOrder[] = [];
    
    for (const [orderId, orderData] of Object.entries(result.open || {})) {
      const order = orderData as any;
      orders.push({
        id: orderId,
        symbol: order.descr.pair,
        side: order.descr.type as 'buy' | 'sell',
        type: order.descr.ordertype as 'market' | 'limit',
        amount: order.vol,
        price: order.descr.price || order.price,
        status: order.status,
        timestamp: order.opentm * 1000, // Convert to milliseconds
      });
    }
    
    return orders;
  }

  async placeOrder(params: {
    pair: string;
    type: 'buy' | 'sell';
    ordertype: 'market' | 'limit';
    volume: string;
    price?: string;
    starttm?: number;
    expiretm?: number;
    userref?: number;
    validate?: boolean;
    close?: {
      ordertype: 'limit' | 'stop-loss' | 'take-profit';
      price: string;
      price2?: string;
    };
  }): Promise<{ txid: string[] }> {
    return await this.makePrivateRequest('AddOrder', params);
  }

  async cancelOrder(txid: string): Promise<{ count: number }> {
    return await this.makePrivateRequest('CancelOrder', { txid });
  }

  async getTradeHistory(params?: {
    type?: 'all' | 'any position' | 'closed position' | 'closing position' | 'no position';
    trades?: boolean;
    start?: number;
    end?: number;
    ofs?: number;
  }): Promise<any> {
    return await this.makePrivateRequest('TradesHistory', params || {});
  }

  // Convert Kraken pair format to standard format (e.g., XBTUSD -> BTC/USD)
  static formatPair(krakenPair: string): string {
    const pairMappings: Record<string, string> = {
      'XBTUSD': 'BTC/USD',
      'ETHUSD': 'ETH/USD',
      'ADAUSD': 'ADA/USD',
      'DOTUSD': 'DOT/USD',
      'SOLUSD': 'SOL/USD',
      'LINKUSD': 'LINK/USD',
      'UNIUSD': 'UNI/USD',
      'ATOMUSD': 'ATOM/USD',
      'ALGOUSD': 'ALGO/USD',
      'XRPUSD': 'XRP/USD',
    };
    
    return pairMappings[krakenPair] || krakenPair;
  }

  // Convert standard format back to Kraken format
  static toKrakenPair(standardPair: string): string {
    const reverseMappings: Record<string, string> = {
      'BTC/USD': 'XBTUSD',
      'ETH/USD': 'ETHUSD',
      'ADA/USD': 'ADAUSD',
      'DOT/USD': 'DOTUSD',
      'SOL/USD': 'SOLUSD',
      'LINK/USD': 'LINKUSD',
      'UNI/USD': 'UNIUSD',
      'ATOM/USD': 'ATOMUSD',
      'ALGO/USD': 'ALGOUSD',
      'XRP/USD': 'XRPUSD',
    };
    
    return reverseMappings[standardPair] || standardPair;
  }
}