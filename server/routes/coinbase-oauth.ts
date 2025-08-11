import express from 'express';
import { CoinbaseOAuthService } from '../integrations/coinbase-oauth';
import { storage } from '../storage';

const router = express.Router();

// Coinbase OAuth configuration
const coinbaseOAuth = new CoinbaseOAuthService({
  clientId: process.env.COINBASE_CLIENT_ID || '',
  clientSecret: process.env.COINBASE_CLIENT_SECRET || '',
  redirectUri: process.env.COINBASE_REDIRECT_URI || 'http://localhost:5000/api/coinbase-oauth/callback'
});

// Initiate OAuth flow
router.post('/initiate', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if Coinbase OAuth credentials are configured
    if (!process.env.COINBASE_CLIENT_ID || !process.env.COINBASE_CLIENT_SECRET) {
      return res.status(500).json({ 
        error: 'Coinbase OAuth not configured',
        message: 'Please configure COINBASE_CLIENT_ID and COINBASE_CLIENT_SECRET environment variables'
      });
    }

    // Generate secure state parameter
    const state = CoinbaseOAuthService.generateState();
    
    // Store state in session/memory for validation
    // In production, store this securely in Redis or database
    req.session.coinbaseOAuthState = state;
    req.session.userId = req.user.id;

    // Generate authorization URL
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

    // Validate state parameter
    if (!state || state !== req.session.coinbaseOAuthState) {
      console.log('Invalid OAuth state parameter');
      return res.redirect('/dashboard?error=invalid_state');
    }

    // Validate authorization code
    if (!code) {
      return res.redirect('/dashboard?error=missing_code');
    }

    // Exchange code for access token
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
      userId: req.session.userId!,
      name: `Coinbase (${userProfile.name})`,
      type: 'coinbase_oauth',
      credentials: JSON.stringify({
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
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
          req.session.userId!,
          exchange.id,
          item.symbol,
          item.balance,
          item.usdValue
        );
      }
    }

    // Create activity log
    await storage.createActivity({
      userId: req.session.userId!,
      type: 'bot_action',
      title: 'Coinbase Exchange Connected',
      description: `Successfully connected via OAuth: ${userProfile.name} (${userProfile.email})`,
      reason: `OAuth integration completed - ${userAccounts.length} accounts synced`,
    });

    // Clean up session
    delete req.session.coinbaseOAuthState;

    // Redirect to success page
    res.redirect('/dashboard?coinbase_connected=true');
    
  } catch (error) {
    console.error('Coinbase OAuth callback error:', error);
    res.redirect('/dashboard?error=connection_failed');
  }
});

// Test connection endpoint
router.get('/test/:exchangeId', async (req, res) => {
  try {
    const { exchangeId } = req.params;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const exchange = await storage.getExchange(exchangeId);
    
    if (!exchange || exchange.userId !== req.user.id) {
      return res.status(404).json({ error: 'Exchange not found' });
    }

    if (exchange.type !== 'coinbase_oauth') {
      return res.status(400).json({ error: 'Not a Coinbase OAuth exchange' });
    }

    const credentials = JSON.parse(exchange.credentials!);
    const isValid = await coinbaseOAuth.testConnection(credentials.access_token);

    res.json({ 
      isValid,
      lastTested: new Date().toISOString(),
      exchangeName: exchange.name
    });

  } catch (error) {
    console.error('Coinbase connection test error:', error);
    res.status(500).json({ error: 'Failed to test connection' });
  }
});

export default router;