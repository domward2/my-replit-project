import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function Terms() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using PnL AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>PnL AI provides cryptocurrency trading tools including portfolio tracking, sentiment analysis, and automated trading strategies. Our service connects to your exchange accounts via official APIs to provide real-time data and execute trades on your behalf when authorized.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <ul className="space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are solely responsible for all trading decisions made using our platform</li>
                <li>You must comply with all applicable laws and regulations in your jurisdiction</li>
                <li>You agree not to use the service for illegal activities or market manipulation</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Trading Risks</h2>
              <p><strong>IMPORTANT:</strong> Cryptocurrency trading involves substantial risk of loss. You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, and financial resources.</p>
              <ul className="space-y-2 mt-4">
                <li>Past performance does not guarantee future results</li>
                <li>Automated trading strategies may result in significant losses</li>
                <li>Market sentiment analysis is not investment advice</li>
                <li>You may lose some or all of your invested capital</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p>PnL AI and its affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of the service, including but not limited to trading losses, system downtime, or data inaccuracies.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">6. Data and Privacy</h2>
              <p>Your use of PnL AI is also governed by our Privacy Policy. By using the service, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
              <p>We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend the service for maintenance, updates, or due to circumstances beyond our control.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform. Your continued use of the service after such modifications constitutes acceptance of the updated terms.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <p>We may terminate your account at any time for violation of these terms or applicable laws. You may terminate your account at any time by contacting us. Upon termination, your access to the service will cease immediately.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p>These terms shall be governed by and construed in accordance with the laws of Spain, without regard to its conflict of law provisions.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
              <p className="mt-2">
                Email: <a href="mailto:legal@pnlai.com" className="text-primary hover:underline">legal@pnlai.com</a><br />
                Address: PnL AI, Canary Islands, Spain
              </p>
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