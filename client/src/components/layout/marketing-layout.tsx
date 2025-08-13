import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, User } from "lucide-react";
import { marketingNav, authNav } from "@/config/navigation";
import { getAuthUser, clearAuthUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-xl font-bold text-white">PnL AI</span>
    </Link>
  );
}

function CompanyDropdown() {
  const companyDropdown = marketingNav.find(item => item.label === "Company");
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
        <span>Company</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
        {companyDropdown?.items?.map((item) => (
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

function DesktopNavigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path || (path === "/#product" && location === "/");
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {marketingNav.map((item) => {
        if (item.items) {
          return <CompanyDropdown key={item.label} />;
        }
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`transition-colors ${isActive(item.href) ? 'text-white' : 'text-gray-300 hover:text-white'}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AuthButtons() {
  const { toast } = useToast();
  const user = getAuthUser();
  const token = localStorage.getItem('pnl-ai-token');
  
  // If user is authenticated, show user menu instead of sign in/up
  if (user && token) {
    const handleLogout = () => {
      clearAuthUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Navigate to home page to show marketing content
      window.location.href = '/';
    };

    return (
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
            Dashboard
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800 p-2">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
            <DropdownMenuItem asChild>
              <div className="px-2 py-1 text-gray-400 text-sm">
                {user.username}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-gray-300 hover:text-white cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // If not authenticated, show sign in/up buttons
  return (
    <div className="flex items-center space-x-4">
      {authNav.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button 
            variant={item.variant === "primary" ? "default" : "ghost"} 
            className={item.variant === "primary" 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "text-gray-300 hover:text-white hover:bg-gray-800"
            }
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const { toast } = useToast();
  const user = getAuthUser();
  const token = localStorage.getItem('pnl-ai-token');

  const handleLogout = () => {
    clearAuthUser();
    setOpen(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    window.location.href = '/';
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 bg-gray-900 border-gray-700">
          <div className="flex flex-col space-y-6 pt-6">
            {marketingNav.map((item) => {
              if (item.items) {
                return (
                  <div key={item.label} className="space-y-2">
                    <button
                      onClick={() => setCompanyOpen(!companyOpen)}
                      className="flex items-center justify-between w-full text-gray-300 hover:text-white text-lg"
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transform transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {companyOpen && (
                      <div className="pl-4 space-y-3">
                        {item.items.map((subItem) => (
                          <Link 
                            key={subItem.href}
                            href={subItem.href} 
                            onClick={() => setOpen(false)} 
                            className="block text-gray-400 hover:text-white"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setOpen(false)} 
                  className="text-gray-300 hover:text-white text-lg"
                >
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-6 border-t border-gray-700 space-y-4">
              {user && token ? (
                <>
                  <div className="text-sm text-gray-400 px-2">
                    Logged in as {user.username}
                  </div>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                authNav.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                    <Button 
                      variant={item.variant === "primary" ? "default" : "outline"}
                      className={item.variant === "primary" 
                        ? "w-full bg-blue-600 hover:bg-blue-700 text-white" 
                        : "w-full text-gray-300 border-gray-600 hover:bg-gray-800"
                      }
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <DesktopNavigation />
        <div className="flex items-center space-x-4">
          <AuthButtons />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Logo />
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
            <span>© 2025 PnL AI. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center space-x-2">
              <span>Version {import.meta.env.VITE_APP_VERSION || '2.1.0'}</span>
              <span>•</span>
              <Link href="/changelog" className="hover:text-gray-300 transition-colors" data-testid="link-changelog">
                Changelog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <MarketingHeader />
      <main className="flex-1">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}