import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  Brain, 
  Bot, 
  FileText,
  ToggleLeft,
  ToggleRight 
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Trading", href: "/trading", icon: TrendingUp },
  { name: "Sentiment AI", href: "/sentiment", icon: Brain },
  { name: "Bots & Automation", href: "/bots", icon: Bot },
  { name: "Activity Log", href: "/activity", icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const togglePaperTradingMutation = useMutation({
    mutationFn: (paperTradingEnabled: boolean) =>
      apiRequest("PATCH", "/api/user/settings", { paperTradingEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Settings updated",
        description: (user as { user: { paperTradingEnabled: boolean } } | undefined)?.user?.paperTradingEnabled 
          ? "Paper trading disabled - Live trading enabled" 
          : "Paper trading enabled - Safe mode activated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleTogglePaperTrading = () => {
    togglePaperTradingMutation.mutate(!(user as { user: { paperTradingEnabled: boolean } } | undefined)?.user?.paperTradingEnabled);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-dark-card border-r border-dark-border">
      <div className="flex items-center px-6 py-4 border-b border-dark-border">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-trading-blue to-trading-green rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ST</span>
          </div>
          <span className="ml-3 text-xl font-bold text-white">SentimentTrader</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-trading-blue/20 text-trading-blue"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
              data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Paper Trading</span>
          <button
            onClick={handleTogglePaperTrading}
            disabled={togglePaperTradingMutation.isPending}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-trading-blue focus:ring-offset-2 ${
              (user as { user: { paperTradingEnabled: boolean } } | undefined)?.user?.paperTradingEnabled ? "bg-trading-green" : "bg-slate-600"
            }`}
            data-testid="toggle-paper-trading"
          >
            <span 
              className={`${
                (user as { user: { paperTradingEnabled: boolean } } | undefined)?.user?.paperTradingEnabled ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {(user as { user: { paperTradingEnabled: boolean } } | undefined)?.user?.paperTradingEnabled ? "Safe mode enabled" : "Live trading enabled"}
        </p>
      </div>
    </aside>
  );
}
