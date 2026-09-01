import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      {/* Header */}
      <section style={{ backgroundColor: "#0B1736" }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "About Us" }]} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#FAF9F6", fontSize: "clamp(2rem, 4vw, 3rem)" }} className="font-semibold mt-5">
            About Vrishabhanvi Venture
          </h1>
          <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="mt-3 text-base max-w-xl">
            Your destination for stylish, comfortable, and quality fashion.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.25em" }} className="text-xs font-semibold uppercase mb-4">Who We Are</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "clamp(1.5rem, 3vw, 2rem)" }} className="font-semibold leading-tight">
              Fashion Made for Everyday Life
            </h2>
            <div style={{ width: "40px", height: "2px", backgroundColor: "#C99724" }} className="my-5" />
            <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.8 }} className="text-base">
              Welcome to Vrishabhanvi Venture, your destination for stylish, comfortable, and quality fashion.
            </p>
            <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.8 }} className="mt-4 text-base">
              Vrishabhanvi Venture is a clothing and fashion business based in Noida, Uttar Pradesh, focused on providing customers with fashionable clothing at a convenient and affordable price.
            </p>
            <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.8 }} className="mt-4 text-base">
              Our goal is to make online fashion shopping simple, reliable, and enjoyable. We carefully focus on product quality, style, customer service, and a smooth shopping experience.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-3 -right-3 w-2/3 h-2/3 rounded-2xl z-0" style={{ backgroundColor: "#F5EDD3" }} />
            <img
              src="https://images.unsplash.com/photo-1764740184986-ad5306463ae1?w=700&h=800&fit=crop&auto=format"
              alt="Vrishabhanvi Venture fashion"
              className="relative z-10 w-full rounded-2xl object-cover shadow-lg"
              style={{ maxHeight: "480px" }}
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.25em" }} className="text-xs font-semibold uppercase mb-3">Our Approach</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }} className="font-semibold">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Style",
                desc: "We curate pieces that reflect contemporary Indian fashion — modern, versatile, and beautiful. Style is not just about what you wear; it is how it makes you feel.",
                color: "#EFF6FF",
                accent: "#3B82F6",
              },
              {
                title: "Quality",
                desc: "Every piece in our collection is selected with careful attention to fabric quality, finish, and durability. We believe you deserve clothing that lasts.",
                color: "#F5F3FF",
                accent: "#7C3AED",
              },
              {
                title: "Affordability",
                desc: "Beautiful fashion should not come with an unnecessary price tag. We focus on delivering genuine value so that great style remains accessible.",
                color: "#ECFDF5",
                accent: "#059669",
              },
              {
                title: "Customer Experience",
                desc: "A smooth, simple and trustworthy shopping experience matters to us. From browsing to delivery, we are here to make every step easy.",
                color: "#FFFBEB",
                accent: "#D97706",
              },
            ].map((item) => (
              <div key={item.title} style={{ backgroundColor: item.color, borderRadius: "16px" }} className="p-6">
                <div
                  style={{ width: "40px", height: "40px", backgroundColor: item.accent, borderRadius: "10px", opacity: 0.15 }}
                  className="mb-4"
                />
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.2rem" }} className="font-semibold mb-2">
                  {item.title}
                </h3>
                <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem", lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div style={{ backgroundColor: "#0B1736", borderRadius: "24px" }} className="p-10 text-center">
          <p style={{ color: "#E6C76A", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.25em" }} className="text-xs font-semibold uppercase mb-4">Based In</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#FAF9F6", fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }} className="font-semibold">
            Noida, Uttar Pradesh, India
          </h2>
          <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="mt-3 text-base max-w-lg mx-auto">
            We are proud to be a homegrown Indian fashion brand serving customers across the country.
          </p>
          <p style={{ color: "#E6C76A", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic" }} className="mt-6">
            "Your Style, Our Commitment."
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
            <Link
              to="/shop"
              style={{ backgroundColor: "#C99724", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
              className="px-8 py-3 rounded-full text-sm font-bold hover:bg-[#E6C76A] transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              to="/contact"
              style={{ border: "1.5px solid rgba(230,199,106,0.4)", color: "#E6C76A", fontFamily: "'Manrope', sans-serif" }}
              className="px-8 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
