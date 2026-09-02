import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBagShopping, faTrash, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Breadcrumb from "../components/Breadcrumb";

function formatINR(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof items[0]) => {
    const defaultSize = product.sizes?.[0] || "M";
    const defaultColor = product.colors?.[0]?.name || "Default";
    addItem(product, defaultSize, defaultColor, 1);
  };

  return (
    <main className="min-h-screen py-8" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 mb-8">
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#0B1736",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 700,
              }}
            >
              My Wishlist
            </h1>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#6B7280",
                fontSize: "0.875rem",
              }}
              className="mt-1"
            >
              {items.length} {items.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#6B7280",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
              className="hover:text-[#DC2626] transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faTrash} style={{ fontSize: "0.75rem" }} />
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "16px",
            }}
            className="text-center py-16 px-4 max-w-lg mx-auto"
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(201,151,36,0.1)",
                color: "#C99724",
              }}
              className="flex items-center justify-center mx-auto mb-4"
            >
              <FontAwesomeIcon icon={faHeart} style={{ fontSize: "1.5rem" }} />
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#0B1736",
                fontSize: "1.4rem",
                fontWeight: 600,
              }}
            >
              Your wishlist is empty
            </h2>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#6B7280",
                fontSize: "0.875rem",
                lineHeight: 1.6,
              }}
              className="mt-2 max-w-sm mx-auto"
            >
              Explore our handcrafted collection and tap the heart icon on any product to save it to your wishlist.
            </p>

            <Link
              to="/shop"
              style={{
                backgroundColor: "#0B1736",
                color: "#FAF9F6",
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 700,
                borderRadius: "8px",
              }}
              className="inline-flex items-center gap-2 px-6 py-3 mt-6 hover:bg-[#152459] transition-colors"
            >
              Explore Collection
              <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "0.75rem" }} />
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
                className="flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      title="Remove from wishlist"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        color: "#DC2626",
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} style={{ fontSize: "0.8rem" }} />
                    </button>
                  </div>

                  <div className="p-4">
                    <p
                      style={{
                        fontFamily: "'Manrope', sans-serif",
                        color: "#C99724",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                      className="mb-1"
                    >
                      {product.category}
                    </p>
                    <Link
                      to={`/product/${product.slug}`}
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#0B1736",
                        fontSize: "1rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                      className="line-clamp-1 hover:text-[#C99724] transition-colors"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        style={{
                          fontFamily: "'Manrope', sans-serif",
                          color: "#0B1736",
                          fontSize: "1rem",
                          fontWeight: 700,
                        }}
                      >
                        {formatINR(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span
                          style={{
                            fontFamily: "'Manrope', sans-serif",
                            color: "#9CA3AF",
                            fontSize: "0.85rem",
                          }}
                          className="line-through"
                        >
                          {formatINR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={{
                      backgroundColor: "#0B1736",
                      color: "#FAF9F6",
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "0.825rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                    }}
                    className="w-full py-2.5 flex items-center justify-center gap-2 hover:bg-[#152459] transition-colors"
                  >
                    <FontAwesomeIcon icon={faBagShopping} style={{ fontSize: "0.8rem" }} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
