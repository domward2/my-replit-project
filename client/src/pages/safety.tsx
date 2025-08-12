import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, AlertTriangle, Eye, Users, CheckCircle } from "lucide-react";

export default function Safety() {
  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-600/10 text-green-400 border-green-600/20">
              Security First
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Your Safety is Our Priority
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              PnL AI implements multiple layers of security and risk controls to protect your funds and data while trading cryptocurrency.
            </p>
          </div>

          {/* Security Measures */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Bank-Level Encryption</CardTitle>
                    <CardDescription className="text-gray-400">
                      End-to-end encryption for all data
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  All your trading credentials and personal data are encrypted using AES-256 encryption, the same standard used by banks and financial institutions worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">API-Only Access</CardTitle>
                    <CardDescription className="text-gray-400">
                      No withdrawal permissions required
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  We only request trading permissions from your exchange. We never ask for withdrawal access, so your funds always remain under your control.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Risk Controls</CardTitle>
                    <CardDescription className="text-gray-400">
                      Built-in safeguards and limits
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Set daily loss limits, position sizes, and emergency stops. Our AI monitors all trades and can halt trading if unusual activity is detected.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-600 p-3 rounded-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Full Transparency</CardTitle>
                    <CardDescription className="text-gray-400">
                      Complete trade and decision logs
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Every trade, decision, and AI recommendation is logged and available for your review. No black box trading - you see everything.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Safety Features */}
          <Card className="bg-gray-900 border-gray-700 mb-16">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Safety Features</CardTitle>
              <CardDescription className="text-gray-400">
                Comprehensive protection for your trading activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Paper Trading First</h3>
                      <p className="text-gray-400 text-sm">Start with simulated trading using real market data to test strategies risk-free.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Daily Loss Limits</h3>
                      <p className="text-gray-400 text-sm">Set maximum daily losses to prevent significant account drawdowns.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Position Sizing</h3>
                      <p className="text-gray-400 text-sm">Automatic position sizing based on your risk tolerance and account size.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Circuit Breakers</h3>
                      <p className="text-gray-400 text-sm">Automatic trading halts during extreme market volatility or unusual patterns.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Two-Factor Authentication</h3>
                      <p className="text-gray-400 text-sm">Optional 2FA for additional account security and peace of mind.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Regular Security Audits</h3>
                      <p className="text-gray-400 text-sm">Third-party security audits and penetration testing to ensure platform integrity.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">24/7 Monitoring</h3>
                      <p className="text-gray-400 text-sm">Continuous monitoring of all systems and trading activities for anomalies.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Instant Disconnection</h3>
                      <p className="text-gray-400 text-sm">Ability to instantly disconnect from exchanges and halt all trading activities.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Regulatory Compliance</CardTitle>
                  <CardDescription className="text-gray-400">
                    Operating within legal frameworks and industry standards
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">GDPR Compliance</h3>
                  <p className="text-gray-400 text-sm">Full compliance with European data protection regulations, giving you complete control over your personal data.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Industry Standards</h3>
                  <p className="text-gray-400 text-sm">Following best practices for financial technology and cryptocurrency trading platform security.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Data Minimization</h3>
                  <p className="text-gray-400 text-sm">We only collect and store data that's essential for providing our trading services.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Right to Deletion</h3>
                  <p className="text-gray-400 text-sm">You can request complete deletion of your account and all associated data at any time.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  );
}