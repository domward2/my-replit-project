import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopNavigation from "@/components/layout/top-navigation";
import PortfolioOverview from "@/components/dashboard/portfolio-overview";
import SentimentAnalysis from "@/components/dashboard/sentiment-analysis";
import TradingInterface from "@/components/dashboard/trading-interface";
import ExchangeConnections from "@/components/dashboard/exchange-connections";
import ActiveBots from "@/components/dashboard/active-bots";
import RecentActivity from "@/components/dashboard/recent-activity";
import RiskControls from "@/components/dashboard/risk-controls";
import { useWebSocket } from "@/hooks/use-websocket";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const isMobile = useIsMobile();
  
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  // Initialize WebSocket connection
  useWebSocket((user as { user: { id: string } } | undefined)?.user?.id);

  return (
    <div className="min-h-screen flex bg-dark-bg">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
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
      </div>
    </div>
  );
}
