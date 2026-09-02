import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faPen, faArchive, faXmark, faCheck, faTrash,
  faFileArrowUp, faDownload, faCircleCheck, faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../context/StoreContext";
import type { Product, ProductVariant } from "../../data/products";

const INR = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

const statusBadge = (archived?: boolean) =>
  archived
    ? { bg: "#F3F4F6", text: "#6B7280", label: "Archived" }
    : { bg: "#D1FAE5", text: "#065F46", label: "Active" };

type ModalMode = "add" | "edit" | "import" | null;

interface ProductForm {
  name: string; slug: string; category: string; categorySlug: string;
  price: string; originalPrice: string; description: string;
  shortDescription: string; imageUrl: string; isNew: boolean; isFeatured: boolean;
}

interface VariantRow extends ProductVariant { _key: string; }

// ── Import row types ──────────────────────────────────────────────────────────
interface ImportRow {
  name: string; slug: string; category: string; categorySlug: string;
  price: number; originalPrice?: number; shortDescription: string;
  description: string; imageUrl: string; isNew: boolean; isFeatured: boolean;
  variants: ProductVariant[];
  errors: string[];
}

const BLANK_FORM: ProductForm = {
  name: "", slug: "", category: "", categorySlug: "",
  price: "", originalPrice: "", description: "", shortDescription: "",
  imageUrl: "", isNew: false, isFeatured: false,
};

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── CSV template ──────────────────────────────────────────────────────────────
const TEMPLATE_HEADERS = [
  "Name", "Slug", "Category", "Category Slug", "Price", "Original Price",
  "Short Description", "Description", "Image URL", "Is Featured", "Is New",
  "Variants (SKU,Size,Color,Stock|SKU,Size,Color,Stock)",
];
const TEMPLATE_EXAMPLE = [
  "Elegant Kurti", "elegant-kurti", "Tops & Kurtis", "tops-kurtis",
  "899", "1199", "Lightweight cotton kurti", "Full product description here",
  "https://images.unsplash.com/photo-1759840278381-bf7d5e332050?w=600&h=750&fit=crop",
  "yes", "no", "EK-S-RED,S,Red,10|EK-M-RED,M,Red,8|EK-L-RED,L,Red,5",
];

function downloadTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, TEMPLATE_EXAMPLE]);
  ws["!cols"] = TEMPLATE_HEADERS.map((_, i) => ({ wch: i === 11 ? 55 : i < 4 ? 22 : 18 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  XLSX.writeFile(wb, "vv_products_template.xlsx");
}

function parseVariants(raw: string): ProductVariant[] {
  if (!raw?.trim()) return [];
  return raw.split("|").map((part) => {
    const [sku, size, color, stock] = part.split(",").map((s) => s.trim());
    return { sku: sku || "", size: size || "", color: color || "", stock: Number(stock) || 0 };
  }).filter((v) => v.sku && v.size && v.color);
}

function parseImportRows(data: unknown[][]): ImportRow[] {
  return data.slice(1).filter((row) => row.some((c) => c != null && c !== "")).map((row) => {
    const get = (i: number) => String(row[i] ?? "").trim();
    const errors: string[] = [];
    const name = get(0);
    const price = Number(get(4));
    const originalPrice = get(5) ? Number(get(5)) : undefined;
    if (!name) errors.push("Name is required");
    if (!price || isNaN(price)) errors.push("Price must be a number");
    const variants = parseVariants(get(11));
    return {
      name,
      slug: get(1) || toSlug(name),
      category: get(2),
      categorySlug: get(3) || toSlug(get(2)),
      price,
      originalPrice: originalPrice && !isNaN(originalPrice) ? originalPrice : undefined,
      shortDescription: get(6),
      description: get(7),
      imageUrl: get(8),
      isNew: get(10).toLowerCase() === "yes",
      isFeatured: get(9).toLowerCase() === "yes",
      variants,
      errors,
    };
  });
}

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, archiveProduct } = useStore();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(BLANK_FORM);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [variantForm, setVariantForm] = useState({ sku: "", size: "", color: "", stock: "0", priceOverride: "" });
  const [showVForm, setShowVForm] = useState(false);
  const [editVKey, setEditVKey] = useState<string | null>(null);

  // ── Import state ──────────────────────────────────────────────────────────
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [importDragging, setImportDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const liveCategories = categories.filter((c) => c.isActive);
  const topLevelCats = liveCategories.filter((c) => c.parentId === null);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.categorySlug === catFilter;
    return matchSearch && matchCat;
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  // ── Single add/edit ───────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(BLANK_FORM); setVariants([]); setShowVForm(false);
    setEditVKey(null); setEditId(null); setModalMode("add");
  };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, category: p.category, categorySlug: p.categorySlug,
      price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      description: p.description, shortDescription: p.shortDescription,
      imageUrl: p.images[0] ?? "", isNew: !!p.isNew, isFeatured: !!p.isFeatured,
    });
    setVariants(p.variants.map((v) => ({ ...v, _key: v.sku + Math.random() })));
    setShowVForm(false); setEditVKey(null); setEditId(p.id); setModalMode("edit");
  };
  const closeModal = () => { setModalMode(null); setEditId(null); };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;
    const slug = form.slug || toSlug(form.name);
    const images = form.imageUrl ? [form.imageUrl] : [];
    const colors = [...new Set(variants.map((v) => v.color))].map((c) => ({ name: c, hex: "#C99724" }));
    const sizes = [...new Set(variants.map((v) => v.size))];
    if (modalMode === "add") {
      addProduct({ slug, name: form.name, category: form.category, categorySlug: form.categorySlug || toSlug(form.category), price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, description: form.description, shortDescription: form.shortDescription, colors, sizes, images, variants: variants.map(({ _key: _, ...v }) => v), isNew: form.isNew, isFeatured: form.isFeatured, isArchived: false });
      showToast("Product created successfully.");
    } else if (editId) {
      updateProduct(editId, { name: form.name, slug, category: form.category, categorySlug: form.categorySlug || toSlug(form.category), price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, description: form.description, shortDescription: form.shortDescription, colors, sizes, images, variants: variants.map(({ _key: _, ...v }) => v), isNew: form.isNew, isFeatured: form.isFeatured });
      showToast("Product updated successfully.");
    }
    closeModal();
  };

  // ── Variant helpers ───────────────────────────────────────────────────────
  const addVariantRow = () => {
    if (!variantForm.sku || !variantForm.size || !variantForm.color) return;
    const row: VariantRow = { _key: variantForm.sku + Date.now(), sku: variantForm.sku, size: variantForm.size, color: variantForm.color, stock: Number(variantForm.stock) || 0, priceOverride: variantForm.priceOverride ? Number(variantForm.priceOverride) : undefined };
    if (editVKey) { setVariants(variants.map((v) => v._key === editVKey ? row : v)); setEditVKey(null); }
    else setVariants([...variants, row]);
    setVariantForm({ sku: "", size: "", color: "", stock: "0", priceOverride: "" });
    setShowVForm(false);
  };
  const startEditVariant = (v: VariantRow) => {
    setVariantForm({ sku: v.sku, size: v.size, color: v.color, stock: String(v.stock), priceOverride: v.priceOverride ? String(v.priceOverride) : "" });
    setEditVKey(v._key); setShowVForm(true);
  };
  const removeVariantRow = (key: string) => setVariants(variants.filter((v) => v._key !== key));

  // ── Archive ───────────────────────────────────────────────────────────────
  const confirmArchive = () => {
    if (archiveTarget) { archiveProduct(archiveTarget.id); setArchiveTarget(null); showToast("Product archived."); }
  };

  // ── File import ───────────────────────────────────────────────────────────
  const parseFile = (file: File) => {
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: "" }) as unknown[][];
        setImportRows(parseImportRows(rows));
        setModalMode("import");
      } catch {
        showToast("Could not parse file. Please use the provided template.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setImportDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  const validRows = importRows.filter((r) => r.errors.length === 0);

  const handleBulkImport = () => {
    validRows.forEach((r) => {
      const colors = [...new Set(r.variants.map((v) => v.color))].map((c) => ({ name: c, hex: "#C99724" }));
      const sizes = [...new Set(r.variants.map((v) => v.size))];
      addProduct({ slug: r.slug, name: r.name, category: r.category, categorySlug: r.categorySlug, price: r.price, originalPrice: r.originalPrice, description: r.description, shortDescription: r.shortDescription, colors, sizes, images: r.imageUrl ? [r.imageUrl] : [], variants: r.variants, isNew: r.isNew, isFeatured: r.isFeatured, isArchived: false });
    });
    setModalMode(null);
    setImportRows([]);
    showToast(`${validRows.length} product${validRows.length !== 1 ? "s" : ""} imported successfully.`);
  };

  const removeImportRow = (i: number) => setImportRows(importRows.filter((_, idx) => idx !== i));

  const input = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#C99724] bg-white";
  const label = "block mb-1 text-xs font-semibold text-gray-600";

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg" style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem" }}>
          <FontAwesomeIcon icon={faCheck} style={{ color: "#E6C76A" }} />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.5rem" }} className="font-semibold">Products</h1>
          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="mt-0.5">Add single products or bulk-import via Excel / CSV.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Template download */}
          <button onClick={downloadTemplate} style={{ border: "1px solid #E5E7EB", color: "#374151", fontFamily: "'Manrope', sans-serif", backgroundColor: "#fff" }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium">
            <FontAwesomeIcon icon={faDownload} size="sm" style={{ color: "#C99724" }} /> Download Template
          </button>
          {/* Bulk import */}
          <button onClick={() => fileInputRef.current?.click()} style={{ border: "1.5px solid #0B1736", color: "#0B1736", fontFamily: "'Manrope', sans-serif", backgroundColor: "#fff" }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold">
            <FontAwesomeIcon icon={faFileArrowUp} size="sm" /> Import Excel / CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileInput} />
          {/* Single add */}
          <button onClick={openAdd} style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold">
            <FontAwesomeIcon icon={faPlus} size="sm" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <input type="text" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem", paddingLeft: "36px" }}
            className="border rounded-lg py-2 pr-4 focus:outline-none focus:border-[#C99724] bg-white w-52" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" fill="none" stroke="#9CA3AF" strokeWidth="1.8"><circle cx="6" cy="6" r="4.5" /><path d="M9.5 9.5l3 3" /></svg>
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:border-[#C99724] bg-white">
          <option value="all">All Categories</option>
          {liveCategories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <span style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.8rem" }}>{filtered.length} products</span>
      </div>

      {/* Product table */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9FAFB" }}>
              <tr>
                {["Product", "Category", "Price", "Variants", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.68rem", letterSpacing: "0.08em" }} className="text-left py-3 px-4 uppercase font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const stock = p.variants.reduce((s, v) => s + v.stock, 0);
                const s = statusBadge(p.isArchived);
                const stockColor = stock === 0 ? "#DC2626" : stock <= 5 ? "#B45309" : "#059669";
                const stockBg = stock === 0 ? "#FEE2E2" : stock <= 5 ? "#FEF3C7" : "#D1FAE5";
                return (
                  <tr key={p.id} style={{ borderTop: "1px solid #F3F4F6", opacity: p.isArchived ? 0.55 : 1 }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? <img src={p.images[0]} alt={p.name} style={{ width: "38px", height: "48px", objectFit: "cover", borderRadius: "6px", backgroundColor: "#F3F4F6", flexShrink: 0 }} />
                          : <div style={{ width: "38px", height: "48px", backgroundColor: "#F3F4F6", borderRadius: "6px", flexShrink: 0 }} />}
                        <div>
                          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontSize: "0.875rem", fontWeight: 600 }}>{p.name}</p>
                          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.7rem" }}>/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem" }} className="py-3 px-4 whitespace-nowrap">{p.category}</td>
                    <td className="py-3 px-4">
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontSize: "0.875rem", fontWeight: 600 }}>₹{p.price.toLocaleString("en-IN")}</p>
                      {p.originalPrice && <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.75rem" }} className="line-through">₹{p.originalPrice.toLocaleString("en-IN")}</p>}
                    </td>
                    <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem" }} className="py-3 px-4">{p.variants.length}</td>
                    <td className="py-3 px-4">
                      <span style={{ backgroundColor: stockBg, color: stockColor, fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700 }} className="px-2 py-0.5 rounded uppercase tracking-wide whitespace-nowrap">
                        {stock === 0 ? "Out of Stock" : stock <= 5 ? `Low (${stock})` : `${stock} units`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span style={{ backgroundColor: s.bg, color: s.text, fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700 }} className="px-2 py-0.5 rounded uppercase tracking-wide">{s.label}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(p)} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 600 }} className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faPen} size="xs" /> Edit
                        </button>
                        {!p.isArchived && (
                          <button onClick={() => setArchiveTarget(p)} style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }} className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faArchive} size="xs" /> Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-14 text-center">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF" }}>No products found.</p>
              <button onClick={openAdd} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", fontWeight: 600 }} className="mt-2">+ Add Product</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Import Modal ──────────────────────────────────────────────────────── */}
      {modalMode === "import" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 px-4 pb-6 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-2xl w-full max-w-5xl" style={{ fontFamily: "'Manrope', sans-serif" }}>
            {/* header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.2rem" }} className="font-semibold">Import Products</h2>
                <p style={{ color: "#6B7280", fontSize: "0.78rem" }} className="mt-0.5">
                  File: <span className="font-medium" style={{ color: "#374151" }}>{importFileName}</span>
                  &nbsp;·&nbsp;{importRows.length} row{importRows.length !== 1 ? "s" : ""} parsed
                  &nbsp;·&nbsp;<span style={{ color: "#059669", fontWeight: 600 }}>{validRows.length} valid</span>
                  {importRows.length - validRows.length > 0 && <span style={{ color: "#DC2626" }}>&nbsp;·&nbsp;{importRows.length - validRows.length} with errors</span>}
                </p>
              </div>
              <button onClick={() => { setModalMode(null); setImportRows([]); }} style={{ color: "#6B7280" }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Re-upload / drop zone */}
            <div className="px-5 pt-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setImportDragging(true); }}
                onDragLeave={() => setImportDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${importDragging ? "#C99724" : "#E5E7EB"}`,
                  borderRadius: "12px",
                  backgroundColor: importDragging ? "#FFFBEB" : "#F9FAFB",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                className="flex items-center justify-center gap-3 py-4 px-6"
              >
                <FontAwesomeIcon icon={faFileArrowUp} style={{ color: "#C99724", fontSize: "1.2rem" }} />
                <span style={{ color: "#6B7280", fontSize: "0.85rem" }}>Drop a new file here or <span style={{ color: "#C99724", fontWeight: 600 }}>click to re-upload</span></span>
                <button
                  onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
                  style={{ marginLeft: "auto", color: "#6B7280", fontSize: "0.78rem", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "4px 10px", backgroundColor: "#fff" }}
                >
                  <FontAwesomeIcon icon={faDownload} size="xs" style={{ marginRight: "5px" }} />Template
                </button>
              </div>
            </div>

            {/* Column legend */}
            <div className="px-5 pt-3">
              <p style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>
                <span style={{ fontWeight: 700, color: "#374151" }}>Columns expected:</span> Name · Slug · Category · Category Slug · Price · Original Price · Short Description · Description · Image URL · Is Featured (yes/no) · Is New (yes/no) · Variants (SKU,Size,Color,Stock|…)
              </p>
            </div>

            {/* Preview table */}
            <div className="p-5 overflow-x-auto" style={{ maxHeight: "55vh", overflowY: "auto" }}>
              {importRows.length === 0 ? (
                <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }} className="text-center py-8">No data rows found. Make sure your file matches the template.</p>
              ) : (
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, backgroundColor: "#F9FAFB", zIndex: 1 }}>
                    <tr>
                      {["", "Name", "Category", "Price", "Variants", "Featured", "New", "Image", "Errors"].map((h) => (
                        <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.65rem", letterSpacing: "0.08em", padding: "8px 10px", borderBottom: "1px solid #E5E7EB", textAlign: "left", whiteSpace: "nowrap" }} className="uppercase font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.map((row, i) => {
                      const ok = row.errors.length === 0;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #F3F4F6", backgroundColor: ok ? "#fff" : "#FFF9F9" }}>
                          <td style={{ padding: "8px 10px", width: "32px" }}>
                            <FontAwesomeIcon icon={ok ? faCircleCheck : faCircleXmark} style={{ color: ok ? "#059669" : "#DC2626", fontSize: "0.95rem" }} />
                          </td>
                          <td style={{ padding: "8px 10px", fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 600, fontSize: "0.8rem", maxWidth: "160px" }}>
                            <p className="truncate">{row.name || <em style={{ color: "#9CA3AF" }}>—</em>}</p>
                            <p style={{ color: "#9CA3AF", fontSize: "0.68rem", fontWeight: 400 }}>/{row.slug}</p>
                          </td>
                          <td style={{ padding: "8px 10px", fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", whiteSpace: "nowrap" }}>{row.category || "—"}</td>
                          <td style={{ padding: "8px 10px", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                            <span style={{ color: "#111827", fontWeight: 600 }}>{row.price ? INR(row.price) : <span style={{ color: "#DC2626" }}>missing</span>}</span>
                            {row.originalPrice && <span style={{ color: "#9CA3AF", fontSize: "0.72rem", display: "block" }} className="line-through">{INR(row.originalPrice)}</span>}
                          </td>
                          <td style={{ padding: "8px 10px", fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem" }}>
                            {row.variants.length > 0 ? (
                              <span style={{ backgroundColor: "#EFF6FF", color: "#1D4ED8", fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: "10px" }}>
                                {row.variants.length} variant{row.variants.length !== 1 ? "s" : ""}
                              </span>
                            ) : <span style={{ color: "#9CA3AF" }}>none</span>}
                          </td>
                          <td style={{ padding: "8px 10px", textAlign: "center" }}>
                            {row.isFeatured ? <span style={{ color: "#C99724", fontSize: "0.9rem" }}>★</span> : <span style={{ color: "#E5E7EB" }}>★</span>}
                          </td>
                          <td style={{ padding: "8px 10px", textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem" }}>
                            {row.isNew ? <span style={{ backgroundColor: "#D1FAE5", color: "#065F46", padding: "1px 6px", borderRadius: "8px", fontWeight: 700 }}>NEW</span> : "—"}
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            {row.imageUrl ? (
                              <img src={row.imageUrl} alt="" style={{ width: "32px", height: "40px", objectFit: "cover", borderRadius: "4px", backgroundColor: "#F3F4F6" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : <span style={{ color: "#9CA3AF", fontSize: "0.72rem" }}>no image</span>}
                          </td>
                          <td style={{ padding: "8px 10px", maxWidth: "180px" }}>
                            {row.errors.length > 0 ? (
                              <div>
                                {row.errors.map((err, ei) => (
                                  <p key={ei} style={{ color: "#DC2626", fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem" }}>• {err}</p>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: "#059669", fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem", fontWeight: 600 }}>Ready to import</span>
                            )}
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            <button onClick={() => removeImportRow(i)} style={{ color: "#9CA3AF" }} title="Remove row">
                              <FontAwesomeIcon icon={faXmark} size="sm" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex-wrap gap-3">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }}>
                {validRows.length === 0 ? "No valid rows to import." : `${validRows.length} product${validRows.length !== 1 ? "s" : ""} will be added to your store.`}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => { setModalMode(null); setImportRows([]); }} style={{ border: "1px solid #E5E7EB", color: "#374151", fontFamily: "'Manrope', sans-serif" }} className="px-6 py-2.5 rounded-lg text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleBulkImport} disabled={validRows.length === 0}
                  style={{ backgroundColor: validRows.length === 0 ? "#E5E7EB" : "#0B1736", color: validRows.length === 0 ? "#9CA3AF" : "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                  className="px-7 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faFileArrowUp} size="sm" />
                  Import {validRows.length > 0 ? `${validRows.length} Product${validRows.length !== 1 ? "s" : ""}` : "Products"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ───────────────────────────────────────────────────── */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 px-4 pb-6 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl" style={{ fontFamily: "'Manrope', sans-serif" }}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.2rem" }} className="font-semibold">
                {modalMode === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <button onClick={closeModal} style={{ color: "#6B7280" }}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic info */}
              <div>
                <p style={{ color: "#374151", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Basic Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>Product Name *</label>
                    <input className={input} style={{ borderColor: "#E5E7EB" }} value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })} />
                  </div>
                  <div>
                    <label className={label}>Slug (URL)</label>
                    <input className={input} style={{ borderColor: "#E5E7EB" }} value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
                  </div>
                  <div>
                    <label className={label}>Base Price (₹) *</label>
                    <input className={input} style={{ borderColor: "#E5E7EB" }} type="number" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1499" />
                  </div>
                  <div>
                    <label className={label}>Original Price (₹) — for Sale badge</label>
                    <input className={input} style={{ borderColor: "#E5E7EB" }} type="number" value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="Leave blank if no sale" />
                  </div>
                  <div>
                    <label className={label}>Category *</label>
                    <select className={input} style={{ borderColor: "#E5E7EB" }} value={form.categorySlug}
                      onChange={(e) => {
                        const cat = liveCategories.find((c) => c.slug === e.target.value);
                        setForm({ ...form, categorySlug: e.target.value, category: cat?.name ?? "" });
                      }}>
                      <option value="">Select category…</option>
                      {topLevelCats.map((c) => (
                        <optgroup key={c.id} label={c.name}>
                          <option value={c.slug}>{c.name}</option>
                          {categories.filter((ch) => ch.parentId === c.id && ch.isActive).map((ch) => (
                            <option key={ch.id} value={ch.slug}>&nbsp;&nbsp;{ch.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={label}>Image URL (primary)</label>
                    <input className={input} style={{ borderColor: "#E5E7EB" }} value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Short Description</label>
                    <input className={input} style={{ borderColor: "#E5E7EB" }} value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Full Description</label>
                    <textarea rows={3} className={input} style={{ borderColor: "#E5E7EB", resize: "vertical" }} value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} style={{ accentColor: "#C99724", width: "16px", height: "16px" }} />
                      <span style={{ fontSize: "0.875rem", color: "#374151" }}>Featured on homepage</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} style={{ accentColor: "#C99724", width: "16px", height: "16px" }} />
                      <span style={{ fontSize: "0.875rem", color: "#374151" }}>Mark as New</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "20px" }}>
                <div className="flex items-center justify-between mb-3">
                  <p style={{ color: "#374151", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Product Variants</p>
                  <button onClick={() => { setShowVForm(true); setEditVKey(null); setVariantForm({ sku: "", size: "", color: "", stock: "0", priceOverride: "" }); }}
                    style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontSize: "0.75rem", fontWeight: 600, borderRadius: "6px", padding: "5px 12px" }}>
                    + Add Variant
                  </button>
                </div>
                {showVForm && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 p-4 rounded-xl" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                    {[
                      { label: "SKU *", key: "sku", placeholder: "VV-KURTI-BLU-M" },
                      { label: "Size *", key: "size", placeholder: "M" },
                      { label: "Color *", key: "color", placeholder: "Blue" },
                      { label: "Stock", key: "stock", placeholder: "0", type: "number" },
                      { label: "Price Override (₹)", key: "priceOverride", placeholder: "Leave blank" },
                    ].map(({ label: l, key, placeholder, type }) => (
                      <div key={key}>
                        <label className={label}>{l}</label>
                        <input className={input} style={{ borderColor: "#E5E7EB" }} type={type ?? "text"} placeholder={placeholder}
                          value={variantForm[key as keyof typeof variantForm]}
                          onChange={(e) => setVariantForm({ ...variantForm, [key]: e.target.value })} />
                      </div>
                    ))}
                    <div className="flex items-end gap-2">
                      <button onClick={addVariantRow} style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontSize: "0.8rem", fontWeight: 600, borderRadius: "6px", padding: "8px 14px" }}>
                        {editVKey ? "Update" : "Add"}
                      </button>
                      <button onClick={() => { setShowVForm(false); setEditVKey(null); }} style={{ color: "#6B7280", fontSize: "0.8rem" }}>Cancel</button>
                    </div>
                  </div>
                )}
                {variants.length > 0 && (
                  <div style={{ border: "1px solid #E5E7EB", borderRadius: "10px" }} className="overflow-hidden">
                    <table className="w-full text-sm">
                      <thead style={{ backgroundColor: "#F9FAFB" }}>
                        <tr>
                          {["SKU", "Size", "Color", "Stock", "Price Override", ""].map((h) => (
                            <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.65rem", letterSpacing: "0.06em" }} className="text-left py-2 px-3 uppercase font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((v) => (
                          <tr key={v._key} style={{ borderTop: "1px solid #F3F4F6" }}>
                            <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem" }} className="py-2 px-3">{v.sku}</td>
                            <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem" }} className="py-2 px-3">{v.size}</td>
                            <td style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem" }} className="py-2 px-3">{v.color}</td>
                            <td style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 600, fontSize: "0.8rem" }} className="py-2 px-3">{v.stock}</td>
                            <td style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.8rem" }} className="py-2 px-3">{v.priceOverride ? INR(v.priceOverride) : "—"}</td>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => startEditVariant(v)} style={{ color: "#C99724" }}><FontAwesomeIcon icon={faPen} size="xs" /></button>
                                <button onClick={() => removeVariantRow(v._key)} style={{ color: "#DC2626" }}><FontAwesomeIcon icon={faTrash} size="xs" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {variants.length === 0 && !showVForm && (
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.8rem" }}>No variants yet. Click "+ Add Variant" to start.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={closeModal} style={{ border: "1px solid #E5E7EB", color: "#374151", fontFamily: "'Manrope', sans-serif" }} className="px-6 py-2.5 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.price}
                style={{ backgroundColor: !form.name || !form.price ? "#E5E7EB" : "#0B1736", color: !form.name || !form.price ? "#9CA3AF" : "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                className="px-7 py-2.5 rounded-lg text-sm font-semibold">
                {modalMode === "add" ? "Save & Publish" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive confirmation */}
      {archiveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.1rem" }} className="font-semibold mb-2">Archive Product?</h3>
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.875rem", lineHeight: 1.6 }}>
              "<strong style={{ color: "#374151" }}>{archiveTarget.name}</strong>" will no longer appear in the storefront.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={confirmArchive} style={{ backgroundColor: "#DC2626", color: "#fff", fontFamily: "'Manrope', sans-serif" }} className="flex-1 py-2.5 rounded-lg text-sm font-semibold">Archive Product</button>
              <button onClick={() => setArchiveTarget(null)} style={{ border: "1px solid #E5E7EB", color: "#374151", fontFamily: "'Manrope', sans-serif" }} className="flex-1 py-2.5 rounded-lg text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
