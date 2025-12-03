import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Upload, Loader2, CheckCircle, BarChart3 } from "lucide-react";
import { products } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        // Simulate AI Analysis
        setIsAnalyzing(true);
        setTimeout(() => {
          setIsAnalyzing(false);
          toast({
            title: "AI Analysis Complete",
            description: "Product category and price estimate generated.",
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Product Created",
        description: "Item has been added to the database.",
      });
      setPreview(null);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage inventory and AI configurations</p>
          </div>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" /> View Analytics
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Upload Form */}
          <div className="lg:col-span-2">
            <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Upload an image to auto-generate details via Gemini API</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-colors relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                      />
                      {preview ? (
                        <div className="relative h-64 w-full">
                          <img src={preview} className="h-full w-full object-contain rounded-lg" />
                          {isAnalyzing && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="text-sm font-medium animate-pulse">Analyzing image pixels...</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-8">
                          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop or click to upload
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input placeholder="Auto-generated..." defaultValue={preview ? "Cybernetic Implant V4" : ""} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price Estimate</Label>
                      <Input placeholder="$0.00" defaultValue={preview ? "$1,299.00" : ""} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>AI Description</Label>
                    <Textarea 
                      placeholder="AI generated description..." 
                      className="min-h-[100px]"
                      defaultValue={preview ? "Advanced neural interface with titanium alloy casing. Features real-time bio-metric syncing and cloud upload capabilities. Recommended for medical and military applications." : ""}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary text-background font-bold hover:bg-primary/90" disabled={!preview || isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving to Database...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" /> Publish Product
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity / Stats */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <span className="text-sm font-medium text-green-400 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" /> Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gemini API</span>
                  <span className="text-sm font-medium text-green-400 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" /> Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Flask Server</span>
                  <span className="text-sm font-medium text-green-400 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" /> Active
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-mono">
                        ORD
                      </div>
                      <div>
                        <div className="text-sm font-medium">Order #293{i}</div>
                        <div className="text-xs text-muted-foreground">Processing via AI</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
