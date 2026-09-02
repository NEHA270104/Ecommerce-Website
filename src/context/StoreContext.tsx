import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { products as seedProducts, type Product, type ProductVariant } from "../data/products";
import { categories as seedCategories, type Category } from "../data/categories";

// ── Order types (admin-side) ─────────────────────────────────────────────────
export interface AdminOrderItem {
  name: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  image?: string;
}

export type OrderStatus = "Placed" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  date: string;
  amount: number;
  payment: "COD" | "Razorpay";
  paymentStatus: "Pending" | "Paid" | "Failed";
  status: OrderStatus;
  items: AdminOrderItem[];
  address: string;
}

const SEED_ORDERS: AdminOrder[] = [
  { id: "VV-2026-001", customer: "Priya Sharma", email: "priya@example.com", phone: "9876543210", date: "2026-09-01", amount: 899, payment: "COD", paymentStatus: "Pending", status: "Delivered", items: [{ name: "Elegant Floral Kurti", size: "M", color: "Peach", qty: 1, price: 899 }], address: "42 Green Park, Sector 50, Noida, UP 201301" },
  { id: "VV-2026-002", customer: "Anita Verma", email: "anita@example.com", phone: "9812345678", date: "2026-09-01", amount: 2098, payment: "COD", paymentStatus: "Pending", status: "Confirmed", items: [{ name: "Classic Cotton Dress", size: "S", color: "Maroon", qty: 1, price: 1499 }, { name: "Statement Fashion Earrings", size: "One Size", color: "Silver-Blue", qty: 1, price: 599 }], address: "15 Sector 62, Noida, UP 201309" },
  { id: "VV-2026-003", customer: "Sunita Rao", email: "sunita@example.com", phone: "8765432109", date: "2026-08-31", amount: 1499, payment: "Razorpay", paymentStatus: "Paid", status: "Shipped", items: [{ name: "Classic Cotton Dress", size: "L", color: "Navy", qty: 1, price: 1499 }], address: "8 MG Road, Bengaluru, KA 560001" },
  { id: "VV-2026-004", customer: "Meera Patel", email: "meera@example.com", phone: "7654321098", date: "2026-08-30", amount: 799, payment: "COD", paymentStatus: "Pending", status: "Placed", items: [{ name: "Everyday Comfort Top", size: "M", color: "White", qty: 1, price: 799 }], address: "22 Linking Road, Mumbai, MH 400050" },
  { id: "VV-2026-005", customer: "Kavita Singh", email: "kavita@example.com", phone: "6543210987", date: "2026-08-29", amount: 2299, payment: "COD", paymentStatus: "Pending", status: "Delivered", items: [{ name: "Festive Anarkali Dress", size: "S", color: "Orange", qty: 1, price: 2299 }], address: "10 Hazratganj, Lucknow, UP 226001" },
  { id: "VV-2026-006", customer: "Deepa Nair", email: "deepa@example.com", phone: "9988776655", date: "2026-08-28", amount: 1199, payment: "COD", paymentStatus: "Pending", status: "Confirmed", items: [{ name: "Minimalist Straight Pants", size: "L", color: "Black", qty: 1, price: 1199 }], address: "5 Thrippunithura, Kochi, KL 682301" },
];

// ── Context type ─────────────────────────────────────────────────────────────
interface StoreContextType {
  // Data
  products: Product[];
  categories: Category[];
  orders: AdminOrder[];
  // Product actions
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  archiveProduct: (id: string) => void;
  // Category actions
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  // Inventory
  updateVariantStock: (productId: string, sku: string, newStock: number) => void;
  adjustVariantStock: (productId: string, sku: string, delta: number) => void;
  addVariant: (productId: string, variant: ProductVariant) => void;
  updateVariant: (productId: string, sku: string, updates: Partial<ProductVariant>) => void;
  removeVariant: (productId: string, sku: string) => void;
  // Orders
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrder: (order: AdminOrder) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

<<<<<<< HEAD
const LS_PRODUCTS = "vv_products_v4";
const LS_CATEGORIES = "vv_categories_v4";
const LS_ORDERS = "vv_orders_v4";
=======
const LS_PRODUCTS = "vv_products_v3";
const LS_CATEGORIES = "vv_categories_v3";
const LS_ORDERS = "vv_orders_v3";
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15

function loadOrSeed<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch { /* ignore */ }
  return seed;
}

function save(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadOrSeed(LS_PRODUCTS, seedProducts));
  const [categories, setCategories] = useState<Category[]>(() => loadOrSeed(LS_CATEGORIES, seedCategories));
  const [orders, setOrders] = useState<AdminOrder[]>(() => loadOrSeed(LS_ORDERS, SEED_ORDERS));

  useEffect(() => { save(LS_PRODUCTS, products); }, [products]);
  useEffect(() => { save(LS_CATEGORIES, categories); }, [categories]);
  useEffect(() => { save(LS_ORDERS, orders); }, [orders]);

  // ── Product actions ─────────────────────────────────────────────────────
  const addProduct = (p: Omit<Product, "id">) => {
    setProducts((prev) => [...prev, { ...p, id: `p${Date.now()}` }]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p));
  };

  const archiveProduct = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isArchived: true, isFeatured: false } : p));
  };

  // ── Category actions ────────────────────────────────────────────────────
  const addCategory = (c: Omit<Category, "id">) => {
    setCategories((prev) => [...prev, { ...c, id: `cat-${Date.now()}` }]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
  };

  // ── Inventory ───────────────────────────────────────────────────────────
  const updateVariantStock = (productId: string, sku: string, newStock: number) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== productId) return p;
      return { ...p, variants: p.variants.map((v) => v.sku === sku ? { ...v, stock: Math.max(0, newStock) } : v) };
    }));
  };

  const adjustVariantStock = (productId: string, sku: string, delta: number) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== productId) return p;
      return { ...p, variants: p.variants.map((v) => v.sku === sku ? { ...v, stock: Math.max(0, v.stock + delta) } : v) };
    }));
  };

  const addVariant = (productId: string, variant: ProductVariant) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, variants: [...p.variants, variant] } : p));
  };

  const updateVariant = (productId: string, sku: string, updates: Partial<ProductVariant>) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== productId) return p;
      return { ...p, variants: p.variants.map((v) => v.sku === sku ? { ...v, ...updates } : v) };
    }));
  };

  const removeVariant = (productId: string, sku: string) => {
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, variants: p.variants.filter((v) => v.sku !== sku) } : p));
  };

  // ── Orders ──────────────────────────────────────────────────────────────
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  const addOrder = (order: AdminOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      orders,
      addProduct,
      updateProduct,
      archiveProduct,
      addCategory,
      updateCategory,
      updateVariantStock,
      adjustVariantStock,
      addVariant,
      updateVariant,
      removeVariant,
      updateOrderStatus,
      addOrder,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

// ── Selector helpers (mirrors data/products.ts helpers) ──────────────────────
export function useProducts() { return useStore().products; }
export function useLiveProduct(slug: string) {
  const { products } = useStore();
  return products.find((p) => p.slug === slug && !(p as Product & { isArchived?: boolean }).isArchived) ?? null;
}
export function useLiveFeatured() {
  const { products } = useStore();
  return products.filter((p) => p.isFeatured && !(p as Product & { isArchived?: boolean }).isArchived);
}
export function useLiveByCategory(categorySlug: string) {
  const { products } = useStore();
  return products.filter((p) => p.categorySlug === categorySlug && !(p as Product & { isArchived?: boolean }).isArchived);
}
export function useLiveCategories() {
  const { categories } = useStore();
  return categories.filter((c) => c.isActive);
}
export function useCategoryTree() {
  const cats = useLiveCategories();
  const topLevel = cats.filter((c) => c.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder);
  return topLevel.map((cat) => ({
    ...cat,
    children: cats.filter((c) => c.parentId === cat.id).sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}
