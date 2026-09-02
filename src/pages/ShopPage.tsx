import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";
import { useStore, useCategoryTree } from "../context/StoreContext";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const ALL_COLORS = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#F5F5F5" },
  { name: "Blue", hex: "#4A90D9" },
  { name: "Pink", hex: "#F4A0B5" },
  { name: "Red", hex: "#C0392B" },
  { name: "Green", hex: "#5BA65B" },
  { name: "Beige", hex: "#D4B896" },
  { name: "Navy", hex: "#0B1736" },
  { name: "Maroon", hex: "#800020" },
  { name: "Orange", hex: "#E8701A" },
];

type SortKey = "newest" | "price-asc" | "price-desc";

export default function ShopPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { products, categories } = useStore();
  const categoryTree = useCategoryTree();

  // Resolve active category and all matching slugs (including children)
  const activeCategory = slug ? categories.find((c) => c.slug === slug) : null;

  // If slug is a parent category, include all child slugs so products are shown
  const matchingSlugs = useMemo(() => {
    if (!slug) return null;
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return [slug];
    const childSlugs = categories.filter((c) => c.parentId === cat.id).map((c) => c.slug);
    return [slug, ...childSlugs];
  }, [slug, categories]);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sort, setSort] = useState<SortKey>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleColor = (c: string) =>
    setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => !p.isArchived);
    if (matchingSlugs) list = list.filter((p) => matchingSlugs.includes(p.categorySlug));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (selectedSizes.length) list = list.filter((p) => selectedSizes.some((s) => p.sizes.includes(s)));
    if (selectedColors.length) list = list.filter((p) => selectedColors.some((c) => p.colors.some((pc) => pc.name === c)));
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [matchingSlugs, searchQuery, selectedSizes, selectedColors, priceRange, sort, products]);

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    ...(activeCategory ? [{ label: activeCategory.name }] : []),
  ];

  const FilterPanel = () => (
    <aside className="space-y-7">
      {/* Category tree */}
      <div>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.7rem", letterSpacing: "0.18em" }} className="font-bold uppercase mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-0.5">
          {/* All Products */}
          <Link
            to="/shop"
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: !slug ? "#C99724" : "#4B5563",
              fontWeight: !slug ? 700 : 400,
              fontSize: "0.875rem",
              textDecoration: "none",
              padding: "4px 0",
            }}
          >
            All Products
          </Link>
          {/* Dynamic tree from StoreContext */}
          {categoryTree.map((parent) => (
            <div key={parent.id}>
              <Link
                to={`/category/${parent.slug}`}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: slug === parent.slug ? "#C99724" : "#374151",
                  fontWeight: slug === parent.slug ? 700 : 600,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  display: "block",
                  padding: "4px 0",
                }}
              >
                {parent.name}
              </Link>
              {parent.children.map((child) => (
                <Link
                  key={child.id}
                  to={`/category/${child.slug}`}
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: slug === child.slug ? "#C99724" : "#6B7280",
                    fontWeight: slug === child.slug ? 700 : 400,
                    fontSize: "0.825rem",
                    textDecoration: "none",
                    display: "block",
                    padding: "3px 0 3px 12px",
                  }}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: "1px", backgroundColor: "#E5E7EB" }} />

      {/* Size */}
      <div>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.7rem", letterSpacing: "0.18em" }} className="font-bold uppercase mb-3">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              style={{
                fontFamily: "'Manrope', sans-serif",
                border: `1.5px solid ${selectedSizes.includes(size) ? "#C99724" : "#E5E7EB"}`,
                backgroundColor: selectedSizes.includes(size) ? "#C99724" : "transparent",
                color: selectedSizes.includes(size) ? "#fff" : "#4B5563",
                fontSize: "0.75rem",
                fontWeight: 500,
                borderRadius: "6px",
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: "1px", backgroundColor: "#E5E7EB" }} />

      {/* Color */}
      <div>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.7rem", letterSpacing: "0.18em" }} className="font-bold uppercase mb-3">
          Color
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                backgroundColor: color.hex,
                border: selectedColors.includes(color.name) ? "2.5px solid #C99724" : "2px solid #E5E7EB",
                cursor: "pointer",
                outline: selectedColors.includes(color.name) ? "2px solid #C99724" : "none",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
        {selectedColors.length > 0 && (
          <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-xs mt-2">
            {selectedColors.join(", ")}
          </p>
        )}
      </div>

      <div style={{ height: "1px", backgroundColor: "#E5E7EB" }} />

      {/* Price */}
      <div>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.7rem", letterSpacing: "0.18em" }} className="font-bold uppercase mb-3">
          Price Range
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif" }} className="text-sm">₹{priceRange[0].toLocaleString("en-IN")}</span>
          <span style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif" }} className="text-sm">₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min={0}
          max={5000}
          step={100}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          style={{ accentColor: "#C99724" }}
          className="w-full"
        />
      </div>

      {(selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[1] < 5000) ? (
        <button
          onClick={() => { setSelectedSizes([]); setSelectedColors([]); setPriceRange([0, 5000]); }}
          style={{ color: "#DC2626", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }}
          className="font-medium"
        >
          Clear All Filters
        </button>
      ) : null}
    </aside>
  );

  const pageTitle = activeCategory
    ? activeCategory.name
    : searchQuery
      ? `Results for "${searchQuery}"`
      : "Shop All";

  const pageDesc = activeCategory
    ? activeCategory.description
    : "Discover our complete collection of ethnic and contemporary Indian fashion.";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      {/* Category hero banner */}
      {activeCategory?.image && (
        <div className="relative h-40 md:h-52 overflow-hidden">
          <img
            src={activeCategory.image}
            alt={activeCategory.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(11,23,54,0.65) 0%, rgba(11,23,54,0.2) 60%, transparent 100%)" }} />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div>
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#E6C76A", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }} className="mb-1">Collection</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#FAF9F6", fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }} className="font-semibold">{activeCategory.name}</h1>
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "rgba(250,249,246,0.8)", fontSize: "0.875rem" }} className="mt-1 max-w-xs">{activeCategory.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex items-end justify-between mt-6 mb-8">
          <div>
            {!activeCategory?.image && (
              <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }} className="font-semibold">
                {pageTitle}
              </h1>
            )}
            {!activeCategory?.image && (
              <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="mt-1 text-sm">{pageDesc}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              style={{ border: "1px solid #E5E7EB", fontFamily: "'Manrope', sans-serif", color: "#0B1736" }}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="4" x2="13" y2="4" />
                <line x1="1" y1="8" x2="15" y2="8" />
                <line x1="3" y1="12" x2="13" y2="12" />
              </svg>
              Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", color: "#0B1736", fontSize: "0.875rem" }}
              className="border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#C99724]"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <FilterPanel />
          </div>

          {/* Mobile filter drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)}>
                    <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2"><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></svg>
                  </button>
                </div>
                <FilterPanel />
                <button
                  onClick={() => setFiltersOpen(false)}
                  style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                  className="w-full mt-6 py-3 rounded-full text-sm font-semibold"
                >
                  Show {filtered.length} Products
                </button>
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-sm mb-5">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <svg className="mx-auto mb-4" width="48" height="48" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p style={{ fontFamily: "'Playfair Display', serif", color: "#6B7280", fontSize: "1.2rem" }}>No products found.</p>
                <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm">Try adjusting your filters or browse a different category.</p>
                <Link
                  to="/shop"
                  style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}
                  className="inline-block mt-4"
                >
                  View All Products →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
