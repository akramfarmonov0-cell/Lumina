import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Upload, Loader2, CheckCircle, BarChart3, Trash2, Send, Play, Pause, Clock, Flame, DollarSign, MessageSquare, Zap, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProducts, 
  getOrders, 
  createProduct, 
  deleteProduct, 
  updateOrderStatus,
  getTelegramLogs, 
  postToTelegram, 
  getCronStatus, 
  startCron, 
  stopCron, 
  runCronNow,
  setFlashSale,
  clearFlashSale
} from "@/lib/api";
import type { Product, Order } from "@shared/schema";

export default function Admin() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [flashSaleProductId, setFlashSaleProductId] = useState<number | null>(null);
  const [flashSalePrice, setFlashSalePrice] = useState("");
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

  const { data: telegramLogs = [] } = useQuery({
    queryKey: ["telegram-logs"],
    queryFn: getTelegramLogs,
  });

  const { data: cronStatus } = useQuery({
    queryKey: ["cron-status"],
    queryFn: getCronStatus,
    refetchInterval: 5000,
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Mahsulot Yaratildi", description: "Mahsulot muvaffaqiyatli qo'shildi." });
      setPreview(null);
      setSelectedFile(null);
      setAiData(null);
    },
    onError: (error: Error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "O'chirildi", description: "Mahsulot muvaffaqiyatli o'chirildi." });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Yangilandi", description: "Buyurtma holati yangilandi." });
    },
  });

  const postToTelegramMutation = useMutation({
    mutationFn: postToTelegram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telegram-logs"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Yuborildi", description: "Mahsulot Telegram kanalga yuborildi." });
    },
    onError: (error: Error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const startCronMutation = useMutation({
    mutationFn: startCron,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cron-status"] });
      toast({ title: "Boshlandi", description: "Avtomatik post har soatda yuboriladi." });
    },
  });

  const stopCronMutation = useMutation({
    mutationFn: stopCron,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cron-status"] });
      toast({ title: "To'xtatildi", description: "Avtomatik post to'xtatildi." });
    },
  });

  const runCronNowMutation = useMutation({
    mutationFn: runCronNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telegram-logs"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Ishga tushdi", description: "Qo'lda post yuborildi." });
    },
  });

  const setFlashSaleMutation = useMutation({
    mutationFn: ({ id, price }: { id: number; price: number }) => setFlashSale(id, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      toast({ title: "Flash Sale", description: "Chegirma o'rnatildi." });
      setFlashSaleProductId(null);
      setFlashSalePrice("");
    },
  });

  const clearFlashSaleMutation = useMutation({
    mutationFn: clearFlashSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      toast({ title: "Bekor qilindi", description: "Flash sale bekor qilindi." });
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
        
        setTimeout(() => {
          setIsAnalyzing(false);
          setAiData({
            title: "AI tomonidan yaratilgan",
            category: "Texnologiya",
            price: 0,
            description: "AI tahlili serverda amalga oshiriladi",
          });
          toast({ title: "Tayyor", description: "Rasm yuklandi. Serverda AI tahlili amalga oshiriladi." });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({ title: "Xatolik", description: "Iltimos, rasm yuklang", variant: "destructive" });
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("image", selectedFile);
    createProductMutation.mutate(formData);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const newOrders = orders.filter(o => o.status === "yangi").length;
  const completedOrders = orders.filter(o => o.status === "bajarildi").length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Boshqaruv Paneli</h1>
            <p className="text-muted-foreground">AI va Telegram integratsiyalarini boshqarish</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mahsulotlar</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Buyurtmalar</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Daromad</p>
                  <p className="text-2xl font-bold">${totalRevenue}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Yangi Buyurtmalar</p>
                  <p className="text-2xl font-bold">{newOrders}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex gap-2">
            <TabsTrigger value="products" data-testid="tab-products">Mahsulotlar</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Buyurtmalar</TabsTrigger>
            <TabsTrigger value="telegram" data-testid="tab-telegram">Telegram</TabsTrigger>
            <TabsTrigger value="flash-sale" data-testid="tab-flash-sale">Flash Sale</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
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
                            data-testid="input-product-image"
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
                              <p className="text-sm text-muted-foreground">Yuklash uchun bosing yoki rasmni tashlang</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Mahsulot Nomi</Label>
                          <Input id="title" name="title" placeholder="Avtomatik AI tomonidan to'ldiriladi..." data-testid="input-product-title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Narx ($)</Label>
                          <Input id="price" name="price" type="number" placeholder="0" data-testid="input-product-price" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Kategoriya</Label>
                        <Input id="category" name="category" placeholder="AI tomonidan aniqlanadi..." data-testid="input-product-category" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Tavsif</Label>
                        <Textarea id="description" name="description" placeholder="AI tomonidan yaratilgan tavsif..." className="min-h-[100px]" data-testid="input-product-description" />
                      </div>

                      <Button type="submit" className="w-full" disabled={!selectedFile || createProductMutation.isPending} data-testid="button-create-product">
                        {createProductMutation.isPending ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI tahlil qilmoqda...</>
                        ) : (
                          <><CheckCircle className="w-4 h-4 mr-2" /> Mahsulotni Chop Etish</>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Barcha Mahsulotlar ({products.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {products.map((product: Product) => (
                        <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border" data-testid={`product-item-${product.id}`}>
                          <img src={product.imageUrl} className="w-16 h-16 rounded object-cover" alt={product.title} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{product.title}</div>
                            <div className="text-xs text-muted-foreground">{product.category} - ${product.price}</div>
                            {product.isFlashSale && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                <Flame className="w-3 h-3 mr-1" /> Flash Sale: ${product.flashSalePrice}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => postToTelegramMutation.mutate(product.id)} disabled={postToTelegramMutation.isPending} data-testid={`button-telegram-${product.id}`}>
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteProductMutation.mutate(product.id)} disabled={deleteProductMutation.isPending} data-testid={`button-delete-${product.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-primary">Tizim Holati</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ma'lumotlar Bazasi</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">Onlayn</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Gemini API</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">Ulangan</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Telegram Bot</span>
                      <Badge variant="outline" className={cronStatus?.running ? "bg-green-500/10 text-green-500 border-green-500/50" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/50"}>
                        {cronStatus?.running ? "Aktiv" : "To'xtagan"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Buyurtmalar ({orders.length})</CardTitle>
                <CardDescription>Barcha buyurtmalarni boshqaring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Hozircha buyurtmalar yo'q</p>
                  ) : (
                    orders.map((order: Order) => (
                      <div key={order.id} className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border" data-testid={`order-item-${order.id}`}>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                          #{order.id}
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                          <div className="text-xs text-muted-foreground truncate">{order.customerAddress}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${order.totalAmount}</div>
                          <Badge variant={order.status === "bajarildi" ? "default" : order.status === "jarayonda" ? "secondary" : "outline"}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateOrderMutation.mutate({ id: order.id, status: "jarayonda" })} disabled={order.status !== "yangi"}>
                            Jarayonda
                          </Button>
                          <Button size="sm" onClick={() => updateOrderMutation.mutate({ id: order.id, status: "bajarildi" })} disabled={order.status === "bajarildi"}>
                            Bajarildi
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Telegram Tab */}
          <TabsContent value="telegram">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Cron Job Boshqaruvi
                  </CardTitle>
                  <CardDescription>Har soatda avtomatik mahsulot postlash</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">Avtomatik Post</p>
                      <p className="text-sm text-muted-foreground">Har 1 soatda bitta mahsulot</p>
                    </div>
                    <Badge variant={cronStatus?.running ? "default" : "secondary"} className="text-lg px-4 py-1">
                      {cronStatus?.running ? "Ishlayapti" : "To'xtagan"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cronStatus?.running ? (
                      <Button variant="destructive" onClick={() => stopCronMutation.mutate()} disabled={stopCronMutation.isPending} className="flex-1" data-testid="button-stop-cron">
                        <Pause className="w-4 h-4 mr-2" /> To'xtatish
                      </Button>
                    ) : (
                      <Button onClick={() => startCronMutation.mutate()} disabled={startCronMutation.isPending} className="flex-1" data-testid="button-start-cron">
                        <Play className="w-4 h-4 mr-2" /> Boshlash
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => runCronNowMutation.mutate()} disabled={runCronNowMutation.isPending} data-testid="button-run-now">
                      <Zap className="w-4 h-4 mr-2" /> Hozir Ishga Tushirish
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Telegram Loglar
                  </CardTitle>
                  <CardDescription>So'nggi yuborilgan postlar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {telegramLogs.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Hozircha loglar yo'q</p>
                    ) : (
                      telegramLogs.map((log: any) => (
                        <div key={log.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={log.status === "sent" ? "default" : "destructive"}>{log.status}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString("uz-UZ")}</span>
                          </div>
                          <p className="text-sm line-clamp-2">{log.caption}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Flash Sale Tab */}
          <TabsContent value="flash-sale">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" /> Flash Sale Boshqaruvi
                </CardTitle>
                <CardDescription>24 soatlik chegirmalarni boshqaring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product: Product) => (
                    <div key={product.id} className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border" data-testid={`flash-sale-item-${product.id}`}>
                      <img src={product.imageUrl} className="w-16 h-16 rounded object-cover" alt={product.title} />
                      <div className="flex-1 min-w-[200px]">
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-muted-foreground">Asl narx: ${product.price}</div>
                      </div>
                      
                      {product.isFlashSale ? (
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant="destructive" className="mb-1">
                              <Flame className="w-3 h-3 mr-1" /> ${product.flashSalePrice}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {product.flashSaleEnds && new Date(product.flashSaleEnds).toLocaleString("uz-UZ")}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => clearFlashSaleMutation.mutate(product.id)} data-testid={`button-clear-flash-${product.id}`}>
                            Bekor qilish
                          </Button>
                        </div>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setFlashSaleProductId(product.id)} data-testid={`button-set-flash-${product.id}`}>
                              <Flame className="w-4 h-4 mr-2" /> Flash Sale
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Flash Sale O'rnatish</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-4">
                                <img src={product.imageUrl} className="w-20 h-20 rounded object-cover" alt={product.title} />
                                <div>
                                  <p className="font-medium">{product.title}</p>
                                  <p className="text-sm text-muted-foreground">Asl narx: ${product.price}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Chegirma Narxi ($)</Label>
                                <Input type="number" placeholder="Yangi narx" value={flashSalePrice} onChange={(e) => setFlashSalePrice(e.target.value)} data-testid="input-flash-sale-price" />
                              </div>
                              <Button className="w-full" onClick={() => { if (flashSalePrice) { setFlashSaleMutation.mutate({ id: product.id, price: parseInt(flashSalePrice) }); } }} disabled={!flashSalePrice || setFlashSaleMutation.isPending} data-testid="button-confirm-flash-sale">
                                <Flame className="w-4 h-4 mr-2" /> Flash Sale Boshlash (24 soat)
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
