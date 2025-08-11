import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [user, setUser] = useState<any>(null);

  // Check localStorage first for immediate auth state (deployment compatibility)
  useEffect(() => {
    const checkLocalAuth = () => {
      const storedUser = localStorage.getItem('pnl-auth-user');
      const timestamp = localStorage.getItem('pnl-auth-timestamp');
      
      if (storedUser && timestamp) {
        const authAge = Date.now() - parseInt(timestamp);
        // Check if auth is less than 24 hours old
        if (authAge < 24 * 60 * 60 * 1000) {
          setUser(JSON.parse(storedUser));
          setAuthState('authenticated');
          return true;
        } else {
          // Clear expired auth
          localStorage.removeItem('pnl-auth-user');
          localStorage.removeItem('pnl-auth-timestamp');
        }
      }
      return false;
    };

    // If localStorage auth found, use it immediately
    if (checkLocalAuth()) {
      return;
    }

    // Otherwise, check server auth
    const checkServerAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setAuthState('authenticated');
          // Store in localStorage for next time
          localStorage.setItem('pnl-auth-user', JSON.stringify(userData.user));
          localStorage.setItem('pnl-auth-timestamp', Date.now().toString());
        } else {
          setAuthState('unauthenticated');
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        setAuthState('unauthenticated');
      }
    };

    checkServerAuth();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-trading-blue"></div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <Login />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <AuthWrapper>
          <Dashboard />
        </AuthWrapper>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
