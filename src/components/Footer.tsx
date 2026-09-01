import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faShieldHalved, faTruck, faHeadset } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0B1736", color: "#FAF9F6" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo variant="full" onDark height={52} />
            <p
              style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }}
              className="mt-4 text-sm leading-relaxed"
            >
              Your Style, Our Commitment.
            </p>
            <p
              style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }}
              className="mt-2 text-xs leading-relaxed"
            >
              Stylish, comfortable and quality-focused fashion made for everyday confidence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{ fontFamily: "'Manrope', sans-serif", color: "#E6C76A" }}
              className="text-xs font-semibold tracking-widest uppercase mb-4"
            >
              Navigation
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/shop" },
                { label: "Categories", to: "/categories" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Return & Refund Policy", to: "/returns" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif" }}
                  className="text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Support */}
          <div>
            <h4
              style={{ fontFamily: "'Manrope', sans-serif", color: "#E6C76A" }}
              className="text-xs font-semibold tracking-widest uppercase mb-4"
            >
              Customer Support
            </h4>
            <div className="flex flex-col gap-3">
              <div>
                <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="text-xs uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                <a
                  href="tel:7753034659"
                  style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif" }}
                  className="text-sm hover:text-white"
                >
                  7753034659
                </a>
              </div>
              <div>
                <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="text-xs uppercase tracking-wider mb-1">Email</p>
                <Link
                  to="/contact"
                  style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif" }}
                  className="text-sm hover:text-white"
                >
                  Contact us via form
                </Link>
              </div>
              <div>
                <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="text-xs uppercase tracking-wider mb-1">Location</p>
                <p style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif" }} className="text-sm">
                  Noida, Uttar Pradesh, India
                </p>
              </div>
            </div>
          </div>

          {/* Trust */}
          <div>
            <h4
              style={{ fontFamily: "'Manrope', sans-serif", color: "#E6C76A" }}
              className="text-xs font-semibold tracking-widest uppercase mb-4"
            >
              Shop With Confidence
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: faRotateLeft, text: "7-Day Return Policy" },
                { icon: faShieldHalved, text: "Secure Checkout" },
                { icon: faTruck, text: "Delivery Across India" },
                { icon: faHeadset, text: "Responsive Support" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <FontAwesomeIcon icon={item.icon} style={{ color: "#C99724", width: "14px" }} />
                  <span style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif" }} className="text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-xs">
            © 2026 Vrishabhanvi Venture. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/returns" style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-xs hover:text-gray-400">
              Return Policy
            </Link>
            <span style={{ color: "#374151" }}>·</span>
            <Link to="/contact" style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-xs hover:text-gray-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
