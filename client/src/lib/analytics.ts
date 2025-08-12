// Google Analytics 4 implementation with GDPR compliance
// Stores user consent and manages GA4 tracking

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export interface TrackingConsent {
  hasConsented: boolean;
  timestamp: number;
}

// Constants
const CONSENT_KEY = 'ga_consent';
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Get stored consent
export function getStoredConsent(): TrackingConsent | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Store user consent choice
export function storeConsent(hasConsented: boolean): void {
  const consent: TrackingConsent = {
    hasConsented,
    timestamp: Date.now()
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

// Check if user has given consent
export function hasUserConsented(): boolean {
  const consent = getStoredConsent();
  return consent?.hasConsented === true;
}

// Load GA4 script dynamically
export function loadGA4Script(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!MEASUREMENT_ID) {
      console.warn('GA4 Measurement ID not found');
      reject(new Error('Missing measurement ID'));
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.onload = () => {
      // Initialize GA4
      window.gtag('js', new Date());
      window.gtag('config', MEASUREMENT_ID, {
        // Privacy-friendly defaults for GDPR
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
      
      console.log('Google Analytics 4 loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load Google Analytics 4');
      reject(new Error('Failed to load GA4'));
    };

    document.head.appendChild(script);
  });
}

// Initialize GA4 if consent exists
export async function initializeGA4(): Promise<void> {
  if (hasUserConsented()) {
    try {
      await loadGA4Script();
    } catch (error) {
      console.error('GA4 initialization failed:', error);
    }
  }
}

// Track user login success
export function trackLogin(userId: string): void {
  if (!hasUserConsented() || !window.gtag) return;
  
  window.gtag('set', 'user_id', userId);
  window.gtag('event', 'login_success', {
    user_id: userId,
    method: 'credentials'
  });
}

// Track user signup success
export function trackSignup(userId: string): void {
  if (!hasUserConsented() || !window.gtag) return;
  
  window.gtag('set', 'user_id', userId);
  window.gtag('event', 'sign_up', {
    user_id: userId,
    method: 'credentials'
  });
}

// Track exchange connection
export function trackExchangeConnected(exchangeName: string, userId?: string): void {
  if (!hasUserConsented() || !window.gtag) return;
  
  window.gtag('event', 'exchange_connected', {
    exchange: exchangeName,
    user_id: userId || 'anonymous',
    event_category: 'engagement'
  });
}

// Track trade execution
export function trackTradeExecuted(
  exchangeName: string, 
  tradeAmount: string, 
  userId?: string,
  symbol?: string,
  side?: 'buy' | 'sell'
): void {
  if (!hasUserConsented() || !window.gtag) return;
  
  window.gtag('event', 'trade_executed', {
    exchange: exchangeName,
    amount: tradeAmount,
    user_id: userId || 'anonymous',
    symbol: symbol || 'unknown',
    side: side || 'unknown',
    event_category: 'engagement',
    value: parseFloat(tradeAmount) || 0
  });
}

// Track page views for SPA navigation
export function trackPageView(path: string): void {
  if (!hasUserConsented() || !window.gtag) return;
  
  window.gtag('config', MEASUREMENT_ID, {
    page_path: path,
    page_title: document.title
  });
}

// Track custom events
export function trackCustomEvent(
  eventName: string, 
  parameters: Record<string, any> = {}
): void {
  if (!hasUserConsented() || !window.gtag) return;
  
  window.gtag('event', eventName, {
    event_category: 'custom',
    ...parameters
  });
}

// Clear user data (for logout or consent withdrawal)
export function clearUserData(): void {
  if (!window.gtag) return;
  
  window.gtag('config', MEASUREMENT_ID, {
    user_id: null
  });
}

// Handle consent acceptance
export async function acceptTracking(): Promise<void> {
  storeConsent(true);
  
  if (!window.gtag) {
    await loadGA4Script();
  }
  
  // Track consent acceptance
  window.gtag('event', 'consent_granted', {
    event_category: 'privacy',
    consent_type: 'analytics'
  });
}

// Handle consent decline
export function declineTracking(): void {
  storeConsent(false);
  
  // If GA4 is already loaded, disable it
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied'
    });
  }
}