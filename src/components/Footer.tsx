import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
<<<<<<< HEAD
import {
  faRotateLeft, faShieldHalved, faTruck, faHeadset,
  faPhone, faEnvelope, faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram, faFacebook, faWhatsapp, faYoutube,
} from "@fortawesome/free-brands-svg-icons";
=======
import { faRotateLeft, faShieldHalved, faTruck, faHeadset } from "@fortawesome/free-solid-svg-icons";
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0B1736", color: "#FAF9F6" }}>
<<<<<<< HEAD
      {/* Trust strip */}
      <div style={{ backgroundColor: "#081229", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {[
              { icon: faTruck, title: "Free Delivery", sub: "On orders above ₹999" },
              { icon: faRotateLeft, title: "7-Day Returns", sub: "Easy return on eligible items" },
              { icon: faShieldHalved, title: "Secure Checkout", sub: "100% safe & encrypted" },
              { icon: faHeadset, title: "Customer Support", sub: "Call or WhatsApp us" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 py-5 px-6">
                <FontAwesomeIcon icon={item.icon} style={{ color: "#C99724", fontSize: "1.25rem", flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#FAF9F6", fontWeight: 700, fontSize: "0.8rem" }}>{item.title}</p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.7rem" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo variant="full" onDark height={52} />
            <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", lineHeight: 1.75 }} className="mt-4">
              Vrishabhanvi Venture — your trusted destination for premium Indian ethnic wear. Sarees, Kurtis, Suits and more, curated for the modern Indian woman.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: faInstagram, href: "https://instagram.com", label: "Instagram" },
                { icon: faFacebook, href: "https://facebook.com", label: "Facebook" },
                { icon: faWhatsapp, href: "https://wa.me/917753034659", label: "WhatsApp" },
                { icon: faYoutube, href: "https://youtube.com", label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: "36px", height: "36px",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#9CA3AF",
                    transition: "all 0.2s",
                    textDecoration: "none",
                  }}
                  className="hover:bg-[#C99724] hover:text-white"
                >
                  <FontAwesomeIcon icon={s.icon} style={{ fontSize: "0.9rem" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h4 style={{ fontFamily: "'Manrope', sans-serif", color: "#E6C76A", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }} className="mb-4">
              Shop
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: "All Products", to: "/shop" },
                { label: "Sarees", to: "/category/sarees" },
                { label: "Silk Sarees", to: "/category/silk-sarees" },
                { label: "Cotton Sarees", to: "/category/cotton-sarees" },
                { label: "Party Sarees", to: "/category/party-sarees" },
                { label: "Kurtis & Suits", to: "/category/kurtis" },
                { label: "Anarkali Kurtis", to: "/category/anarkali-kurtis" },
                { label: "Salwar Suits", to: "/category/salwar-suits" },
                { label: "Accessories", to: "/category/accessories" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif", fontSize: "0.83rem", textDecoration: "none", transition: "color 0.15s" }}
                  className="hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company column */}
          <div>
            <h4 style={{ fontFamily: "'Manrope', sans-serif", color: "#E6C76A", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }} className="mb-4">
              Company
=======
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
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Home", to: "/" },
<<<<<<< HEAD
                { label: "About Us", to: "/about" },
                { label: "Contact Us", to: "/contact" },
                { label: "Return & Refund Policy", to: "/returns" },
                { label: "My Account", to: "/account" },
                { label: "Track Order", to: "/account" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif", fontSize: "0.83rem", textDecoration: "none", transition: "color 0.15s" }}
                  className="hover:text-white"
=======
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
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

<<<<<<< HEAD
          {/* Contact column */}
          <div>
            <h4 style={{ fontFamily: "'Manrope', sans-serif", color: "#E6C76A", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }} className="mb-4">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="tel:7753034659"
                style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif", fontSize: "0.83rem", textDecoration: "none", display: "flex", alignItems: "flex-start", gap: "10px" }}
                className="hover:text-white"
              >
                <FontAwesomeIcon icon={faPhone} style={{ color: "#C99724", marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <p style={{ color: "#9CA3AF", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Phone / WhatsApp</p>
                  <span>+91 77530 34659</span>
                </div>
              </a>
              <a
                href="mailto:vrishabhanviVentures@gmail.com"
                style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif", fontSize: "0.83rem", textDecoration: "none", display: "flex", alignItems: "flex-start", gap: "10px" }}
                className="hover:text-white"
              >
                <FontAwesomeIcon icon={faEnvelope} style={{ color: "#C99724", marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <p style={{ color: "#9CA3AF", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Email</p>
                  <span style={{ wordBreak: "break-all" }}>vrishabhanviVentures@gmail.com</span>
                </div>
              </a>
              <div style={{ color: "#D1D5DB", fontFamily: "'Manrope', sans-serif", fontSize: "0.83rem", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ color: "#C99724", marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <p style={{ color: "#9CA3AF", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>Location</p>
                  <span>Noida, Uttar Pradesh, India</span>
                </div>
              </div>
=======
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
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}>
            © 2026 Vrishabhanvi Venture. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[
              { label: "Return Policy", to: "/returns" },
              { label: "Contact", to: "/contact" },
              { label: "About", to: "/about" },
            ].map((l) => (
              <Link key={l.label} to={l.to} style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", textDecoration: "none" }} className="hover:text-gray-400">
                {l.label}
              </Link>
            ))}
=======
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
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
          </div>
        </div>
      </div>
    </footer>
  );
}
