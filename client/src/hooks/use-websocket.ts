import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useWebSocket(userId?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const connect = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          
          // Authenticate with the server
          ws.send(JSON.stringify({
            type: "authenticate",
            userId: userId,
          }));
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
              case "authenticated":
                console.log("WebSocket authenticated");
                break;
                
              case "sentiment_update":
                // Update sentiment data in cache
                queryClient.setQueryData(["/api/sentiment"], message.data);
                break;
                
              case "order_placed":
                // Invalidate orders and activities cache
                queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
                queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
                queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
                
                toast({
                  title: "Order Update",
                  description: `Order ${message.data.id} has been ${message.data.status}`,
                });
                break;
                
              case "price_alert":
                toast({
                  title: "Price Alert",
                  description: message.message,
                });
                break;
                
              default:
                console.log("Unknown message type:", message.type);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket disconnected:", event.reason);
          setIsConnected(false);
          
          // Attempt to reconnect after 3 seconds if not a clean close
          if (!event.wasClean) {
            setTimeout(connect, 3000);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, [userId, queryClient, toast]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, unable to send message:", message);
    }
  };

  return {
    isConnected,
    sendMessage,
  };
}
