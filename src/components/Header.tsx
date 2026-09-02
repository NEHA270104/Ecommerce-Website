import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  faStar,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import AnnouncementBar from "./AnnouncementBar";

const navLinks = [
  { label: "Home", to: "/", icon: faHouse },
  { label: "Sarees", to: "/category/sarees", icon: faStar },
  { label: "Kurtis & Suits", to: "/category/kurtis", icon: faShirt },
  { label: "Shop All", to: "/shop", icon: faLayerGroup },
  { label: "About Us", to: "/about", icon: faCircleInfo },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    if (to === "/shop") return location.pathname === "/shop";
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <AnnouncementBar />
      <div
        style={{
          backgroundColor: "#FAF9F6",
          borderBottom: "1px solid #E5E7EB",
          boxShadow: scrolled ? "0 4px 20px rgba(11,23,54,0.08)" : "none",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
                style={{ color: "#0B1736" }}
              >
                <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="text-xl" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Logo height={56} />
              </Link>
            </div>

            {/* Desktop Navigation */}
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

            {/* Action icons (Clean single set) */}
            <div className="flex items-center gap-1.5">
              {/* 1. Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Search"
                style={{ color: searchOpen ? "#C99724" : "#374151" }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>

              {/* 2. Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Wishlist"
                style={{ color: "#374151" }}
              >
                <FontAwesomeIcon icon={faHeart} />
                {totalWishlist > 0 && (
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
                    {totalWishlist > 9 ? "9+" : totalWishlist}
                  </span>
                )}
              </Link>

              {/* 3. Cart */}
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

              {/* 4. Single Login / Account Action */}
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ml-1 transition-colors hover:bg-gray-100"
                style={{
                  color: "#374151",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <FontAwesomeIcon
                  icon={isAuthenticated ? faUser : faRightToBracket}
                  style={{ fontSize: "0.8rem", color: isAuthenticated ? "#C99724" : "#6B7280" }}
                />
                <span>{isAuthenticated ? "Account" : "Login"}</span>
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
                    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                    setSearchQuery("");
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
                to="/wishlist"
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
                <FontAwesomeIcon icon={faHeart} style={{ width: "16px", color: "#9CA3AF" }} />
                Wishlist {totalWishlist > 0 && `(${totalWishlist})`}
              </Link>
              <Link
                to={isAuthenticated ? "/account" : "/login"}
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
                }}
              >
                <FontAwesomeIcon
                  icon={isAuthenticated ? faUser : faRightToBracket}
                  style={{ width: "16px", color: "#9CA3AF" }}
                />
                {isAuthenticated ? "My Account" : "Login / Sign Up"}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
