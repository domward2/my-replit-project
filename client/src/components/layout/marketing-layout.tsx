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
import { Menu, ChevronDown } from "lucide-react";

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
        <span>Company</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
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

function DesktopNavigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        href="/" 
        className={`transition-colors ${isActive('/') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
      >
        Cryptocurrencies
      </Link>
      <Link 
        href="/how-it-works" 
        className={`transition-colors ${isActive('/how-it-works') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
      >
        Individuals
      </Link>
      <Link 
        href="/mission" 
        className={`transition-colors ${isActive('/mission') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
      >
        Businesses
      </Link>
      <Link 
        href="/about" 
        className={`transition-colors ${isActive('/about') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
      >
        Institutions
      </Link>
      <Link 
        href="/docs" 
        className={`transition-colors ${isActive('/docs') ? 'text-white' : 'text-gray-300 hover:text-white'}`}
      >
        Developers
      </Link>
      <CompanyDropdown />
    </nav>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/login">
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
          Sign in
        </Button>
      </Link>
      <Link href="/signup">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Sign up
        </Button>
      </Link>
    </div>
  );
}

function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

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
            <Link href="/" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-lg">
              Cryptocurrencies
            </Link>
            <Link href="/how-it-works" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-lg">
              Individuals
            </Link>
            <Link href="/mission" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-lg">
              Businesses
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-lg">
              Institutions
            </Link>
            <Link href="/docs" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-lg">
              Developers
            </Link>
            
            <div className="space-y-2">
              <button
                onClick={() => setCompanyOpen(!companyOpen)}
                className="flex items-center justify-between w-full text-gray-300 hover:text-white text-lg"
              >
                Company
                <ChevronDown className={`h-4 w-4 transform transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
              </button>
              {companyOpen && (
                <div className="pl-4 space-y-3">
                  <Link href="/about" onClick={() => setOpen(false)} className="block text-gray-400 hover:text-white">
                    About Us
                  </Link>
                  <Link href="/mission" onClick={() => setOpen(false)} className="block text-gray-400 hover:text-white">
                    Mission & Vision
                  </Link>
                  <Link href="/how-it-works" onClick={() => setOpen(false)} className="block text-gray-400 hover:text-white">
                    How It Works
                  </Link>
                  <Link href="/privacy" onClick={() => setOpen(false)} className="block text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" onClick={() => setOpen(false)} className="block text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                  <Link href="/contact" onClick={() => setOpen(false)} className="block text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-gray-700 space-y-4">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full text-gray-300 border-gray-600 hover:bg-gray-800">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Sign up
                </Button>
              </Link>
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
          © 2025 PnL AI. All rights reserved.
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