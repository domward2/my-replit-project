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
    
    // Force immediate auth check with deployment handling
    const performAuthCheck = () => {
      // Check localStorage first
      const localUser = getAuthUser();
      const token = localStorage.getItem('pnl-ai-token');
      
      if (localUser && token) {
        console.log('Found localStorage auth:', localUser.username);
        console.log('Found localStorage token:', token ? 'YES' : 'NO');
        
        // Validate the token with the server before trusting localStorage
        fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-cache',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            console.log('Token validation successful:', data.user.username);
            setUser(data.user);
          } else {
            console.log('Token validation failed - clearing localStorage');
            localStorage.removeItem('pnl-ai-token');
            localStorage.removeItem('pnl-ai-auth');
            localStorage.removeItem('pnl-ai-timestamp');
            setUser(null);
          }
          setIsLoading(false);
        })
        .catch(() => {
          console.log('Token validation error - clearing localStorage');
          localStorage.removeItem('pnl-ai-token');
          localStorage.removeItem('pnl-ai-auth');
          localStorage.removeItem('pnl-ai-timestamp');
          setUser(null);
          setIsLoading(false);
        });
        return;
      }

      // If no localStorage auth, try server (but don't wait long)
      const serverAuthTimeout = setTimeout(() => {
        console.log('Server auth timeout - assuming unauthenticated');
        setUser(null);
        setIsLoading(false);
      }, 2000); // 2 second timeout

      fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-cache',
        headers: { 
          'Cache-Control': 'no-cache',
          ...(localStorage.getItem('pnl-ai-token') ? { 'Authorization': `Bearer ${localStorage.getItem('pnl-ai-token')}` } : {})
        }
      })
      .then(async (response) => {
        clearTimeout(serverAuthTimeout);
        if (response.ok) {
          const data = await response.json();
          console.log('Server auth success:', data.user.username);
          setUser(data.user);
        } else {
          console.log('Server auth failed');
          setUser(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        clearTimeout(serverAuthTimeout);
        console.log('Server auth error:', error);
        setUser(null);
        setIsLoading(false);
      });
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
