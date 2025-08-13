import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4"
      data-testid="page-not-found"
    >
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-blue-400" data-testid="text-404">404</h1>
          <h2 className="text-2xl font-semibold">Page not found</h2>
          <p className="text-gray-300">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full" data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()} 
            className="w-full"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="text-sm text-gray-400">
          <p>Need help? <a href="mailto:support@pnl-ai.com" className="text-blue-400 hover:underline">Contact support</a></p>
        </div>
      </div>
    </div>
  );
}