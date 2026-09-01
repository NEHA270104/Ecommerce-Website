const CUSTOMERS = [
  { id: "c1", name: "Priya Sharma", email: "priya@example.com", phone: "9876543210", orders: 2, joined: "2026-01-15" },
  { id: "c2", name: "Anita Verma", email: "anita@example.com", phone: "9876543211", orders: 1, joined: "2026-02-20" },
  { id: "c3", name: "Sunita Rao", email: "sunita@example.com", phone: "9876543212", orders: 1, joined: "2026-03-05" },
  { id: "c4", name: "Meera Patel", email: "meera@example.com", phone: "9876543213", orders: 1, joined: "2026-04-10" },
  { id: "c5", name: "Kavita Singh", email: "kavita@example.com", phone: "9876543214", orders: 1, joined: "2026-05-18" },
  { id: "c6", name: "Pooja Mishra", email: "pooja@example.com", phone: "9876543215", orders: 0, joined: "2026-06-22" },
  { id: "c7", name: "Rekha Joshi", email: "rekha@example.com", phone: "9876543216", orders: 0, joined: "2026-07-14" },
];

import { useState } from "react";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111827", fontSize: "1.5rem" }} className="font-semibold mb-6">Customers</h1>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
            <circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l3 3" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
            className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
          />
        </div>
        <span style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }}>
          {filtered.length} customers
        </span>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9FAFB" }}>
              <tr>
                {["Customer", "Email", "Phone", "Orders", "Joined"].map((h) => (
                  <th key={h} style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.7rem", letterSpacing: "0.08em" }} className="text-left py-3 px-5 uppercase font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div style={{ width: "34px", height: "34px", backgroundColor: "#0B1736", borderRadius: "50%" }} className="flex items-center justify-center flex-shrink-0">
                        <span style={{ color: "#E6C76A", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 700 }}>
                          {c.name.charAt(0)}
                        </span>
                      </div>
                      <span style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.875rem", fontWeight: 500 }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.875rem" }} className="py-3.5 px-5">{c.email}</td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.875rem" }} className="py-3.5 px-5">{c.phone}</td>
                  <td className="py-3.5 px-5">
                    <span style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontWeight: 600, fontSize: "0.875rem" }}>
                      {c.orders}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }} className="py-3.5 px-5">
                    {new Date(c.joined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#9CA3AF" }} className="text-sm">No customers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
