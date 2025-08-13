import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Briefcase, AlertTriangle } from "lucide-react";

export default function PortfolioOverview() {
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-dark-card border-dark-border animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-8 bg-slate-700 rounded mb-1"></div>
              <div className="h-3 bg-slate-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalBalance = (portfolio as any)?.totalBalance || "0.00";
  const dailyPnL = (portfolio as any)?.dailyPnL || "0.00";
  const dailyPnLPercent = (portfolio as any)?.dailyPnLPercent || "0";
  const activePositions = (portfolio as any)?.activePositions || 0;
  const riskLevel = "Medium"; // This would be calculated based on risk metrics

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-dark-card border-dark-border" data-testid="card-total-balance">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Total Balance</h3>
            <DollarSign className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-white">${totalBalance}</p>
          {parseFloat(dailyPnLPercent) !== 0 && (
            <p className="text-sm text-trading-green mt-1">+{dailyPnLPercent}% (24h)</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-dark-card border-dark-border" data-testid="card-daily-pnl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Today's P&L</h3>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <p className={`text-2xl font-bold ${parseFloat(dailyPnL) >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
            {parseFloat(dailyPnL) >= 0 ? '+' : ''}${dailyPnL}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-dark-card border-dark-border" data-testid="card-active-positions">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Active Positions</h3>
            <Briefcase className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-white">{activePositions}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-dark-card border-dark-border" data-testid="card-risk-level">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Risk Level</h3>
            <AlertTriangle className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-orange-400">{riskLevel}</p>
          <p className="text-sm text-slate-400 mt-1">Within limits</p>
        </CardContent>
      </Card>
    </div>
  );
}
