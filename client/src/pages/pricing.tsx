import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your trading needs. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Free Plan */}
            <Card className="bg-gray-900 border-gray-700 relative">
              <CardHeader>
                <CardTitle className="text-white text-xl">Starter</CardTitle>
                <CardDescription className="text-gray-400">
                  Perfect for beginners exploring crypto trading
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Paper trading only</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Basic sentiment analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">1 exchange connection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Community support</span>
                  </div>
                </div>
                <Link href="/signup">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600" data-testid="button-start-free">
                    Start Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gray-900 border-blue-600 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white text-xl">Pro</CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced features for serious traders
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">$29</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Live trading enabled</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Advanced AI sentiment analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">5 exchange connections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Automated trading bots</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Priority support</span>
                  </div>
                </div>
                <Link href="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-upgrade-pro">
                    Upgrade to Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gray-900 border-gray-700 relative">
              <CardHeader>
                <CardTitle className="text-white text-xl">Enterprise</CardTitle>
                <CardDescription className="text-gray-400">
                  Custom solutions for institutional traders
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">Custom</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Unlimited exchanges</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Custom AI models</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">API access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300">Dedicated support</span>
                  </div>
                </div>
                <Link href="/contact">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600" data-testid="button-contact-sales">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Comparison */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 text-gray-300">Feature</th>
                    <th className="text-center py-4 text-gray-300">Starter</th>
                    <th className="text-center py-4 text-blue-400">Pro</th>
                    <th className="text-center py-4 text-gray-300">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">Exchange Connections</td>
                    <td className="text-center py-3 text-gray-400">1</td>
                    <td className="text-center py-3 text-white">5</td>
                    <td className="text-center py-3 text-white">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">Live Trading</td>
                    <td className="text-center py-3 text-gray-400">❌</td>
                    <td className="text-center py-3 text-green-500">✅</td>
                    <td className="text-center py-3 text-green-500">✅</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">AI Sentiment Analysis</td>
                    <td className="text-center py-3 text-yellow-500">Basic</td>
                    <td className="text-center py-3 text-green-500">Advanced</td>
                    <td className="text-center py-3 text-green-500">Custom</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-gray-300">Automated Bots</td>
                    <td className="text-center py-3 text-gray-400">❌</td>
                    <td className="text-center py-3 text-green-500">✅</td>
                    <td className="text-center py-3 text-green-500">✅</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-300">Support</td>
                    <td className="text-center py-3 text-gray-400">Community</td>
                    <td className="text-center py-3 text-white">Priority</td>
                    <td className="text-center py-3 text-white">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
                <p className="text-gray-400">Yes! Our Starter plan is completely free and includes paper trading to help you learn our platform risk-free.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-400">Absolutely. You can cancel your subscription at any time with no penalties or hidden fees.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What exchanges do you support?</h3>
                <p className="text-gray-400">We support major exchanges including Coinbase, Kraken, Binance, and more. See our full list in the documentation.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is my data secure?</h3>
                <p className="text-gray-400">Yes. We use bank-level encryption and never store your exchange credentials in plain text. Your security is our top priority.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}