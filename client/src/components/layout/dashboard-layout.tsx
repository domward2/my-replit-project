import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Bell, 
  HelpCircle, 
  Grid3X3, 
  User,
  LogOut,
  Settings 
} from "lucide-react";
import { clearAuthUser } from "@/lib/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLogo() {
  return (
    <Link href="/dashboard" className="flex items-center space-x-2">
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-lg font-semibold text-white hidden sm:block">PnL AI</span>
    </Link>
  );
}

function NotificationButton() {
  const [hasNotifications] = useState(true); // Mock state

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-gray-400 hover:text-white hover:bg-gray-800"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Notifications</p>
      </TooltipContent>
    </Tooltip>
  );
}

function HelpButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={() => window.open('/how-it-works', '_blank')}
          data-testid="button-help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Help & Documentation</p>
      </TooltipContent>
    </Tooltip>
  );
}

function MoreAppsMenu() {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              data-testid="button-more-apps"
            >
              <Grid3X3 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>More</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
        <DropdownMenuItem asChild>
          <Link href="/about" className="text-gray-300 hover:text-white">
            About Us
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/mission" className="text-gray-300 hover:text-white">
            Mission & Vision
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/how-it-works" className="text-gray-300 hover:text-white">
            How It Works
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/privacy" className="text-gray-300 hover:text-white">
            Privacy Policy
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/terms" className="text-gray-300 hover:text-white">
            Terms of Service
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const handleLogout = () => {
    clearAuthUser();
    window.location.href = '/login';
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              data-testid="button-user-menu"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                U
              </div>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Account</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="text-gray-300 hover:text-white flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-gray-300 hover:text-white flex items-center space-x-2 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <DashboardLogo />
        
        <div className="flex items-center space-x-2">
          <NotificationButton />
          <HelpButton />
          <MoreAppsMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <DashboardHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}