import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link to="/"><Logo /></Link>
        </div>

        {sent ? (
          <div className="text-center">
            <div style={{ width: "60px", height: "60px", backgroundColor: "#D1FAE5", borderRadius: "50%" }} className="mx-auto flex items-center justify-center mb-5">
              <svg width="28" height="28" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M5 13l5 5L20 7" /></svg>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.5rem" }} className="font-semibold">Check your email</h2>
            <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm">
              If an account exists for <strong>{email}</strong>, you'll receive password reset instructions.
            </p>
            <Link
              to="/auth/sign-in"
              style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
              className="inline-block mt-6 px-8 py-3 rounded-full text-sm font-semibold"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.8rem" }} className="font-semibold">Forgot Password</h1>
            <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="mt-1 text-sm">
              Enter your email and we'll send you reset instructions.
            </p>

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
              <button
                type="submit"
                style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                className="w-full py-3 rounded-full text-sm font-bold hover:bg-[#152459] transition-colors"
              >
                Send Reset Instructions
              </button>
            </form>

            <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem" }} className="text-center mt-5">
              <Link to="/auth/sign-in" style={{ color: "#C99724", fontWeight: 600 }}>← Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
