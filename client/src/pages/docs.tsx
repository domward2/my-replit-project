import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Book, Zap, Shield, BarChart3, Bot } from "lucide-react";

export default function Docs() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Developer Documentation</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Build powerful trading applications with PnL AI's API and SDK. Get started with our comprehensive documentation and examples.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">API Reference</CardTitle>
                    <CardDescription className="text-gray-400">
                      Complete REST API documentation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Access real-time market data, execute trades, and manage portfolios programmatically.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">REST API</Badge>
                  <Badge variant="secondary">WebSocket</Badge>
                  <Badge variant="secondary">Rate Limiting</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  View API Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Book className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">SDK & Libraries</CardTitle>
                    <CardDescription className="text-gray-400">
                      Official SDKs for popular languages
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Get started quickly with our official SDKs for Python, JavaScript, and more.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">JavaScript</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Download SDKs
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="bg-purple-600 p-3 rounded-lg w-fit">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Quick Start</CardTitle>
                <CardDescription className="text-gray-400">
                  Get up and running in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Follow our step-by-step guide to make your first API call and start building.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="bg-orange-600 p-3 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Authentication</CardTitle>
                <CardDescription className="text-gray-400">
                  Secure API access methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Learn about API keys, OAuth2, and best practices for secure integration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="bg-red-600 p-3 rounded-lg w-fit">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Analytics API</CardTitle>
                <CardDescription className="text-gray-400">
                  Market data and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Access sentiment analysis, market trends, and trading signals via API.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 mt-12">
            <CardContent className="p-8 text-center">
              <Bot className="h-12 w-12 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Build?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of developers building the future of crypto trading with PnL AI's powerful APIs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get API Key
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Examples
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  );
}