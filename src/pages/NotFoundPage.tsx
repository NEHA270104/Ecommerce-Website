import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faShirt, faCircleInfo, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <main
      className="min-h-[75vh] flex items-center justify-center px-4 py-20"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "24px" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(6rem, 20vw, 10rem)",
              fontWeight: 700,
              color: "#0B1736",
              lineHeight: 1,
              display: "block",
              opacity: 0.07,
              userSelect: "none",
            }}
          >
            404
          </span>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#0B1736",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" fill="none" stroke="#C99724" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <circle cx="12" cy="16" r="0.8" fill="#C99724" />
              </svg>
            </div>
          </div>
        </div>

        <p
          style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.22em", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}
          className="mb-4"
        >
          Page Not Found
        </p>

        <h1
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0B1736", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", lineHeight: 1.15 }}
          className="font-semibold mb-4"
        >
          Oops! This page doesn't exist.
        </h1>

        <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", lineHeight: 1.7 }} className="text-sm mb-2">
          The page at <code style={{ backgroundColor: "#F3F4F6", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", color: "#374151" }}>{location.pathname}</code> could not be found.
        </p>
        <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", lineHeight: 1.7 }} className="text-sm mb-10">
          It may have been moved or the URL might be incorrect.
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link
            to="/"
            style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#152459] transition-colors"
          >
            <FontAwesomeIcon icon={faHouse} size="sm" />
            Go Home
          </Link>
          <Link
            to="/shop"
            style={{ border: "1.5px solid #0B1736", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faShirt} size="sm" />
            Shop Now
          </Link>
        </div>

        {/* Helper links */}
        <div className="flex flex-wrap justify-center gap-5">
          {[
            { to: "/about", icon: faCircleInfo, label: "About Us" },
            { to: "/contact", icon: faEnvelope, label: "Contact" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", fontSize: "0.82rem" }}
              className="inline-flex items-center gap-1.5 hover:text-[#C99724] transition-colors"
            >
              <FontAwesomeIcon icon={item.icon} size="sm" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
