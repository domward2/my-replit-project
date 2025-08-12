import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackTradeExecuted } from "@/lib/analytics";
import { getAuthUser } from "@/lib/auth";

const tradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  side: z.enum(["buy", "sell"]),
  type: z.enum(["market", "limit"]),
  amount: z.string().min(1, "Amount is required"),
  price: z.string().optional(),
  stopLoss: z.string().optional(),
  takeProfit: z.string().optional(),
  exchangeId: z.string().optional(),
});

type TradeForm = z.infer<typeof tradeSchema>;

export default function TradingInterface() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const buyForm = useForm<TradeForm>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      symbol: "BTC/USDT",
      side: "buy",
      type: "market",
      amount: "",
      stopLoss: "5",
      takeProfit: "15",
    },
  });

  const sellForm = useForm<TradeForm>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      symbol: "BTC/USDT",
      side: "sell",
      type: "market",
      amount: "",
      stopLoss: "3",
      takeProfit: "10",
    },
  });

  const placOrderMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/orders", data),
    onSuccess: (data, variables) => {
      // Track successful trade execution
      const user = getAuthUser();
      trackTradeExecuted(
        variables.exchangeId || 'manual', 
        variables.amount, 
        user?.id,
        variables.symbol,
        variables.side
      );
      
      toast({
        title: "Order placed successfully",
        description: `${variables.side.toUpperCase()} order for ${variables.amount} ${variables.symbol}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      
      // Reset forms
      if (variables.side === "buy") {
        buyForm.reset();
      } else {
        sellForm.reset();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const onPlaceOrder = (data: TradeForm) => {
    const orderData = {
      ...data,
      amount: data.amount,
      price: data.type === "limit" ? data.price : null,
      stopLoss: data.stopLoss ? data.stopLoss : null,
      takeProfit: data.takeProfit ? data.takeProfit : null,
      reason: "Manual trade from dashboard",
      exchangeId: "default-exchange", // This would come from user's connected exchanges
    };

    placOrderMutation.mutate(orderData);
  };

  const TradeForm = ({ form, side, title, buttonColor }: any) => (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${side === 'buy' ? 'text-trading-green' : 'text-trading-red'}`}>
        {title}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onPlaceOrder)} className="space-y-3">
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Asset</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid={`select-${side}-symbol`}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                    <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                    <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Order Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid={`select-${side}-type`}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">
                    {side === 'buy' ? 'Amount (USDT)' : 'Amount (%)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={side === 'buy' ? "1000" : "50"}
                      className="bg-slate-700 border-slate-600 text-white"
                      data-testid={`input-${side}-amount`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="stopLoss"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Stop Loss (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      className="bg-slate-700 border-slate-600 text-white"
                      data-testid={`input-${side}-stop-loss`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="takeProfit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Take Profit (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15"
                      className="bg-slate-700 border-slate-600 text-white"
                      data-testid={`input-${side}-take-profit`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button
            type="submit"
            disabled={placOrderMutation.isPending}
            className={`w-full font-medium py-3 rounded-lg transition-colors ${buttonColor}`}
            data-testid={`button-place-${side}-order`}
          >
            {placOrderMutation.isPending 
              ? `Placing ${side} order...` 
              : `Place ${side.charAt(0).toUpperCase() + side.slice(1)} Order`
            }
          </Button>
        </form>
      </Form>
    </div>
  );

  return (
    <Card className="bg-dark-card border-dark-border" data-testid="card-trading-interface">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Quick Trade</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TradeForm 
            form={buyForm}
            side="buy"
            title="Buy Orders"
            buttonColor="bg-trading-green hover:bg-trading-green/90 text-white"
          />
          
          <TradeForm 
            form={sellForm}
            side="sell"
            title="Sell Orders"
            buttonColor="bg-trading-red hover:bg-trading-red/90 text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
}
