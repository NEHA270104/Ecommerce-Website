import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../../context/StoreContext";
import type { Category } from "../../data/categories";

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminCategories() {
  const { categories, addCategory, updateCategory } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", imageUrl: "", parentId: "" as string | null, sortOrder: "1", isActive: true });
  const [toast, setToast] = useState<string | null>(null);

  const topLevel = categories.filter((c) => c.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder);
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const openAdd = () => {
    setForm({ name: "", slug: "", description: "", imageUrl: "", parentId: null, sortOrder: "1", isActive: true });
    setEditCat(null);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, imageUrl: cat.image, parentId: cat.parentId, sortOrder: String(cat.sortOrder), isActive: cat.isActive });
    setEditCat(cat);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const slug = form.slug || toSlug(form.name);
    const image = form.imageUrl.trim() || "https://images.unsplash.com/photo-1716504628204-47f2df8d2634?w=600&h=750&fit=crop&auto=format";
    if (editCat) {
      updateCategory(editCat.id, {
        name: form.name, slug, description: form.description,
        parentId: form.parentId ?? null, sortOrder: Number(form.sortOrder),
        isActive: form.isActive, image,
      });
      showToast("Category updated.");
    } else {
      addCategory({
        slug, name: form.name, description: form.description,
        parentId: form.parentId ?? null, sortOrder: Number(form.sortOrder),
        isActive: form.isActive, image,
      });
      showToast("Category created.");
    }
    setShowForm(false);
  };

  const toggleActive = (cat: Category) => {
    updateCategory(cat.id, { isActive: !cat.isActive });
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg" style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem" }}>
          <FontAwesomeIcon icon={faCheck} style={{ color: "#E6C76A" }} />
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.5rem" }} className="font-semibold">Categories</h1>
          <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="mt-0.5">Organize your store by category and sub-category.</p>
        </div>
        <button onClick={openAdd} style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold">
          <FontAwesomeIcon icon={faPlus} size="sm" /> Add Category
        </button>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5">
        <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="mb-5">
          Categories are organized as a tree. Changes update the storefront immediately.
        </p>

        <div className="space-y-3">
          {topLevel.map((cat) => {
            const children = getChildren(cat.id);
            return (
              <div key={cat.id}>
                <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "10px", opacity: cat.isActive ? 1 : 0.65 }} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#111827", fontWeight: 700, fontSize: "0.9rem" }}>{cat.name}</p>
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.7rem" }}>/{cat.slug} · Order: {cat.sortOrder} · {getChildren(cat.id).length} sub-categories</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ backgroundColor: cat.isActive ? "#D1FAE5" : "#F3F4F6", color: cat.isActive ? "#065F46" : "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700 }} className="px-2 py-0.5 rounded uppercase tracking-wide">
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                    <button onClick={() => openEdit(cat)} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 600 }} className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faPen} size="xs" /> Edit
                    </button>
                    <button onClick={() => toggleActive(cat)} style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem" }}>
                      {cat.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>

                {children.length > 0 && (
                  <div className="ml-8 mt-1 space-y-1">
                    {children.map((child) => (
                      <div key={child.id} style={{ border: "1px solid #E5E7EB", borderRadius: "8px", backgroundColor: "#fff", opacity: child.isActive ? 1 : 0.65 }} className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <span style={{ color: "#D1D5DB" }}>└</span>
                          <div>
                            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontWeight: 500, fontSize: "0.85rem" }}>{child.name}</p>
                            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.7rem" }}>/{child.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span style={{ backgroundColor: child.isActive ? "#D1FAE5" : "#F3F4F6", color: child.isActive ? "#065F46" : "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700 }} className="px-2 py-0.5 rounded uppercase">
                            {child.isActive ? "Active" : "Inactive"}
                          </span>
                          <button onClick={() => openEdit(child)} style={{ color: "#C99724", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 600 }} className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faPen} size="xs" /> Edit
                          </button>
                          <button onClick={() => toggleActive(child)} style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}>
                            {child.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {topLevel.length === 0 && (
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF", fontSize: "0.875rem" }} className="text-center py-8">No categories yet.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }} className="text-lg font-semibold">
                {editCat ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2"><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Category Name *", field: "name", placeholder: "e.g. Sarees" },
                { label: "Slug (URL)", field: "slug", placeholder: "auto-generated from name" },
                { label: "Description", field: "description", placeholder: "Short description for storefront" },
                { label: "Image URL", field: "imageUrl", placeholder: "https://images.unsplash.com/…" },
                { label: "Sort Order", field: "sortOrder", placeholder: "1" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[field as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [field]: field === "name" && !form.slug ? { ...form, name: e.target.value, slug: "" }[field] : e.target.value })}
                    style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
                  />
                  {field === "imageUrl" && form.imageUrl && (
                    <img src={form.imageUrl} alt="preview" style={{ width: "56px", height: "72px", objectFit: "cover", borderRadius: "6px", marginTop: "6px", backgroundColor: "#F3F4F6" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  )}
                </div>
              ))}
              <div>
                <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">Parent Category</label>
                <select
                  value={form.parentId ?? ""}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
                  style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
                >
                  <option value="">None (Top-level category)</option>
                  {topLevel.filter((c) => !editCat || c.id !== editCat.id).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: "#C99724", width: "16px", height: "16px" }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem" }}>Active (visible on storefront)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={!form.name.trim()} style={{ backgroundColor: !form.name.trim() ? "#E5E7EB" : "#0B1736", color: !form.name.trim() ? "#9CA3AF" : "#FAF9F6", fontFamily: "'Manrope', sans-serif" }} className="px-7 py-2.5 rounded-lg text-sm font-semibold">Save</button>
                <button onClick={() => setShowForm(false)} style={{ border: "1px solid #E5E7EB", color: "#374151", fontFamily: "'Manrope', sans-serif" }} className="px-7 py-2.5 rounded-lg text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
