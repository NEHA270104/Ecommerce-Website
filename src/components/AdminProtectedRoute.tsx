import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import { apiFetch } from "../lib/api.ts";

export default function AdminProtectedRoute({ children }: { children?: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      try {
        const res = await apiFetch("/api/auth/me", {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (isMounted && data.authenticated && data.user?.role === "admin") {
            setAuthorized(true);
          } else if (isMounted) {
            setAuthorized(false);
          }
        } else if (isMounted) {
          setAuthorized(false);
        }
      } catch {
        if (isMounted) {
          setAuthorized(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: "#FAF9F6" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Logo height={56} />
          <div className="flex items-center gap-2 mt-2" style={{ color: "#0B1736" }}>
            <FontAwesomeIcon icon={faSpinner} spin className="text-[#C99724]" />
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Verifying admin credentials...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
