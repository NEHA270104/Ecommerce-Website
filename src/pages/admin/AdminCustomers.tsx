import { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";

export default function AdminCustomers() {
  const { orders } = useStore();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "orders" | "revenue" | "joined">("joined");

  // Derive unique customers from orders
  const customers = useMemo(() => {
    const map = new Map<string, {
      email: string; name: string; phone: string;
      orderCount: number; totalSpent: number; lastOrder: string;
    }>();
    orders.forEach((o) => {
      const key = o.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.amount;
        if (o.date > existing.lastOrder) existing.lastOrder = o.date;
      } else {
        map.set(key, {
          email: o.email,
          name: o.customer,
          phone: o.phone ?? "—",
          orderCount: 1,
          totalSpent: o.amount,
          lastOrder: o.date,
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = customers.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
    if (sortKey === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortKey === "orders") list = [...list].sort((a, b) => b.orderCount - a.orderCount);
    else if (sortKey === "revenue") list = [...list].sort((a, b) => b.totalSpent - a.totalSpent);
    else list = [...list].sort((a, b) => b.lastOrder.localeCompare(a.lastOrder));
    return list;
  }, [customers, search, sortKey]);

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.5rem" }} className="font-semibold">Customers</h1>
          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="mt-0.5">Derived from order history.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Customers", value: customers.length },
          { label: "Total Orders", value: orders.length },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px" }} className="p-4">
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.4rem", fontWeight: 700 }}>{value}</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.75rem" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
            <circle cx="6" cy="6" r="4.5" /><path d="M9.5 9.5l3 3" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem", paddingLeft: "34px" }}
            className="border rounded-lg py-2 pr-4 focus:outline-none focus:border-[#C99724] bg-white w-56"
          />
        </div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
          style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
          className="border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#C99724]"
        >
          <option value="joined">Sort: Recent</option>
          <option value="orders">Sort: Most Orders</option>
          <option value="revenue">Sort: Highest Spend</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
        <span style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.8rem" }}>{filtered.length} customers</span>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9FAFB" }}>
              <tr>
                {["Customer", "Email", "Phone", "Orders", "Total Spent", "Last Order"].map((h) => (
                  <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.7rem", letterSpacing: "0.08em" }} className="text-left py-3 px-5 uppercase font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.email} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div style={{ width: "34px", height: "34px", backgroundColor: "#0B1736", borderRadius: "50%", flexShrink: 0 }} className="flex items-center justify-center">
                        <span style={{ color: "#E6C76A", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 700 }}>
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem", fontWeight: 600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.875rem" }} className="py-3.5 px-5">{c.email}</td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.875rem" }} className="py-3.5 px-5">{c.phone}</td>
                  <td className="py-3.5 px-5">
                    <span style={{ backgroundColor: "#EFF6FF", color: "#1D4ED8", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px" }}>
                      {c.orderCount}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 600, fontSize: "0.875rem" }} className="py-3.5 px-5">
                    ₹{c.totalSpent.toLocaleString("en-IN")}
                  </td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="py-3.5 px-5">
                    {new Date(c.lastOrder).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-14 text-center">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.875rem" }}>
                {orders.length === 0 ? "No orders yet. Customers will appear here once orders are placed." : "No customers match your search."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
