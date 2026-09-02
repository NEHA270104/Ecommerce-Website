import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", orderNumber: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      <section style={{ backgroundColor: "#0B1736" }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#FAF9F6", fontSize: "clamp(2rem, 4vw, 3rem)" }} className="font-semibold mt-5">
            Contact Us
          </h1>
          <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-base">
            Have a question? We're here to help.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.8 }} className="text-base">
              Have a question about our products, your order, delivery, returns, or exchanges? We're here to help.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  icon: (
                    <svg width="22" height="22" fill="none" stroke="#C99724" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  label: "Location",
                  value: "Noida, Uttar Pradesh, India",
                  link: null,
                },
                {
                  icon: (
                    <svg width="22" height="22" fill="none" stroke="#C99724" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.67 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012.57 1H5.5a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.5a16 16 0 006.59 6.59l.86-.86a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  ),
                  label: "Phone / WhatsApp",
                  value: "7753034659",
                  link: "tel:7753034659",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div style={{ width: "48px", height: "48px", backgroundColor: "#F5EDD3", borderRadius: "12px" }} className="flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.75rem", letterSpacing: "0.12em" }} className="uppercase font-semibold mb-0.5">
                      {item.label}
                    </p>
                    {item.link ? (
                      <a href={item.link} style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "1rem", fontWeight: 600 }}>
                        {item.value}
                      </a>
                    ) : (
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "1rem", fontWeight: 600 }}>
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/917753034659"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Manrope', sans-serif" }}
              className="inline-flex items-center gap-3 mt-8 px-7 py-3.5 rounded-full text-sm font-bold hover:bg-[#20c45b] transition-colors"
            >
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>

            <div style={{ backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB" }} className="mt-8 p-5">
              <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 600, fontSize: "0.875rem" }} className="mb-2">
                Order-related queries?
              </p>
              <p style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif", fontSize: "0.875rem", lineHeight: 1.7 }}>
                For order-related questions, please provide your order number so our team can assist you quickly. We aim to provide helpful and timely customer support.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "16px" }} className="p-8 text-center">
                <div style={{ width: "56px", height: "56px", backgroundColor: "#D1FAE5", borderRadius: "50%" }} className="mx-auto flex items-center justify-center mb-4">
                  <svg width="28" height="28" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M5 13l5 5L20 7" /></svg>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#065F46" }} className="text-xl font-semibold">Message Sent!</h3>
                <p style={{ color: "#047857", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-7">
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-lg font-semibold mb-6">Send us a Message</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", field: "name", type: "text", required: true },
                      { label: "Phone", field: "phone", type: "tel", required: false },
                      { label: "Email", field: "email", type: "email", required: true },
                      { label: "Order Number (if any)", field: "orderNumber", type: "text", required: false },
                    ].map(({ label, field, type, required }) => (
                      <div key={field}>
                        <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">
                          {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
                        </label>
                        <input
                          type={type}
                          value={form[field as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          required={required}
                          style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
                          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">
                      Message <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      placeholder="Tell us how we can help you..."
                      style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem", resize: "vertical" }}
                      className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                    className="w-full py-3.5 rounded-full text-sm font-bold hover:bg-[#152459] transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
