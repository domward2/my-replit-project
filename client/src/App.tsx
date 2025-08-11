import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { getAuthUser, clearAuthUser, type User } from "./lib/auth";
import { initializeDeploymentRouter } from "./lib/deployment-router";
import { DebugAuth } from "./components/debug-auth";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";

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
        <DebugAuth />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
