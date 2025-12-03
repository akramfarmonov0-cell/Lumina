import { Link, useLocation } from "wouter";
import { assets } from "@/lib/mock-data";
import { ShoppingCart, Search, User, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <img 
                src={assets.logo} 
                alt="Lumina AI" 
                className="h-10 w-10 rounded-lg object-cover border border-primary/20 group-hover:border-primary/50 transition-all shadow-[0_0_15px_-5px_var(--color-primary)]" 
              />
              <span className="font-display font-bold text-xl tracking-wide">
                Lumina<span className="text-primary">.AI</span>
              </span>
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/">
              <a className={`text-sm font-medium hover:text-primary transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
                Store
              </a>
            </Link>
            <Link href="/admin">
              <a className={`text-sm font-medium hover:text-primary transition-colors ${location === '/admin' ? 'text-primary' : 'text-muted-foreground'}`}>
                Admin
              </a>
            </Link>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About AI
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Neural Search..." 
                className="h-9 w-64 rounded-full bg-secondary/50 border border-white/5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-white/10">
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">Profile</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">Orders</DropdownMenuItem>
                <Link href="/admin">
                  <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">Admin Panel</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-l border-white/10">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/">
                    <a className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Store</a>
                  </Link>
                  <Link href="/admin">
                    <a className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Admin</a>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20 bg-black/20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <span className="font-display font-bold text-xl tracking-wide">
                Lumina<span className="text-primary">.AI</span>
              </span>
              <p className="mt-4 text-sm text-muted-foreground">
                Next-generation e-commerce powered by advanced neural networks.
              </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Neural Search</li>
              <li>AI Analytics</li>
              <li>Predictive Stock</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Careers</li>
              <li>Legal</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Secure</h4>
            <div className="flex items-center gap-2 text-primary/80">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm">Verified by Sentinel AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
