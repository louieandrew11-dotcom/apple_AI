import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { ProductModal } from '../components/ProductModal';

export const Wishlist = () => {
  const { wishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
          <Heart size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-apple-text-light dark:text-apple-text-dark">Your Wishlist is empty.</h1>
        <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark max-w-md mx-auto">
          Save your dream iPhone products by clicking the heart icon on any product card.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-semibold transition-colors shadow-lg"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center space-x-3">
        <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
        <h1 className="text-3xl sm:text-5xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
          Saved Favorites ({wishlist.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
