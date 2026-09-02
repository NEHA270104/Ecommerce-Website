import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: { name: string; size: string; color: string; quantity: number; price: number; image: string }[];
  total: number;
  status: "Placed" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "COD" | "Razorpay";
  address: Address;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joined: string;
}

interface AuthContextValue {
  user: User | null;
  orders: Order[];
  addresses: Address[];
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => boolean;
  signUp: (name: string, email: string, password: string) => boolean;
  signOut: () => void;
  addOrder: (order: Omit<Order, "id" | "date">) => Order;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DEMO_USER: User = {
  id: "u1",
  name: "Priya Sharma",
  email: "priya@example.com",
  phone: "9876543210",
  joined: "2026-01-15",
};

const DEMO_ORDERS: Order[] = [
  {
    id: "VV-2026-001",
    date: "2026-08-20",
    items: [
      { name: "Elegant Floral Kurti", size: "M", color: "Peach", quantity: 1, price: 899, image: "https://images.unsplash.com/photo-1740992556357-f7fe9afff763?w=80&h=80&fit=crop&auto=format" },
    ],
    total: 899,
    status: "Delivered",
    paymentMethod: "COD",
    address: { id: "a1", fullName: "Priya Sharma", phone: "9876543210", addressLine1: "42 Green Park", city: "Noida", state: "Uttar Pradesh", pinCode: "201301", isDefault: true },
  },
  {
    id: "VV-2026-002",
    date: "2026-09-01",
    items: [
      { name: "Classic Cotton Dress", size: "S", color: "Maroon", quantity: 1, price: 1499, image: "https://images.unsplash.com/photo-1708534246055-d7b149acb731?w=80&h=80&fit=crop&auto=format" },
      { name: "Statement Fashion Earrings", size: "One Size", color: "Silver-Blue", quantity: 1, price: 599, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=80&h=80&fit=crop&auto=format" },
    ],
    total: 2098,
    status: "Confirmed",
    paymentMethod: "COD",
    address: { id: "a1", fullName: "Priya Sharma", phone: "9876543210", addressLine1: "42 Green Park", city: "Noida", state: "Uttar Pradesh", pinCode: "201301", isDefault: true },
  },
];

const DEMO_ADDRESSES: Address[] = [
  {
    id: "a1",
    fullName: "Priya Sharma",
    phone: "9876543210",
    addressLine1: "42 Green Park Colony",
    addressLine2: "Near Sector 18",
    city: "Noida",
    state: "Uttar Pradesh",
    pinCode: "201301",
    isDefault: true,
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const signIn = useCallback((email: string, _password: string) => {
    if (email === DEMO_USER.email) {
      setUser(DEMO_USER);
      setOrders(DEMO_ORDERS);
      setAddresses(DEMO_ADDRESSES);
      return true;
    }
    return false;
  }, []);

  const signUp = useCallback((name: string, email: string, _password: string) => {
    setUser({ id: `u-${Date.now()}`, name, email, joined: new Date().toISOString().slice(0, 10) });
    setOrders([]);
    setAddresses([]);
    return true;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setOrders([]);
    setAddresses([]);
  }, []);

  const addOrder = useCallback((order: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...order,
      id: `VV-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const addAddress = useCallback((addr: Omit<Address, "id">) => {
    const newAddr: Address = { ...addr, id: `a-${Date.now()}` };
    setAddresses((prev) => {
      if (addr.isDefault) return [...prev.map((a) => ({ ...a, isDefault: false })), newAddr];
      return [...prev, newAddr];
    });
  }, []);

  const updateAddress = useCallback((id: string, addr: Omit<Address, "id">) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...addr, id } : a))
    );
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }, []);

  return (
    <AuthContext.Provider value={{
      user, orders, addresses, isAuthenticated: !!user,
      signIn, signUp, signOut, addOrder,
      addAddress, updateAddress, deleteAddress, setDefaultAddress,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
