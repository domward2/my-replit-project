import { useState } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { clearAuthUser } from "@/lib/auth";

export default function TopNavigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      // Clear all auth data immediately
      clearAuthUser();
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Force complete page refresh for mobile compatibility
      setTimeout(() => {
        console.log('Forcing logout redirect for mobile compatibility');
        window.location.href = '/login';
      }, 500);
    },
    onError: () => {
      // Even if API fails, clear local auth and redirect
      console.log('Logout API failed, but clearing local auth anyway');
      clearAuthUser();
      queryClient.clear();
      
      toast({
        title: "Logged out",
        description: "Session cleared",
      });
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-dark-card border-b border-dark-border px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </Button>
          <span className="ml-3 text-xl font-bold text-white">PnL AI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <Input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-700 border-slate-600 pl-10 text-sm focus:ring-2 focus:ring-trading-blue"
              data-testid="search-input"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          </div>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-slate-400 hover:text-white"
            data-testid="notifications-button"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-trading-red rounded-full"></span>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 text-slate-300 hover:text-white"
                data-testid="user-menu"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-trading-blue text-white text-xs">
                    {(user as { user: { username: string } } | undefined)?.user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {(user as { user: { username: string } } | undefined)?.user?.username || "User"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-dark-card border-dark-border">
              <DropdownMenuItem 
                className="text-slate-300 focus:text-white focus:bg-slate-700"
                data-testid="menu-profile"
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-slate-300 focus:text-white focus:bg-slate-700"
                data-testid="menu-security"
              >
                Security
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-slate-300 focus:text-white focus:bg-slate-700"
                data-testid="menu-api-keys"
              >
                API Keys
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="text-trading-red focus:text-trading-red focus:bg-slate-700"
                data-testid="menu-logout"
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
