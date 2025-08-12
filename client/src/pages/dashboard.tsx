import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopNavigation from "@/components/layout/top-navigation";
import Footer from "@/components/layout/footer";
import PortfolioOverview from "@/components/dashboard/portfolio-overview";
import SentimentAnalysis from "@/components/dashboard/sentiment-analysis";
import TradingInterface from "@/components/dashboard/trading-interface";
import ExchangeConnections from "@/components/dashboard/exchange-connections";
import ActiveBots from "@/components/dashboard/active-bots";
import RecentActivity from "@/components/dashboard/recent-activity";
import RiskControls from "@/components/dashboard/risk-controls";
import { useWebSocket } from "@/hooks/use-websocket";
import { useIsMobile } from "@/hooks/use-mobile";
import { setAuthUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  // Handle OAuth callback authentication
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth_token');
    const userId = urlParams.get('user_id');
    const username = urlParams.get('username');
    const email = urlParams.get('email');
    const coinbaseConnected = urlParams.get('coinbase_connected');
    const error = urlParams.get('error');

    if (authToken && userId && username) {
      // Store auth data from OAuth callback
      setAuthUser({ id: userId, username, email: email || '' }, authToken);
      
      if (coinbaseConnected === 'true') {
        toast({
          title: "Coinbase Connected!",
          description: "Your Coinbase account has been successfully connected via OAuth.",
        });
      }
      
      // Clean URL by removing auth parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Force a page refresh to reload with authentication
      window.location.reload();
    } else if (error) {
      // Handle OAuth errors
      let errorMessage = "Connection failed. Please try again.";
      if (error === 'user_not_found') {
        errorMessage = "User account not found. Please log in first.";
      } else if (error === 'invalid_state') {
        errorMessage = "Invalid authorization request. Please try again.";
      } else if (error === 'connection_failed') {
        errorMessage = "Failed to connect to Coinbase. Please try again.";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [toast]);

  // Initialize WebSocket connection
  useWebSocket((user as { user: { id: string } } | undefined)?.user?.id);

  return (
    <div className="min-h-screen flex bg-dark-bg">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-5">
          {/* Portfolio Overview Cards */}
          <PortfolioOverview />

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column: Sentiment & Quick Trade */}
            <div className="lg:col-span-2 space-y-6">
              <SentimentAnalysis />
              <TradingInterface />
            </div>

            {/* Right Column: Activity & Bots */}
            <div className="space-y-6">
              <ExchangeConnections />
              <ActiveBots />
              <RecentActivity />
              <RiskControls />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
