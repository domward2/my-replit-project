import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function HowItWorks() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="back-to-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                PA
              </div>
              <span className="text-lg font-semibold">PnL AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">How It Works</CardTitle>
            <p className="text-muted-foreground">A step-by-step guide to getting started with PnL AI</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Connect Your Exchange
                </h3>
                <p className="text-muted-foreground mb-4">
                  Securely connect your cryptocurrency exchange accounts using OAuth (Coinbase) or API keys (Kraken). We guide you through the entire process with step-by-step instructions.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• One-click OAuth connection for Coinbase</li>
                  <li>• 60-second guided setup for Kraken API keys</li>
                  <li>• Bank-level security with encrypted credential storage</li>
                  <li>• Revokable access through your exchange settings</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Monitor Your Portfolio
                </h3>
                <p className="text-muted-foreground mb-4">
                  Once connected, PnL AI automatically syncs your portfolio data and displays real-time balances, positions, and performance metrics across all your connected exchanges.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time balance updates</li>
                  <li>• Cross-exchange portfolio aggregation</li>
                  <li>• Profit & loss tracking with detailed analytics</li>
                  <li>• Historical performance charts</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Analyze Market Sentiment
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our AI continuously analyzes social media sentiment, news sources, and market indicators to provide real-time sentiment scores for major cryptocurrencies.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time sentiment scoring for BTC, ETH, and other major coins</li>
                  <li>• Social media trend analysis</li>
                  <li>• News sentiment integration</li>
                  <li>• Market regime detection</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Automate Your Trading (Optional)
                </h3>
                <p className="text-muted-foreground mb-4">
                  Set up automated trading bots that react to sentiment signals and market conditions. Start with paper trading to test strategies before risking real capital.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Paper trading mode by default (risk-free testing)</li>
                  <li>• Customizable trading strategies based on sentiment</li>
                  <li>• Built-in risk controls (daily loss limits, position sizing)</li>
                  <li>• Circuit breakers to prevent major losses</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold mb-3">🛡️ Safety First Approach</h3>
              <p className="text-muted-foreground mb-4">
                PnL AI is designed with safety as the top priority. All accounts start in paper trading mode, allowing you to test strategies and familiarize yourself with the platform without risking real money.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li><strong>Paper Trading:</strong> Test strategies with simulated trades using real market data</li>
                <li><strong>Risk Controls:</strong> Set daily loss limits, position sizes, and enable circuit breakers</li>
                <li><strong>Gradual Activation:</strong> Only enable live trading when you're confident in your strategies</li>
                <li><strong>Transparent Operations:</strong> All trades and decisions are logged for your review</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                  PA
                </div>
                <span className="text-lg font-semibold">PnL AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered crypto trading platform for retail traders.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm">
                <Link href="/about" className="block hover:text-primary">About Us</Link>
                <Link href="/mission" className="block hover:text-primary">Mission & Vision</Link>
                <Link href="/how-it-works" className="block hover:text-primary">How It Works</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block hover:text-primary">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-primary">Terms of Service</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PnL AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}