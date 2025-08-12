import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, initializeGA4, getStoredConsent, type TrackingConsent } from '@/lib/analytics';

// Hook to automatically track page views in SPA
export function useAnalytics() {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  const initializedRef = useRef<boolean>(false);
  
  // Initialize GA4 once on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializeGA4();
      initializedRef.current = true;
    }
  }, []);
  
  // Track page views when location changes
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(location);
      prevLocationRef.current = location;
    }
  }, [location]);
}

// Hook to get current consent status
export function useTrackingConsent() {
  const [consent, setConsent] = useState<TrackingConsent | null>(null);
  
  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);
  
  return consent;
}