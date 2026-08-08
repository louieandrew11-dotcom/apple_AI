import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Check, Star, Shield, Cpu, Camera, Battery, Smartphone, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions ? product.storageOptions[0] : null);

  if (!product) return null;

  const isLiked = wishlist.some(item => item.id === product.id);
  const currentPrice = selectedStorage ? selectedStorage.price : product.price;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 dark:border-white/10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-apple-text-light dark:text-apple-text-dark transition-colors"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image Showcase */}
            <div className="flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded-2xl p-6 relative">
              <img
                src={selectedColor ? selectedColor.image : product.image}
                alt={product.name}
                onError={(e) => {
                  if (product.fallbackImage) {
                    e.target.src = product.fallbackImage;
                  }
                }}
                className="max-h-72 object-contain drop-shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <span className="mt-4 text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                Selected Color: <strong className="text-apple-text-light dark:text-apple-text-dark">{selectedColor?.name}</strong>
              </span>
            </div>

            {/* Product Details & Specs */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-apple-accent">
                  {product.series} Series
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight mt-1">
                  {product.name}
                </h2>
                <p className="text-sm italic text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-0.5">
                  "{product.tagline}"
                </p>
                <div className="flex items-center space-x-2 mt-2 text-amber-500 text-xs font-semibold">
                  <Star size={14} fill="currentColor" />
                  <span>{product.rating} / 5.0 ({product.reviewCount} customer reviews)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-apple-text-light dark:text-apple-text-dark leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && (
                <div>
                  <label className="text-xs font-semibold text-apple-text-light dark:text-apple-text-dark block mb-2">
                    Finish: <span className="font-normal text-apple-text-subtleLight dark:text-apple-text-subtleDark">{selectedColor?.name}</span>
                  </label>
                  <div className="flex space-x-3">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        style={{ backgroundColor: c.hex }}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor?.name === c.name ? 'border-apple-accent scale-110 shadow-lg' : 'border-transparent opacity-80'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Option Selector */}
              {product.storageOptions && (
                <div>
                  <label className="text-xs font-semibold text-apple-text-light dark:text-apple-text-dark block mb-2">
                    Capacity:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.storageOptions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedStorage(s)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedStorage?.size === s.size
                            ? 'bg-apple-accent text-white border-apple-accent font-bold shadow-md'
                            : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-apple-text-light dark:text-apple-text-dark hover:border-apple-accent'
                        }`}
                      >
                        <div className="text-xs">{s.size}</div>
                        <div className="text-[10px] opacity-80">₹{s.price?.toLocaleString('en-IN')}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs Highlights Grid */}
              {product.specs && (
                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-apple-text-light dark:text-apple-text-dark">
                    <Smartphone size={14} className="text-apple-accent" />
                    <span><strong>Display:</strong> {product.specs.display}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-apple-text-light dark:text-apple-text-dark">
                    <Cpu size={14} className="text-apple-accent" />
                    <span><strong>Chip:</strong> {product.specs.chip}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-apple-text-light dark:text-apple-text-dark">
                    <Camera size={14} className="text-apple-accent" />
                    <span><strong>Camera:</strong> {product.specs.camera}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-apple-text-light dark:text-apple-text-dark">
                    <Battery size={14} className="text-apple-accent" />
                    <span><strong>Battery:</strong> {product.specs.battery}</span>
                  </div>
                </div>
              )}

              {/* Price & Add to Bag */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark block">Total Price</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-apple-text-light dark:text-apple-text-dark">
                      ₹{currentPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-3 rounded-2xl border transition-colors ${
                        isLiked ? 'text-red-500 border-red-500 bg-red-500/10' : 'border-black/10 dark:border-white/10 text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    </button>

                    <button
                      onClick={() => {
                        addToCart(product, selectedColor, selectedStorage);
                        onClose();
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-sm rounded-2xl transition-all shadow-lg active:scale-95"
                    >
                      <ShoppingBag size={18} />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(
                      new CustomEvent('open-siri', {
                        detail: {
                          query: `What are the No Cost EMI options and trade-in discount for ${product.name} (${selectedStorage ? selectedStorage.size : ''})?`
                        }
                      })
                    );
                  }}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 border border-cyan-400/40 text-cyan-400 dark:text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                  <span>Ask Siri AI for EMI Calculator & Trade-In Credit</span>
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
