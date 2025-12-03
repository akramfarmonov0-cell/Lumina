import type { Product, InsertProduct, Order, InsertOrder } from "@shared/schema";

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
