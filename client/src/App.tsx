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

  // Direct auth check bypassing React Query for deployment compatibility
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setAuthState('authenticated');
        } else {
          setAuthState('unauthenticated');
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        setAuthState('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  // Also use React Query as backup
  const { data: queryUser } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: authState === 'loading', // Only run if direct check is still loading
  });

  // Use React Query result if direct auth hasn't resolved yet
  useEffect(() => {
    if (authState === 'loading' && queryUser) {
      setUser(queryUser.user);
      setAuthState('authenticated');
    }
  }, [queryUser, authState]);

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
