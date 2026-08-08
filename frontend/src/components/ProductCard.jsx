import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions ? product.storageOptions[0] : null);

  const isLiked = wishlist.some(item => item.id === product.id);
  const displayPrice = selectedStorage ? selectedStorage.price : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-3xl p-5 flex flex-col justify-between relative group overflow-hidden border border-black/5 dark:border-white/10 hover:shadow-2xl transition-all"
    >
      {/* Top Badges & Wishlist */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark">
          {product.series} Series
        </span>

        <button
          onClick={() => toggleWishlist(product)}
          className={`p-2 rounded-full glass-card transition-colors ${
            isLiked ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-red-500'
          }`}
          title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-52 my-4 flex items-center justify-center cursor-pointer overflow-hidden" onClick={() => onQuickView(product)}>
        <img
          src={selectedColor ? selectedColor.image : product.image}
          alt={product.name}
          onError={(e) => {
            if (product.fallbackImage) {
              e.target.src = product.fallbackImage;
            }
          }}
          className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-apple-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
            New
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-apple-text-light dark:text-apple-text-dark tracking-tight">
              {product.name}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-amber-500 font-semibold">
              <Star size={12} fill="currentColor" />
              <span>{product.rating}</span>
            </div>
          </div>
          <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark line-clamp-1 italic">
            "{product.tagline}"
          </p>
        </div>

        {/* Color Palette Switcher */}
        {product.colors && (
          <div className="flex items-center space-x-2 pt-1">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                className={`w-4 h-4 rounded-full border border-black/20 dark:border-white/20 transition-transform ${
                  selectedColor?.name === color.name ? 'scale-125 ring-2 ring-apple-accent' : 'hover:scale-110 opacity-80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Storage Tier Selectors */}
        {product.storageOptions && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.storageOptions.map((storage, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedStorage(storage)}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                  selectedStorage?.size === storage.size
                    ? 'bg-apple-accent text-white border-apple-accent'
                    : 'bg-black/5 dark:bg-white/5 text-apple-text-light dark:text-apple-text-dark border-black/10 dark:border-white/10 hover:border-apple-accent'
                }`}
              >
                {storage.size}
              </button>
            ))}
          </div>
        )}

        {/* Price & Action Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/10">
          <div>
            <span className="text-[10px] text-apple-text-subtleLight dark:text-apple-text-subtleDark block">From</span>
            <span className="text-base sm:text-lg font-extrabold text-apple-text-light dark:text-apple-text-dark">
              ₹{displayPrice?.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onQuickView(product)}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-apple-text-light dark:text-apple-text-dark transition-colors"
              title="Quick View Specs"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => addToCart(product, selectedColor, selectedStorage)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95"
            >
              <ShoppingBag size={14} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Ask Siri AI for Price & EMI Direct Trigger */}
        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('open-siri', {
                detail: {
                  query: `What is the exact price, No Cost EMI breakdown, and key features of ${product.name}?`
                }
              })
            );
          }}
          className="w-full py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 dark:text-cyan-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Sparkles size={12} className="text-cyan-400 animate-pulse" />
          <span>Ask Siri AI for Price & EMI</span>
        </button>
      </div>
    </motion.div>
  );
};
