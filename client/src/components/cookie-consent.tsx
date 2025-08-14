import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { 
  getStoredConsent, 
  acceptTracking, 
  declineTracking 
} from '@/lib/analytics';

interface CookieConsentBannerProps {
  onConsentChange?: (hasConsented: boolean) => void;
}

export function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already made a consent choice
    const consent = getStoredConsent();
    
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    
    try {
      await acceptTracking();
      setIsVisible(false);
      onConsentChange?.(true);
    } catch (error) {
      console.error('Error accepting tracking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    declineTracking();
    setIsVisible(false);
    onConsentChange?.(false);
  };

  const handleClose = () => {
    // Treat close as decline
    handleDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 pr-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-white">🍪 Cookie Notice</strong>
              <br />
              We use cookies to improve your experience and track usage analytics. 
              By accepting, you help us understand how PnL AI is used to make improvements.
              <span className="block mt-1 text-xs text-gray-400">
                Compliant with GDPR and Spanish data protection regulations.
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
              data-testid="cookie-decline"
            >
              Decline
            </Button>
            
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white border-0"
              data-testid="cookie-accept"
            >
              {isLoading ? 'Loading...' : 'Accept Cookies'}
            </Button>
            
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-1 ml-2"
              data-testid="cookie-close"
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Privacy settings component for user preferences
export function PrivacySettings() {
  const [consent, setConsent] = useState(getStoredConsent());

  const handleToggleConsent = async () => {
    if (consent === 'granted') {
      declineTracking();
      setConsent('denied');
    } else {
      await acceptTracking();
      setConsent('granted');
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Privacy & Analytics</h3>
      
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h4 className="font-medium text-white mb-1">Analytics Cookies</h4>
            <p className="text-sm text-gray-400">
              Help us improve PnL AI by tracking usage patterns and user interactions. 
              No personal data is shared with third parties.
            </p>
          </div>
          
          <Button
            variant={consent === 'granted' ? "default" : "outline"}
            size="sm"
            onClick={handleToggleConsent}
            className={
              consent === 'granted' 
                ? "bg-green-600 hover:bg-green-700" 
                : "border-gray-600 text-gray-300"
            }
            data-testid="privacy-toggle"
          >
            {consent === 'granted' ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
        
        {/* Removed timestamp display since consent is now stored as a simple status */}
      </div>
    </div>
  );
}