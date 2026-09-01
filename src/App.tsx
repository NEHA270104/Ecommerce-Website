import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";

import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import NotFoundPage from "./pages/NotFoundPage";

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Storefront */}
            <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
            <Route path="/shop" element={<StorefrontLayout><ShopPage /></StorefrontLayout>} />
            <Route path="/categories" element={<StorefrontLayout><CategoriesPage /></StorefrontLayout>} />
            <Route path="/category/:slug" element={<StorefrontLayout><ShopPage /></StorefrontLayout>} />
            <Route path="/product/:slug" element={<StorefrontLayout><ProductDetailPage /></StorefrontLayout>} />
            <Route path="/cart" element={<StorefrontLayout><CartPage /></StorefrontLayout>} />
            <Route path="/checkout" element={<StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
            <Route path="/order-success" element={<StorefrontLayout><OrderSuccessPage /></StorefrontLayout>} />
            <Route path="/account" element={<StorefrontLayout><AccountPage /></StorefrontLayout>} />
            <Route path="/about" element={<StorefrontLayout><AboutPage /></StorefrontLayout>} />
            <Route path="/contact" element={<StorefrontLayout><ContactPage /></StorefrontLayout>} />
            <Route path="/returns" element={<StorefrontLayout><ReturnPolicyPage /></StorefrontLayout>} />

            {/* Auth (no header/footer) */}
            <Route path="/auth/sign-in" element={<SignInPage />} />
            <Route path="/auth/sign-up" element={<SignUpPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="customers" element={<AdminCustomers />} />
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<StorefrontLayout><NotFoundPage /></StorefrontLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
