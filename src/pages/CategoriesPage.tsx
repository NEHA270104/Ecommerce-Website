import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { useCategoryTree } from "../context/StoreContext";

export default function CategoriesPage() {
  const tree = useCategoryTree();
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Categories" }]} />

        <div className="mt-8 mb-10">
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }} className="font-semibold">
            Shop by Category
          </h1>
          <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-base">
            Browse our complete collection by category.
          </p>
        </div>

        <div className="space-y-12">
          {tree.map((cat) => (
            <div key={cat.slug}>
              <div className="flex items-center justify-between mb-5">
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.4rem" }} className="font-semibold">
                  {cat.name}
                </h2>
                <Link
                  to={`/category/${cat.slug}`}
                  style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif" }}
                  className="text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <Link
                  to={`/category/${cat.slug}`}
                  className="group relative overflow-hidden rounded-xl"
                  style={{ aspectRatio: "3/4", backgroundColor: "#E5E7EB", textDecoration: "none" }}
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,23,54,0.8) 30%, transparent 65%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#FAF9F6", fontSize: "1rem" }} className="font-semibold">
                      All {cat.name}
                    </p>
                    <p style={{ color: "#E6C76A", fontFamily: "'Manrope', sans-serif" }} className="text-xs mt-0.5">Explore →</p>
                  </div>
                </Link>
                {cat.children.map((child) => (
                  <Link
                    key={child.slug}
                    to={`/category/${child.slug}`}
                    className="group relative overflow-hidden rounded-xl"
                    style={{ aspectRatio: "3/4", backgroundColor: "#E5E7EB", textDecoration: "none" }}
                  >
                    <img src={child.image} alt={child.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,23,54,0.8) 30%, transparent 65%)" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p style={{ fontFamily: "'Playfair Display', serif", color: "#FAF9F6", fontSize: "0.95rem" }} className="font-semibold">
                        {child.name}
                      </p>
                      <p style={{ color: "#CBD5E1", fontFamily: "'Manrope', sans-serif" }} className="text-xs mt-0.5 line-clamp-1">
                        {child.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
