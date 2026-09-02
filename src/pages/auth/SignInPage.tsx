import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = signIn(email, password);
    if (success) {
      navigate("/account");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: "#FAF9F6" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-10" style={{ backgroundColor: "#0B1736" }}>
        <Link to="/">
          <Logo variant="full" onDark height={56} />
        </Link>
        <div>
          <img
            src="https://images.unsplash.com/photo-1708534246051-7f47b279e94b?w=600&h=700&fit=crop&auto=format"
            alt="Fashion"
            className="w-full rounded-2xl object-cover"
            style={{ maxHeight: "400px" }}
          />
          <p style={{ color: "#9CA3AF", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.1rem" }} className="mt-6">
            "Style that feels like you."
          </p>
          <p style={{ color: "#E6C76A", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }} className="mt-2">
            — Vrishabhanvi Venture
          </p>
        </div>
        <p style={{ color: "#374151", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}>
          © 2026 Vrishabhanvi Venture
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/"><Logo /></Link>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.8rem" }} className="font-semibold">
            Welcome back
          </h1>
          <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="mt-1 text-sm">
            Sign in to your account to continue.
          </p>

          {error && (
            <div style={{ backgroundColor: "#FEE2E2", borderRadius: "8px", border: "1px solid #FCA5A5" }} className="mt-4 p-3">
              <p style={{ color: "#DC2626", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">
                Email <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
              />
            </div>
            <div>
              <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">
                Password <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
              />
            </div>
            <div className="flex items-center justify-end">
              <Link to="/auth/forgot-password" style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }}>
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
              className="w-full py-3 rounded-full text-sm font-bold hover:bg-[#152459] transition-colors"
            >
              Sign In
            </button>
          </form>

          <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem" }} className="text-center mt-5">
            Don't have an account?{" "}
            <Link to="/auth/sign-up" style={{ color: "#C99724", fontWeight: 600 }}>Create Account</Link>
          </p>
          <div className="text-center mt-3">
            <Link to="/shop" style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
