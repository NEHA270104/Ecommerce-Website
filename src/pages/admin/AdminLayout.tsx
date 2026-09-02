import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faClipboardList,
  faBoxOpen,
  faLayerGroup,
  faWarehouse,
  faUsers,
  faArrowUpRightFromSquare,
  faBars,
  faXmark,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import logoImg from "../../imports/WhatsApp_Image_2026-08-20_at_10.12.44_AM.jpeg";

const navItems = [
  { to: "/admin", label: "Dashboard", exact: true, icon: faGauge },
  { to: "/admin/orders", label: "Orders", icon: faClipboardList },
  { to: "/admin/products", label: "Products", icon: faBoxOpen },
  { to: "/admin/categories", label: "Categories", icon: faLayerGroup },
  { to: "/admin/inventory", label: "Inventory", icon: faWarehouse },
  { to: "/admin/customers", label: "Customers", icon: faUsers },
];

const SIDEBAR_W = 240;

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Continue navigation even if network fails
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const isActive = (to: string, exact = false) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const currentLabel = navItems.find((n) => isActive(n.to, n.exact))?.label ?? "Admin";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F7F7F8" }}>

      {/* Sidebar */}
      <aside
        style={{
          width: `${SIDEBAR_W}px`,
          backgroundColor: "#0B1736",
          flexShrink: 0,
          position: "fixed",
          top: 0,
          bottom: 0,
          zIndex: 40,
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        className={`lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo block */}
        <div
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 16px 16px" }}
          className="flex flex-col items-center"
        >
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            style={{ display: "block", textDecoration: "none" }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                padding: "10px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <img
                src={logoImg}
                alt="Vrishabhanvi Ventures"
                style={{
                  width: "110px",
                  height: "110px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </Link>
          <div
            style={{
              marginTop: "10px",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "rgba(201,151,36,0.12)",
              border: "1px solid rgba(201,151,36,0.3)",
              borderRadius: "20px",
              padding: "3px 10px",
            }}
          >
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#E6C76A",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3" style={{ paddingTop: "8px" }}>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "10px 12px 6px",
            }}
          >
            Menu
          </p>
          <div className="space-y-0.5">
            {navItems.map(({ to, label, icon, exact }) => {
              const active = isActive(to, exact);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#E6C76A" : "#9CA3AF",
                    backgroundColor: active ? "rgba(230,199,106,0.1)" : "transparent",
                    borderLeft: active ? "3px solid #C99724" : "3px solid transparent",
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                  className={active ? "" : "hover:bg-white/5 hover:text-gray-200"}
                >
                  <FontAwesomeIcon icon={icon} style={{ width: "15px", flexShrink: 0, opacity: active ? 1 : 0.7 }} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom links */}
        <div className="p-3 pt-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "8px",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.8rem",
              color: "#6B7280",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            className="hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ width: "13px", opacity: 0.7 }} />
            View Storefront
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "8px",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.8rem",
              color: "#6B7280",
              background: "none",
              border: "none",
              cursor: loggingOut ? "not-allowed" : "pointer",
              width: "100%",
              textAlign: "left",
              transition: "color 0.15s",
            }}
            className="hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faRightFromBracket} style={{ width: "13px", opacity: 0.7 }} />
            {loggingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area — offset by sidebar width on large screens */}
      <div
        className="flex-1 flex flex-col min-w-0 lg:ml-[240px]"
      >
        {/* Top header */}
        <header
          style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #E5E7EB",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
          className="flex items-center justify-between px-5 py-3 gap-4"
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: "#374151" }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.8rem" }}>
                Admin
              </span>
              <span style={{ color: "#D1D5DB" }}>/</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", color: "#171717", fontSize: "0.875rem", fontWeight: 600 }}>
                {currentLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#6B7280",
                fontSize: "0.78rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #E5E7EB",
                transition: "all 0.15s",
              }}
              className="hidden sm:flex hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: "0.7rem" }} />
              Storefront
            </Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 10px 4px 4px",
                borderRadius: "24px",
                backgroundColor: "#F3F4F6",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "#0B1736",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#E6C76A", fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", fontWeight: 700 }}>
                  A
                </span>
              </div>
              <span style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.78rem", fontWeight: 500 }} className="hidden sm:block">
                Admin
              </span>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#6B7280",
                fontSize: "0.78rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#fff",
                cursor: loggingOut ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
              className="hover:bg-gray-50 hover:text-red-600"
              title="Sign Out"
            >
              <FontAwesomeIcon icon={faRightFromBracket} style={{ fontSize: "0.75rem" }} />
              <span className="hidden sm:inline">{loggingOut ? "Signing Out..." : "Sign Out"}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
