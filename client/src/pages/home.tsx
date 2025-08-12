import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Bot, 
  Users,
  ChevronRight,
  Star
} from "lucide-react";

export default function Home() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-blue-600/10 text-blue-400 border-blue-600/20">
              AI-Powered Trading Platform
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Trade Smarter with AI-Driven Insights
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Harness the power of artificial intelligence to analyze market sentiment, 
              automate your trading strategies, and maximize your crypto profits with advanced risk controls.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Start Trading Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Everything You Need to Trade Like a Pro
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven trading strategies 
              to give you an edge in the crypto markets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 hover:border-blue-600/50 transition-colors">
              <CardHeader>
                <div className="bg-blue-600 p-3 rounded-lg w-fit">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">AI Sentiment Analysis</CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time market sentiment from social media, news, and on-chain data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Our AI analyzes thousands of data points to give you early signals on market movements and sentiment shifts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-green-600/50 transition-colors">
              <CardHeader>
                <div className="bg-green-600 p-3 rounded-lg w-fit">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Automated Trading</CardTitle>
                <CardDescription className="text-gray-400">
                  Set up trading bots that execute your strategies 24/7
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Create custom trading strategies and let our bots execute them automatically based on market conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-purple-600/50 transition-colors">
              <CardHeader>
                <div className="bg-purple-600 p-3 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Risk Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced risk controls to protect your capital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Built-in stop losses, position sizing, and daily loss limits ensure you never risk more than you can afford.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-orange-600/50 transition-colors">
              <CardHeader>
                <div className="bg-orange-600 p-3 rounded-lg w-fit">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Portfolio Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Track performance across multiple exchanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Get detailed insights into your trading performance with comprehensive analytics and reporting tools.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-cyan-600/50 transition-colors">
              <CardHeader>
                <div className="bg-cyan-600 p-3 rounded-lg w-fit">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Lightning Fast</CardTitle>
                <CardDescription className="text-gray-400">
                  Execute trades in milliseconds across top exchanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Our low-latency infrastructure ensures your trades are executed at the best possible prices.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-red-600/50 transition-colors">
              <CardHeader>
                <div className="bg-red-600 p-3 rounded-lg w-fit">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Community Insights</CardTitle>
                <CardDescription className="text-gray-400">
                  Learn from successful traders in our community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Access strategies and insights from our community of professional traders and developers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Trusted by Traders Worldwide
            </h2>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10,000+</div>
                <div className="text-sm">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">$50M+</div>
                <div className="text-sm">Volume Traded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-sm">Exchanges</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="text-sm text-gray-400">4.9/5 Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who are already using AI to maximize their crypto profits. 
            Start with our free plan today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                Get Started Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}