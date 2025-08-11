import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { krakenExchangeSchema, type KrakenExchangeRequest } from "@shared/schema";
import { Loader2, ExternalLink, Shield, Zap } from "lucide-react";

interface KrakenIntegrationProps {
  onSuccess?: () => void;
}

export default function KrakenIntegration({ onSuccess }: KrakenIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<KrakenExchangeRequest>({
    resolver: zodResolver(krakenExchangeSchema),
    defaultValues: {
      name: "",
      apiKey: "",
      apiSecret: "",
    },
  });

  const krakenMutation = useMutation({
    mutationFn: (data: KrakenExchangeRequest) => apiRequest("POST", "/api/exchanges/kraken", data),
    onMutate: () => {
      setIsConnecting(true);
    },
    onSuccess: () => {
      toast({
        title: "Kraken Connected Successfully!",
        description: "Your Kraken exchange has been integrated and portfolio synced.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/exchanges'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      
      // Reset form
      form.reset();
      
      // Call success callback
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Kraken. Please check your API credentials.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsConnecting(false);
    },
  });

  const onSubmit = (values: KrakenExchangeRequest) => {
    krakenMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-dark-card border-dark-border">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-white">Connect Kraken Exchange</CardTitle>
        <CardDescription className="text-slate-400 text-base">
          Securely connect your Kraken account for one-click trading and portfolio synchronization
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-trading-blue/10 border border-trading-blue/20 rounded-lg p-4 text-center">
            <Shield className="w-6 h-6 text-trading-blue mx-auto mb-2" />
            <h4 className="font-medium text-white mb-1">Secure</h4>
            <p className="text-xs text-slate-400">API keys encrypted and stored safely</p>
          </div>
          <div className="bg-trading-green/10 border border-trading-green/20 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-trading-green mx-auto mb-2" />
            <h4 className="font-medium text-white mb-1">Instant</h4>
            <p className="text-xs text-slate-400">Real-time portfolio sync</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
            <ExternalLink className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <h4 className="font-medium text-white mb-1">Direct</h4>
            <p className="text-xs text-slate-400">Trade directly from PnL AI</p>
          </div>
        </div>

        {/* API Setup Instructions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3">Quick Setup Guide:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>Log into your <a href="https://pro.kraken.com/app/settings/api" target="_blank" rel="noopener noreferrer" className="text-trading-blue hover:underline">Kraken Pro account</a></li>
            <li>Go to Settings → API and create a new API key</li>
            <li>Enable permissions: "Query Funds", "Query Orders", "Modify Orders"</li>
            <li>Copy your API Key and Private Key below</li>
          </ol>
        </div>

        {/* Connection Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Exchange Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Kraken Account"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isConnecting}
                      data-testid="input-kraken-name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-400 text-sm">
                    A friendly name to identify this exchange connection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">API Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Kraken API Key"
                      className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                      disabled={isConnecting}
                      data-testid="input-kraken-api-key"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-400 text-sm">
                    Your public API key from Kraken (starts with letters/numbers)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Private Key (API Secret)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your Kraken Private Key"
                      className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                      disabled={isConnecting}
                      data-testid="input-kraken-api-secret"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-400 text-sm">
                    Your private key (secret) from Kraken - kept encrypted and secure
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isConnecting}
              data-testid="button-connect-kraken"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting to Kraken...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Connect Kraken Exchange
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Security Note */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-500 mb-1">Security Notice</h4>
              <p className="text-sm text-slate-400">
                Your API keys are encrypted before storage and never shared. We recommend setting IP restrictions 
                on your Kraken API key for maximum security.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}