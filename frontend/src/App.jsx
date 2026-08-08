import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { AppleLoadingScreen } from './components/AppleLoadingScreen';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SiriChatbot } from './components/SiriChatbot';
import { Toast } from './components/Toast';
import { PortalSelectionModal } from './components/PortalSelectionModal';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Support } from './pages/Support';
import { Stores } from './pages/Stores';
import { Gallery } from './pages/Gallery';
import { FAQ } from './pages/FAQ';
import { AdminPortal } from './pages/AdminPortal';
import { StaffPage } from './pages/StaffPage';
import { ReviewPage } from './pages/ReviewPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showGateway, setShowGateway] = useState(false);
  const location = useLocation();

  const isAdminPage = location.pathname === '/admin' || location.pathname === '/owner';

  const handleLoadingComplete = () => {
    setIsLoading(false);
    if (!sessionStorage.getItem('has_selected_portal')) {
      setShowGateway(true);
    }
  };

  const handleCloseGateway = () => {
    sessionStorage.setItem('has_selected_portal', 'true');
    setShowGateway(false);
  };

  return (
    <>
      <PortalSelectionModal isOpen={showGateway} onClose={handleCloseGateway} />
      <AppleLoadingScreen onComplete={handleLoadingComplete} />
      <div className="min-h-screen flex flex-col bg-apple-bg-light dark:bg-apple-bg-dark text-apple-text-light dark:text-apple-text-dark font-sf transition-colors duration-300">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Support />} />
            <Route path="/support" element={<Support />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/tracking" element={<OrderTrackingPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/owner" element={<AdminPortal />} />
          </Routes>
        </main>

        {!isAdminPage && <Footer />}
        <SiriChatbot />
        <Toast />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <AppContent />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

