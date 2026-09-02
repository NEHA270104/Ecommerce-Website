import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import type { Order, Address } from "../context/AuthContext";

function formatINR(n: number) { return `₹${n.toLocaleString("en-IN")}`; }

type Tab = "dashboard" | "orders" | "order-detail" | "addresses" | "wishlist";

const statusColors: Record<Order["status"], { bg: string; text: string }> = {
  Placed: { bg: "#EFF6FF", text: "#1D4ED8" },
  Confirmed: { bg: "#F5F3FF", text: "#7C3AED" },
  Shipped: { bg: "#FFFBEB", text: "#B45309" },
  Delivered: { bg: "#D1FAE5", text: "#065F46" },
  Cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function AccountPage() {
  const { user, orders, addresses, isAuthenticated, signOut, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<Address> | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF9F6" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.4rem" }}>Please sign in to access your account.</p>
          <Link to="/auth/sign-in" style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }} className="inline-block mt-5 px-8 py-3 rounded-full text-sm font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSignOut = () => { signOut(); navigate("/"); };

  const sidebarLinks: { id: Tab | "signout"; label: string; icon: React.ReactNode }[] = [
    {
      id: "dashboard",
      label: "My Account",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="8" cy="5" r="3" /><path d="M2 16c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>,
    },
    {
      id: "orders",
      label: "Orders",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="12" height="13" rx="1" /><path d="M5 7h6M5 10h6M5 13h3" /></svg>,
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 14s-5-3.5-5-7a3 3 0 015-2.2A3 3 0 0113 7c0 3.5-5 7-5 7z" /></svg>,
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 2C5.8 2 4 3.8 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z" /><circle cx="8" cy="6" r="1.5" /></svg>,
    },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
          {/* Sidebar */}
          <aside>
            <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5">
              <div className="flex items-center gap-3 mb-5 pb-5" style={{ borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ width: "44px", height: "44px", backgroundColor: "#0B1736", borderRadius: "50%" }} className="flex items-center justify-center flex-shrink-0">
                  <span style={{ color: "#E6C76A", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700 }}>
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "0.9rem" }}>{user?.name}</p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.75rem" }}>{user?.email}</p>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {sidebarLinks.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id as Tab)}
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      color: tab === id ? "#C99724" : "#374151",
                      backgroundColor: tab === id ? "#FFFBEE" : "transparent",
                      fontSize: "0.875rem",
                      fontWeight: tab === id ? 600 : 400,
                      borderRadius: "8px",
                      padding: "9px 12px",
                      textAlign: "left",
                      border: "none",
                      cursor: "pointer",
                    }}
                    className="flex items-center gap-2.5 w-full"
                  >
                    {icon}
                    {label}
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  style={{ fontFamily: "'Manrope', sans-serif", color: "#DC2626", fontSize: "0.875rem", padding: "9px 12px", textAlign: "left", border: "none", cursor: "pointer", borderRadius: "8px" }}
                  className="flex items-center gap-2.5 w-full hover:bg-red-50"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 2H5a1 1 0 00-1 1v10a1 1 0 001 1h4" /><path d="M12 9l3-3-3-3M15 6H7" /></svg>
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Dashboard */}
            {tab === "dashboard" && (
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.5rem" }} className="font-semibold mb-5">
                  Welcome back, {user?.name.split(" ")[0]}
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-7">
                  {[
                    { label: "Total Orders", value: orders.length },
                    { label: "Delivered", value: orders.filter((o) => o.status === "Delivered").length },
                    { label: "Saved Addresses", value: addresses.length },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px" }} className="p-4 text-center">
                      <p style={{ color: "#0B1736", fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700 }}>{value}</p>
                      <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}>{label}</p>
                    </div>
                  ))}
                </div>
                {orders.length > 0 && (
                  <>
                    <h2 style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "0.9rem" }} className="mb-3">Recent Orders</h2>
                    <OrderTable orders={orders.slice(0, 3)} onView={(o) => { setSelectedOrder(o); setTab("order-detail"); }} />
                    {orders.length > 3 && (
                      <button onClick={() => setTab("orders")} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif" }} className="mt-3 text-sm font-medium">View All Orders →</button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Orders */}
            {tab === "orders" && (
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.5rem" }} className="font-semibold mb-5">My Orders</h1>
                {orders.length === 0 ? (
                  <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-12 text-center">
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#6B7280", fontSize: "1.1rem" }}>You haven't placed any orders yet.</p>
                    <Link to="/shop" style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm inline-block">Start Shopping →</Link>
                  </div>
                ) : (
                  <OrderTable orders={orders} onView={(o) => { setSelectedOrder(o); setTab("order-detail"); }} />
                )}
              </div>
            )}

            {/* Order Detail */}
            {tab === "order-detail" && selectedOrder && (
              <div>
                <button onClick={() => setTab("orders")} style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-sm flex items-center gap-1 mb-5">
                  ← Back to Orders
                </button>
                <OrderDetailView order={selectedOrder} />
              </div>
            )}

            {/* Wishlist */}
            {tab === "wishlist" && (
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.5rem" }} className="font-semibold mb-5">My Wishlist</h1>
                {wishlistItems.length === 0 ? (
                  <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-12 text-center">
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#6B7280", fontSize: "1.1rem" }}>Your wishlist is empty.</p>
                    <Link to="/shop" style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm inline-block">Explore Products →</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((p) => (
                      <div key={p.id} style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px" }} className="p-4 flex gap-4 items-center">
                        <img src={p.images[0]} alt={p.name} style={{ width: "70px", height: "85px", objectFit: "cover", borderRadius: "8px" }} />
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${p.slug}`} style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontWeight: 600, fontSize: "0.95rem" }} className="line-clamp-1 hover:text-[#C99724]">
                            {p.name}
                          </Link>
                          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "0.9rem" }} className="mt-1">
                            {formatINR(p.price)}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Link to={`/product/${p.slug}`} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 600 }}>
                              View Details
                            </Link>
                            <button onClick={() => removeFromWishlist(p.id)} style={{ color: "#DC2626", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {tab === "addresses" && (
              <AddressManager
                addresses={addresses}
                onAdd={addAddress}
                onUpdate={updateAddress}
                onDelete={deleteAddress}
                onSetDefault={setDefaultAddress}
                addressForm={addressForm}
                setAddressForm={setAddressForm}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function OrderTable({ orders, onView }: { orders: Order[]; onView: (o: Order) => void }) {
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#F9FAFB" }}>
            <tr>
              {["Order ID", "Date", "Items", "Total", "Status", ""].map((h) => (
                <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.7rem", letterSpacing: "0.1em" }} className="text-left py-3 px-4 uppercase font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const sc = statusColors[order.status];
              return (
                <tr key={order.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.875rem", fontWeight: 600 }} className="py-3.5 px-4">{order.id}</td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="py-3.5 px-4">{new Date(order.date).toLocaleDateString("en-IN")}</td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563", fontSize: "0.8rem" }} className="py-3.5 px-4">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 600, fontSize: "0.875rem" }} className="py-3.5 px-4">{`₹${order.total.toLocaleString("en-IN")}`}</td>
                  <td className="py-3.5 px-4">
                    <span style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", fontWeight: 700 }} className="px-2.5 py-1 rounded uppercase tracking-wide">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button onClick={() => onView(order)} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderDetailView({ order }: { order: Order }) {
  const statusSteps: Order["status"][] = ["Placed", "Confirmed", "Shipped", "Delivered"];
  const currentIdx = statusSteps.indexOf(order.status);
  const sc = statusColors[order.status];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.3rem" }} className="font-semibold">Order {order.id}</h1>
        <span style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 700 }} className="px-3 py-1 rounded-full uppercase">
          {order.status}
        </span>
      </div>

      {order.status !== "Cancelled" && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5 mb-5">
          <div className="flex items-center gap-0">
            {statusSteps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      backgroundColor: i <= currentIdx ? "#0B1736" : "#E5E7EB",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {i < currentIdx ? (
                      <svg width="12" height="12" fill="none" stroke="#FAF9F6" strokeWidth="2.5"><path d="M2 6l3 3 5-5" /></svg>
                    ) : (
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i === currentIdx ? "#E6C76A" : "#D1D5DB" }} />
                    )}
                  </div>
                  <span style={{ fontFamily: "'Manrope', sans-serif", color: i <= currentIdx ? "#0B1736" : "#9CA3AF", fontSize: "0.65rem", fontWeight: i === currentIdx ? 700 : 400 }} className="mt-1.5 text-center">
                    {s}
                  </span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div style={{ flex: 1, height: "2px", backgroundColor: i < currentIdx ? "#0B1736" : "#E5E7EB", marginBottom: "14px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5 mb-5">
        <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "0.85rem" }} className="mb-4">Items Ordered</h3>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <img src={item.image} alt={item.name} style={{ width: "56px", height: "70px", objectFit: "cover", borderRadius: "6px", backgroundColor: "#F3F4F6" }} />
              <div className="flex-1">
                <p style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "0.9rem", fontWeight: 500 }}>{item.name}</p>
                <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.75rem" }}>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
              </div>
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 600, fontSize: "0.875rem" }}>
                {`₹${(item.price * item.quantity).toLocaleString("en-IN")}`}
              </p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #E5E7EB" }} className="mt-4 pt-3 flex justify-between">
          <span style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700 }} className="text-sm">Total</span>
          <span style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700 }} className="text-base">{`₹${order.total.toLocaleString("en-IN")}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5">
          <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "0.85rem" }} className="mb-3">Shipping Address</h3>
          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563", fontSize: "0.875rem", lineHeight: 1.7 }}>
            {order.address.fullName}<br />
            {order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}<br />
            {order.address.city}, {order.address.state} – {order.address.pinCode}
          </p>
        </div>
        <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5">
          <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "0.85rem" }} className="mb-3">Payment</h3>
          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563", fontSize: "0.875rem" }}>
            {order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay"}
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#065F46", fontSize: "0.8rem", fontWeight: 600 }} className="mt-1">
            {order.paymentMethod === "COD" ? "Pay on delivery" : "Paid"}
          </p>
        </div>
      </div>
    </div>
  );
}

const INDIA_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"];

function AddressManager({ addresses, onAdd, onUpdate, onDelete, onSetDefault, addressForm, setAddressForm }: {
  addresses: Address[];
  onAdd: (a: Omit<Address, "id">) => void;
  onUpdate: (id: string, a: Omit<Address, "id">) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  addressForm: Partial<Address> | null;
  setAddressForm: (a: Partial<Address> | null) => void;
}) {
  const [form, setForm] = useState<Partial<Address>>({ state: "Uttar Pradesh", isDefault: false });

  const startEdit = (addr: Address) => {
    setForm({ ...addr });
    setAddressForm(addr);
  };

  const startAdd = () => {
    setForm({ state: "Uttar Pradesh", isDefault: false });
    setAddressForm({});
  };

  const handleSave = () => {
    if (addressForm?.id) {
      onUpdate(addressForm.id, form as Omit<Address, "id">);
    } else {
      onAdd(form as Omit<Address, "id">);
    }
    setAddressForm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.5rem" }} className="font-semibold">Saved Addresses</h1>
        <button
          onClick={startAdd}
          style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
          className="px-5 py-2 rounded-full text-sm font-semibold"
        >
          + Add New Address
        </button>
      </div>

      {addressForm !== null ? (
        <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-base font-semibold mb-5">
            {addressForm.id ? "Edit Address" : "Add New Address"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["fullName", "phone", "addressLine1", "addressLine2", "city", "pinCode"] as (keyof Address)[]).map((field) => (
              <div key={field} className={field === "addressLine1" || field === "addressLine2" ? "sm:col-span-2" : ""}>
                <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">
                  {field === "fullName" ? "Full Name" : field === "addressLine1" ? "Address Line 1" : field === "addressLine2" ? "Address Line 2 (optional)" : field === "pinCode" ? "PIN Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  value={(form[field] as string) ?? ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
                />
              </div>
            ))}
            <div>
              <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">State</label>
              <select
                value={form.state ?? "Uttar Pradesh"}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
              >
                {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 mt-4">
            <input type="checkbox" checked={!!form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} style={{ accentColor: "#C99724" }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem" }}>Set as default address</span>
          </label>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }} className="px-7 py-2.5 rounded-full text-sm font-semibold">Save</button>
            <button onClick={() => setAddressForm(null)} style={{ border: "1px solid #E5E7EB", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }} className="px-7 py-2.5 rounded-full text-sm font-medium">Cancel</button>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-12 text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#6B7280", fontSize: "1rem" }}>No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} style={{ backgroundColor: "#fff", border: `2px solid ${addr.isDefault ? "#C99724" : "#E5E7EB"}`, borderRadius: "16px" }} className="p-5">
              {addr.isDefault && (
                <span style={{ backgroundColor: "#FFFBEE", color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700 }} className="uppercase tracking-widest px-2.5 py-0.5 rounded mb-3 inline-block">
                  Default
                </span>
              )}
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "0.9rem" }}>{addr.fullName}</p>
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563", fontSize: "0.8rem", lineHeight: 1.6, marginTop: "4px" }}>
                {addr.phone}<br />
                {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}<br />
                {addr.city}, {addr.state} – {addr.pinCode}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => startEdit(addr)} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>Edit</button>
                <button onClick={() => onDelete(addr.id)} style={{ color: "#DC2626", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }}>Delete</button>
                {!addr.isDefault && (
                  <button onClick={() => onSetDefault(addr.id)} style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }}>Set Default</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
