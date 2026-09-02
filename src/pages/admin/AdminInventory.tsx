import { useState } from "react";
import { useStore } from "../../context/StoreContext";

export default function AdminInventory() {
  const { products, adjustVariantStock, updateVariantStock } = useStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "in" | "low" | "out">("all");
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [adjustMode, setAdjustMode] = useState<"delta" | "set">("delta");
  const [adjustValue, setAdjustValue] = useState("0");

  const getStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", bg: "#FEE2E2", text: "#DC2626" };
    if (stock <= 3) return { label: "Low Stock", bg: "#FEF3C7", text: "#B45309" };
    return { label: "In Stock", bg: "#D1FAE5", text: "#065F46" };
  };

  // Flatten to a list of rows for display
  interface Row { productId: string; productName: string; sku: string; size: string; color: string; stock: number; }
  const allRows: Row[] = products
    .filter((p) => !p.isArchived)
    .flatMap((p) => p.variants.map((v) => ({
      productId: p.id,
      productName: p.name,
      sku: v.sku,
      size: v.size,
      color: v.color,
      stock: v.stock,
    })));

  const filtered = allRows.filter((r) => {
    const matchSearch = !search ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.color.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ||
      (filter === "in" && r.stock > 3) ||
      (filter === "low" && r.stock > 0 && r.stock <= 3) ||
      (filter === "out" && r.stock === 0);
    return matchSearch && matchFilter;
  });

  const applyAdjust = (row: Row) => {
    const val = parseInt(adjustValue);
    if (!isNaN(val)) {
      if (adjustMode === "delta") {
        adjustVariantStock(row.productId, row.sku, val);
      } else {
        updateVariantStock(row.productId, row.sku, Math.max(0, val));
      }
    }
    setAdjusting(null);
    setAdjustValue("0");
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.5rem" }} className="font-semibold mb-6">Inventory</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "In Stock", count: allRows.filter((r) => r.stock > 3).length, color: "#D1FAE5", text: "#065F46" },
          { label: "Low Stock", count: allRows.filter((r) => r.stock > 0 && r.stock <= 3).length, color: "#FEF3C7", text: "#B45309" },
          { label: "Out of Stock", count: allRows.filter((r) => r.stock === 0).length, color: "#FEE2E2", text: "#DC2626" },
        ].map(({ label, count, color, text }) => (
          <div key={label} style={{ backgroundColor: color, borderRadius: "12px" }} className="p-4 text-center">
            <p style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "1.6rem", fontWeight: 700 }}>{count}</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", color: text, fontSize: "0.75rem", fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
            <circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l3 3" />
          </svg>
          <input type="text" placeholder="Search SKU or product..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
            className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white" />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "in", "low", "out"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: filter === f ? 600 : 400,
              padding: "5px 14px", borderRadius: "20px",
              border: `1.5px solid ${filter === f ? "#0B1736" : "#E5E7EB"}`,
              backgroundColor: filter === f ? "#0B1736" : "#fff",
              color: filter === f ? "#FAF9F6" : "#374151",
            }}>
              {f === "all" ? "All" : f === "in" ? "In Stock" : f === "low" ? "Low Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9FAFB" }}>
              <tr>
                {["Product", "SKU", "Size", "Color", "Stock", "Status", "Adjust Stock"].map((h) => (
                  <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.7rem", letterSpacing: "0.08em" }} className="text-left py-3 px-5 uppercase font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const status = getStatus(row.stock);
                const isAdjusting = adjusting === row.sku;
                return (
                  <tr key={row.sku} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem", maxWidth: "160px" }} className="py-3.5 px-5 truncate">{row.productName}</td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.75rem" }} className="py-3.5 px-5">{row.sku}</td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem" }} className="py-3.5 px-5">{row.size}</td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem" }} className="py-3.5 px-5">{row.color}</td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 700, fontSize: "0.9rem" }} className="py-3.5 px-5">{row.stock}</td>
                    <td className="py-3.5 px-5">
                      <span style={{ backgroundColor: status.bg, color: status.text, fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700 }} className="px-2 py-0.5 rounded uppercase tracking-wide whitespace-nowrap">
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      {isAdjusting ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <select value={adjustMode} onChange={(e) => setAdjustMode(e.target.value as "delta" | "set")}
                            style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.75rem" }}
                            className="border rounded px-2 py-1.5 bg-white focus:outline-none focus:border-[#C99724]">
                            <option value="delta">+/− Delta</option>
                            <option value="set">Set to</option>
                          </select>
                          <input type="number" value={adjustValue} onChange={(e) => setAdjustValue(e.target.value)}
                            style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem", width: "70px" }}
                            className="px-2 py-1.5 border rounded-lg focus:outline-none focus:border-[#C99724]" />
                          <button onClick={() => applyAdjust(row)} style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }} className="px-3 py-1.5 rounded font-semibold">Apply</button>
                          <button onClick={() => setAdjusting(null)} style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setAdjusting(row.sku); setAdjustValue("0"); setAdjustMode("delta"); }}
                          style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>
                          Adjust
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.875rem" }}>No variants found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
