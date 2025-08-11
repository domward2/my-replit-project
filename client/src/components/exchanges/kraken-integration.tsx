import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ExternalLink, Shield, Zap, CheckCircle } from "lucide-react";

interface KrakenIntegrationProps {
  onSuccess?: () => void;
}

export default function KrakenIntegration({ onSuccess }: KrakenIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'start' | 'connecting' | 'success'>('start');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const krakenConnectMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/kraken-connect/initiate", {}),
    onMutate: () => {
      setIsConnecting(true);
      setConnectionStep('connecting');
    },
    onSuccess: (data: any) => {
      // Redirect to Kraken OAuth
      window.location.href = data.authUrl;
    },
    onError: (error: any) => {
      setConnectionStep('start');
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to initiate Kraken connection.",
        variant: "destructive",
      });
      setIsConnecting(false);
    },
  });

  const handleKrakenConnect = () => {
    krakenConnectMutation.mutate();
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
            <h4 className="font-medium text-white mb-1">Secure OAuth</h4>
            <p className="text-xs text-slate-400">No API keys needed - direct secure login</p>
          </div>
          <div className="bg-trading-green/10 border border-trading-green/20 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-trading-green mx-auto mb-2" />
            <h4 className="font-medium text-white mb-1">One Click</h4>
            <p className="text-xs text-slate-400">Connect in seconds, not minutes</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
            <CheckCircle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <h4 className="font-medium text-white mb-1">Instant Sync</h4>
            <p className="text-xs text-slate-400">Automatic portfolio synchronization</p>
          </div>
        </div>

        {connectionStep === 'start' && (
          <>
            {/* Kraken Connect Explanation */}
            <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">Kraken Connect - No API Keys Required!</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    PnL AI is integrated with Kraken Connect, their secure OAuth system. Instead of manually creating 
                    API keys, simply click below to securely connect your Kraken account in one step.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>✓ No manual API key setup required</li>
                    <li>✓ Secure OAuth 2.0 authentication</li>
                    <li>✓ Revoke access anytime from your Kraken account</li>
                    <li>✓ Automatic permission management</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* One-Click Connection */}
            <div className="space-y-4">
              <Button
                onClick={handleKrakenConnect}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg font-semibold"
                disabled={isConnecting}
                data-testid="button-kraken-connect-oauth"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Connecting to Kraken...
                  </>
                ) : (
                  <>
                    <Zap className="mr-3 h-5 w-5" />
                    Connect with Kraken Connect
                  </>
                )}
              </Button>
              
              <p className="text-center text-xs text-slate-500">
                You'll be redirected to Kraken to securely authorize PnL AI
              </p>
            </div>
          </>
        )}

        {connectionStep === 'connecting' && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Connecting to Kraken...</h4>
            <p className="text-slate-400 text-sm">
              You'll be redirected to Kraken's secure login page
            </p>
          </div>
        )}

        {connectionStep === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Successfully Connected!</h4>
            <p className="text-slate-400 text-sm mb-4">
              Your Kraken account is now connected and portfolio is syncing
            </p>
            <Button 
              onClick={() => onSuccess?.()}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to Dashboard
            </Button>
          </div>
        )}

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