import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { CookieBanner } from './components/common/CookieBanner';
import { NotificationToast } from './components/common/NotificationToast';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrderTypeSelectPage } from './pages/OrderTypeSelectPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { FindUsPage } from './pages/FindUsPage';
import { OffersPage } from './pages/OffersPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPolicyPage } from './pages/policies/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/policies/CookiePolicyPage';
import { TermsPage } from './pages/policies/TermsPage';
import { DeliveryPolicyPage } from './pages/policies/DeliveryPolicyPage';
import { RefundPolicyPage } from './pages/policies/RefundPolicyPage';
import { AccessibilityPage } from './pages/policies/AccessibilityPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminMenuPage } from './pages/admin/AdminMenuPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public Layout Wrapper
function PublicLayout({
  children,
  onOpenCart,
}: {
  children: React.ReactNode;
  onOpenCart: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#202B32]">
      <Navbar onOpenCart={onOpenCart} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Notification Container
function NotificationContainer() {
  const { activeNotification, closeNotification } = useStore();
  return <NotificationToast notification={activeNotification} onClose={closeNotification} />;
}

export default function App() {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <NotificationContainer />
        <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
        <CookieBanner />

        <Routes>
          {/* PUBLIC ROUTES (1-22) */}
          <Route
            path="/"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <HomePage onOpenCart={() => setCartDrawerOpen(true)} />
              </PublicLayout>
            }
          />
          <Route
            path="/menu"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <MenuPage onOpenCart={() => setCartDrawerOpen(true)} />
              </PublicLayout>
            }
          />
          <Route
            path="/menu/:category"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <MenuPage onOpenCart={() => setCartDrawerOpen(true)} />
              </PublicLayout>
            }
          />
          <Route
            path="/product/:slug"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <ProductDetailPage onOpenCart={() => setCartDrawerOpen(true)} />
              </PublicLayout>
            }
          />
          <Route
            path="/order"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <OrderTypeSelectPage />
              </PublicLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <CartPage />
              </PublicLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <CheckoutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/order-confirmation/:id"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <OrderConfirmationPage />
              </PublicLayout>
            }
          />
          <Route
            path="/track-order"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <TrackOrderPage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/gallery"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <GalleryPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <ContactPage />
              </PublicLayout>
            }
          />
          <Route
            path="/find-us"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <FindUsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/offers"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <OffersPage />
              </PublicLayout>
            }
          />
          <Route
            path="/faq"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <FaqPage />
              </PublicLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <PrivacyPolicyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/cookie-policy"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <CookiePolicyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/terms-and-conditions"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <TermsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/delivery-policy"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <DeliveryPolicyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/refund-and-cancellation"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <RefundPolicyPage />
              </PublicLayout>
            }
          />
          <Route
            path="/accessibility"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <AccessibilityPage />
              </PublicLayout>
            }
          />
          <Route
            path="/404"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <NotFoundPage />
              </PublicLayout>
            }
          />

          {/* ADMINISTRATION ROUTES (23-35) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <AdminOrdersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <AdminLayout>
                <AdminOrderDetailPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AdminLayout>
                <AdminMenuPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <AdminLayout>
                <AdminProductFormPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <AdminLayout>
                <AdminProductFormPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <AdminLayout>
                <AdminInventoryPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/offers"
            element={
              <AdminLayout>
                <AdminOffersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminLayout>
                <AdminCustomersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <AdminLayout>
                <AdminGalleryPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <AdminSettingsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminLayout>
                <AdminAnalyticsPage />
              </AdminLayout>
            }
          />

          {/* Catch-all 404 */}
          <Route
            path="*"
            element={
              <PublicLayout onOpenCart={() => setCartDrawerOpen(true)}>
                <NotFoundPage />
              </PublicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
