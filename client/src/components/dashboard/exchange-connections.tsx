import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Zap } from "lucide-react";
import KrakenIntegration from "@/components/exchanges/kraken-integration";

export default function ExchangeConnections() {
  const [isKrakenDialogOpen, setIsKrakenDialogOpen] = useState(false);
  
  const { data: exchanges, isLoading } = useQuery({
    queryKey: ["/api/exchanges"],
  });

  if (isLoading) {
    return (
      <Card className="bg-dark-card border-dark-border animate-pulse">
        <CardContent className="p-6">
          <div className="h-5 bg-slate-700 rounded mb-4 w-1/2"></div>
          <div className="space-y-3">
            <div className="h-16 bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-700 rounded"></div>
            <div className="h-12 bg-slate-700 rounded border-2 border-dashed"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration
  const mockExchanges = [
    {
      id: "coinbase",
      name: "Coinbase",
      type: "OAuth Connected",
      logo: { bg: "bg-blue-600", text: "CB" },
      isActive: true
    },
    {
      id: "kraken",
      name: "Kraken",
      type: "API Connected",
      logo: { bg: "bg-purple-600", text: "KR" },
      isActive: true
    }
  ];

  const displayExchanges = (exchanges as any[])?.length > 0 ? exchanges : mockExchanges;

  return (
    <Card className="bg-dark-card border-dark-border" data-testid="card-exchange-connections">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold text-white mb-4">Exchange Connections</h2>
        
        <div className="space-y-3">
          {(displayExchanges as any[]).map((exchange: any) => (
            <div 
              key={exchange.id}
              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              data-testid={`exchange-${exchange.name.toLowerCase()}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${exchange.logo.bg}`}>
                  <span className="text-white font-bold text-xs">{exchange.logo.text}</span>
                </div>
                <div>
                  <p className="font-medium text-white">{exchange.name}</p>
                  <p className="text-xs text-slate-400">{exchange.type}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${exchange.isActive ? 'bg-trading-green' : 'bg-slate-500'}`}></div>
            </div>
          ))}
          
          <Dialog open={isKrakenDialogOpen} onOpenChange={setIsKrakenDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="w-full p-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 hover:bg-slate-700/30 transition-colors bg-transparent"
                data-testid="button-add-exchange"
              >
                <Zap className="w-4 h-4 mr-2" />
                Connect Kraken Exchange
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-dark-bg border-dark-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Add Exchange Connection</DialogTitle>
              </DialogHeader>
              <KrakenIntegration onSuccess={() => setIsKrakenDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
