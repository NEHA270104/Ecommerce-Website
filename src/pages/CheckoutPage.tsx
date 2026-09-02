import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function formatINR(n: number) { return `₹${n.toLocaleString("en-IN")}`; }

type Step = 1 | 2 | 3;
type PaymentMethod = "cod" | "razorpay";

interface ShippingData {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
}

const INDIA_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder, isAuthenticated, addresses, user } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [useExisting, setUseExisting] = useState(false);
  const [formData, setFormData] = useState<ShippingData>({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Uttar Pradesh",
    pinCode: "",
  });

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const defaultAddress = addresses.find((a) => a.isDefault);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  const update = (field: keyof ShippingData, value: string) => {
    setFormData((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep1 = () => {
    const required: (keyof ShippingData)[] = ["fullName", "phone", "email", "addressLine1", "city", "pinCode"];
    const newErrors: Partial<Record<keyof ShippingData, string>> = {};
    if (!useExisting) {
      required.forEach((f) => {
        if (!formData[f]?.trim()) newErrors[f] = "This field is required";
      });
      if (formData.phone && !/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = "Enter a valid 10-digit phone number";
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = "Enter a valid email address";
      if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode.trim())) newErrors.pinCode = "Enter a valid 6-digit PIN code";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const address = useExisting && defaultAddress
    ? {
        id: defaultAddress.id,
        fullName: defaultAddress.fullName,
        phone: defaultAddress.phone,
        addressLine1: defaultAddress.addressLine1,
        addressLine2: defaultAddress.addressLine2,
        city: defaultAddress.city,
        state: defaultAddress.state,
        pinCode: defaultAddress.pinCode,
        isDefault: true,
      }
    : {
        id: "new",
        ...formData,
        isDefault: false,
      };

  const handlePlaceOrder = () => {
    const order = addOrder({
      items: items.map((i) => ({
        name: i.product.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.images[0],
      })),
      total,
      status: "Placed",
      paymentMethod: payment === "cod" ? "COD" : "Razorpay",
      address,
    });
    clearCart();
    navigate("/order-success", { state: { order } });
  };

  const InputField = ({ label, field, type = "text", placeholder = "", required = true }: {
    label: string; field: keyof ShippingData; type?: string; placeholder?: string; required?: boolean;
  }) => (
    <div>
      <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        style={{ fontFamily: "'Manrope', sans-serif", borderColor: errors[field] ? "#DC2626" : "#E5E7EB", fontSize: "0.875rem" }}
        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
      />
      {errors[field] && <p style={{ color: "#DC2626", fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem" }} className="mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }} className="font-semibold mb-7">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    backgroundColor: step >= s ? "#0B1736" : "#E5E7EB",
                    color: step >= s ? "#FAF9F6" : "#9CA3AF",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                  className="flex items-center justify-center flex-shrink-0"
                >
                  {step > s ? "✓" : s}
                </div>
                <span style={{ fontFamily: "'Manrope', sans-serif", color: step === s ? "#0B1736" : "#9CA3AF", fontSize: "0.8rem", fontWeight: step === s ? 600 : 400 }}>
                  {["Address", "Review", "Payment"][i]}
                </span>
              </div>
              {i < 2 && <div style={{ height: "1px", backgroundColor: "#E5E7EB", flex: 1, minWidth: "20px" }} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-6">
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-lg font-semibold mb-5">Shipping Address</h2>

                {isAuthenticated && addresses.length > 0 && defaultAddress && (
                  <label className="flex items-center gap-3 mb-5 cursor-pointer">
                    <input type="checkbox" checked={useExisting} onChange={(e) => setUseExisting(e.target.checked)} style={{ accentColor: "#C99724" }} />
                    <div>
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.875rem", fontWeight: 600 }}>Use saved address</p>
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }}>
                        {defaultAddress.addressLine1}, {defaultAddress.city}, {defaultAddress.state} – {defaultAddress.pinCode}
                      </p>
                    </div>
                  </label>
                )}

                {!useExisting && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Full Name" field="fullName" />
                    <InputField label="Phone" field="phone" type="tel" />
                    <InputField label="Email" field="email" type="email" />
                    <div />
                    <div className="sm:col-span-2">
                      <InputField label="Address Line 1" field="addressLine1" placeholder="House no., street, area" />
                    </div>
                    <div className="sm:col-span-2">
                      <InputField label="Address Line 2" field="addressLine2" placeholder="Landmark, colony (optional)" required={false} />
                    </div>
                    <InputField label="City" field="city" />
                    <div>
                      <label style={{ fontFamily: "'Manrope', sans-serif", color: "#374151", fontSize: "0.8rem", fontWeight: 600 }} className="block mb-1.5">
                        State <span style={{ color: "#DC2626" }}>*</span>
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => update("state", e.target.value)}
                        style={{ fontFamily: "'Manrope', sans-serif", borderColor: "#E5E7EB", fontSize: "0.875rem" }}
                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-[#C99724] bg-white"
                      >
                        {INDIA_STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <InputField label="PIN Code" field="pinCode" placeholder="6-digit PIN" />
                  </div>
                )}

                <button
                  onClick={() => { if (validateStep1()) setStep(2); }}
                  style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                  className="mt-6 w-full sm:w-auto px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#152459] transition-colors"
                >
                  Continue to Review →
                </button>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-6">
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-lg font-semibold mb-5">Order Review</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3 items-center">
                      <img src={item.product.images[0]} alt={item.product.name} style={{ width: "60px", height: "74px", objectFit: "cover", borderRadius: "8px", backgroundColor: "#F3F4F6" }} />
                      <div className="flex-1">
                        <p style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736", fontSize: "0.9rem", fontWeight: 500 }}>{item.product.name}</p>
                        <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.75rem" }}>
                          Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 700, fontSize: "0.9rem" }}>
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: "#F9FAFB", borderRadius: "10px" }} className="mt-5 p-4">
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontSize: "0.8rem", fontWeight: 600 }} className="mb-2">Shipping to:</p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563", fontSize: "0.875rem" }}>
                    {address.fullName} · {address.phone}
                  </p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", color: "#4B5563", fontSize: "0.875rem" }}>
                    {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city}, {address.state} – {address.pinCode}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    style={{ border: "1px solid #E5E7EB", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
                    className="px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    style={{ backgroundColor: "#0B1736", color: "#FAF9F6", fontFamily: "'Manrope', sans-serif" }}
                    className="px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#152459] transition-colors"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-6">
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-lg font-semibold mb-5">Payment</h2>

                <div className="space-y-3">
                  {[
                    { value: "cod", label: "Cash on Delivery", desc: "Pay in cash when your order is delivered.", icon: "💵" },
                    { value: "razorpay", label: "Razorpay", desc: "Pay securely with UPI, Net Banking, or Card.", icon: "🔒" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      style={{
                        border: `2px solid ${payment === opt.value ? "#C99724" : "#E5E7EB"}`,
                        borderRadius: "12px",
                        backgroundColor: payment === opt.value ? "#FFFBEE" : "#fff",
                        cursor: "pointer",
                      }}
                      className="flex items-center gap-4 p-4"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={payment === opt.value as PaymentMethod}
                        onChange={() => setPayment(opt.value as PaymentMethod)}
                        style={{ accentColor: "#C99724" }}
                      />
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <p style={{ fontFamily: "'Manrope', sans-serif", color: "#0B1736", fontWeight: 600, fontSize: "0.9rem" }}>{opt.label}</p>
                        <p style={{ fontFamily: "'Manrope', sans-serif", color: "#6B7280", fontSize: "0.8rem" }}>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    style={{ border: "1px solid #E5E7EB", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
                    className="px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    style={{ backgroundColor: "#C99724", color: "#0B1736", fontFamily: "'Manrope', sans-serif" }}
                    className="flex-1 py-3 rounded-full text-sm font-bold hover:bg-[#E6C76A] transition-colors"
                  >
                    Place Order — {formatINR(total)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div>
            <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px" }} className="p-5 sticky top-24">
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#0B1736" }} className="text-base font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-sm">Subtotal</span>
                  <span style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 500 }} className="text-sm">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#6B7280", fontFamily: "'Manrope', sans-serif" }} className="text-sm">Shipping</span>
                  <span style={{ color: shipping === 0 ? "#065F46" : "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 500 }} className="text-sm">{shipping === 0 ? "Free" : formatINR(shipping)}</span>
                </div>
                <div style={{ borderTop: "1px solid #E5E7EB" }} className="pt-2.5 flex justify-between">
                  <span style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 700 }} className="text-sm">Total</span>
                  <span style={{ color: "#0B1736", fontFamily: "'Manrope', sans-serif", fontWeight: 700 }} className="text-base">{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
