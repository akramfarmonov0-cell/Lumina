import { Link, useLocation } from "wouter";
import { assets } from "@/lib/mock-data";
import { ShoppingCart, Search, User, Menu, ShieldCheck, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useCart } from "@/hooks/use-cart";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-background transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer">
              <img 
                src={assets.logo} 
                alt="Lumina AI" 
                className="h-10 w-10 rounded-lg object-cover border border-primary/20 group-hover:border-primary/50 transition-all shadow-[0_0_15px_-5px_var(--color-primary)]" 
              />
              <span className="font-display font-bold text-xl tracking-wide">
                Lumina<span className="text-primary">.AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/">
              <span className={`text-sm font-medium hover:text-primary transition-colors cursor-pointer ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
                Do'kon
              </span>
            </Link>
            <Link href="/admin">
              <span className={`text-sm font-medium hover:text-primary transition-colors cursor-pointer ${location === '/admin' ? 'text-primary' : 'text-muted-foreground'}`}>
                Admin Panel
              </span>
            </Link>
            <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              AI Haqida
            </span>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Neyron Qidiruv..." 
                className="h-9 w-64 rounded-full bg-secondary/50 border border-border pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>

            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:text-primary"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:text-primary relative"
              onClick={() => setLocation("/checkout")}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-background"
                  data-testid="badge-cart-count"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">Profil</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">Buyurtmalar</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary" onClick={() => window.location.href = '/admin'}>
                  Admin Panel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-l border-border">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-lg font-medium cursor-pointer">Do'kon</span>
                  </Link>
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-lg font-medium cursor-pointer">Admin Panel</span>
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
      <footer className="border-t border-border py-12 mt-20 bg-secondary/20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <span className="font-display font-bold text-xl tracking-wide">
                Lumina<span className="text-primary">.AI</span>
              </span>
              <p className="mt-4 text-sm text-muted-foreground">
                Ilg'or neyron tarmoqlar asosida ishlaydigan keyingi avlod elektron tijorati.
              </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Neyron Qidiruv</li>
              <li>AI Analitika</li>
              <li>Bashoratli Zaxira</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Kompaniya</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Biz Haqimizda</li>
              <li>Karyera</li>
              <li>Huquqiy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Xavfsizlik</h4>
            <div className="flex items-center gap-2 text-primary/80">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm">Sentinel AI tomonidan tasdiqlangan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
