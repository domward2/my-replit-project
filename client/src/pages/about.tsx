import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useEffect } from "react";

export default function About() {
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
        </div>
      </div>
    </MarketingLayout>
  );
}