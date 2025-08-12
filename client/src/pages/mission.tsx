import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useEffect } from "react";

export default function Mission() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <MarketingLayout>
      <div className="container mx-auto px-4 py-16">

        <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Mission & Vision</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To democratize sophisticated cryptocurrency trading tools and make them accessible to everyday investors without requiring advanced technical expertise or complex setups.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p>
                We envision a future where retail traders have access to the same quality of tools and insights used by professional trading firms, leveling the playing field in cryptocurrency markets through AI-powered analysis and automation.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Core Values</h2>
              
              <div className="grid gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">🔒 Security First</h3>
                  <p>We prioritize the security of your data and trading credentials above all else. Every integration follows industry best practices for encryption, access controls, and secure data handling.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">🌟 Transparency</h3>
                  <p>No hidden fees, no black-box algorithms. We believe in clear communication about how our tools work, what data we use, and what risks are involved in automated trading.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">🎯 Accessibility</h3>
                  <p>Complex trading strategies shouldn't require a computer science degree. We design our interface and workflows to be intuitive for traders of all experience levels.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">⚡ Innovation</h3>
                  <p>We continuously integrate the latest advances in AI and sentiment analysis to provide cutting-edge insights that give our users a competitive advantage.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
              <ul className="space-y-3">
                <li><strong>Safety-First Approach:</strong> Paper trading by default with optional live trading activation</li>
                <li><strong>Real-Time Sentiment Analysis:</strong> AI-powered market sentiment scoring from multiple data sources</li>
                <li><strong>Streamlined Exchange Integration:</strong> Connect your accounts in minutes, not hours</li>
                <li><strong>Comprehensive Risk Controls:</strong> Built-in daily loss limits, position sizing, and circuit breakers</li>
                <li><strong>Multi-Exchange Support:</strong> Unified interface for managing positions across different platforms</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Looking Forward</h2>
              <p>
                As we continue to grow, our focus remains on empowering individual traders with institutional-grade tools while maintaining the simplicity and security that define our platform. We're committed to building sustainable, profitable trading solutions for the retail crypto community.
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </MarketingLayout>
  );
}