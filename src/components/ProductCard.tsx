import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { getTotalStock } from "../data/products";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function formatINR(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span
        style={{ backgroundColor: "rgba(220,38,38,0.1)", color: "#DC2626", fontFamily: "'Manrope', sans-serif" }}
        className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
      >
        Sold Out
      </span>
    );
  }
  if (stock <= 3) {
    return (
      <span
        style={{ backgroundColor: "rgba(180,83,9,0.08)", color: "#B45309", fontFamily: "'Manrope', sans-serif" }}
        className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
      >
        Only {stock} left
      </span>
    );
  }
  return null;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const stock = getTotalStock(product);
  const [hovered, setHovered] = useState(false);
  const hasSecond = product.images.length > 1;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group block ${className}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image frame */}
      <div
        style={{
          backgroundColor: "#F0EDE8",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          aspectRatio: "3/4",
        }}
      >
        {/* Primary image */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            opacity: hovered && hasSecond ? 0 : 1,
            transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
            willChange: "transform",
          }}
        />

        {/* Secondary image (swaps in on hover) */}
        {hasSecond && (
          <img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1.04)" : "scale(1.08)",
              transition: "opacity 0.4s ease, transform 0.65s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        )}

        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(11,23,54,0.55) 0%, transparent 45%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Top badges */}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
          {product.isNew && (
            <span
              style={{
                backgroundColor: "#C99724",
                color: "#fff",
                fontFamily: "'Manrope', sans-serif",
                fontSize: "9px",
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: "20px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              New
            </span>
          )}
          {discount > 0 && (
            <span
              style={{
                backgroundColor: "#0B1736",
                color: "#E6C76A",
                fontFamily: "'Manrope', sans-serif",
                fontSize: "9px",
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: "20px",
                letterSpacing: "0.08em",
              }}
            >
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick view pill */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: hovered ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(8px)",
            opacity: hovered ? 1 : 0,
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              backgroundColor: "#FAF9F6",
              color: "#0B1736",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              padding: "6px 16px",
              borderRadius: "20px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            View Product
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 5h6M5 2l3 3-3 3" /></svg>
          </span>
        </div>

        {/* Color dots preview on hover (bottom right) */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(6px)",
            transition: "all 0.3s 0.05s ease",
          }}
        >
          {product.colors.slice(0, 3).map((color) => (
            <span
              key={color.name}
              title={color.name}
              style={{
                backgroundColor: color.hex,
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.7)",
                display: "block",
              }}
            />
          ))}
          {product.colors.length > 3 && (
            <span
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "6px",
                fontWeight: 700,
                color: "#374151",
              }}
            >
              +{product.colors.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <p
          style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700 }}
          className="mb-1"
        >
          {product.category}
        </p>
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#171717",
            fontSize: "0.95rem",
            fontWeight: 500,
            lineHeight: 1.3,
            transition: "color 0.2s",
          }}
          className="line-clamp-1 group-hover:text-[#0B1736]"
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <span
            style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontSize: "0.95rem", fontWeight: 700 }}
          >
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <span
              style={{ color: "#C0BDB8", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }}
              className="line-through"
            >
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Bottom row: color swatches + stock */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.name}
                title={color.name}
                style={{
                  backgroundColor: color.hex,
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "1.5px solid #E5E7EB",
                  display: "inline-block",
                  transition: "transform 0.15s",
                }}
                className="hover:scale-125"
              />
            ))}
            {product.colors.length > 4 && (
              <span style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", fontSize: "10px" }}>
                +{product.colors.length - 4}
              </span>
            )}
          </div>
          <StockBadge stock={stock} />
        </div>
      </div>
    </Link>
  );
}
