import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  return {
    user: (data as { user: User } | undefined)?.user,
    isLoading,
    isAuthenticated: !!((data as { user: User } | undefined)?.user),
    error,
  };
}

export function requireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return { loading: true, authenticated: false };
  }
  
  return { loading: false, authenticated: isAuthenticated };
}
