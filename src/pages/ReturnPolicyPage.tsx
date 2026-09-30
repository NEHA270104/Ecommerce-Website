import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const sections = [
  {
    number: "1",
    title: "Return Period",
    content: "You may request a return within 7 days from the date of delivery.",
  },
  {
    number: "2",
    title: "Return Conditions",
    content: null,
    list: [
      "The product must be unused and unworn.",
      "Original tags must be attached.",
      "Original packaging should be retained.",
      "The product must not be washed, altered, stained, or damaged.",
      "The product should be returned in its original condition.",
    ],
  },
  {
    number: "3",
    title: "Damaged or Incorrect Product",
    content: "If you receive a damaged, defective, or incorrect product, contact us as soon as possible at 8447158710. Please provide your order number and clear photographs or videos showing the issue.",
  },
  {
    number: "4",
    title: "How to Request a Return",
    content: null,
    list: [
      "Contact Vrishabhanvi Venture within 7 days of delivery.",
      "Provide your order number.",
      "Explain the reason for the return.",
      "Provide photographs/videos if requested.",
      "Follow the return instructions provided by our team.",
    ],
  },
  {
    number: "5",
    title: "Refund",
    content: "After the returned product is received and inspected, we will notify you about the status of your refund. For approved refunds, the refund will be processed through the applicable payment method, subject to payment-provider and bank processing times.",
  },
  {
    number: "6",
    title: "Exchange",
    content: "Exchange requests are subject to product availability and the conditions of this Return & Refund Policy.",
  },
  {
    number: "7",
    title: "Non-Returnable Products",
    content: "Any products specifically marked as non-returnable on the product page will not be eligible for return.",
  },
];

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      <section style={{ backgroundColor: "#0B1736" }} className="py-14">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Return & Refund Policy" }]} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#FAF9F6", fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }} className="font-semibold mt-5">
            Return & Refund Policy
          </h1>
          <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm">
            Last Updated: August 11, 2026
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-14">
        {/* Trust highlight */}
        <div style={{ backgroundColor: "#F5EDD3", border: "1px solid #E6C76A", borderRadius: "12px" }} className="p-5 mb-10 flex items-start gap-4">
          <div style={{ width: "44px", height: "44px", backgroundColor: "#C99724", borderRadius: "10px" }} className="flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 2l2.5 7.5H22l-6.3 4.5 2.3 7.5L12 17l-6 4.5 2.3-7.5L2 9.5h7.5z" /></svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700 }} className="text-sm">7-Day Return Policy</p>
            <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif" }} className="text-sm mt-0.5">
              We stand behind our products and want you to shop with complete confidence.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.number} style={{ borderBottom: "1px solid #E5E7EB" }} className="pb-8 last:border-0">
              <div className="flex items-start gap-4">
                <div
                  style={{ width: "32px", height: "32px", backgroundColor: "#0B1736", borderRadius: "50%", flexShrink: 0 }}
                  className="flex items-center justify-center"
                >
                  <span style={{ color: "#E6C76A", fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 700 }}>{section.number}</span>
                </div>
                <div className="flex-1">
                  <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "1.2rem" }} className="font-semibold mb-3">
                    {section.title}
                  </h2>
                  {section.content && (
                    <p style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.8 }} className="text-base">
                      {section.content}
                    </p>
                  )}
                  {section.list && (
                    <ul className="space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span style={{ color: "#C99724", marginTop: "4px", flexShrink: 0 }}>•</span>
                          <span style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", lineHeight: 1.7 }} className="text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{ backgroundColor: "#0B1736", borderRadius: "16px" }} className="mt-12 p-8 text-center">
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#FAF9F6" }} className="text-xl font-semibold">
            Questions About a Return?
          </h3>
          <p style={{ color: "#9CA3AF", fontFamily: "'Manrope', sans-serif" }} className="mt-2 text-sm">
            Contact us with your order number and we'll guide you through the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
            <a
              href="tel:8447158710"
              style={{ backgroundColor: "#C99724", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
              className="px-7 py-3 rounded-full text-sm font-bold"
            >
              Call: 8447158710
            </a>
            <Link
              to="/contact"
              style={{ border: "1.5px solid rgba(230,199,106,0.4)", color: "#E6C76A", fontFamily: "'Manrope', sans-serif" }}
              className="px-7 py-3 rounded-full text-sm font-medium"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
