import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyNavigation } from "@/components/layout/company-navigation";
import { useEffect } from "react";

export default function Privacy() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CompanyNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <h3 className="text-xl font-medium mb-3">Account Information</h3>
              <p>When you create an account, we collect your email address, username, and securely hashed password. We never store passwords in plain text.</p>
              
              <h3 className="text-xl font-medium mb-3 mt-6">Trading Data</h3>
              <p>With your explicit consent, we collect trading data from connected exchange accounts including portfolio balances, transaction history, and trading preferences. This data is used solely to provide our services and is never shared with third parties.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <ul className="space-y-2">
                <li>Provide and maintain our trading platform services</li>
                <li>Analyze market sentiment and generate trading insights</li>
                <li>Send you service-related communications</li>
                <li>Improve our platform based on usage patterns</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>We implement industry-standard security measures including:</p>
              <ul className="space-y-2 mt-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication protocols</li>
                <li>Secure data storage with reputable cloud providers</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Rights (GDPR Compliance)</h2>
              <p>As users located in the EU, you have the following rights:</p>
              <ul className="space-y-2 mt-4">
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p>We retain your personal data only as long as necessary to provide our services or as required by law. Account data is typically retained for the duration of your account plus 3 years for legal compliance.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <p>We integrate with cryptocurrency exchanges through their official APIs. We do not share your personal information with these services beyond what is necessary for authentication and data retrieval as authorized by you.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>For privacy-related questions or to exercise your rights, contact us at:</p>
              <p className="mt-2">
                Email: <a href="mailto:privacy@pnlai.com" className="text-primary hover:underline">privacy@pnlai.com</a><br />
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