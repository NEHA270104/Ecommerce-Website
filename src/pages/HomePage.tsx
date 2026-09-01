import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLiveFeatured, useCategoryTree } from "../context/StoreContext";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const HERO_SLIDES = [
  {
    id: 0,
    image: "https://images.unsplash.com/photo-1597983073540-684a10b15ab1?w=1600&h=900&fit=crop&auto=format&q=90",
    tag: "New Collection 2026",
    headline: ["Style That Feels", "Like You."],
    sub: "Discover stylish, comfortable and quality-focused fashion made for everyday confidence.",
    cta: "Shop Collection",
    ctaLink: "/shop",
    accent: "#E6C76A",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&h=900&fit=crop&auto=format&q=90",
    tag: "Ethnic Elegance",
    headline: ["Grace for Every", "Occasion."],
    sub: "Festive-ready designs that celebrate the modern Indian woman.",
    cta: "Explore Dresses",
    ctaLink: "/category/dresses",
    accent: "#E6C76A",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1764740184986-ad5306463ae1?w=1600&h=900&fit=crop&auto=format&q=90",
    tag: "Everyday Comfort",
    headline: ["Effortless Style,", "Every Day."],
    sub: "Kurtis and tops designed for comfort, confidence, and everyday wear.",
    cta: "Shop Tops & Kurtis",
    ctaLink: "/category/tops-kurtis",
    accent: "#E6C76A",
  },
];

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    if (animating || idx === active) return;
    setAnimating(true);
    setActive(idx);
    setTimeout(() => setAnimating(false), 700);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((active + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active]);

  const slide = HERO_SLIDES[active];

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0B1736", minHeight: "92vh" }}>
      {/* Background images with crossfade */}
      {HERO_SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : 0,
            transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 0,
          }}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
            style={{ display: "block" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(110deg, rgba(11,23,54,0.93) 0%, rgba(11,23,54,0.75) 45%, rgba(11,23,54,0.3) 100%)",
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-full flex items-center" style={{ minHeight: "92vh" }}>
        <div className="max-w-2xl py-24">
          <div
            key={`tag-${active}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(10px)" : "translateY(0)",
              transition: "opacity 0.5s 0.1s, transform 0.5s 0.1s",
            }}
          >
            <div style={{ width: "28px", height: "1.5px", backgroundColor: "#C99724" }} />
            <span style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              {slide.tag}
            </span>
          </div>

          <h1
            key={`h-${active}`}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#FAF9F6",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 1.05,
              fontWeight: 600,
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(18px)" : "translateY(0)",
              transition: "opacity 0.6s 0.15s, transform 0.6s 0.15s",
            }}
          >
            {slide.headline[0]}<br />
            <em style={{ color: "#E6C76A", fontStyle: "italic" }}>{slide.headline[1]}</em>
          </h1>

          <p
            key={`sub-${active}`}
            style={{
              color: "#CBD5E1",
              fontFamily: "'Manrope', sans-serif",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              marginTop: "20px",
              maxWidth: "430px",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(14px)" : "translateY(0)",
              transition: "opacity 0.6s 0.25s, transform 0.6s 0.25s",
            }}
          >
            {slide.sub}
          </p>

          <div
            key={`cta-${active}`}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "36px",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(10px)" : "translateY(0)",
              transition: "opacity 0.6s 0.35s, transform 0.6s 0.35s",
            }}
          >
            <Link
              to={slide.ctaLink}
              style={{ backgroundColor: "#C99724", color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem" }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold tracking-wide hover:bg-[#E6C76A] transition-colors"
            >
              {slide.cta}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
            </Link>
            <Link
              to="/categories"
              style={{ border: "1.5px solid rgba(230,199,106,0.45)", color: "#E6C76A", fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem" }}
              className="inline-flex items-center px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Explore Categories
            </Link>
          </div>

          {/* Slide dots */}
          <div className="flex items-center gap-2 mt-12">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: i === active ? "#C99724" : "rgba(255,255,255,0.25)",
                  width: i === active ? "32px" : "14px",
                  transition: "all 0.4s ease",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1.5">
        <span style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em" }}>SCROLL</span>
        <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, rgba(201,151,36,0.8), transparent)" }} />
      </div>
    </section>
  );
}

// Marquee trust strip
function TrustStrip() {
  const items = [
    "7-Day Returns",
    "Quality Focused",
    "Affordable Fashion",
    "Free Delivery Available",
    "Noida, Uttar Pradesh",
    "Cash on Delivery",
    "Modern Indian Style",
  ];
  return (
    <div style={{ backgroundColor: "#C99724", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)" }} className="py-2.5">
      <div
        style={{
          display: "flex",
          gap: "0",
          animation: "marquee 28s linear infinite",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "0 40px" }}
          >
            {item}
            <span style={{ marginLeft: "40px", color: "rgba(11,23,54,0.4)" }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

export default function HomePage() {
  const featured = useLiveFeatured();
  const categoryTree = useCategoryTree(); // live from StoreContext
  return (
    <main>
      <HeroCarousel />
      <TrustStrip />

      {/* CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.25em" }} className="text-xs font-semibold uppercase mb-3">Browse</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0B1736", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }} className="font-semibold">
              Explore Our Collection
            </h2>
            <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm">
              Find styles made for every mood and moment.
            </p>
          </div>
          <Link
            to="/categories"
            style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", borderBottom: "1px solid #C99724" }}
            className="text-sm font-semibold pb-0.5 hidden sm:block"
          >
            All Categories
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          {categoryTree.map((cat, i) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative overflow-hidden"
              style={{
                aspectRatio: i === 0 ? "2/3" : "3/4",
                borderRadius: "16px",
                backgroundColor: "#E5E7EB",
                textDecoration: "none",
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                style={{ display: "block" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(11,23,54,0.88) 28%, rgba(11,23,54,0.2) 65%, transparent 100%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FAF9F6", fontSize: "1.05rem", lineHeight: 1.2 }}
                  className="font-semibold"
                >
                  {cat.name}
                </h3>
                <p style={{ color: "#CBD5E1", fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem", marginTop: "3px", lineHeight: 1.4 }} className="line-clamp-2">
                  {cat.description}
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "8px",
                    color: "#E6C76A",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    transform: "translateX(-4px)",
                    opacity: 0,
                    transition: "all 0.3s ease",
                  }}
                  className="group-hover:opacity-100 group-hover:translate-x-0"
                >
                  EXPLORE →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ backgroundColor: "#F7F5F2" }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.25em" }} className="text-xs font-semibold uppercase mb-3">Handpicked</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0B1736", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }} className="font-semibold">
                Featured Styles
              </h2>
            </div>
            <Link
              to="/shop"
              style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", borderBottom: "1px solid #C99724" }}
              className="text-sm font-semibold pb-0.5 hidden sm:block"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              style={{ border: "1.5px solid #0B1736", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
              className="inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-sm font-semibold hover:bg-[#0B1736] hover:text-white transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL SPLIT — Brand Story */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
          {/* Image */}
          <div className="relative overflow-hidden" style={{ minHeight: "480px" }}>
            <img
              src="https://images.unsplash.com/photo-1787295779676-181b3d5b55dd?w=900&h=700&fit=crop&auto=format&q=90"
              alt="Vrishabhanvi Venture brand story"
              className="w-full h-full object-cover"
              style={{ position: "absolute", inset: 0 }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, transparent 60%, #FAF9F6 100%)" }}
            />
          </div>

          {/* Text */}
          <div
            style={{ backgroundColor: "#FAF9F6" }}
            className="flex items-center"
          >
            <div className="px-10 lg:px-14 py-16 lg:py-24 max-w-lg">
              <p style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.25em" }} className="text-xs font-semibold uppercase mb-5">Our Story</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0B1736", fontSize: "clamp(2rem, 3vw, 2.8rem)", lineHeight: 1.1 }} className="font-semibold">
                Fashion Made<br /><em style={{ color: "#C99724" }}>Simple.</em>
              </h2>
              <div style={{ width: "40px", height: "2px", backgroundColor: "#C99724" }} className="my-6" />
              <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.85, fontSize: "0.95rem" }}>
                At Vrishabhanvi Venture, we believe shopping for fashion should be simple, reliable and enjoyable. We focus on style, comfort, quality and affordability so you can find pieces that fit naturally into your everyday life.
              </p>
              <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", lineHeight: 1.85, fontSize: "0.875rem" }} className="mt-4">
                Based in Noida, Uttar Pradesh — bringing you carefully selected styles that celebrate the modern Indian woman.
              </p>
              <div className="flex items-center gap-6 mt-8">
                <Link
                  to="/about"
                  style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#152459] transition-colors"
                >
                  Our Story
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4" /></svg>
                </Link>
                <div className="text-center">
                  <p style={{ color: "#0B1736", fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700 }}>7</p>
                  <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ backgroundColor: "#0B1736" }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", letterSpacing: "0.25em" }} className="text-xs font-semibold uppercase mb-3">Our Promise</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FAF9F6", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }} className="font-semibold">
              Why Choose Vrishabhanvi Venture?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: <svg width="26" height="26" fill="none" stroke="#C99724" strokeWidth="1.6" strokeLinecap="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" /><path d="M8 12l3 3 5-5" /></svg>,
                title: "Stylish & Fashionable",
                desc: "Styles designed for modern everyday fashion.",
              },
              {
                icon: <svg width="26" height="26" fill="none" stroke="#C99724" strokeWidth="1.6" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
                title: "Quality Focused",
                desc: "We carefully focus on product quality and presentation.",
              },
              {
                icon: <svg width="26" height="26" fill="none" stroke="#C99724" strokeWidth="1.6" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
                title: "Affordable Pricing",
                desc: "Fashion that offers value without unnecessary markup.",
              },
              {
                icon: <svg width="26" height="26" fill="none" stroke="#C99724" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
                title: "Convenient Shopping",
                desc: "Simple online shopping from browsing to checkout.",
              },
              {
                icon: <svg width="26" height="26" fill="none" stroke="#C99724" strokeWidth="1.6" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
                title: "Customer Focused",
                desc: "Support when you need us.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="group flex flex-col items-center text-center gap-4 p-6 rounded-2xl transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  style={{ width: "60px", height: "60px", backgroundColor: "rgba(201,151,36,0.1)", borderRadius: "16px", transition: "background 0.3s" }}
                  className="flex items-center justify-center group-hover:bg-[rgba(201,151,36,0.2)]"
                >
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#FAF9F6", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.01em" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", fontSize: "0.78rem", lineHeight: 1.65, marginTop: "6px" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STARTING PRICES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Kurtis from", price: 799, to: "/category/tops-kurtis" },
              { label: "Dresses from", price: 1499, to: "/category/dresses" },
              { label: "Bottom Wear from", price: 999, to: "/category/bottom-wear" },
              { label: "Accessories from", price: 449, to: "/category/accessories" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  backgroundColor: "#FAF9F6",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px",
                  textDecoration: "none",
                  transition: "all 0.25s",
                }}
                className="flex flex-col items-center justify-center py-8 px-4 text-center hover:border-[#C99724] hover:shadow-md group"
              >
                <span style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.label}</span>
                <span
                  style={{ color: "#0B1736", fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 700, marginTop: "4px", transition: "color 0.2s" }}
                  className="group-hover:text-[#C99724]"
                >
                  {formatINR(item.price)}
                </span>
                <span style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", fontWeight: 600, marginTop: "8px", opacity: 0, transition: "opacity 0.2s" }} className="group-hover:opacity-100">
                  Shop Now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section style={{ backgroundColor: "#F5EDD3" }} className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div
            style={{ width: "56px", height: "56px", backgroundColor: "#0B1736", borderRadius: "50%" }}
            className="mx-auto flex items-center justify-center mb-5"
          >
            <svg width="26" height="26" fill="none" stroke="#C99724" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0B1736", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }} className="font-semibold">
            Shop With Confidence
          </h2>
          <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif" }} className="mt-3 text-base leading-relaxed">
            7-day return policy available on eligible products. We stand behind every item we sell — quality and trust, always.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Link
              to="/returns"
              style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#152459] transition-colors"
            >
              View Return Policy
            </Link>
            <Link
              to="/contact"
              style={{ border: "1.5px solid #0B1736", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
              className="inline-block px-7 py-3 rounded-full text-sm font-medium hover:bg-[#0B1736] hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
