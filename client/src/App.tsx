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
    
    // Simplified auth check using session only
    const performAuthCheck = () => {
      // Check localStorage first
      const localUser = getAuthUser();
      
      if (localUser) {
        console.log('Found localStorage auth:', localUser.username);
        
        // Validate session with server with explicit cookie handling
        fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-cache',
          mode: 'cors',
          headers: { 
            'Cache-Control': 'no-cache',
            'Accept': 'application/json'
          }
        })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            console.log('Session validation successful:', data.user.username);
            setUser(data.user);
          } else {
            console.log('Session validation failed - clearing localStorage');
            clearAuthUser();
            setUser(null);
          }
          setIsLoading(false);
        })
        .catch(() => {
          console.log('Session validation error - clearing localStorage');
          clearAuthUser();
          setUser(null);
          setIsLoading(false);
        });
        return;
      }

      // If no localStorage auth, try server session
      const serverAuthTimeout = setTimeout(() => {
        console.log('Server auth timeout - assuming unauthenticated');
        setUser(null);
        setIsLoading(false);
      }, 2000);

      fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-cache',
        mode: 'cors',
        headers: { 
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        }
      })
      .then(async (response) => {
        clearTimeout(serverAuthTimeout);
        if (response.ok) {
          const data = await response.json();
          console.log('Server session auth success:', data.user.username);
          setUser(data.user);
        } else {
          console.log('Server session auth failed');
          setUser(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        clearTimeout(serverAuthTimeout);
        console.log('Server session auth error:', error);
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
