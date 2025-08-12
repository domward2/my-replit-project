import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ExternalLink, Shield, Check, Zap } from "lucide-react";

interface CoinbaseIntegrationProps {
  onSuccess?: () => void;
}

export default function CoinbaseIntegration({ onSuccess }: CoinbaseIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const coinbaseOAuthMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/coinbase-oauth/initiate", {}),
    onMutate: () => {
      setIsConnecting(true);
    },
    onSuccess: async (response: Response) => {
      try {
        const data = await response.json();
        if (data.authUrl) {
          // Redirect to Coinbase OAuth
          window.location.href = data.authUrl;
        } else {
          throw new Error("No auth URL received");
        }
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Invalid response from server",
          variant: "destructive",
        });
        setIsConnecting(false);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to initiate Coinbase connection.",
        variant: "destructive",
      });
      setIsConnecting(false);
    },
  });

  const handleCoinbaseConnect = () => {
    coinbaseOAuthMutation.mutate();
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">CB</span>
          </div>
          Connect Coinbase
        </CardTitle>
        <CardDescription className="text-slate-400">
          Connect your Coinbase account using secure OAuth authentication
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* OAuth Status Warning */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">⚠</span>
            </div>
            <div>
              <h4 className="font-bold text-yellow-400 mb-2">OAuth Temporarily Unavailable</h4>
              <p className="text-yellow-200 text-sm">
                Coinbase OAuth is pending approval and may take several days. Use the Kraken integration for immediate trading access.
              </p>
            </div>
          </div>
        </div>

        {/* OAuth Benefits */}
        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-lg p-6 opacity-60">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Secure OAuth Integration</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Connect your Coinbase account safely using industry-standard OAuth2 authentication. 
                No need to share API keys or credentials.
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" />One-click secure connection</li>
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" />No manual API key creation required</li>
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" />Revokable access from Coinbase settings</li>
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" />Automatic portfolio synchronization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What Will Be Accessed */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3 flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            This integration will access:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Account balances</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Portfolio positions</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Transaction history</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Account information</span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Process */}
        <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3">How it works:</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <div>
                <p className="text-white font-medium">Secure Redirect</p>
                <p className="text-slate-400 text-xs">You'll be redirected to Coinbase's secure login page</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <div>
                <p className="text-white font-medium">Grant Permission</p>
                <p className="text-slate-400 text-xs">Authorize PnL AI to access your account data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <div>
                <p className="text-white font-medium">Automatic Sync</p>
                <p className="text-slate-400 text-xs">Your portfolio data will be imported automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connect Button - Disabled due to pending approval */}
        <Button
          onClick={() => {}}
          className="w-full h-12 bg-gray-600 text-lg font-semibold cursor-not-allowed opacity-50"
          disabled={true}
          data-testid="button-coinbase-oauth-disabled"
        >
          <Shield className="mr-3 h-5 w-5" />
          OAuth Pending Coinbase Approval
        </Button>
        
        <p className="text-center text-xs text-slate-500">
          Coinbase is reviewing the OAuth application. Use Kraken for immediate access.
        </p>

        {/* Security Notice */}
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 text-sm font-medium">Secure & Revokable</p>
              <p className="text-green-300 text-xs">
                You can revoke PnL AI's access anytime from your Coinbase account settings. 
                Your login credentials are never shared with us.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}