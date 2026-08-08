import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, Camera, Play, Image as ImageIcon, Eye, X, ChevronRight, 
  ChevronLeft, Smartphone, Maximize2, Layers, Cpu, Video, Palette, ShieldCheck,
  Search, Heart, Download, Share2, ZoomIn, ZoomOut, Filter, Sliders, Volume2,
  Watch, Laptop, Tablet, Headphones, Store, Check, Copy, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

export const Gallery = () => {
  const containerRef = useRef(null);

  // Framer Motion Scroll-Driven Parallax Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Parallax Transform Animations
  const headerY = useTransform(smoothProgress, [0, 0.25], [0, -60]);
  const heroGlowScale = useTransform(smoothProgress, [0, 0.3], [1, 1.4]);
  const cardParallaxY = useTransform(smoothProgress, [0.2, 0.8], [40, -40]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('desert');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('apple_gallery_favorites')) || [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomLevelSample, setZoomLevelSample] = useState(5);

  // iPhone 16 Pro Max Finishes
  const proFinishes = [
    { 
      id: 'desert', 
      name: 'Desert Titanium', 
      hex: '#b38b6d', 
      bg: 'from-[#e3c4a8] via-[#b38b6d] to-[#7a5c43]', 
      img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      specs: 'Grade 5 Titanium • Micro-blasted Finish • A18 Pro Chip'
    },
    { 
      id: 'natural', 
      name: 'Natural Titanium', 
      hex: '#86868b', 
      bg: 'from-[#d1d1d6] via-[#86868b] to-[#515154]', 
      img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
      specs: 'Aerospace Grade Alloy • Super Retina XDR • ProMotion 120Hz'
    },
    { 
      id: 'white', 
      name: 'White Titanium', 
      hex: '#f5f5f7', 
      bg: 'from-[#ffffff] via-[#e5e5ea] to-[#8e8e93]', 
      img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=80',
      specs: 'Ceramic Shield Glass • Ceramic Front • Sapphire Camera Cover'
    },
    { 
      id: 'black', 
      name: 'Black Titanium', 
      hex: '#1c1c1e', 
      bg: 'from-[#3a3a3c] via-[#1c1c1e] to-[#000000]', 
      img: 'https://images.unsplash.com/photo-1574944985070-8f30c4397220?auto=format&fit=crop&w=1200&q=80',
      specs: 'PVD Coated Titanium • Dynamic Island • Camera Control Button'
    }
  ];

  // Comprehensive Media Assets
  const mediaLibrary = [
    {
      id: 1,
      category: 'iphones',
      title: 'iPhone 16 Pro Max — Grade 5 Titanium Finish',
      type: 'photo',
      model: 'iPhone 16 Pro Max',
      src: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      badge: 'Titanium Design',
      desc: 'Forged in Grade 5 Titanium with a refined micro-blasted texture and thinnest borders on any Apple product.',
      tags: ['titanium', 'iphone 16 pro', 'design', 'a18 pro']
    },
    {
      id: 2,
      category: 'camera',
      title: '48MP Fusion Camera Macro Mode Sample',
      type: 'photo',
      model: 'Camera System',
      src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      badge: '48MP Ultra Wide Macro',
      desc: 'Capture microscopic detail with the all-new 48MP Ultra Wide sensor featuring quad-pixel autofocus and 0.5x macro mode.',
      tags: ['camera', 'macro', '48mp', 'sample']
    },
    {
      id: 3,
      category: 'iphones',
      title: 'A18 Pro Chip Architecture & 4K 120fps Cinema',
      type: 'video',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-technology-network-lines-and-dots-loop-27546-large.mp4',
      model: 'Hardware Architecture',
      src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      badge: '4K 120 FPS Dolby Vision',
      desc: 'Record studio-grade 4K 120 fps Dolby Vision video with zero shutter lag, powered by the 6-core A18 Pro GPU.',
      tags: ['a18 pro', '4k video', 'dolby vision', 'gpu']
    },
    {
      id: 4,
      category: 'macbooks',
      title: 'MacBook Pro 16" M3 Max — Space Black Edition',
      type: 'photo',
      model: 'MacBook Pro M3 Max',
      src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      badge: 'Liquid Retina XDR',
      desc: 'Unprecedented 16-core CPU performance with 1600 nits peak brightness display and breakthrough Space Black anodization.',
      tags: ['macbook pro', 'm3 max', 'laptop', 'space black']
    },
    {
      id: 5,
      category: 'camera',
      title: '5x Optical Telephoto 120mm Lens Sample',
      type: 'photo',
      model: 'Tetraprism Optics',
      src: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80',
      badge: '120mm Telephoto',
      desc: 'Get close-ups from farther away with the 5x Optical Telephoto camera available on both iPhone 16 Pro and 16 Pro Max.',
      tags: ['camera', 'telephoto', '5x zoom', 'optics']
    },
    {
      id: 6,
      category: 'iphones',
      title: 'Camera Control Button — Capacitive Touch Sensor',
      type: 'photo',
      model: 'Hardware Innovation',
      src: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
      badge: 'Sapphire Crystal Touch',
      desc: 'A force-sensing button wrapped in smooth sapphire crystal with haptic feedback for instant camera launch and visual intelligence.',
      tags: ['camera control', 'button', 'haptics', 'sapphire']
    },
    {
      id: 7,
      category: 'ipads',
      title: 'iPad Pro 13" M4 — Tandem OLED Ultra Retina XDR',
      type: 'photo',
      model: 'iPad Pro M4',
      src: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
      badge: '5.1mm Ultra Thin',
      desc: 'The thinnest Apple product ever made, featuring state-of-the-art Tandem OLED technology and M4 Neural Engine.',
      tags: ['ipad pro', 'm4', 'oled', 'tablet']
    },
    {
      id: 8,
      category: 'watches',
      title: 'Apple Watch Ultra 2 — Grade 5 Titanium Case',
      type: 'photo',
      model: 'Apple Watch Ultra 2',
      src: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80',
      badge: '3000 Nits Display',
      desc: 'Built for endurance and exploration with 100m water resistance, dual-frequency GPS, and S9 SiP Double Tap gesture.',
      tags: ['apple watch', 'ultra 2', 'titanium', 'fitness']
    },
    {
      id: 9,
      category: 'audio',
      title: 'AirPods Max — Personalized Spatial Audio',
      type: 'photo',
      model: 'AirPods Max',
      src: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      badge: 'Active Noise Cancellation',
      desc: 'Over-ear headphones engineered with custom acoustic design, Apple H1 chip, and dynamic head tracking.',
      tags: ['airpods max', 'audio', 'spatial audio', 'headphones']
    },
    {
      id: 10,
      category: 'stores',
      title: 'Apple BKC Mumbai — Flagship Retail Store',
      type: 'photo',
      model: 'Apple Store BKC',
      src: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80',
      badge: 'India Flagship',
      desc: 'Located at Jio World Drive BKC Mumbai, featuring a handcrafted timber ceiling and solar array powering 100% renewable operations.',
      tags: ['apple bkc', 'mumbai', 'store', 'retail']
    },
    {
      id: 11,
      category: 'stores',
      title: 'Apple Fifth Avenue Glass Cube — New York City',
      type: 'photo',
      model: 'Apple Fifth Avenue',
      src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
      badge: '24/7 Iconic Glass Cube',
      desc: 'The iconic glass cube on 5th Avenue NYC offering round-the-clock Genius Plaza support and Today at Apple workshops.',
      tags: ['fifth avenue', 'nyc', 'glass cube', '24/7']
    },
    {
      id: 12,
      category: 'iphones',
      title: 'iPhone 16 Standard Series — Ultramarine & Teal',
      type: 'photo',
      model: 'iPhone 16 & 16 Plus',
      src: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80',
      badge: 'Color Infused Glass',
      desc: 'Color-infused back glass with ceramic shield front cover 2x tougher than any smartphone glass, powered by A18.',
      tags: ['iphone 16', 'ultramarine', 'color glass', 'a18']
    }
  ];

  const zoomSamples = {
    0.5: { label: '0.5x Ultra Wide Macro', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80', note: '13mm Equivalent • f/2.2 Aperture • 48MP Sensor' },
    1: { label: '1x Main Fusion Lens', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80', note: '24mm Equivalent • 2.44µm Quad Pixel • f/1.78' },
    2: { label: '2x Telephoto Crop', img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80', note: '48mm Equivalent • 12MP Quad-pixel Sensor Crop' },
    5: { label: '5x Optical Telephoto', img: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80', note: '120mm Equivalent • Tetraprism Design • 3D Sensor Shift' },
    25: { label: '25x Digital Super Zoom', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', note: '600mm Digital Crop • AI Image Stabilization Engine' }
  };

  const toggleFavorite = (itemId) => {
    let updated = favorites.includes(itemId) ? favorites.filter(id => id !== itemId) : [...favorites, itemId];
    setFavorites(updated);
    localStorage.setItem('apple_gallery_favorites', JSON.stringify(updated));
  };

  const filteredMedia = useMemo(() => {
    return mediaLibrary.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesType = mediaTypeFilter === 'all' || item.type === mediaTypeFilter;
      const matchesSearch = !searchQuery.trim() || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFav = !showFavoritesOnly || favorites.includes(item.id);

      return matchesCategory && matchesType && matchesSearch && matchesFav;
    });
  }, [activeCategory, mediaTypeFilter, searchQuery, showFavoritesOnly, favorites]);

  const currentFinish = proFinishes.find(f => f.id === selectedColor) || proFinishes[0];

  const handleNextSlide = () => {
    if (lightboxIndex !== null && filteredMedia.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredMedia.length);
      setZoomLevel(1);
    }
  };

  const handlePrevSlide = () => {
    if (lightboxIndex !== null && filteredMedia.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filteredMedia.length) % filteredMedia.length);
      setZoomLevel(1);
    }
  };

  const activeLightboxItem = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  return (
    <div ref={containerRef} className="space-y-16 pb-20 overflow-hidden select-none">
      
      {/* 1. PARALLAX HERO HEADER BANNER */}
      <section className="relative min-h-[50vh] flex items-center justify-center text-center bg-black text-white rounded-b-[48px] overflow-hidden pt-12 pb-12 shadow-2xl">
        
        {/* Dynamic Motion Parallax Glow Mesh */}
        <motion.div
          style={{ scale: heroGlowScale }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.25)_0,rgba(127,0,255,0.15)_45%,transparent_75%)] pointer-events-none z-0"
        />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 backdrop-blur-2xl text-xs font-bold text-cyan-300 shadow-[0_0_25px_rgba(0,210,255,0.25)]"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span> Apple Media & 4K Studio Gallery</span>
          </motion.div>

          <motion.div style={{ y: headerY }} className="space-y-3">
            <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-titanium leading-tight drop-shadow-2xl">
              Visual Experience
            </h1>
            <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto font-medium leading-relaxed">
              Clean. Simple. Expressive. Explore Grade 5 Titanium finishes, 48MP macro optical samples, and 4K cinema assets.
            </p>
          </motion.div>

          {/* Quick Siri Assistant Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('open-siri', {
                    detail: {
                      query: "Show me the specs and finish details of iPhone 16 Pro Max Grade 5 Titanium."
                    }
                  })
                );
              }}
              className="px-6 py-2.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 dark:text-cyan-300 text-xs font-bold inline-flex items-center gap-2 transition-all hover:scale-105 shadow-md active:scale-95"
            >
              <Sparkles size={14} className="animate-spin-slow" />
              <span>Ask Siri AI for Camera & Material Specs </span>
            </button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* 2. CLEAN & MINIMALIST 360° TITANIUM COLOR INSPECTOR */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-[36px] p-6 sm:p-12 border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-black/80 via-black/60 to-apple-bg-light dark:to-apple-bg-dark"
        >
          {/* Finish Left Info */}
          <div className="lg:col-span-5 space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-cyan-400 border border-cyan-400/30">
              <Palette className="w-3.5 h-3.5" />
              <span>360° Finish Inspector</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              iPhone 16 Pro Max <br />
              <span className={`bg-gradient-to-r ${currentFinish.bg} text-transparent bg-clip-text drop-shadow-md`}>
                {currentFinish.name}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
              {currentFinish.specs}
            </p>

            {/* Clean Color Dots */}
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">Select Titanium Finish:</label>
              <div className="flex items-center space-x-3">
                {proFinishes.map(finish => (
                  <button
                    key={finish.id}
                    onClick={() => setSelectedColor(finish.id)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      selectedColor === finish.id
                        ? 'ring-4 ring-cyan-400 scale-110 shadow-[0_0_20px_rgba(0,210,255,0.4)]'
                        : 'hover:scale-105 border border-white/20 opacity-80'
                    }`}
                    style={{ backgroundColor: finish.hex }}
                    title={finish.name}
                  >
                    {selectedColor === finish.id && (
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-md animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => setLightboxIndex(0)}
                className="px-6 py-3 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-xs transition-all shadow-xl hover:scale-105 flex items-center space-x-2 active:scale-95"
              >
                <Maximize2 size={14} />
                <span>Fullscreen Studio View</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentFinish.hex);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/15 flex items-center space-x-1.5"
              >
                {copiedLink ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span>{copiedLink ? 'HEX Copied!' : 'Copy Hex'}</span>
              </button>
            </div>
          </div>

          {/* Finish Right Smooth Preview Card */}
          <div className="lg:col-span-7 relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-black/60 border border-white/15 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentFinish.id}
                initial={{ opacity: 0, scale: 0.92, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.92, rotateY: 15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                src={currentFinish.img}
                alt={currentFinish.name}
                className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-700 filter drop-shadow-2xl"
              />
            </AnimatePresence>

            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-[11px] font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span>Grade 5 Titanium Alloy</span>
            </div>
          </div>
        </motion.section>

        {/* 3. OPTICAL ZOOM INSPECTOR TOOL WITH MOTION SLIDER */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-[32px] p-6 sm:p-10 border border-black/5 dark:border-white/10 shadow-xl space-y-6 bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-purple-950/30"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
                <Camera size={16} />
                <span className="uppercase tracking-wider">Optical Zoom Inspector</span>
              </div>
              <h3 className="text-2xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight mt-1">
                48MP Tetraprism Optics & Macro Samples
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {[0.5, 1, 2, 5, 25].map(z => (
                <button
                  key={z}
                  onClick={() => setZoomLevelSample(z)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    zoomLevelSample === z
                      ? 'bg-cyan-400 text-black font-black shadow-lg shadow-cyan-400/30 scale-105'
                      : 'bg-black/20 dark:bg-white/10 text-apple-text-light dark:text-apple-text-dark hover:bg-black/30'
                  }`}
                >
                  {z}x
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-cyan-400/30 shadow-2xl bg-black">
              <AnimatePresence mode="wait">
                <motion.img
                  key={zoomLevelSample}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  src={zoomSamples[zoomLevelSample].img}
                  alt={zoomSamples[zoomLevelSample].label}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300">
                {zoomSamples[zoomLevelSample].label}
              </div>
            </div>

            <div className="md:col-span-4 space-y-4">
              <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Focal Length & Lens Specs</span>
                <h4 className="text-base font-extrabold text-white">{zoomSamples[zoomLevelSample].label}</h4>
                <p className="text-xs text-gray-300 font-mono leading-relaxed">{zoomSamples[zoomLevelSample].note}</p>
              </div>
              <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed font-medium">
                Tap the optical zoom multipliers above to test 0.5x Ultra Wide Macro focal length up to 5x Optical 120mm Tetraprism Zoom.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 4. CLEAN SEARCH, CATEGORIES & TYPE FILTER TOOLBAR */}
        <section className="space-y-6">
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-black/5 dark:border-white/10 space-y-4 shadow-xl">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Titanium, 48MP Macro, M3 Max, BKC..."
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs sm:text-sm rounded-full pl-10 pr-4 py-2.5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-400 hidden sm:inline">Type:</span>
                {[
                  { id: 'all', label: 'All Types' },
                  { id: 'photo', label: '📷 Photos' },
                  { id: 'video', label: '🎥 Videos / 4K' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setMediaTypeFilter(t.id)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${
                      mediaTypeFilter === t.id
                        ? 'bg-apple-accent text-white shadow-md'
                        : 'bg-black/5 dark:bg-white/10 text-apple-text-light dark:text-apple-text-dark hover:bg-black/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}

                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                    showFavoritesOnly
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-black/5 dark:bg-white/10 text-red-400 hover:bg-black/10'
                  }`}
                >
                  <Heart size={13} fill={showFavoritesOnly ? "currentColor" : "none"} />
                  <span>Favorites ({favorites.length})</span>
                </button>
              </div>
            </div>

            {/* Category Selector Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5 dark:border-white/10">
              {[
                { id: 'all', label: 'All Media Assets', icon: Layers },
                { id: 'iphones', label: 'iPhone 16 Pro & Base', icon: Smartphone },
                { id: 'camera', label: '48MP Camera & Optics', icon: Camera },
                { id: 'macbooks', label: 'MacBook Pro & M3', icon: Laptop },
                { id: 'ipads', label: 'iPad Pro M4', icon: Tablet },
                { id: 'watches', label: 'Apple Watch Ultra', icon: Watch },
                { id: 'audio', label: 'AirPods Max & Pro', icon: Headphones },
                { id: 'stores', label: 'Apple Global Stores', icon: Store }
              ].map(cat => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                      activeCategory === cat.id
                        ? 'bg-cyan-400 text-black font-black shadow-md scale-105'
                        : 'bg-black/5 dark:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark hover:bg-black/10'
                    }`}
                  >
                    <IconComp size={13} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 3D PARALLAX TILT MEDIA GRID */}
          {filteredMedia.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-4">
              <p className="text-lg font-bold text-apple-text-light dark:text-apple-text-dark">No media assets found matching your filter criteria.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setMediaTypeFilter('all');
                  setSearchQuery('');
                  setShowFavoritesOnly(false);
                }}
                className="px-6 py-2.5 rounded-full bg-apple-accent text-white text-xs font-bold hover:bg-apple-accentHover transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div 
              style={{ y: cardParallaxY }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMedia.map((item, idx) => {
                const isFav = favorites.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -10, 
                      scale: 1.03,
                      rotateX: 2,
                      rotateY: -2
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="glass-card rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-xl cursor-pointer group flex flex-col justify-between"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <div className="relative h-64 overflow-hidden bg-black/40">
                      <img
                        src={item.src}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter saturate-110"
                      />

                      <span className="absolute top-3.5 left-3.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 shadow-md">
                        {item.badge}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className={`absolute top-3.5 right-3.5 p-2 rounded-full glass-card transition-transform active:scale-90 ${
                          isFav ? 'text-red-500 bg-red-500/20' : 'text-gray-300 hover:text-red-500'
                        }`}
                        title={isFav ? "Remove Favorite" : "Save Favorite"}
                      >
                        <Heart size={15} fill={isFav ? "currentColor" : "none"} />
                      </button>

                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider block">
                          {item.model}
                        </span>
                        <h3 className="font-extrabold text-base text-apple-text-light dark:text-apple-text-dark group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-apple-accent font-bold">
                        <span className="flex items-center gap-1">
                          <Maximize2 size={13} /> Full HD Studio View
                        </span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

      </div>

      {/* 6. FULLSCREEN LIGHTBOX MODAL & SLIDESHOW */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 select-none"
          >
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
              title="Previous Item (Left Arrow)"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
              title="Next Item (Right Arrow)"
            >
              <ChevronRight size={24} />
            </button>

            <div className="relative max-w-5xl w-full bg-[#1c1c1e] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
              
              <div className="p-4 bg-black/80 flex items-center justify-between border-b border-white/10 text-white">
                <div>
                  <h3 className="font-extrabold text-base text-cyan-400">{activeLightboxItem.title}</h3>
                  <p className="text-xs text-gray-400">{activeLightboxItem.model} • {lightboxIndex + 1} of {filteredMedia.length}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setZoomLevel(prev => (prev === 1 ? 1.5 : 1))}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    title="Toggle Zoom"
                  >
                    {zoomLevel === 1 ? <ZoomIn size={18} /> : <ZoomOut size={18} />}
                  </button>

                  <button
                    onClick={() => toggleFavorite(activeLightboxItem.id)}
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                      favorites.includes(activeLightboxItem.id) ? 'text-red-500' : 'text-gray-300'
                    }`}
                  >
                    <Heart size={18} fill={favorites.includes(activeLightboxItem.id) ? "currentColor" : "none"} />
                  </button>

                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="relative max-h-[65vh] h-[65vh] overflow-hidden flex items-center justify-center bg-black">
                {activeLightboxItem.type === 'video' && activeLightboxItem.videoUrl ? (
                  <video
                    controls
                    autoPlay
                    className="max-h-full max-w-full object-contain rounded-xl"
                    src={activeLightboxItem.videoUrl}
                  />
                ) : (
                  <motion.img
                    animate={{ scale: zoomLevel }}
                    transition={{ type: "spring", stiffness: 200 }}
                    src={activeLightboxItem.src}
                    alt={activeLightboxItem.title}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              <div className="p-6 bg-black/90 text-white space-y-3 border-t border-white/10">
                <p className="text-xs text-gray-300 leading-relaxed">{activeLightboxItem.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeLightboxItem.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
