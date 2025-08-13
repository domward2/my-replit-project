import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ActiveBots() {
  const { data: bots, isLoading } = useQuery({
    queryKey: ["/api/bots"],
  });

  if (isLoading) {
    return (
      <Card className="bg-dark-card border-dark-border animate-pulse">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 bg-slate-700 rounded w-1/3"></div>
            <div className="h-4 bg-slate-700 rounded w-16"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-700 rounded"></div>
            ))}
          </div>
          <div className="h-10 bg-slate-700 rounded mt-4"></div>
        </CardContent>
      </Card>
    );
  }

  // Use only real bots
  const displayBots = (bots as any[]) || [];

  const getBotGradient = (type: string, isActive: boolean) => {
    if (!isActive) return "bg-slate-700/50 opacity-60";
    
    switch (type) {
      case "dca":
        return "bg-gradient-to-r from-trading-green/20 to-trading-green/5 border border-trading-green/30";
      case "grid":
        return "bg-gradient-to-r from-trading-blue/20 to-trading-blue/5 border border-trading-blue/30";
      case "sentiment":
        return "bg-gradient-to-r from-purple-500/20 to-purple-500/5 border border-purple-500/30";
      default:
        return "bg-slate-700/50";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-trading-green" : "bg-slate-500";
  };

  return (
    <Card className="bg-dark-card border-dark-border" data-testid="card-active-bots">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Active Bots</h2>
          <Button 
            variant="link" 
            className="text-trading-blue hover:text-trading-blue/80 text-sm font-medium p-0 h-auto"
            data-testid="button-manage-all-bots"
          >
            Manage All
          </Button>
        </div>
        
        <div className="space-y-3">
          {(displayBots as any[]).map((bot: any) => (
            <div 
              key={bot.id}
              className={`p-3 rounded-lg ${getBotGradient(bot.type, bot.isActive)}`}
              data-testid={`bot-${bot.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(bot.isActive)} ${bot.isActive ? 'animate-pulse' : ''}`}></div>
                  <span className="font-medium text-white">{bot.name}</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-slate-600 text-slate-300"
                >
                  {bot.isActive ? "Active" : "Paused"}
                </Badge>
              </div>
              
              <p className="text-sm text-slate-300 mb-1">
                {bot.symbol} • {
                  bot.type === "dca" ? `$${bot.config.dailyAmount}/day` :
                  bot.type === "grid" ? `${bot.config.grids} grids` :
                  `Sentiment ${bot.config.sentimentRange}`
                }
              </p>
              
              <p className={`text-xs ${bot.isActive && parseFloat(bot.totalProfit) > 0 ? 'text-trading-green' : 'text-slate-400'}`}>
                {bot.isActive && parseFloat(bot.totalProfit) > 0 ? `+${bot.totalProfit}%` : "Waiting for signal"} 
                {bot.period && ` (${bot.period})`}
              </p>
            </div>
          ))}
        </div>
        
        <Button 
          className="w-full mt-4 bg-trading-blue hover:bg-trading-blue/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          data-testid="button-create-new-bot"
        >
          Create New Bot
        </Button>
      </CardContent>
    </Card>
  );
}
