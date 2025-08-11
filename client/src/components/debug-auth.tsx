// Debug component to test token authentication
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DebugAuth() {
  const [result, setResult] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const testLogin = async () => {
    try {
      console.log("Testing login...");
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: 'dom.ward1', password: 'Horace82' })
      });
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('pnl-ai-token', data.token);
        localStorage.setItem('pnl-ai-auth', JSON.stringify(data.user));
        localStorage.setItem('pnl-ai-timestamp', Date.now().toString());
        setResult(`Login successful! Token: ${data.token.substring(0, 20)}...`);
      } else {
        setResult(`Login failed: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setResult(`Login error: ${error}`);
    }
  };

  const testAuth = async () => {
    try {
      console.log("Testing auth with token...");
      const storedToken = localStorage.getItem('pnl-ai-token');
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {}),
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log("Auth response status:", response.status);
      const data = await response.json();
      console.log("Auth response data:", data);
      
      if (response.ok) {
        setResult(`Auth successful! User: ${data.user.username}`);
      } else {
        setResult(`Auth failed: ${response.status} - ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setResult(`Auth error: ${error}`);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 p-4 rounded border text-white text-xs max-w-sm">
      <h3 className="font-bold mb-2">Debug Auth (Dev Only)</h3>
      <div className="space-y-2">
        <Button onClick={testLogin} size="sm" className="w-full">Test Login</Button>
        <Button onClick={testAuth} size="sm" className="w-full">Test Auth</Button>
        {token && (
          <div>
            <label className="block text-xs">Token:</label>
            <Input 
              value={token} 
              onChange={(e) => setToken(e.target.value)}
              className="text-xs h-6"
            />
          </div>
        )}
        <div className="mt-2 p-2 bg-gray-800 rounded text-xs max-h-20 overflow-auto">
          {result || "No results yet"}
        </div>
      </div>
    </div>
  );
}