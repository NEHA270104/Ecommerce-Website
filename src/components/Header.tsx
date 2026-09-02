import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Link, useLocation, useNavigate } from "react-router-dom";
=======
import { Link, useLocation } from "react-router-dom";
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faShirt,
  faLayerGroup,
  faCircleInfo,
  faMagnifyingGlass,
  faUser,
  faBagShopping,
  faBars,
  faXmark,
  faRightToBracket,
<<<<<<< HEAD
  faStar,
=======
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
} from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AnnouncementBar from "./AnnouncementBar";

const navLinks = [
  { label: "Home", to: "/", icon: faHouse },
<<<<<<< HEAD
  { label: "Sarees", to: "/category/sarees", icon: faStar },
  { label: "Kurtis & Suits", to: "/category/kurtis", icon: faShirt },
  { label: "Shop All", to: "/shop", icon: faLayerGroup },
=======
  { label: "Shop", to: "/shop", icon: faShirt },
  { label: "Categories", to: "/categories", icon: faLayerGroup },
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
  { label: "About Us", to: "/about", icon: faCircleInfo },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

<<<<<<< HEAD
  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    if (to === "/shop") return location.pathname === "/shop";
    return location.pathname.startsWith(to);
  };
=======
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15

  return (
    <header className="sticky top-0 z-50 w-full">
      <AnnouncementBar />
      <div
        style={{
          backgroundColor: "#FAF9F6",
          borderBottom: "1px solid #E5E7EB",
          boxShadow: scrolled ? "0 1px 12px rgba(11,23,54,0.08)" : "none",
          transition: "box-shadow 0.25s",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Mobile: hamburger */}
            <button
              className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ color: "#0B1736" }}
            >
              <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} size="lg" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <Logo height={56} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: isActive(link.to) ? "#C99724" : "#374151",
                    fontSize: "0.875rem",
                    fontWeight: isActive(link.to) ? 700 : 500,
                    letterSpacing: "0.02em",
                    textDecoration: "none",
                    backgroundColor: isActive(link.to) ? "rgba(201,151,36,0.07)" : "transparent",
                    borderRadius: "8px",
                    padding: "7px 14px",
                    transition: "all 0.18s",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  className="hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={link.icon}
                    style={{ fontSize: "0.8rem", opacity: 0.85 }}
                  />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Action icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Search"
                style={{ color: searchOpen ? "#C99724" : "#374151" }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>

              {/* Account */}
              <Link
                to={isAuthenticated ? "/account" : "/auth/sign-in"}
                className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isAuthenticated ? "My Account" : "Sign In"}
                style={{ color: "#374151" }}
              >
                <FontAwesomeIcon icon={isAuthenticated ? faUser : faRightToBracket} />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Cart"
                style={{ color: "#374151" }}
              >
                <FontAwesomeIcon icon={faBagShopping} />
                {totalItems > 0 && (
                  <span
                    style={{
                      backgroundColor: "#C99724",
                      color: "#fff",
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "9px",
                      fontWeight: 800,
                      lineHeight: 1,
                      minWidth: "17px",
                      height: "17px",
                      borderRadius: "9px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 4px",
                    }}
                    className="absolute -top-0.5 -right-0.5"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

<<<<<<< HEAD
              {/* Login link */}
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ml-1 transition-colors hover:bg-gray-100"
                style={{ color: "#374151", fontFamily: "'Manrope', sans-serif", fontSize: "0.825rem", fontWeight: 600, textDecoration: "none" }}
              >
                Login
=======
              {/* Admin shortcut (desktop only) */}
              <Link
                to="/admin"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg ml-1 transition-colors hover:bg-gray-100"
                style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 600 }}
              >
                Admin
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
              </Link>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3 pt-2 border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
<<<<<<< HEAD
                    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                    setSearchQuery("");
=======
                    window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
                  }
                }}
                className="flex items-center gap-2 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#9CA3AF", fontSize: "0.8rem" }}
                  />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", paddingLeft: "36px" }}
                    className="w-full py-2 pr-4 text-sm border rounded-full focus:outline-none focus:border-[#C99724]"
                  />
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                  className="px-5 py-2 text-sm font-semibold rounded-full hover:bg-[#152459] transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ backgroundColor: "#FAF9F6", borderTop: "1px solid #E5E7EB" }} className="lg:hidden">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: isActive(link.to) ? "#C99724" : "#374151",
                    fontWeight: isActive(link.to) ? 700 : 500,
                    fontSize: "0.95rem",
                    borderBottom: "1px solid #F3F4F6",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 4px",
                    backgroundColor: isActive(link.to) ? "rgba(201,151,36,0.05)" : "transparent",
                    borderRadius: "4px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={link.icon}
                    style={{ width: "16px", color: isActive(link.to) ? "#C99724" : "#9CA3AF" }}
                  />
                  {link.label}
                </Link>
              ))}
              <Link
                to={isAuthenticated ? "/account" : "/auth/sign-in"}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 4px",
                  textDecoration: "none",
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                <FontAwesomeIcon
                  icon={isAuthenticated ? faUser : faRightToBracket}
                  style={{ width: "16px", color: "#9CA3AF" }}
                />
                {isAuthenticated ? "My Account" : "Sign In"}
              </Link>
              <Link
<<<<<<< HEAD
                to="/login"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: "0.95rem",
=======
                to="/admin"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: "#9CA3AF",
                  fontWeight: 500,
                  fontSize: "0.85rem",
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 4px",
                  textDecoration: "none",
                }}
              >
<<<<<<< HEAD
                <FontAwesomeIcon icon={faRightToBracket} style={{ width: "16px", color: "#9CA3AF" }} />
                Login
=======
                <FontAwesomeIcon icon={faLayerGroup} style={{ width: "16px" }} />
                Admin Panel
>>>>>>> 33e34ecccfadbe883a95e5eadb5e30279ace7d15
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
