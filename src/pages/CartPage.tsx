import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Breadcrumb from "../components/Breadcrumb";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 0 ? (subtotal >= 999 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center" style={{ backgroundColor: "#FAF9F6" }}>
        <div className="text-center max-w-sm px-4">
          <div
            style={{ width: "72px", height: "72px", backgroundColor: "#F5EDD3", borderRadius: "50%" }}
            className="mx-auto flex items-center justify-center mb-5"
          >
            <svg width="32" height="32" fill="none" stroke="#C99724" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h10a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.4rem" }} className="font-semibold">
            Your cart is waiting for something beautiful.
          </h2>
          <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm">
            Discover our curated collection of stylish fashion.
          </p>
          <Link
            to="/shop"
            style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
            className="inline-block mt-6 px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#152459] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }} className="font-semibold mt-6 mb-8">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px" }}
                className="flex gap-4 p-4"
              >
                <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: "90px", height: "110px", objectFit: "cover", borderRadius: "8px", backgroundColor: "#F3F4F6" }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", letterSpacing: "0.12em" }} className="uppercase mb-0.5">
                        {item.product.category}
                      </p>
                      <Link
                        to={`/product/${item.product.slug}`}
                        style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1rem", fontWeight: 500, textDecoration: "none" }}
                        className="hover:text-[#C99724] transition-colors leading-tight block"
                      >
                        {item.product.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      style={{ color: "#DC2626", flexShrink: 0, padding: "4px" }}
                      aria-label="Remove item"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span style={{ backgroundColor: "#F3F4F6", color: "#4B5563", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }} className="px-2 py-0.5 rounded">
                      Size: {item.size}
                    </span>
                    <span style={{ backgroundColor: "#F3F4F6", color: "#4B5563", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }} className="px-2 py-0.5 rounded">
                      Color: {item.color}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center" style={{ border: "1px solid #E5E7EB", borderRadius: "7px", display: "inline-flex" }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", width: "32px", height: "32px" }}
                        className="flex items-center justify-center hover:bg-gray-50 text-base"
                      >
                        −
                      </button>
                      <span style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 600, fontSize: "0.875rem" }} className="w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", width: "32px", height: "32px" }}
                        className="flex items-center justify-center hover:bg-gray-50 text-base"
                      >
                        +
                      </button>
                    </div>
                    <span style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "1rem" }}>
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/shop"
              style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }}
              className="text-sm flex items-center gap-1.5 mt-4 hover:text-[#0B1736] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-6 sticky top-24">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.2rem" }} className="font-semibold mb-5">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-sm">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 500 }} className="text-sm">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-sm">Shipping</span>
                  <span style={{ color: shipping === 0 ? "#065F46" : "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 500 }} className="text-sm">
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="text-xs">
                    Add {formatINR(999 - subtotal)} more for free shipping
                  </p>
                )}
                <div style={{ borderTop: "1px solid #E5E7EB" }} className="pt-3 flex justify-between">
                  <span style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 700 }} className="text-base">Total</span>
                  <span style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{formatINR(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                className="w-full mt-5 py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-[#152459] transition-colors"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 flex items-center justify-center gap-2">
                <svg width="14" height="14" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="3" y="6" width="10" height="7" rx="1" /><path d="M7 6V4a3 3 0 016 0v2" /></svg>
                <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-xs">Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
