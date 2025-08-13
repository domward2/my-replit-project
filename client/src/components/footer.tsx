import { Link } from 'wouter';

export function Footer() {
  const currentVersion = import.meta.env.VITE_APP_VERSION || '2.1.0';
  
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-auto" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span>© 2025 PnL AI. All rights reserved.</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-blue-400">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-blue-400">Terms</Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Version {currentVersion}</span>
            <span>•</span>
            <Link href="/changelog" className="hover:text-blue-400" data-testid="link-changelog">
              Changelog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}