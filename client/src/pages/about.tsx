import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
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
            <CardTitle className="text-3xl">About Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong>PnL AI</strong> is a Canary Islands–based technology startup developing next-generation crypto trading tools. Our platform helps traders connect their exchange accounts, analyze market sentiment in real-time, and automate strategies with minimal setup.
            </p>

            <p>
              Founded in 2025, our mission is to make sophisticated crypto trading tools accessible to everyday investors — without requiring advanced coding skills or complex setups. We combine sentiment analysis, portfolio tracking, and smart automation into a single, easy-to-use interface.
            </p>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="mb-4">
                PnL AI was founded by a team of fintech and technology enthusiasts with deep experience in blockchain integration, data analytics, and automated trading systems.
              </p>
              
              <ul className="space-y-2">
                <li><strong>Domain expertise:</strong> Crypto trading, sentiment analysis, and automated strategy deployment.</li>
                <li><strong>Technical skills:</strong> API integrations with major exchanges, scalable cloud architectures, and secure data handling.</li>
                <li><strong>Vision:</strong> Level the playing field in crypto markets by giving traders the same quality of tools used by professionals.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Where we operate</h2>
              <p className="mb-4">
                Based in the Canary Islands, Spain, we operate within EU data protection and regulatory frameworks, ensuring user privacy and compliance.
              </p>
              
              <p>
                We are currently in MVP development and onboarding early users for testing. If you'd like to be part of our beta program, <a href="mailto:support@pnlai.com" className="text-primary hover:underline">contact us here</a>.
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