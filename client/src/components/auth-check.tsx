import { useEffect, useState } from "react";
import { getAuthUser } from "@/lib/auth";

// Simple component that forces authentication state check
export function AuthCheck({ onAuthChange }: { onAuthChange: (isAuth: boolean) => void }) {
  useEffect(() => {
    // Check localStorage immediately on mount
    const user = getAuthUser();
    onAuthChange(!!user);
    
    // Also listen for storage changes (when login happens in another tab/window)
    const handleStorageChange = () => {
      const updatedUser = getAuthUser();
      onAuthChange(!!updatedUser);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [onAuthChange]);

  return null;
}