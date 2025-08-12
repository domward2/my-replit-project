import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-dark-card mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-2 sm:mb-0">
            <span className="text-white font-medium">PnL AI</span>
            <span className="mx-2">•</span>
            <span>© 2025 AI-Powered Crypto Trading</span>
          </div>
          
          <div className="flex items-center space-x-4 flex-wrap">
            <Link href="/about" className="hover:text-white transition-colors" data-testid="link-about">
              About Us
            </Link>
            <Link href="/mission" className="hover:text-white transition-colors" data-testid="link-mission">
              Mission
            </Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors" data-testid="link-how-it-works">
              How It Works
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}