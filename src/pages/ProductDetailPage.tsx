import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getStockForVariant } from "../data/products";
import { useLiveProduct } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import Breadcrumb from "../components/Breadcrumb";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useLiveProduct(slug ?? "");
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF9F6" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#6B7280", fontSize: "1.4rem" }}>Product not found.</p>
          <Link to="/shop" style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif" }} className="mt-3 text-sm inline-block">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const stock = selectedSize && selectedColor
    ? getStockForVariant(product, selectedSize, selectedColor)
    : null;

  const isOutOfStock = stock === 0;
  const isLowStock = stock !== null && stock > 0 && stock <= 3;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          { label: product.category, to: `/category/${product.categorySlug}` },
          { label: product.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
          {/* Images */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[540px]">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    border: `2px solid ${activeImage === i ? "#C99724" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                  className="w-16 h-20 sm:w-16 sm:h-20"
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 rounded-xl overflow-hidden" style={{ backgroundColor: "#F3F4F6", aspectRatio: "3/4" }}>
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", letterSpacing: "0.18em" }} className="uppercase mb-2">
              {product.category}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "clamp(1.5rem, 3vw, 2rem)" }} className="font-semibold leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-4">
              <span style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontSize: "1.6rem", fontWeight: 700 }}>
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", fontSize: "1.1rem" }} className="line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span style={{ backgroundColor: "#D1FAE5", color: "#065F46", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }} className="px-2 py-0.5 rounded font-semibold">
                  Save {formatINR(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.7 }} className="mt-4 text-sm">
              {product.shortDescription}
            </p>

            <div style={{ height: "1px", backgroundColor: "#E5E7EB" }} className="my-5" />

            {/* Color */}
            <div className="mb-5">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.8rem", fontWeight: 600 }} className="uppercase tracking-wider mb-2">
                Color: <span style={{ fontWeight: 400, textTransform: "none" }}>{selectedColor}</span>
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: color.hex,
                      border: `2.5px solid ${selectedColor === color.name ? "#C99724" : "#E5E7EB"}`,
                      outline: selectedColor === color.name ? "2px solid #C99724" : "none",
                      outlineOffset: "2px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.8rem", fontWeight: 600 }} className="uppercase tracking-wider">
                  Size
                </p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}
                  className="font-medium"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const sizeStock = getStockForVariant(product, size, selectedColor);
                  const oos = sizeStock === 0;
                  return (
                    <button
                      key={size}
                      onClick={() => !oos && setSelectedSize(size)}
                      disabled={oos}
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        minWidth: "44px",
                        padding: "6px 12px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        borderRadius: "8px",
                        border: `1.5px solid ${selectedSize === size ? "#C99724" : oos ? "#F3F4F6" : "#E5E7EB"}`,
                        backgroundColor: selectedSize === size ? "#C99724" : oos ? "#F9FAFB" : "white",
                        color: selectedSize === size ? "#fff" : oos ? "#D1D5DB" : "#0B1736",
                        cursor: oos ? "not-allowed" : "pointer",
                        textDecoration: oos ? "line-through" : "none",
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {!selectedSize && (
                <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="text-xs mt-1.5">Please select a size</p>
              )}
            </div>

            {/* Stock status */}
            {selectedSize && (
              <div className="mb-4">
                {isOutOfStock ? (
                  <p style={{ color: "#DC2626", fontFamily: "'Manrope', sans-serif" }} className="text-sm font-medium">Currently unavailable in this size</p>
                ) : isLowStock ? (
                  <p style={{ color: "#B45309", fontFamily: "'Manrope', sans-serif" }} className="text-sm font-medium">Only {stock} left in this size!</p>
                ) : (
                  <p style={{ color: "#065F46", fontFamily: "'Manrope', sans-serif" }} className="text-sm font-medium flex items-center gap-1.5">
                    <span style={{ backgroundColor: "#10B981", borderRadius: "50%", width: "7px", height: "7px", display: "inline-block" }} />
                    In Stock
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="mb-5">
                <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.8rem", fontWeight: 600 }} className="uppercase tracking-wider mb-2">Quantity</p>
                <div className="flex items-center gap-0" style={{ border: "1.5px solid #E5E7EB", borderRadius: "8px", display: "inline-flex" }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "1.1rem" }}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 600 }} className="w-10 text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock ?? 10, q + 1))}
                    style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "1.1rem" }}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA */}
            {isOutOfStock && selectedSize ? (
              <button
                disabled
                style={{ backgroundColor: "#F3F4F6", color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }}
                className="w-full py-3.5 rounded-full text-sm font-semibold cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                style={{
                  backgroundColor: added ? "#065F46" : selectedSize ? "#0B1736" : "#E5E7EB",
                  color: selectedSize ? "#FAF9F6" : "#9CA3AF",
                  fontFamily: "'Manrope', sans-serif",
                  transition: "all 0.2s",
                }}
                className="w-full py-3.5 rounded-full text-sm font-semibold disabled:cursor-not-allowed"
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
            )}

            {added && (
              <button
                onClick={() => navigate("/cart")}
                style={{ border: "1.5px solid #0B1736", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
                className="w-full mt-2.5 py-3.5 rounded-full text-sm font-semibold hover:bg-[#0B1736] hover:text-white transition-colors"
              >
                View Cart
              </button>
            )}

            <div style={{ height: "1px", backgroundColor: "#E5E7EB" }} className="my-6" />

            {/* Product details accordion */}
            <ProductAccordion label="Product Details">
              <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.8 }} className="text-sm">
                {product.description}
              </p>
            </ProductAccordion>

            <ProductAccordion label="Shipping & Delivery">
              <div style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif" }} className="text-sm space-y-1.5">
                <p>• Standard delivery available across India.</p>
                <p>• Orders are typically shipped within 1–3 business days.</p>
                <p>• Estimated delivery: 4–7 business days.</p>
              </div>
            </ProductAccordion>

            <ProductAccordion label="Returns">
              <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.8 }} className="text-sm">
                7-day return policy on eligible products. Items must be unused, unworn and in original packaging.{" "}
                <Link to="/returns" style={{ color: "#C99724" }}>Read our full return policy →</Link>
              </p>
            </ProductAccordion>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-lg font-semibold">Size Guide</h2>
              <button onClick={() => setSizeGuideOpen(false)}>
                <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2"><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></svg>
              </button>
            </div>
            <div className="p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    {["Size", "Chest (in)", "Waist (in)", "Hip (in)"].map((h) => (
                      <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.75rem" }} className="text-left py-2.5 px-3 uppercase tracking-wide font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["XS", "30–31", "24–25", "33–34"],
                    ["S", "32–33", "26–27", "35–36"],
                    ["M", "34–35", "28–29", "37–38"],
                    ["L", "36–37", "30–31", "39–40"],
                    ["XL", "38–40", "32–34", "41–43"],
                    ["XXL", "41–43", "35–37", "44–46"],
                  ].map(([size, chest, waist, hip]) => (
                    <tr key={size} style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 600 }} className="py-2.5 px-3">{size}</td>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563" }} className="py-2.5 px-3">{chest}</td>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563" }} className="py-2.5 px-3">{waist}</td>
                      <td style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563" }} className="py-2.5 px-3">{hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="mt-4 text-xs">Measurements are in inches. For best fit, we recommend comparing your measurements to the size chart above.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ProductAccordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5"
      >
        <span style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.875rem", fontWeight: 600 }}>{label}</span>
        <svg
          width="16" height="16" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}
