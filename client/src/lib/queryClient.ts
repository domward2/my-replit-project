import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { clearAuthUser } from "./auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    if (res.status === 401) {
      // Clear invalid tokens on 401 errors
      console.log('401 Unauthorized - clearing invalid auth tokens');
      clearAuthUser();
      // Force page reload to trigger login screen
      window.location.reload();
    }
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Add cache-busting parameter for deployment compatibility
  const separator = url.includes('?') ? '&' : '?';
  const cacheBustedUrl = `${url}${separator}cb=${Date.now()}`;
  console.log(`Making ${method} request to ${cacheBustedUrl}`);
  console.log('Request headers:', {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(token ? { "Authorization": `Bearer ${token?.substring(0, 20)}...` } : {}),
  });
  
  // Get auth token for stateless authentication
  const token = localStorage.getItem('pnl-ai-token');
  
  const res = await fetch(cacheBustedUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Accept": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    cache: "no-store",
    mode: "cors",
  });

  console.log(`Response: ${res.status} ${res.statusText}`);
  
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = queryKey.join("/") as string;
    // Add cache-busting for deployment compatibility
    const separator = baseUrl.includes('?') ? '&' : '?';
    const url = `${baseUrl}${separator}cb=${Date.now()}`;
    console.log(`Query request to ${url}`);
    
    // Get auth token for stateless authentication
    const token = localStorage.getItem('pnl-ai-token');
    
    const res = await fetch(url, {
      credentials: "include",
      cache: "no-store",
      mode: "cors",
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Accept": "application/json",
      },
    });

    console.log(`Query response: ${res.status} ${res.statusText}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log('401 Unauthorized - returning null');
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
