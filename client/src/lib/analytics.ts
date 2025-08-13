// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);

  console.log('Google Analytics 4 loaded successfully');
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

// Track custom events with enhanced business logic
export const track = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.log('Analytics not available, event skipped:', eventName);
    return;
  }
  
  console.log('Tracking event:', eventName, properties);
  
  window.gtag('event', eventName, {
    event_category: properties?.category || 'user_action',
    event_label: properties?.label,
    value: properties?.value,
    custom_parameter_1: properties?.custom_parameter_1,
    ...properties
  });
};

// Business-specific tracking functions
export const trackSignupStarted = () => track('signup_started', { category: 'authentication' });
export const trackSignupCompleted = () => track('signup_completed', { category: 'authentication' });
export const trackExchangeConnected = (exchange: string) => track('exchange_connected', { category: 'integration', label: exchange });
export const trackFirstStrategyRun = () => track('first_strategy_run', { category: 'trading' });

// Additional tracking functions required by components
export const trackLogin = () => track('login_success', { category: 'authentication' });
export const trackSignup = () => track('signup_completed', { category: 'authentication' });
export const trackTradeExecuted = (details?: any) => track('trade_executed', { category: 'trading', ...details });

// Cookie consent management
export type TrackingConsent = 'granted' | 'denied' | null;

export const getStoredConsent = (): TrackingConsent => {
  const consent = localStorage.getItem('pnl-ai-analytics-consent');
  return consent as TrackingConsent;
};

export const acceptTracking = () => {
  localStorage.setItem('pnl-ai-analytics-consent', 'granted');
  initGA();
  console.log('Analytics initialized with user consent');
};

export const declineTracking = () => {
  localStorage.setItem('pnl-ai-analytics-consent', 'denied');
  console.log('Analytics tracking declined by user');
};

export const initializeGA4 = () => {
  const consent = getStoredConsent();
  if (consent === 'granted') {
    initGA();
  }
};