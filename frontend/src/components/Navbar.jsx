import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, Heart, Sun, Moon, Search, Menu, X, Sparkles, Lock, Bell, Truck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ onOpenSearch }) => {
  const { isDark, toggleTheme } = useTheme();
  const { totalCount } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // Active Order Check
  const activeOrderId = localStorage.getItem('last_order_id');
  const hasActiveOrder = !!activeOrderId;

  // 1-Minute AI News Analysis Popup State
  const aiNewsItems = [
    {
      title: " Apple Genius AI News Analysis • iOS 18.2",
      badge: "AI Hardware Insight",
      text: "Apple Intelligence introduced Visual Intelligence & Image Playground with 40% faster neural processing on A18 Pro chip."
    },
    {
      title: " iPhone 16 Pro Max Benchmark Breakdown",
      badge: "Performance Benchmark",
      text: "A18 Pro 3nm chip breaks Geekbench Single-Core records at 3,550 points with 20% enhanced thermal dissipation."
    },
    {
      title: " Camera Control Button Tech Analysis",
      badge: "Hardware Innovation",
      text: "Capacitive force-sensor button with tactile Taptic Engine response supports zero-shutter-lag 4K 120fps Dolby Vision."
    },
    {
      title: " Grade 5 Titanium Durability Report",
      badge: "Materials Science",
      text: "Micro-blasted titanium frame combined with Ceramic Shield front glass offers 2x fracture resistance against drops."
    },
    {
      title: " Apple Store Trade-In Credit Surge",
      badge: "Market Value Spike",
      text: "Instant Trade-In program offers up to ₹42,000 credit for iPhone 14 Pro towards iPhone 16 series at BKC & Saket."
    }
  ];

  const [currentNewsIdx, setCurrentNewsIdx] = useState(0);
  const [showNewsBanner, setShowNewsBanner] = useState(false);

  // Trigger AI News Banner every 60 seconds (1 minute)
  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIdx(prev => (prev + 1) % aiNewsItems.length);
      setShowNewsBanner(true);
    }, 60000);
    return () => clearInterval(newsInterval);
  }, []);

  const navLinks = [
    { name: 'Store', path: '/' },
    { name: 'iPhone', path: '/shop?category=iPhone' },
    { name: 'Media Library', path: '/gallery' },
    { name: 'Locations', path: '/stores' },
    { name: 'Support', path: '/support' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Owner Portal 🔐', path: '/admin' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        
        {/* Apple Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-200 flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-wider lowercase text-cyan-400">ani</span>
            <span className="text-lg text-apple-text-light dark:text-apple-text-dark"></span>
            <span className="text-sm font-semibold tracking-normal hidden sm:inline-block text-apple-text-light dark:text-apple-text-dark">Apple Store</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-5 text-xs font-medium tracking-wide">
          <Link to="/" className={`transition-colors duration-200 hover:text-apple-accent ${isActive('/') ? 'text-apple-accent font-semibold' : 'text-apple-text-subtleLight dark:text-apple-text-subtleDark'}`}>Store</Link>
          <Link to="/shop?category=iPhone" className={`transition-colors duration-200 hover:text-apple-accent ${isActive('/shop') ? 'text-apple-accent font-semibold' : 'text-apple-text-subtleLight dark:text-apple-text-subtleDark'}`}>iPhone</Link>
          <Link to="/gallery" className={`transition-colors duration-200 hover:text-apple-accent ${isActive('/gallery') ? 'text-apple-accent font-semibold' : 'text-apple-text-subtleLight dark:text-apple-text-subtleDark'}`}>Media Library</Link>
          <Link to="/stores" className={`transition-colors duration-200 hover:text-apple-accent ${isActive('/stores') ? 'text-apple-accent font-semibold' : 'text-apple-text-subtleLight dark:text-apple-text-subtleDark'}`}>Locations</Link>
          <Link to="/support" className={`transition-colors duration-200 hover:text-apple-accent ${isActive('/support') ? 'text-apple-accent font-semibold' : 'text-apple-text-subtleLight dark:text-apple-text-subtleDark'}`}>Support</Link>
          <Link to="/about" className={`transition-colors duration-200 hover:text-apple-accent ${isActive('/about') ? 'text-apple-accent font-semibold' : 'text-apple-text-subtleLight dark:text-apple-text-subtleDark'}`}>About</Link>
          <Link to="/faq" className={`transition-colors duration-200 hover:text-apple-accent ${isActive('/faq') ? 'text-apple-accent font-semibold' : 'text-apple-text-subtleLight dark:text-apple-text-subtleDark'}`}>FAQ</Link>
        </nav>


        {/* Right Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Owner Portal Glowing Header Button */}
          <Link
            to="/admin"
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/40 text-xs font-bold text-purple-300 transition-all hover:scale-105 shadow-sm"
            title="Owner & Admin Portal"
          >
            <Lock size={13} className="text-purple-400" />
            <span className="hidden lg:inline">Owner Portal 🔐</span>
          </Link>

          {/* Ask Siri AI Header Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-siri'))}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 border border-cyan-400/30 text-xs font-semibold text-apple-text-light dark:text-apple-text-dark transition-all hover:scale-105"
            title="Ask Siri AI Assistant"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">Ask Siri AI</span>
          </button>

          {/* Quick Search */}
          <Link
            to="/shop"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark hover:text-apple-accent transition-colors"
            title="Search Products"
          >
            <Search size={18} />
          </Link>

          {/* Order Notification Bell Icon & Popup Modal */}
          <div className="relative">
            <button
              onClick={() => setShowNotifModal(!showNotifModal)}
              className="relative p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark hover:text-amber-400 transition-colors"
              title="Order Delivery Notifications"
            >
              <Bell size={18} className={hasActiveOrder ? "animate-bounce text-amber-400" : ""} />
              {hasActiveOrder && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-emerald-400">
                  1
                </span>
              )}
            </button>

            {/* Notification Popup Dropdown Modal */}
            <AnimatePresence>
              {showNotifModal && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1c1c1e] text-apple-text-light dark:text-apple-text-dark rounded-3xl p-5 border border-black/10 dark:border-white/10 shadow-2xl z-50 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <Bell size={16} className="text-amber-400" />
                      <h4 className="font-extrabold text-xs">Live Order & Delivery Notifications</h4>
                    </div>
                    <button onClick={() => setShowNotifModal(false)} className="text-gray-400 hover:text-white text-xs">✕</button>
                  </div>

                  {hasActiveOrder ? (
                    <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl border border-emerald-500/30 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                          <CheckCircle2 size={12} /> Order Dispatched (Live)
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">{activeOrderId}</span>
                      </div>

                      <p className="text-xs font-semibold text-apple-text-light dark:text-apple-text-dark">
                        Driver <strong className="text-cyan-400">Vikram Singh</strong> (TVS iQube EV) is <strong className="text-emerald-400">35 Mins Away</strong> from your address!
                      </p>

                      <Link
                        to="/track"
                        onClick={() => setShowNotifModal(false)}
                        className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                      >
                        <Truck size={14} />
                        <span>Track Order & Delivery Status 🚚</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 text-center space-y-2 text-xs">
                      <p className="text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                        No active order in progress.
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Place an order at Checkout to enable live GPS express delivery tracking!
                      </p>
                      <Link
                        to="/shop"
                        onClick={() => setShowNotifModal(false)}
                        className="inline-block px-4 py-2 bg-apple-accent text-white font-bold text-xs rounded-xl shadow-md mt-1"
                      >
                        Browse Apple Products
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark hover:text-red-500 transition-colors"
            title="Wishlist"
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark hover:text-apple-accent transition-colors"
            title="Shopping Bag"
          >
            <ShoppingBag size={18} />
            {totalCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-apple-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {totalCount}
              </motion.span>
            )}
          </Link>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark hover:text-amber-500 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t border-black/5 dark:border-white/10 px-6 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium py-1.5 transition-colors ${
                  isActive(link.path)
                    ? 'text-apple-accent font-semibold'
                    : 'text-apple-text-light dark:text-apple-text-dark'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1-MINUTE AI GOOGLE & GROQ NEWS ANALYSIS POPUP BANNER */}
      <AnimatePresence>
        {showNewsBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-[#1c1c1e] text-white p-5 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-cyan-400 animate-spin" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                  {aiNewsItems[currentNewsIdx].badge} (1-Min AI Live News)
                </span>
              </div>
              <button onClick={() => setShowNewsBanner(false)} className="text-gray-400 hover:text-white text-xs">✕</button>
            </div>

            <h4 className="text-xs font-bold text-white">{aiNewsItems[currentNewsIdx].title}</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{aiNewsItems[currentNewsIdx].text}</p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] text-gray-500 font-mono">Updated via Google & Groq AI</span>
              <button
                onClick={() => setShowNewsBanner(false)}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[10px] rounded-lg transition-colors"
              >
                Dismiss News
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
