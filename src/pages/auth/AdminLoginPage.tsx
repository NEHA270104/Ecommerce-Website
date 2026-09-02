import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faSpinner,
  faArrowLeft,
  faShieldHalved,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../components/Logo";
import { apiFetch } from "../../lib/api.ts";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
    if (error) setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    const errMail = validateEmail(email);
    const errPass = !password ? "Password is required." : "";

    setEmailError(errMail);
    setPasswordError(errPass);

    if (errMail || errPass) {
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // Successful login: redirect to /admin (cookie is set by the server)
        navigate("/admin", { replace: true });
      } else {
        // Authentication failed: do not reveal which field was wrong
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("Unable to connect to server. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div className="w-full max-w-md">
        {/* Top brand header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="inline-block mb-4 transition-transform hover:scale-[1.02]">
            <Logo height={64} />
          </Link>

          <div
            style={{
              backgroundColor: "rgba(11,23,54,0.06)",
              border: "1px solid rgba(11,23,54,0.12)",
              borderRadius: "20px",
              padding: "4px 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "12px",
            }}
          >
            <FontAwesomeIcon icon={faShieldHalved} style={{ color: "#C99724", fontSize: "0.75rem" }} />
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#0B1736",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Management Portal
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#0B1736",
              fontSize: "1.875rem",
              fontWeight: 700,
            }}
          >
            Admin Login
          </h1>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "#6B7280",
              fontSize: "0.875rem",
            }}
            className="mt-1"
          >
            Sign in to access your e-commerce management dashboard.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(11,23,54,0.06)",
          }}
          className="p-7 sm:p-8"
        >
          {/* Error alert */}
          {error && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "10px",
              }}
              className="p-3.5 mb-5 flex items-start gap-3"
            >
              <FontAwesomeIcon
                icon={faCircleExclamation}
                style={{ color: "#DC2626", marginTop: "2px" }}
              />
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: "#B91C1C",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                }}
              >
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email input */}
            <div>
              <label
                htmlFor="admin-email"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: "#374151",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                }}
                className="block mb-1.5"
              >
                Admin Email <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "0.85rem" }} />
                </span>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.875rem",
                    borderColor: emailError ? "#EF4444" : "#E5E7EB",
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:border-[#C99724] transition-colors"
                />
              </div>
              {emailError && (
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#DC2626",
                    fontSize: "0.75rem",
                  }}
                  className="mt-1 font-medium"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Password input */}
            <div>
              <label
                htmlFor="admin-password"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: "#374151",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                }}
                className="block mb-1.5"
              >
                Password <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faLock} style={{ fontSize: "0.85rem" }} />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.875rem",
                    borderColor: passwordError ? "#EF4444" : "#E5E7EB",
                  }}
                  className="w-full pl-10 pr-11 py-2.5 bg-white border rounded-lg focus:outline-none focus:border-[#C99724] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ fontSize: "0.9rem" }} />
                </button>
              </div>
              {passwordError && (
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#DC2626",
                    fontSize: "0.75rem",
                  }}
                  className="mt-1 font-medium"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? "#4B5563" : "#0B1736",
                color: "#FAF9F6",
                fontFamily: "'Manrope', sans-serif",
                boxShadow: "0 2px 8px rgba(11,23,54,0.18)",
              }}
              className="w-full py-3 rounded-lg text-sm font-bold tracking-wide hover:bg-[#152459] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Log In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center">
            <Link
              to="/"
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "#6B7280",
                fontSize: "0.8rem",
                textDecoration: "none",
              }}
              className="hover:text-[#0B1736] flex items-center gap-1.5 transition-colors font-medium"
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "0.75rem" }} />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
