import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Upload, Loader2, CheckCircle, BarChart3, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getOrders, createProduct, deleteProduct } from "@/lib/api";

export default function Admin() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiData, setAiData] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Mahsulot Yaratildi",
        description: "Mahsulot muvaffaqiyatli qo'shildi.",
      });
      setPreview(null);
      setSelectedFile(null);
      setAiData(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "O'chirildi",
        description: "Mahsulot muvaffaqiyatli o'chirildi.",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        setIsAnalyzing(true);
        
        // Simulate AI analysis loading
        setTimeout(() => {
          setIsAnalyzing(false);
          setAiData({
            title: "AI tomonidan yaratilgan",
            category: "Texnologiya",
            price: 0,
            description: "AI tahlili serverda amalga oshiriladi",
          });
          toast({
            title: "Tayyor",
            description: "Rasm yuklandi. Serverda AI tahlili amalga oshiriladi.",
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Xatolik",
        description: "Iltimos, rasm yuklang",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("image", selectedFile);

    createProductMutation.mutate(formData);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Boshqaruv Paneli</h1>
            <p className="text-muted-foreground">Zaxira va AI konfiguratsiyalarini boshqarish</p>
          </div>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" /> Analitikani Ko'rish
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Upload Form */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Yangi Mahsulot Qo'shish</CardTitle>
                <CardDescription>Rasm yuklang va Gemini AI avtomatik tahlil qiladi</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Mahsulot Rasmi</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors relative group bg-secondary/20">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        required
                      />
                      {preview ? (
                        <div className="relative h-64 w-full">
                          <img src={preview} className="h-full w-full object-contain rounded-lg" alt="Preview" />
                          {isAnalyzing && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm rounded-lg">
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="text-sm font-medium animate-pulse">Tayyorlanmoqda...</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-8">
                          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                          <p className="text-sm text-muted-foreground">
                            Yuklash uchun bosing yoki rasmni tashlang
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Mahsulot Nomi</Label>
                      <Input 
                        id="title"
                        name="title"
                        placeholder="Avtomatik AI tomonidan to'ldiriladi..." 
                        defaultValue={aiData?.title || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Narx ($)</Label>
                      <Input 
                        id="price"
                        name="price"
                        type="number"
                        placeholder="0" 
                        defaultValue={aiData?.price || ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategoriya</Label>
                    <Input 
                      id="category"
                      name="category"
                      placeholder="AI tomonidan aniqlanadi..." 
                      defaultValue={aiData?.category || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Tavsif</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      placeholder="AI tomonidan yaratilgan tavsif..." 
                      className="min-h-[100px]"
                      defaultValue={aiData?.description || ""}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-background font-bold hover:bg-primary/90" 
                    disabled={!selectedFile || createProductMutation.isPending}
                  >
                    {createProductMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI tahlil qilmoqda...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" /> Mahsulotni Chop Etish
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card className="border-border mt-6">
              <CardHeader>
                <CardTitle>Barcha Mahsulotlar ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                      <img src={product.imageUrl} className="w-16 h-16 rounded object-cover" alt={product.title} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{product.title}</div>
                        <div className="text-xs text-muted-foreground">{product.category} • ${product.price}</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity / Stats */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary">Tizim Holati</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ma'lumotlar Bazasi</span>
                  <span className="text-sm font-medium text-green-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" /> Onlayn
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gemini API</span>
                  <span className="text-sm font-medium text-green-500 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" /> Ulangan
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mahsulotlar</span>
                  <span className="text-sm font-medium">{products.length} ta</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>So'nggi Buyurtmalar</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Buyurtmalar yo'q</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-mono">
                          #{order.id}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">${order.totalAmount} • {order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
