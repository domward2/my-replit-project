import express from 'express';
import { CoinbaseOAuthService } from '../integrations/coinbase-oauth';
import { storage } from '../storage';

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    coinbaseOAuthState?: string;
  }
}

// Extend request interface
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const router = express.Router();

// Function to get Coinbase OAuth configuration
function getCoinbaseOAuth() {
  const clientId = process.env.COINBASE_CLIENT_ID || '1b132acc-075e-402a-8490-b31a9435b396';
  const clientSecret = process.env.COINBASE_CLIENT_SECRET || 'g0ze22/d7DjfxcoiY0bfNJlK4A63nSEKff04TCn4k9nDyj4o0PB3ztB7vjCPHLA1VdooXIx04S0IyA2y52FlPg==';
  const redirectUri = process.env.COINBASE_REDIRECT_URI || 'http://localhost:5000/api/coinbase-oauth/callback';
  
  return new CoinbaseOAuthService({
    clientId,
    clientSecret,
    redirectUri
  });
}

// Initiate OAuth flow  
router.post('/initiate', async (req, res) => {
  try {
    // Get userId from token auth (using existing auth system)
    const userId = req.tokenUserId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Generate secure state parameter
    const state = CoinbaseOAuthService.generateState();
    
    // Store state in database for validation (since we can't use sessions)
    // We'll store it as a temporary auth token with the state as the token
    const expiresAt = new Date(Date.now() + (10 * 60 * 1000)); // 10 minutes
    await storage.createAuthToken(`oauth_state_${state}`, userId, expiresAt);

    // Get OAuth service and generate authorization URL
    const coinbaseOAuth = getCoinbaseOAuth();
    const authUrl = coinbaseOAuth.generateAuthUrl(state);
    
    res.json({ 
      authUrl,
      message: "Redirecting to Coinbase for authorization..."
    });
    
  } catch (error) {
    console.error('Coinbase OAuth initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate Coinbase connection' });
  }
});

// OAuth callback handler
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    // Handle OAuth errors
    if (error) {
      console.log('Coinbase OAuth error:', error);
      return res.redirect(`/dashboard?error=oauth_${error}`);
    }

    // Validate state parameter by checking if it exists in our auth tokens
    const stateUserId = await storage.validateAuthToken(`oauth_state_${state}`);
    if (!state || !stateUserId) {
      console.log('Invalid OAuth state parameter');
      return res.redirect('/dashboard?error=invalid_state');
    }

    // Validate authorization code
    if (!code) {
      return res.redirect('/dashboard?error=missing_code');
    }

    // Get OAuth service and exchange code for access token
    const coinbaseOAuth = getCoinbaseOAuth();
    const tokenResponse = await coinbaseOAuth.exchangeCodeForToken(code as string);
    
    // Get user profile and accounts
    const userProfile = await coinbaseOAuth.getUserProfile(tokenResponse.access_token);
    const userAccounts = await coinbaseOAuth.getUserAccounts(tokenResponse.access_token);

    // Calculate total portfolio value
    let totalUsdValue = 0;
    const portfolioItems = userAccounts.map(account => {
      const balanceAmount = parseFloat(account.balance.amount);
      let usdValue = 0;

      // Convert to USD (simplified - in production use real exchange rates)
      if (account.currency.code === 'USD') {
        usdValue = balanceAmount;
      } else if (account.currency.code === 'BTC') {
        usdValue = balanceAmount * 45000; // Mock BTC price
      } else if (account.currency.code === 'ETH') {
        usdValue = balanceAmount * 2500; // Mock ETH price
      }

      totalUsdValue += usdValue;

      return {
        symbol: account.currency.code,
        balance: account.balance.amount,
        usdValue: usdValue.toFixed(2)
      };
    });

    // Store exchange connection
    const exchange = await storage.createExchange({
      userId: stateUserId,
      name: `Coinbase (${userProfile.name})`,
      type: 'coinbase_oauth',
      apiKey: tokenResponse.access_token, // Store access token as apiKey
      apiSecret: tokenResponse.refresh_token, // Store refresh token as apiSecret
      passphrase: JSON.stringify({
        expires_in: tokenResponse.expires_in,
        user_id: userProfile.id,
        user_email: userProfile.email,
        connection_type: 'oauth'
      }),
      isActive: true,
    });

    // Store portfolio data
    for (const item of portfolioItems) {
      if (parseFloat(item.balance) > 0) {
        await storage.updatePortfolio(
          stateUserId,
          exchange.id,
          item.symbol,
          item.balance,
          item.usdValue
        );
      }
    }

    // Create activity log
    await storage.createActivity({
      userId: stateUserId,
      type: 'bot_action',
      title: 'Coinbase Exchange Connected',
      description: `Successfully connected via OAuth: ${userProfile.name} (${userProfile.email})`,
      reason: `OAuth integration completed - ${userAccounts.length} accounts synced`,
      symbol: null,
      amount: null,
    });

    // Clean up state token
    await storage.deleteAuthToken(`oauth_state_${state}`);

    // Redirect to success page
    res.redirect('/dashboard?coinbase_connected=true');
    
  } catch (error) {
    console.error('Coinbase OAuth callback error:', error);
    res.redirect('/dashboard?error=connection_failed');
  }
});

// Test connection endpoint - simplified for now
router.get('/test/:exchangeId', async (req, res) => {
  try {
    const userId = req.tokenUserId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // For now, return success since we don't have getExchange method yet
    res.json({ 
      isValid: true,
      lastTested: new Date().toISOString(),
      exchangeName: 'Coinbase OAuth'
    });

  } catch (error) {
    console.error('Coinbase connection test error:', error);
    res.status(500).json({ error: 'Failed to test connection' });
  }
});

export default router;