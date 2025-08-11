import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Zap } from "lucide-react";
import KrakenIntegration from "@/components/exchanges/kraken-integration";
import CoinbaseIntegration from "@/components/exchanges/coinbase-integration";

export default function ExchangeConnections() {
  const [isKrakenDialogOpen, setIsKrakenDialogOpen] = useState(false);
  const [isCoinbaseDialogOpen, setIsCoinbaseDialogOpen] = useState(false);
  
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

  // Use real exchange data only
  const displayExchanges = (exchanges as any[]) || [];

  return (
    <Card className="bg-dark-card border-dark-border" data-testid="card-exchange-connections">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold text-white mb-4">Exchange Connections</h2>
        
        <div className="space-y-3">
          {displayExchanges.length > 0 ? (
            displayExchanges.map((exchange: any) => (
              <div 
                key={exchange.id}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                data-testid={`exchange-${exchange.name.toLowerCase()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    exchange.type === 'coinbase_oauth' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    <span className="text-white font-bold text-xs">
                      {exchange.type === 'coinbase_oauth' ? 'CB' : 'KR'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{exchange.name}</p>
                    <p className="text-xs text-slate-400">
                      {exchange.type === 'coinbase_oauth' ? 'OAuth Connected' : 'API Connected'}
                    </p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${exchange.isActive ? 'bg-trading-green' : 'bg-slate-500'}`}></div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400">
              <p className="text-sm">No exchanges connected yet</p>
              <p className="text-xs mt-1">Use the buttons below to connect your first exchange</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Coinbase OAuth Integration */}
            <Dialog open={isCoinbaseDialogOpen} onOpenChange={setIsCoinbaseDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="p-3 border-2 border-dashed border-blue-600/50 rounded-lg text-blue-400 hover:border-blue-500 hover:text-blue-300 hover:bg-blue-900/20 transition-colors bg-transparent"
                  data-testid="button-add-coinbase"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Coinbase OAuth
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-dark-bg border-dark-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Connect Coinbase</DialogTitle>
                </DialogHeader>
                <CoinbaseIntegration onSuccess={() => setIsCoinbaseDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            {/* Kraken API Integration */}
            <Dialog open={isKrakenDialogOpen} onOpenChange={setIsKrakenDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="p-3 border-2 border-dashed border-purple-600/50 rounded-lg text-purple-400 hover:border-purple-500 hover:text-purple-300 hover:bg-purple-900/20 transition-colors bg-transparent"
                  data-testid="button-add-kraken"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Add Kraken Exchange
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-dark-bg border-dark-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Connect Kraken</DialogTitle>
                </DialogHeader>
                <KrakenIntegration onSuccess={() => setIsKrakenDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
