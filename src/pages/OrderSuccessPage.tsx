import { useLocation, Link } from "react-router-dom";
import type { Order } from "../context/AuthContext";

function formatINR(n: number) { return `₹${n.toLocaleString("en-IN")}`; }

export default function OrderSuccessPage() {
  const location = useLocation();
  const order: Order | undefined = location.state?.order;

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div
          style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#D1FAE5" }}
          className="mx-auto flex items-center justify-center mb-6"
        >
          <svg width="40" height="40" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 20l7 7 15-14" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "2rem" }} className="font-semibold">
          Order Confirmed!
        </h1>
        <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-base">
          Thank you for shopping with Vrishabhanvi Venture.
        </p>

        {order && (
          <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="mt-8 p-6 text-left">
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-base font-semibold mb-4">Order Details</h2>
            <div className="space-y-3">
              {[
                { label: "Order Number", value: order.id },
                { label: "Order Date", value: new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                { label: "Payment Method", value: order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay" },
                { label: "Total Amount", value: formatINR(order.total) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem" }}>{label}</span>
                  <span style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #E5E7EB" }} className="mt-4 pt-4">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="mb-1.5">Delivering to:</p>
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {order.address.fullName}<br />
                {order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}<br />
                {order.address.city}, {order.address.state} – {order.address.pinCode}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-7 justify-center">
          <Link
            to="/account"
            style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
            className="px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#152459] transition-colors"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            style={{ border: "1.5px solid #0B1736", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
            className="px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#0B1736] hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
