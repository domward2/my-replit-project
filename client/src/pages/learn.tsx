import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, FileText, MessageCircle, TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function Learn() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600/10 text-blue-400 border-blue-600/20">
              Education Center
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Learn Crypto Trading with AI
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Master cryptocurrency trading with our comprehensive guides, tutorials, and AI-powered insights. Start your journey from beginner to expert trader.
            </p>
          </div>

          {/* Learning Paths */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-900 border-gray-700 hover:border-blue-600/50 transition-colors">
              <CardHeader>
                <div className="bg-blue-600 p-3 rounded-lg w-fit">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Beginner's Guide</CardTitle>
                <CardDescription className="text-gray-400">
                  Start your crypto trading journey with the basics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300 mb-4">
                  <li>• What is cryptocurrency trading?</li>
                  <li>• Understanding market basics</li>
                  <li>• Setting up your first exchange account</li>
                  <li>• Risk management fundamentals</li>
                </ul>
                <Button variant="outline" className="w-full" data-testid="button-start-beginner">
                  Start Learning
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-green-600/50 transition-colors">
              <CardHeader>
                <div className="bg-green-600 p-3 rounded-lg w-fit">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">AI Trading Strategies</CardTitle>
                <CardDescription className="text-gray-400">
                  Learn how to leverage AI for better trading decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300 mb-4">
                  <li>• Understanding sentiment analysis</li>
                  <li>• AI-powered market prediction</li>
                  <li>• Automated trading bot setup</li>
                  <li>• Backtesting your strategies</li>
                </ul>
                <Button variant="outline" className="w-full" data-testid="button-start-ai-strategies">
                  Explore AI Trading
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-purple-600/50 transition-colors">
              <CardHeader>
                <div className="bg-purple-600 p-3 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Advanced Risk Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Master professional risk management techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300 mb-4">
                  <li>• Portfolio diversification strategies</li>
                  <li>• Stop-loss and take-profit orders</li>
                  <li>• Position sizing calculations</li>
                  <li>• Market volatility analysis</li>
                </ul>
                <Button variant="outline" className="w-full" data-testid="button-start-risk-management">
                  Master Risk Management
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Learning Resources */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-600 p-3 rounded-lg">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Video Tutorials</CardTitle>
                    <CardDescription className="text-gray-400">
                      Step-by-step video guides
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Watch our comprehensive video series covering everything from platform basics to advanced trading strategies.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>📹 Platform Overview (5 min)</div>
                  <div>📹 Setting Up Your First Bot (12 min)</div>
                  <div>📹 Reading Sentiment Signals (8 min)</div>
                  <div>📹 Risk Management Best Practices (15 min)</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-cyan-600 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Documentation</CardTitle>
                    <CardDescription className="text-gray-400">
                      Detailed guides and API references
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Comprehensive documentation covering all platform features, integrations, and troubleshooting guides.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>📖 Platform User Manual</div>
                  <div>📖 Exchange Integration Guide</div>
                  <div>📖 API Documentation</div>
                  <div>📖 Troubleshooting Guide</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Concepts */}
          <Card className="bg-gray-900 border-gray-700 mb-16">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Key Trading Concepts</CardTitle>
              <CardDescription className="text-gray-400">
                Essential knowledge for successful crypto trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-600 p-4 rounded-lg w-fit mx-auto mb-3">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Technical Analysis</h3>
                  <p className="text-gray-400 text-sm">Learn to read charts, identify patterns, and use indicators to predict price movements.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-600 p-4 rounded-lg w-fit mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Market Sentiment</h3>
                  <p className="text-gray-400 text-sm">Understand how news, social media, and emotions drive market movements.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-600 p-4 rounded-lg w-fit mx-auto mb-3">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Trading Psychology</h3>
                  <p className="text-gray-400 text-sm">Master your emotions and develop the mental discipline needed for consistent profits.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-600 p-4 rounded-lg w-fit mx-auto mb-3">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Risk Management</h3>
                  <p className="text-gray-400 text-sm">Protect your capital with proper position sizing, stop losses, and portfolio management.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community and Support */}
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-500">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Join Our Community</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Connect with other traders, share strategies, and get help from our community of experts. Learn faster together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Discord Community
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Live Trading Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  );
}