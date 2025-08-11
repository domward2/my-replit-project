import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function RiskControls() {
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  // Mock risk data - in production this would come from risk calculations
  const riskData = {
    dailyLossUsed: 1200,
    dailyLossLimit: parseFloat((user as { user: { dailyLossLimit: string } } | undefined)?.user?.dailyLossLimit || "3000"),
    positionSizeUsed: 25, // percentage of current exposure
    circuitBreakerEnabled: (user as { user: { circuitBreakerEnabled: boolean } } | undefined)?.user?.circuitBreakerEnabled || true,
  };

  const dailyLossPercent = (riskData.dailyLossUsed / riskData.dailyLossLimit) * 100;
  const dailyLossRemaining = 100 - dailyLossPercent;

  return (
    <Card className="bg-dark-card border-dark-border" data-testid="card-risk-controls">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold text-white mb-4">Risk Controls</h2>
        
        <div className="space-y-4">
          {/* Daily Loss Cap */}
          <div data-testid="risk-daily-loss">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Daily Loss Cap</span>
              <span className="text-sm text-slate-400">
                ${riskData.dailyLossUsed.toFixed(0)} / ${riskData.dailyLossLimit.toFixed(0)}
              </span>
            </div>
            <Progress 
              value={dailyLossPercent} 
              className="w-full h-2"
            />
            <p className="text-xs text-slate-400 mt-1">{dailyLossRemaining.toFixed(0)}% remaining</p>
          </div>
          
          {/* Position Size Limit */}
          <div data-testid="risk-position-size">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Position Size Limit</span>
              <span className="text-sm text-slate-400">
                {(user as { user: { positionSizeLimit: string } } | undefined)?.user?.positionSizeLimit || 5}% per trade
              </span>
            </div>
            <Progress 
              value={riskData.positionSizeUsed} 
              className="w-full h-2"
            />
            <p className="text-xs text-slate-400 mt-1">Conservative</p>
          </div>
          
          {/* Circuit Breaker */}
          <div 
            className="flex items-center justify-between"
            data-testid="risk-circuit-breaker"
          >
            <span className="text-sm font-medium text-slate-300">Circuit Breaker</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">
                {riskData.circuitBreakerEnabled ? "Enabled" : "Disabled"}
              </span>
              <div className={`w-2 h-2 rounded-full ${riskData.circuitBreakerEnabled ? 'bg-trading-green' : 'bg-slate-500'}`}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
