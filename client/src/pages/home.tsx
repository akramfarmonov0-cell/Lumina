import { Layout } from "@/components/layout";
import { products } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Zap, ArrowRight, BrainCircuit, ShoppingCart, ShieldCheck } from "lucide-react";

export default function Home() {
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
                Powered by Gemini 1.5 Pro
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent glow-text">
                  Intelligent Commerce
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Experience shopping evolved. Our AI analyzes trends, predicts quality, and curates the perfect tech for your lifestyle.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary text-background hover:bg-primary/90 font-bold px-8 h-12 rounded-full shadow-[0_0_20px_-5px_var(--color-primary)]">
                  Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-full border-white/20 hover:bg-white/5">
                  View AI Analytics
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute -right-20 top-20 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      </section>

      {/* Features Grid */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BrainCircuit,
                title: "Neural Analysis",
                desc: "Every product is scanned by our AI for quality assurance and sentiment analysis."
              },
              {
                icon: Zap,
                title: "Instant Logistics",
                desc: "Predictive shipping algorithms ensure your gear arrives before you know you need it."
              },
              {
                icon: ShieldCheck,
                title: "Secure Transactions",
                desc: "Blockchain-verified purchase history and identity protection."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-all hover:bg-white/5 group">
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
            <h2 className="text-3xl font-bold">Featured Technology</h2>
            <Button variant="link" className="text-primary">View All Collection</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden bg-card border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-60" />
                  
                  {/* AI Badge Overlay */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/50 backdrop-blur-md border border-primary/30 text-primary text-xs">
                      AI Score: {product.aiAnalysis.sentiment.split(' ')[1]}
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
                  
                  {/* AI Analysis Mini */}
                  <div className="mb-4 space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {product.aiAnalysis.keywords.slice(0, 2).map(kw => (
                        <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-xl font-bold font-mono">${product.price}</span>
                    <Button size="sm" className="rounded-full bg-white/5 hover:bg-primary hover:text-background transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
