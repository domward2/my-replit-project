import { useState } from "react";
import { Menu, Search, Bell, ChevronDown, TrendingUp, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
    <header className="bg-dark-card border-b border-dark-border shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-2.5">
        {/* Left section - Mobile menu and Logo */}
        <div className="flex items-center">
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="ml-2 flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">PnL AI</span>
            </div>
          </div>
          
          {/* Desktop Logo and Breadcrumb */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PnL AI</span>
            </div>
            <div className="text-slate-400 text-sm">
              <span>/</span> <span className="text-slate-300">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Center section - Search (Desktop only) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search assets, portfolios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border-slate-600 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-9"
              data-testid="search-input"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          </div>
        </div>
        
        {/* Right section - Actions and User */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          {/* Quick Stats (Desktop only) */}
          <div className="hidden lg:flex items-center space-x-4 mr-4">
            <div className="flex items-center space-x-1 text-xs">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-slate-400">Live</span>
            </div>
            <Badge variant="secondary" className="bg-slate-700 text-slate-300 px-2 py-1 text-xs">
              BTC +2.1%
            </Badge>
          </div>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-slate-400 hover:text-white p-2"
            data-testid="notifications-button"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-2 h-9"
                data-testid="user-menu"
              >
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                    {(user as { user: { username: string } } | undefined)?.user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:block text-sm font-medium max-w-24 truncate">
                  {(user as { user: { username: string } } | undefined)?.user?.username || "User"}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-dark-card border-slate-700 shadow-lg">
              <div className="px-3 py-2 border-b border-slate-700">
                <p className="text-sm font-medium text-white">
                  {(user as { user: { username: string } } | undefined)?.user?.username || "User"}
                </p>
                <p className="text-xs text-slate-400">
                  {(user as { user: { email: string } } | undefined)?.user?.email || "user@example.com"}
                </p>
              </div>
              <DropdownMenuItem 
                className="text-slate-300 hover:text-white hover:bg-slate-700 py-2"
                data-testid="menu-profile"
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-slate-300 hover:text-white hover:bg-slate-700 py-2"
                data-testid="menu-security"
              >
                Security & API Keys
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-slate-300 hover:text-white hover:bg-slate-700 py-2"
                data-testid="menu-preferences"
              >
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2"
                data-testid="menu-logout"
              >
                {logoutMutation.isPending ? "Logging out..." : "Sign Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
