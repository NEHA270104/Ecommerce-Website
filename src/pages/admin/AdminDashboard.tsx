<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
import { useStore } from "../../context/StoreContext";

const statusColors: Record<string, { bg: string; text: string }> = {
  Placed: { bg: "#EFF6FF", text: "#1D4ED8" },
  Confirmed: { bg: "#F5F3FF", text: "#7C3AED" },
  Shipped: { bg: "#FFFBEB", text: "#B45309" },
  Delivered: { bg: "#D1FAE5", text: "#065F46" },
  Cancelled: { bg: "#FEE2E2", text: "#DC2626" },
  "Return Requested": { bg: "#FEF3C7", text: "#92400E" },
};

export default function AdminDashboard() {
  const { products, orders } = useStore();

  const activeProducts = products.filter((p) => !p.isArchived);
  const totalVariants = activeProducts.reduce((s, p) => s + p.variants.length, 0);
  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.date.startsWith(todayStr));

  const lowStockProducts = activeProducts.filter((p) => {
    const stock = p.variants.reduce((s, v) => s + v.stock, 0);
    return stock > 0 && stock <= 5;
  });

  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.5rem" }} className="font-semibold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Orders Today", value: String(todayOrders.length || orders.length), sub: `${orders.length} total`, color: "#3B82F6" },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, sub: "All orders", color: "#10B981" },
          { label: "Low Stock", value: String(lowStockProducts.length), sub: "Products ≤5 units", color: "#F59E0B" },
          { label: "Total Products", value: String(activeProducts.length), sub: `${totalVariants} variants`, color: "#8B5CF6" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px" }} className="p-5">
            <div style={{ width: "36px", height: "4px", backgroundColor: color, borderRadius: "2px" }} className="mb-3" />
            <p style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.6rem", fontWeight: 700 }}>{value}</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="mt-0.5">{label}</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.75rem" }} className="mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="mb-8">
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 700, fontSize: "0.95rem" }}>Recent Orders</h2>
<<<<<<< HEAD
          <Link to="/admin/orders" style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>View All →</Link>
=======
          <a href="/admin/orders" style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>View All →</a>
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.875rem" }} className="p-6 text-center">
              No orders yet. Orders placed through checkout will appear here.
            </p>
          ) : (
            <table className="w-full mt-4">
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  {["Order ID", "Customer", "Date", "Amount", "Payment", "Status"].map((h) => (
                    <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.7rem", letterSpacing: "0.08em" }} className="text-left py-3 px-5 uppercase font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const sc = statusColors[order.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
                  return (
                    <tr key={order.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.8rem", fontWeight: 600 }} className="py-3.5 px-5">{order.id}</td>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem" }} className="py-3.5 px-5">{order.customer}</td>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="py-3.5 px-5">{new Date(order.date).toLocaleDateString("en-IN")}</td>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 600, fontSize: "0.875rem" }} className="py-3.5 px-5">₹{order.amount.toLocaleString("en-IN")}</td>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="py-3.5 px-5">{order.payment}</td>
                      <td className="py-3.5 px-5">
                        <span style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: "'Manrope', sans-serif", fontSize: "0.68rem", fontWeight: 700 }} className="px-2.5 py-1 rounded uppercase tracking-wide">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "16px" }} className="p-5">
          <h2 style={{ fontFamily: "'Manrope', sans-serif", color: "#92400E", fontWeight: 700, fontSize: "0.9rem" }} className="mb-3 flex items-center gap-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            Low Stock Alert
          </h2>
          <div className="space-y-2">
            {lowStockProducts.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <div key={p.id} className="flex items-center justify-between">
                  <span style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem" }}>{p.name}</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", color: "#B45309", fontSize: "0.8rem", fontWeight: 600 }}>
                    {stock} unit{stock !== 1 ? "s" : ""} left
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
