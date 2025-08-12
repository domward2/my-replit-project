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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { helpModalLinks, moreDropdownItems } from "@/config/navigation";

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
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              data-testid="button-help"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Help & Documentation</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Help & Support</DialogTitle>
          <DialogDescription className="text-gray-400">
            Quick access to help resources and documentation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {helpModalLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
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
        {moreDropdownItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="text-gray-300 hover:text-white">
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const handleLogout = () => {
    clearAuthUser();
    window.location.href = '/';
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