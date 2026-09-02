import { useState } from "react";
import { useStore, type AdminOrder, type OrderStatus } from "../../context/StoreContext";

const STATUS_FLOW: OrderStatus[] = ["Placed", "Confirmed", "Shipped", "Delivered"];

const statusColors: Record<OrderStatus | "Return Requested", { bg: string; text: string }> = {
  Placed: { bg: "#EFF6FF", text: "#1D4ED8" },
  Confirmed: { bg: "#F5F3FF", text: "#7C3AED" },
  Shipped: { bg: "#FFFBEB", text: "#B45309" },
  Delivered: { bg: "#D1FAE5", text: "#065F46" },
  Cancelled: { bg: "#FEE2E2", text: "#DC2626" },
  "Return Requested": { bg: "#FEF3C7", text: "#92400E" },
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = statusFilter === "All" ? orders : orders.filter((o) => o.status === statusFilter);
  const selectedOrder: AdminOrder | undefined = orders.find((o) => o.id === selectedId);

  const advanceStatus = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const idx = STATUS_FLOW.indexOf(order.status as OrderStatus);
    if (idx >= 0 && idx < STATUS_FLOW.length - 1) {
      updateOrderStatus(id, STATUS_FLOW[idx + 1]);
    }
  };

  const cancelOrder = (id: string) => updateOrderStatus(id, "Cancelled");

  if (selectedOrder) {
    const sc = statusColors[selectedOrder.status as OrderStatus] ?? { bg: "#F3F4F6", text: "#6B7280" };
    const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status as OrderStatus);
    return (
      <div>
        <button onClick={() => setSelectedId(null)} style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-sm flex items-center gap-1 mb-5">
          ← Back to Orders
        </button>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.3rem" }} className="font-semibold">Order {selectedOrder.id}</h1>
          <div className="flex items-center gap-3">
            <span style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 700 }} className="px-3 py-1 rounded-full uppercase">{selectedOrder.status}</span>
            {selectedOrder.status !== "Delivered" && selectedOrder.status !== "Cancelled" && currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1 && (
              <>
                <button onClick={() => advanceStatus(selectedOrder.id)} style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }} className="px-4 py-2 rounded-lg text-xs font-semibold">
                  Mark as {STATUS_FLOW[currentIdx + 1]}
                </button>
                <button onClick={() => cancelOrder(selectedOrder.id)} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", fontFamily: "'Manrope', sans-serif" }} className="px-4 py-2 rounded-lg text-xs font-semibold">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status timeline */}
        {selectedOrder.status !== "Cancelled" && (
          <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5 mb-5">
            <div className="flex items-center">
              {STATUS_FLOW.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: i <= currentIdx ? "#0B1736" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {i < currentIdx
                        ? <svg width="12" height="12" fill="none" stroke="#FAF9F6" strokeWidth="2.5"><path d="M2 6l3 3 5-5" /></svg>
                        : <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: i === currentIdx ? "#E6C76A" : "#D1D5DB" }} />}
                    </div>
                    <span style={{ fontFamily: "'Manrope', sans-serif", color: i <= currentIdx ? "#111827" : "#9CA3AF", fontSize: "0.7rem", fontWeight: i === currentIdx ? 700 : 400 }} className="mt-1 text-center whitespace-nowrap">{s}</span>
                  </div>
                  {i < STATUS_FLOW.length - 1 && <div style={{ flex: 1, height: "2px", backgroundColor: i < currentIdx ? "#0B1736" : "#E5E7EB", marginBottom: "16px" }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5">
            <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 700, fontSize: "0.85rem" }} className="mb-4">Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem", fontWeight: 500 }}>{item.name}</p>
                    <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.75rem" }}>Size: {item.size} · Color: {item.color} · Qty: {item.qty}</p>
                  </div>
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #E5E7EB" }} className="mt-4 pt-3 flex justify-between">
              <span style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 700 }} className="text-sm">Total</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 700 }}>₹{selectedOrder.amount.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5">
            <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 700, fontSize: "0.85rem" }} className="mb-3">Customer</h3>
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontWeight: 600 }} className="text-sm">{selectedOrder.customer}</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280" }} className="text-sm">{selectedOrder.email}</p>
            {selectedOrder.phone && <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280" }} className="text-sm">{selectedOrder.phone}</p>}
            <div style={{ borderTop: "1px solid #E5E7EB" }} className="mt-4 pt-4">
              <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 700, fontSize: "0.85rem" }} className="mb-2">Shipping Address</h3>
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563", lineHeight: 1.6 }} className="text-sm">{selectedOrder.address}</p>
            </div>
            <div style={{ borderTop: "1px solid #E5E7EB" }} className="mt-4 pt-4 flex items-center justify-between">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }}>Payment: <strong style={{ color: "#374151" }}>{selectedOrder.payment}</strong></p>
              <span style={{
                fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700,
                backgroundColor: selectedOrder.paymentStatus === "Paid" ? "#D1FAE5" : "#FEF3C7",
                color: selectedOrder.paymentStatus === "Paid" ? "#065F46" : "#B45309",
                padding: "2px 8px", borderRadius: "4px",
              }}>
                {selectedOrder.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.5rem" }} className="font-semibold mb-6">Orders</h1>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(["All", "Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s as OrderStatus | "All")} style={{
            fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: statusFilter === s ? 600 : 400,
            padding: "5px 14px", borderRadius: "20px",
            border: `1.5px solid ${statusFilter === s ? "#0B1736" : "#E5E7EB"}`,
            backgroundColor: statusFilter === s ? "#0B1736" : "#fff",
            color: statusFilter === s ? "#FAF9F6" : "#374151",
          }}>
            {s} {s !== "All" && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9FAFB" }}>
              <tr>
                {["Order ID", "Customer", "Date", "Amount", "Payment", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.7rem", letterSpacing: "0.08em" }} className="text-left py-3 px-5 uppercase font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const sc = statusColors[order.status as OrderStatus] ?? { bg: "#F3F4F6", text: "#6B7280" };
                const idx = STATUS_FLOW.indexOf(order.status as OrderStatus);
                return (
                  <tr key={order.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.875rem", fontWeight: 600 }} className="py-3.5 px-5">{order.id}</td>
                    <td className="py-3.5 px-5">
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem", fontWeight: 500 }}>{order.customer}</p>
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.75rem" }}>{order.email}</p>
                    </td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="py-3.5 px-5 whitespace-nowrap">{new Date(order.date).toLocaleDateString("en-IN")}</td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 600, fontSize: "0.875rem" }} className="py-3.5 px-5">₹{order.amount.toLocaleString("en-IN")}</td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="py-3.5 px-5">{order.payment}</td>
                    <td className="py-3.5 px-5">
                      <span style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700 }} className="px-2.5 py-1 rounded uppercase tracking-wide whitespace-nowrap">{order.status}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setSelectedId(order.id)} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>View</button>
                        {order.status !== "Delivered" && order.status !== "Cancelled" && idx >= 0 && idx < STATUS_FLOW.length - 1 && (
                          <button onClick={() => advanceStatus(order.id)} style={{ color: "#7C3AED", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 600 }}>
                            → {STATUS_FLOW[idx + 1]}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF" }} className="text-sm">No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
