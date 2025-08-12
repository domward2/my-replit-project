import { Bell, HelpCircle, Grid3X3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { clearAuthUser } from "@/lib/auth";

export default function TopNavigation() {
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
    <TooltipProvider>
      <header className="bg-dark-card border-b border-dark-border h-14">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">PnL AI</span>
          </div>

          {/* Right side - Icon Navigation */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 h-9 w-9"
                  data-testid="notifications-button"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>

            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 h-9 w-9"
                  data-testid="help-button"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>

            {/* Apps Menu (9-dot grid) */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 h-9 w-9"
                      data-testid="apps-menu"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More Options</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-48 bg-dark-card border-slate-700 shadow-lg">
                <DropdownMenuItem asChild>
                  <a href="/about" className="text-slate-300 hover:text-white hover:bg-slate-700 py-2 cursor-pointer">
                    About Us
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/mission" className="text-slate-300 hover:text-white hover:bg-slate-700 py-2 cursor-pointer">
                    Mission & Vision
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/how-it-works" className="text-slate-300 hover:text-white hover:bg-slate-700 py-2 cursor-pointer">
                    How It Works
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild>
                  <a href="/privacy" className="text-slate-300 hover:text-white hover:bg-slate-700 py-2 cursor-pointer">
                    Privacy Policy
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/terms" className="text-slate-300 hover:text-white hover:bg-slate-700 py-2 cursor-pointer">
                    Terms of Service
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-1 h-9 w-9"
                      data-testid="user-menu"
                    >
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                          {(user as { user: { username: string } } | undefined)?.user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account</p>
                </TooltipContent>
              </Tooltip>
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
    </TooltipProvider>
  );
}
