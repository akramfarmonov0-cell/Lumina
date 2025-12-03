import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Award, ShoppingCart, ShieldCheck, Check, Truck, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  const { addToCart, items } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedItems((prev) => new Set(prev).add(product.id));
    toast({
      title: "Savatga qo'shildi!",
      description: `${product.title} savatga qo'shildi`,
    });
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  const isInCart = (productId: number) => {
    return items.some((item) => item.product.id === productId);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-6 border-primary/50 text-primary bg-primary/10 backdrop-blur-md px-4 py-1.5 text-sm">
                <Star className="w-4 h-4 mr-2" />
                Premium Texnologiyalar Do'koni
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Eng Yaxshi <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glow-text">
                  Texnologiyalar
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Premium sifatli mahsulotlar, arzon narxlar va tezkor yetkazib berish. Siz uchun eng yaxshi tanlovlar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-background hover:bg-primary/90 font-bold px-8 h-12 rounded-full shadow-[0_0_20px_-5px_var(--color-primary)]"
                  onClick={() => setLocation("/checkout")}
                  data-testid="button-start-shopping"
                >
                  Xaridni Boshlash <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-full border-primary/20 hover:bg-primary/5">
                  Katalogni Ko'rish
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute -right-20 top-20 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      </section>

      {/* Features Grid */}
      <section className="py-20 border-y border-border bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Premium Sifat",
                desc: "Har bir mahsulot sinchkovlik bilan tekshirilgan va sifat standartlariga mos keladi."
              },
              {
                icon: Truck,
                title: "Tezkor Yetkazish",
                desc: "1-3 kun ichida bepul yetkazib berish. Buyurtmangizni tez va xavfsiz qabul qiling."
              },
              {
                icon: ShieldCheck,
                title: "Xavfsiz To'lov",
                desc: "100% xavfsiz to'lov tizimlari va ma'lumotlaringiz himoyasi kafolatlangan."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:bg-secondary/50 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Tanlangan Texnologiyalar</h2>
            <Button variant="link" className="text-primary">Barcha Kolleksiyani Ko'rish</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Hozircha mahsulotlar yo'q. Admin paneldan yangi mahsulot qo'shing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-60" />
                    
                    {/* Quality Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-background/50 backdrop-blur-md border border-primary/30 text-primary text-xs">
                        <Star className="w-3 h-3 mr-1" /> Premium
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-xs text-primary mb-2 font-medium tracking-wider uppercase">
                      {product.category}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    
                    {/* Product Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="mb-4 space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="text-xl font-bold font-mono">${product.price}</span>
                      <Button 
                        size="sm" 
                        className={`rounded-full transition-colors ${
                          addedItems.has(product.id) 
                            ? "bg-green-500 text-white" 
                            : isInCart(product.id)
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary hover:bg-primary hover:text-background"
                        }`}
                        onClick={() => handleAddToCart(product)}
                        data-testid={`button-add-to-cart-${product.id}`}
                      >
                        {addedItems.has(product.id) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
