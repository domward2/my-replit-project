import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`Making ${method} request to ${url}`);
  
  // Get auth token for deployment compatibility
  const token = localStorage.getItem('pnl-ai-token');
  
  const res = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    cache: "no-cache",
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
    const url = queryKey.join("/") as string;
    console.log(`Query request to ${url}`);
    
    // Get auth token for deployment compatibility
    const token = localStorage.getItem('pnl-ai-token');
    
    const res = await fetch(url, {
      credentials: "include",
      cache: "no-cache",
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
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
