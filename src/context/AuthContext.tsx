import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

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

interface StoredAccount extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  orders: Order[];
  addresses: Address[];
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  signUp: (name: string, email: string, password: string) => { success: boolean; error?: string };
  signOut: () => void;
  addOrder: (order: Omit<Order, "id" | "date">) => Order;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const LS_CUSTOMER_SESSION = "vv_customer_session_v1";
const LS_CUSTOMER_ACCOUNTS = "vv_customer_accounts_v1";
const LS_CUSTOMER_ORDERS = "vv_customer_orders_v1";
const LS_CUSTOMER_ADDRESSES = "vv_customer_addresses_v1";

function isAdminEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return (
    clean.includes("vrishabhanviventures") ||
    clean.startsWith("admin@") ||
    clean === "admin"
  );
}

function loadInitialUser(): User | null {
  try {
    const raw = localStorage.getItem(LS_CUSTOMER_SESSION);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (parsed?.email && isAdminEmail(parsed.email)) {
      localStorage.removeItem(LS_CUSTOMER_SESSION);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadInitialUser());
  const [orders, setOrders] = useState<Order[]>(() => {
    const initial = loadInitialUser();
    if (!initial) return [];
    return loadStorage<Order[]>(`${LS_CUSTOMER_ORDERS}_${initial.id}`, []);
  });
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const initial = loadInitialUser();
    if (!initial) return [];
    return loadStorage<Address[]>(`${LS_CUSTOMER_ADDRESSES}_${initial.id}`, []);
  });

  // Sync session
  useEffect(() => {
    if (user && !isAdminEmail(user.email)) {
      saveStorage(LS_CUSTOMER_SESSION, user);
      setOrders(loadStorage<Order[]>(`${LS_CUSTOMER_ORDERS}_${user.id}`, []));
      setAddresses(loadStorage<Address[]>(`${LS_CUSTOMER_ADDRESSES}_${user.id}`, []));
    } else {
      localStorage.removeItem(LS_CUSTOMER_SESSION);
      setOrders([]);
      setAddresses([]);
    }
  }, [user]);

  // Sync orders
  useEffect(() => {
    if (user && !isAdminEmail(user.email)) {
      saveStorage(`${LS_CUSTOMER_ORDERS}_${user.id}`, orders);
    }
  }, [orders, user]);

  // Sync addresses
  useEffect(() => {
    if (user && !isAdminEmail(user.email)) {
      saveStorage(`${LS_CUSTOMER_ADDRESSES}_${user.id}`, addresses);
    }
  }, [addresses, user]);

  const signIn = useCallback((email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: "Email and password are required." };
    }

    if (isAdminEmail(cleanEmail)) {
      return {
        success: false,
        error: "This is an administrator account. Please sign in through the Admin Portal.",
      };
    }

    const accounts = loadStorage<StoredAccount[]>(LS_CUSTOMER_ACCOUNTS, []);
    const found = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (found) {
      if (found.password === password) {
        const { password: _, ...userInfo } = found;
        setUser(userInfo);
        return { success: true };
      }
      return { success: false, error: "Invalid email or password." };
    }

    return {
      success: false,
      error: "No customer account found with this email. Please click Sign Up below.",
    };
  }, []);

  const signUp = useCallback((name: string, email: string, password: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: "All fields are required." };
    }

    if (isAdminEmail(cleanEmail)) {
      return {
        success: false,
        error: "This email address is reserved for administrative use.",
      };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const accounts = loadStorage<StoredAccount[]>(LS_CUSTOMER_ACCOUNTS, []);
    const existing = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: "An account with this email already exists. Please login." };
    }

    const newAccount: StoredAccount = {
      id: `cust-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      joined: new Date().toISOString().slice(0, 10),
      password,
    };

    saveStorage(LS_CUSTOMER_ACCOUNTS, [...accounts, newAccount]);
    const { password: _, ...userInfo } = newAccount;
    setUser(userInfo);
    return { success: true };
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setOrders([]);
    setAddresses([]);
    localStorage.removeItem(LS_CUSTOMER_SESSION);
  }, []);

  const addOrder = useCallback((orderData: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...orderData,
      id: `VV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const addAddress = useCallback((addr: Omit<Address, "id">) => {
    const newAddr: Address = { ...addr, id: `addr-${Date.now()}` };
    setAddresses((prev) => {
      if (addr.isDefault) {
        return [...prev.map((a) => ({ ...a, isDefault: false })), newAddr];
      }
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
    <AuthContext.Provider
      value={{
        user,
        orders,
        addresses,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        addOrder,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
