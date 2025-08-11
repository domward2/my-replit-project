import express from 'express';
import crypto from 'crypto';
import { storage } from '../storage';
import { KrakenConnectDemo } from '../integrations/kraken-connect';

const router = express.Router();
const krakenDemo = new KrakenConnectDemo();

// Demo route for initiating "Kraken Connect" OAuth simulation
router.post('/initiate', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Generate demo auth URL that simulates OAuth flow
    const state = crypto.randomUUID();
    const authUrl = krakenDemo.generateAuthUrl(state);
    
    res.json({ 
      authUrl,
      message: "Redirecting to Kraken Connect authorization..."
    });
    
  } catch (error) {
    console.error('Kraken Connect initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate Kraken connection' });
  }
});

// Demo OAuth callback simulation
router.get('/demo-auth', async (req, res) => {
  const { state, demo } = req.query;
  
  if (!demo) {
    return res.status(400).send('Invalid request');
  }

  // Create a demo authorization page
  const demoPage = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Kraken Connect Authorization</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0; 
                padding: 2rem;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container { 
                background: white; 
                padding: 3rem; 
                border-radius: 12px; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                max-width: 480px;
                width: 100%;
                text-align: center;
            }
            .logo { 
                width: 64px; 
                height: 64px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                border-radius: 12px; 
                margin: 0 auto 1.5rem; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
            }
            h1 { color: #333; margin: 0 0 1rem; font-size: 24px; }
            p { color: #666; margin: 0 0 2rem; line-height: 1.5; }
            .permissions {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 8px;
                margin: 2rem 0;
                text-align: left;
            }
            .permissions h3 { margin: 0 0 1rem; color: #333; font-size: 16px; }
            .permissions ul { margin: 0; padding: 0; list-style: none; }
            .permissions li { 
                padding: 0.5rem 0; 
                color: #555; 
                border-bottom: 1px solid #eee;
            }
            .permissions li:last-child { border-bottom: none; }
            .permissions li::before { content: '✓ '; color: #28a745; font-weight: bold; }
            button { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                border: none; 
                padding: 1rem 2rem; 
                border-radius: 8px; 
                font-size: 16px; 
                font-weight: 600;
                cursor: pointer; 
                margin: 0.5rem;
                min-width: 120px;
            }
            button:hover { opacity: 0.9; }
            .deny { background: #6c757d !important; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">K</div>
            <h1>Authorize PnL AI</h1>
            <p><strong>PnL AI Trading Platform</strong> would like permission to access your Kraken account.</p>
            
            <div class="permissions">
                <h3>This application will be able to:</h3>
                <ul>
                    <li>View your account balances</li>
                    <li>View your trading history</li>
                    <li>Place trades on your behalf</li>
                    <li>Access portfolio information</li>
                </ul>
            </div>
            
            <button onclick="authorize()">Authorize</button>
            <button class="deny" onclick="deny()">Deny</button>
        </div>
        
        <script>
            function authorize() {
                // Simulate successful authorization
                window.location.href = '/api/kraken-connect/callback?code=demo_auth_code_${state}&state=${state}';
            }
            
            function deny() {
                window.location.href = '/dashboard?error=access_denied';
            }
        </script>
    </body>
    </html>
  `;
  
  res.send(demoPage);
});

// OAuth callback handler
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.redirect('/dashboard?error=authorization_failed');
    }

    // In a real implementation, we'd:
    // 1. Exchange code for access token
    // 2. Get user info from Kraken
    // 3. Store tokens securely
    
    // For demo, simulate successful exchange
    const mockToken = await krakenDemo.mockExchangeCodeForToken(code as string);
    const userInfo = await krakenDemo.getMockUserInfo();
    const balance = await krakenDemo.getMockBalance();

    // Create exchange record (simulating OAuth connection)
    const newExchange = await storage.createExchange({
      userId: 'demo-user-id', // In real app, get from session
      name: 'Kraken (Connected via OAuth)',
      type: 'kraken',
      credentials: JSON.stringify({
        access_token: mockToken.access_token,
        refresh_token: mockToken.refresh_token,
        user_id: userInfo.user_id,
        connection_type: 'oauth'
      }),
      isActive: true,
    });

    // Sync portfolio from OAuth connection
    for (const [symbol, amount] of Object.entries(balance)) {
      const usdValue = symbol === 'ZUSD' ? amount : (parseFloat(amount) * 45000).toString(); // Mock USD conversion
      await storage.updatePortfolio(
        'demo-user-id',
        newExchange.id,
        symbol,
        amount,
        usdValue
      );
    }

    // Redirect to success page
    res.redirect('/dashboard?kraken_connected=true');
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('/dashboard?error=connection_failed');
  }
});

export default router;