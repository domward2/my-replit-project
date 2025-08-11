import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <Card className="bg-dark-card border-dark-border animate-pulse">
        <CardContent className="p-6">
          <div className="h-5 bg-slate-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-2 h-2 bg-slate-700 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded mb-1 w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-slate-700 rounded w-12"></div>
              </div>
            ))}
          </div>
          <div className="h-8 bg-slate-700 rounded mt-4"></div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration since we don't have real activity data yet
  const mockActivities = [
    {
      id: "1",
      type: "trade",
      title: "Buy BTC executed",
      description: "Market order for 0.023 BTC/USDT",
      reason: "Sentiment signal: News buzz ↑, Social +23%",
      amount: 247,
      symbol: "BTC",
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    {
      id: "2",
      type: "trade",
      title: "SL triggered on ETH",
      description: "Stop loss executed",
      reason: "Daily loss cap: 67% remaining",
      amount: -89,
      symbol: "ETH",
      createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    },
    {
      id: "3",
      type: "bot_action",
      title: "Grid bot profit",
      description: "ADA/USDT grid completed cycle",
      reason: "Grid bot cycle #47 completed",
      amount: 34,
      symbol: "ADA",
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
  ];

  const displayActivities = (activities as any[])?.length > 0 ? activities : mockActivities;

  const getActivityColor = (type: string, amount?: number) => {
    if (amount) {
      return amount > 0 ? "bg-trading-green" : "bg-trading-red";
    }
    
    switch (type) {
      case "trade":
        return "bg-trading-blue";
      case "bot_action":
        return "bg-purple-500";
      case "alert":
        return "bg-orange-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return null;
    
    return (
      <span className={`text-sm font-medium ${amount > 0 ? 'text-trading-green' : 'text-trading-red'}`}>
        {amount > 0 ? '+' : ''}${Math.abs(amount)}
      </span>
    );
  };

  return (
    <Card className="bg-dark-card border-dark-border" data-testid="card-recent-activity">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
        
        <div className="space-y-3">
          {(displayActivities as any[]).map((activity: any) => (
            <div 
              key={activity.id}
              className="flex items-start space-x-3 p-3 hover:bg-slate-700/30 rounded-lg transition-colors"
              data-testid={`activity-${activity.id}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type, activity.amount)}`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{activity.title}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.reason || activity.description}</p>
                <p className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
              {activity.amount && formatAmount(activity.amount)}
            </div>
          ))}
        </div>
        
        <Button 
          variant="link"
          className="w-full mt-4 text-trading-blue hover:text-trading-blue/80 text-sm font-medium p-0 h-auto"
          data-testid="button-view-full-log"
        >
          View Full Log
        </Button>
      </CardContent>
    </Card>
  );
}
