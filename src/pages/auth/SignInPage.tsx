import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faEye,
  faEyeSlash,
  faCircleExclamation,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";
import { apiFetch } from "../../lib/api";

interface AuthProps {
  initialMode?: "login" | "signup";
}

export default function SignInPage({ initialMode = "login" }: AuthProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup states
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = loginEmail.trim();
    if (!cleanEmail || !loginPassword) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    // 1. Attempt Admin Login via Render backend API
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: cleanEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setLoading(false);
        navigate("/admin", { replace: true });
        return;
      }
    } catch {
      // Backend not reached or not admin, proceed to customer check
    }

    // 2. Attempt Customer Login
    const result = signIn(cleanEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      navigate(redirectUrl, { replace: true });
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !signupEmail.trim() || !signupPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = signUp(name, signupEmail, signupPassword);
    setLoading(false);

    if (result.success) {
      navigate(redirectUrl, { replace: true });
    } else {
      setError(result.error || "Failed to create account.");
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    setError("");
    setShowPassword(false);
    setMode(newMode);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="inline-block mb-4 transition-transform hover:scale-[1.02]">
            <Logo height={64} />
          </Link>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#0B1736",
              fontSize: "1.875rem",
              fontWeight: 700,
            }}
          >
            {mode === "login" ? "Login" : "Create Account"}
          </h1>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "#6B7280",
              fontSize: "0.875rem",
            }}
            className="mt-1"
          >
            {mode === "login"
              ? "Sign in to your Vrishabhanvi Ventures account to continue."
              : "Join Vrishabhanvi Ventures for a seamless shopping experience."}
          </p>
        </div>

        {/* Common Auth Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(11,23,54,0.06)",
          }}
          className="p-7 sm:p-8"
        >
          {/* Error Message */}
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

          {/* ── State 1: Login Form ── */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#374151",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                  }}
                  className="block mb-1.5"
                >
                  Email <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "0.85rem" }} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your email"
                    required
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "0.875rem",
                      borderColor: "#E5E7EB",
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:border-[#C99724] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
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
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your password"
                    required
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "0.875rem",
                      borderColor: "#E5E7EB",
                    }}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border rounded-lg focus:outline-none focus:border-[#C99724] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ fontSize: "0.85rem" }} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end pt-1">
                <Link
                  to="/auth/forgot-password"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#C99724",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                  className="hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#0B1736",
                  color: "#FAF9F6",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  borderRadius: "8px",
                }}
                className="w-full py-3 hover:bg-[#152459] transition-colors font-bold mt-2"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          ) : (
            /* ── State 2: Signup Form ── */
            <form onSubmit={handleSignupSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#374151",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                  }}
                  className="block mb-1.5"
                >
                  Full Name <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: "0.85rem" }} />
                  </span>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your full name"
                    required
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "0.875rem",
                      borderColor: "#E5E7EB",
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:border-[#C99724] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#374151",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                  }}
                  className="block mb-1.5"
                >
                  Email <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "0.85rem" }} />
                  </span>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your email"
                    required
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "0.875rem",
                      borderColor: "#E5E7EB",
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:border-[#C99724] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-password"
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
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Minimum 6 characters"
                    required
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "0.875rem",
                      borderColor: "#E5E7EB",
                    }}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border rounded-lg focus:outline-none focus:border-[#C99724] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ fontSize: "0.85rem" }} />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-confirm"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#374151",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                  }}
                  className="block mb-1.5"
                >
                  Confirm Password <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <FontAwesomeIcon icon={faLock} style={{ fontSize: "0.85rem" }} />
                  </span>
                  <input
                    id="signup-confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Re-enter your password"
                    required
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: "0.875rem",
                      borderColor: "#E5E7EB",
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:border-[#C99724] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#0B1736",
                  color: "#FAF9F6",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  borderRadius: "8px",
                }}
                className="w-full py-3 hover:bg-[#152459] transition-colors font-bold mt-2"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          )}

          {/* Bottom Switcher */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            {mode === "login" ? (
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: "#6B7280",
                  fontSize: "0.875rem",
                }}
              >
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  style={{
                    color: "#C99724",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  className="hover:underline font-bold"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: "#6B7280",
                  fontSize: "0.875rem",
                }}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  style={{
                    color: "#C99724",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  className="hover:underline font-bold"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "#6B7280",
              fontSize: "0.825rem",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
            className="hover:text-[#0B1736] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "0.75rem" }} />
            Back to Storefront
          </Link>
        </div>
      </div>
    </main>
  );
}
