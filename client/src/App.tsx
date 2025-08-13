import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsentBanner } from "@/components/cookie-consent";
import { useAnalytics } from "@/hooks/use-analytics";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { useState, useEffect } from "react";
import { getAuthUser, clearAuthUser, type User } from "./lib/auth";
import { initializeDeploymentRouter } from "./lib/deployment-router";
import { DebugAuth } from "./components/debug-auth";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import Signup from "@/pages/signup";
import Docs from "@/pages/docs";
import Pricing from "@/pages/pricing";
import Safety from "@/pages/safety";
import Learn from "@/pages/learn";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Mission from "@/pages/mission";
import HowItWorks from "@/pages/how-it-works";
import NotFound from "@/pages/not-found";
import Changelog from "@/pages/changelog";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize deployment-specific routing
    initializeDeploymentRouter();
    
    // Token-based auth check (no session dependency)
    const performAuthCheck = () => {
      // Check localStorage for user and token
      const localUser = getAuthUser();
      const token = localStorage.getItem('pnl-ai-token');
      
      console.log('Auth check - User:', !!localUser, 'Token:', !!token);
      console.log('LocalStorage contents:', {
        user: localStorage.getItem('pnl-ai-auth'),
        token: localStorage.getItem('pnl-ai-token'),
        timestamp: localStorage.getItem('pnl-ai-timestamp')
      });
      
      if (localUser && token) {
        console.log('Found localStorage auth:', localUser.username, 'Token length:', token.length);
        
        // Validate token with server using cache-busting
        const cacheBuster = Date.now();
        fetch(`/api/auth/me?cb=${cacheBuster}`, {
          cache: 'no-store',
          mode: 'cors',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Accept': 'application/json'
          }
        })
        .then(async (response) => {
          console.log('Token validation response status:', response.status);
          if (response.ok) {
            const data = await response.json();
            console.log('Token validation successful:', data.user.username);
            setUser(data.user);
          } else {
            const errorText = await response.text();
            console.log('Token validation failed:', response.status, errorText);
            clearAuthUser();
            setUser(null);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.log('Token validation error:', error);
          clearAuthUser();
          setUser(null);
          setIsLoading(false);
        });
      } else {
        console.log('No valid auth found - user needs to login. User exists:', !!localUser, 'Token exists:', !!token);
        setUser(null);
        setIsLoading(false);
      }
    };

    performAuthCheck();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-trading-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}

function Router() {
  // Enable scroll-to-top on all route changes
  useScrollToTop();
  
  // Track page views automatically
  useAnalytics();
  
  return (
    <Switch>
      {/* Dashboard pages - authenticated access with DashboardLayout */}
      <Route path="/dashboard">
        <AuthWrapper>
          <Dashboard />
        </AuthWrapper>
      </Route>
      
      {/* Marketing pages - public access with MarketingLayout (no auth required) */}
      <Route path="/home" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/safety" component={Safety} />
      <Route path="/learn" component={Learn} />
      <Route path="/contact" component={Contact} />
      <Route path="/signup" component={Signup} />
      <Route path="/docs" component={Docs} />
      <Route path="/login" component={Login} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/mission" component={Mission} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/changelog" component={Changelog} />
      
      {/* Root route - redirect to home if not authenticated, dashboard if authenticated */}
      <Route path="/">
        {(() => {
          const localUser = getAuthUser();
          const token = localStorage.getItem('pnl-ai-token');
          
          if (localUser && token) {
            return (
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            );
          }
          
          return <Home />;
        })()}
      </Route>
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <main role="main">
            <Toaster />
            <Router />
            <DebugAuth />
            <CookieConsentBanner />
          </main>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
