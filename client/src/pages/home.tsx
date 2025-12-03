import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Zap, ArrowRight, BrainCircuit, ShoppingCart, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

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
                <Sparkles className="w-4 h-4 mr-2" />
                Gemini 1.5 Pro tomonidan quvvatlangan
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Aqlli Tijoratning <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glow-text">
                  Kelajagi
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Savdo evolyutsiyasini his qiling. Bizning AI trendlarni tahlil qiladi, sifatni bashorat qiladi va sizning turmush tarzingiz uchun mukammal texnikani tanlaydi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary text-background hover:bg-primary/90 font-bold px-8 h-12 rounded-full shadow-[0_0_20px_-5px_var(--color-primary)]">
                  Xaridni Boshlash <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-full border-primary/20 hover:bg-primary/5">
                  AI Analitikani Ko'rish
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
                icon: BrainCircuit,
                title: "Neyron Tahlil",
                desc: "Har bir mahsulot sifat nazorati va his-tuyg'ular tahlili uchun AI tomonidan tekshiriladi."
              },
              {
                icon: Zap,
                title: "Tezkor Logistika",
                desc: "Bashoratli yetkazib berish algoritmlari buyurtmangizni sizga kerak bo'lishidan oldin yetkazilishini ta'minlaydi."
              },
              {
                icon: ShieldCheck,
                title: "Xavfsiz Tranzaksiyalar",
                desc: "Blokcheyn orqali tasdiqlangan xarid tarixi va shaxsni himoya qilish."
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
                    
                    {/* AI Badge Overlay */}
                    {product.aiAnalysis && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-background/50 backdrop-blur-md border border-primary/30 text-primary text-xs">
                          AI: {product.aiAnalysis.sentiment}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-xs text-primary mb-2 font-medium tracking-wider uppercase">
                      {product.category}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    
                    {/* AI Analysis Mini */}
                    {product.aiAnalysis && (
                      <div className="mb-4 space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {product.aiAnalysis.keywords.slice(0, 2).map(kw => (
                            <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="text-xl font-bold font-mono">${product.price}</span>
                      <Button size="sm" className="rounded-full bg-secondary hover:bg-primary hover:text-background transition-colors">
                        <ShoppingCart className="w-4 h-4" />
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
