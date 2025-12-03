import type { Product, InsertProduct, Order, InsertOrder, TelegramLog } from "@shared/schema";

const API_BASE = "/api";

// Products API
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Mahsulotlarni yuklab bo'lmadi");
  return res.json();
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Mahsulot topilmadi");
  return res.json();
}

export async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Qidirishda xatolik");
  return res.json();
}

export async function createProduct(formData: FormData): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Mahsulot qo'shib bo'lmadi");
  }
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Mahsulotni o'chirib bo'lmadi");
}

// Flash Sale API
export async function getFlashSales(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/flash-sales`);
  if (!res.ok) throw new Error("Flash sale mahsulotlarni yuklab bo'lmadi");
  return res.json();
}

export async function setFlashSale(productId: number, flashSalePrice: number, hours: number = 24): Promise<{ product: Product; marketing: any }> {
  const res = await fetch(`${API_BASE}/products/${productId}/flash-sale`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flashSalePrice, hours }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Flash sale o'rnatib bo'lmadi");
  }
  return res.json();
}

export async function clearFlashSale(productId: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${productId}/flash-sale`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Flash sale o'chirib bo'lmadi");
  return res.json();
}

// Telegram API
export async function getTelegramLogs(): Promise<TelegramLog[]> {
  const res = await fetch(`${API_BASE}/telegram/logs`);
  if (!res.ok) throw new Error("Telegram loglarni yuklab bo'lmadi");
  return res.json();
}

export async function postToTelegram(productId: number): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/telegram/post/${productId}`, {
    method: "POST",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Telegram'ga yuborib bo'lmadi");
  }
  return res.json();
}

export async function getCronStatus(): Promise<{ running: boolean }> {
  const res = await fetch(`${API_BASE}/telegram/cron/status`);
  return res.json();
}

export async function startCron(): Promise<{ success: boolean; running: boolean }> {
  const res = await fetch(`${API_BASE}/telegram/cron/start`, { method: "POST" });
  return res.json();
}

export async function stopCron(): Promise<{ success: boolean; running: boolean }> {
  const res = await fetch(`${API_BASE}/telegram/cron/stop`, { method: "POST" });
  return res.json();
}

export async function runCronNow(): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/telegram/cron/run-now`, { method: "POST" });
  return res.json();
}

export async function generateMarketing(productId: number): Promise<any> {
  const res = await fetch(`${API_BASE}/products/${productId}/marketing`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Marketing yaratib bo'lmadi");
  return res.json();
}

// Orders API
export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error("Buyurtmalarni yuklab bo'lmadi");
  return res.json();
}

export async function createOrder(order: InsertOrder, items: Array<{productId: number; quantity: number; priceAtPurchase: number}>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order, items }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Buyurtma qo'shib bo'lmadi");
  }
  return res.json();
}

export async function updateOrderStatus(id: number, status: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Buyurtma holatini o'zgartirib bo'lmadi");
  return res.json();
}

// Auth API
export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Kirish muvaffaqiyatsiz");
  }
  return res.json();
}

export async function register(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Ro'yxatdan o'tish muvaffaqiyatsiz");
  }
  return res.json();
}
