import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Camera, Smartphone, ChevronRight, Layers } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  // Framer Motion Scroll-Driven Parallax Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Parallax Transform Offsets
  const heroTextY = useTransform(smoothProgress, [0, 0.3], [0, -80]);
  const heroImageY = useTransform(smoothProgress, [0, 0.3], [0, -120]);
  const heroImageScale = useTransform(smoothProgress, [0, 0.3], [1, 1.15]);
  const heroImageRotate = useTransform(smoothProgress, [0, 0.3], [0, -6]);
  const bgGlowScale = useTransform(smoothProgress, [0, 0.4], [1, 1.6]);
  const macbookParallaxY = useTransform(smoothProgress, [0.3, 0.7], [60, -40]);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setFeaturedProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div ref={containerRef} className="space-y-20 pb-20 overflow-hidden">
      
      {/* 3D Parallax Apple Hero Showcase with Dynamic Video Background & Centered Siri AI */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center bg-black text-white rounded-b-[48px] overflow-hidden pt-16 pb-12 shadow-2xl">
        
        {/* Dynamic Background Video Layer */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen pointer-events-none z-0 filter saturate-150 contrast-125"
          poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-technology-network-lines-and-dots-loop-27546-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-line-lights-animation-31804-large.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Gradient & Radial Mesh Overlay for Video Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-apple-bg-light dark:to-apple-bg-dark pointer-events-none z-0" />
        
        {/* Dynamic Parallax Siri Glow Circle */}
        <motion.div
          style={{ scale: bgGlowScale }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.22)_0,rgba(127,0,255,0.12)_45%,transparent_75%)] pointer-events-none z-0"
        />

        <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-8">
          
          {/* Floating Siri AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 backdrop-blur-2xl text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(0,210,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>ani Apple Store • Siri AI Powered Launch</span>
          </motion.div>

          {/* Parallax Hero Title */}
          <motion.div style={{ y: heroTextY }} className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-titanium leading-tight drop-shadow-2xl">
              iPhone 16 Pro
            </h1>

            <p className="text-2xl sm:text-3xl font-medium text-gray-200 tracking-tight">
              Hello, Apple Intelligence.
            </p>

            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
              Forged in Grade 5 Titanium. Powered by A18 Pro. Ask Siri AI Assistant anything in real-time.
            </p>

            {/* PROMINENT CENTER PAGE "ASK SIRI AI" BUTTON */}
            <div className="pt-4 flex flex-col items-center justify-center space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => window.dispatchEvent(new CustomEvent('open-siri'))}
                className="siri-hero-button group px-8 py-4 rounded-full flex items-center space-x-4 cursor-pointer text-white font-bold text-sm sm:text-base tracking-wide"
                title="Ask Siri AI Assistant"
              >
                <div className="siri-pulse-ring" />
                {/* Glowing Siri Orb inside Center Button */}
                <div className="w-9 h-9 rounded-full siri-orb flex items-center justify-center shadow-lg group-hover:rotate-45 transition-transform duration-500">
                  <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 font-extrabold text-white text-sm sm:text-base">
                    <span>Ask Siri AI Assistant</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black">Live</span>
                  </div>
                  <div className="text-[11px] font-normal text-cyan-200 opacity-90">Instant iPhone Prices, Specs & Trade-in Help</div>
                </div>
              </motion.button>

              {/* Quick Prompt Chips under Center Siri Button */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl pt-2">
                {[
                  { label: "💰 iPhone 16 Pro Price in India", query: "What is the price of iPhone 16 Pro Max in India?" },
                  { label: "⚖️ Compare 16 Pro vs 15 Pro", query: "Compare iPhone 16 Pro and 15 Pro Max" },
                  { label: "🔄 Trade-In Estimate", query: "How much trade in credit do I get for iPhone 13?" },
                  { label: "⚡ A18 Pro Specs", query: "What are the specs of A18 Pro chip?" },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-siri'));
                    }}
                    className="text-[11px] px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 border border-white/15 backdrop-blur-xl transition-all duration-200 hover:border-cyan-400/50 hover:scale-105"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                to="/shop?category=iPhone"
                className="px-8 py-3.5 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-xs transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Buy iPhone 16 Pro
              </Link>
              <Link
                to="/shop?series=16%20Pro"
                className="inline-flex items-center space-x-1.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all backdrop-blur-xl border border-white/15"
              >
                <span>Compare Specs</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* 3D Scroll Parallax Phone Cutout (Pure Phone, Zero Background Box) */}
          <motion.div
            style={{ y: heroImageY, scale: heroImageScale, rotate: heroImageRotate }}
            transition={{ type: "spring", stiffness: 100 }}
            className="pt-6 flex justify-center perspective-1000 z-10"
          >
            <div className="relative max-w-[320px] sm:max-w-[360px] w-full flex justify-center filter drop-shadow-[0_30px_60px_rgba(0,210,255,0.45)] hover:scale-105 transition-transform duration-500">
              <svg viewBox="0 0 380 760" className="w-full h-auto max-h-[440px] object-contain">
                {/* Grade 5 Desert Titanium Bezels */}
                <rect x="10" y="10" width="360" height="740" rx="54" fill="#bfa088" stroke="#d4b69c" strokeWidth="4"/>
                <rect x="18" y="18" width="344" height="724" rx="46" fill="#0b0b0e" stroke="#1c1c1e" strokeWidth="2"/>
                {/* OLED Screen Area */}
                <rect x="26" y="26" width="328" height="708" rx="38" fill="#030308"/>
                {/* Screen Wallpaper Aura */}
                <radialGradient id="phoneGlow" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.45"/>
                  <stop offset="40%" stopColor="#7f00ff" stopOpacity="0.3"/>
                  <stop offset="85%" stopColor="#ff007f" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#030308" stopOpacity="1"/>
                </radialGradient>
                <rect x="26" y="26" width="328" height="708" rx="38" fill="url(#phoneGlow)"/>
                
                {/* Dynamic Island */}
                <rect x="140" y="42" width="100" height="28" rx="14" fill="#000000"/>
                <circle cx="160" cy="56" r="6" fill="#0d0d12"/>
                <circle cx="218" cy="56" r="5" fill="#00d2ff" opacity="0.9"/>
                
                {/* iOS Lockscreen Artwork */}
                <text x="190" y="140" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="48" font-weight="800" text-anchor="middle" opacity="0.9">9:41</text>
                <text x="190" y="170" fill="#a3a199" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">Thursday, August 6</text>

                {/* iPhone Model Label */}
                <rect x="65" y="320" width="250" height="180" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                <text x="190" y="370" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="22" font-weight="900" text-anchor="middle">iPhone 16 Pro</text>
                <text x="190" y="400" fill="#bfa088" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Grade 5 Titanium</text>
                <text x="190" y="435" fill="#00d2ff" font-family="-apple-system, sans-serif" font-size="12" font-weight="600" text-anchor="middle">Apple Intelligence • A18 Pro</text>

                {/* Home Indicator Bar */}
                <rect x="125" y="718" width="130" height="5" rx="2.5" fill="#ffffff" opacity="0.8"/>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Titanium Innovation Features Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-apple-accent">Next-Gen Engineering</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
            Designed to wow. Engineered to last.
          </h2>
          <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark max-w-lg mx-auto">
            Discover the breakthrough technology powering the latest Apple generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="glass-card rounded-3xl p-8 space-y-4 border border-black/5 dark:border-white/10 hover:border-apple-accent/40 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-apple-accent/10 text-apple-accent flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark">A18 Pro Chip</h3>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
              6-core CPU with 2 performance and 4 efficiency cores. Unlocks desktop-grade ray tracing and Apple Intelligence features with extreme battery efficiency.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="glass-card rounded-3xl p-8 space-y-4 border border-black/5 dark:border-white/10 hover:border-cyan-400/40 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark">Camera Control</h3>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
              Tactile sapphire glass button with multi-stage press. Adjust exposure, depth of field, and optical zoom with intuitive touch gestures.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="glass-card rounded-3xl p-8 space-y-4 border border-black/5 dark:border-white/10 hover:border-purple-400/40 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark">Grade 5 Titanium</h3>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
              Micro-blasted finish using the same alloy selected for spacecraft missions. Incredible strength-to-weight ratio for our lightest Pro models ever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MacBook Pro Parallax Scroll Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: macbookParallaxY }}
          className="glass-card rounded-[36px] p-8 sm:p-14 border border-black/5 dark:border-white/10 bg-gradient-to-r from-black via-zinc-900 to-black text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
              MacBook Pro 16" M3 Max
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-titanium">
              Mind-blowing. Head-turning.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Up to 16-core CPU, 40-core GPU, 128GB Unified Memory, and Liquid Retina XDR display. The ultimate workstation laptop curated by Andrew.
            </p>
            <Link
              to="/shop?category=MacBook"
              className="inline-block px-8 py-3.5 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-bold transition-all shadow-xl hover:scale-105"
            >
              Explore MacBook Pro
            </Link>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054299"
              alt="MacBook Pro M3 Max"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop";
              }}
              className="max-h-80 object-contain filter drop-shadow-[0_20px_50px_rgba(0,210,255,0.25)] transition-transform hover:scale-105 duration-300"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Products Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
              Featured Flagship Models
            </h2>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark">
              Explore iPhones and MacBooks available at Andrew's Apple Store.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-apple-accent hover:underline"
          >
            <span>View full catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setSelectedProduct(prod)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Apple Trade-In Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-apple-accent/10 via-purple-500/10 to-pink-500/10 border border-apple-accent/20">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-apple-accent">Apple Trade In</span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
              Get ₹15,000–₹67,500 in credit when you trade in iPhone 11 or higher.
            </h3>
            <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark">
              It’s good for you and good for the planet. Trade in online or at any Apple Store location.
            </p>
            <Link
              to="/about"
              className="inline-block px-6 py-3 rounded-full bg-apple-accent text-white text-xs font-semibold hover:bg-apple-accentHover transition-colors shadow-lg"
            >
              Estimate your trade-in
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Quick View */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
