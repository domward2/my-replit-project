import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown } from "lucide-react";

export default function SentimentAnalysis() {
  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ["/api/sentiment"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-dark-card border-dark-border animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-slate-700 rounded mb-6 w-1/3"></div>
          <div className="space-y-4">
            <div className="h-32 bg-slate-700 rounded"></div>
            <div className="h-32 bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const btcData = (sentimentData as any)?.BTC;
  const ethData = (sentimentData as any)?.ETH;

  const SentimentCard = ({ data, symbol, price, logo }: any) => {
    const isPositive = data?.score >= 50;
    const scoreColor = data?.score >= 70 ? "text-trading-green" : data?.score >= 40 ? "text-orange-400" : "text-trading-red";
    const bgGradient = isPositive ? "from-trading-green/20 to-trading-green/5 border-trading-green/30" : "from-trading-red/20 to-trading-red/5 border-trading-red/30";
    
    return (
      <div className={`p-4 bg-gradient-to-r ${bgGradient} border rounded-lg`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${logo.bg}`}>
              <span className="text-white font-bold text-xs">{logo.text}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{symbol}</h3>
              <p className="text-sm text-slate-400">{price}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${scoreColor}`}>{data?.score || 0}</div>
            <div className="text-xs text-slate-400">Sentiment Score</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {data?.signals?.map((signal: string, index: number) => (
            <div key={index} className="flex items-center text-sm">
              <span className={`w-2 h-2 rounded-full mr-2 ${isPositive ? 'bg-trading-green' : 'bg-trading-red'}`}></span>
              <span className="text-slate-300">{signal}</span>
            </div>
          ))}
        </div>
        
        <Button 
          className={`w-full mt-4 font-medium py-2 px-4 rounded-lg transition-colors ${
            isPositive && data?.score >= 60
              ? "bg-trading-green hover:bg-trading-green/90 text-white"
              : "bg-slate-600 hover:bg-slate-500 text-white"
          }`}
          data-testid={`button-trade-${symbol.toLowerCase()}`}
        >
          {isPositive && data?.score >= 60 ? `One-Tap Buy ${symbol}` : "Hold Position"}
        </Button>
      </div>
    );
  };

  return (
    <Card className="bg-dark-card border-dark-border" data-testid="card-sentiment-analysis">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">AI Sentiment Analysis</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-trading-green rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">Live</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {btcData && (
            <SentimentCard 
              data={btcData}
              symbol="Bitcoin (BTC)"
              price="$43,247.82"
              logo={{ bg: "bg-orange-500", text: "₿" }}
            />
          )}
          
          {ethData && (
            <SentimentCard 
              data={ethData}
              symbol="Ethereum (ETH)"
              price="$2,547.23"
              logo={{ bg: "bg-indigo-500", text: "Ξ" }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
