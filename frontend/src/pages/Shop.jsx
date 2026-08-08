import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSeries = searchParams.get('series') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters state
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [seriesFilter, setSeriesFilter] = useState(initialSeries);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(400000);
  const [sortBy, setSortBy] = useState('recommended');

  const categoryOptions = [
    { label: 'All Products', value: 'all' },
    { label: ' iPhone', value: 'iPhone' },
    { label: '💻 MacBook Laptops', value: 'MacBook' },
  ];

  const seriesOptions = [
    { label: 'All Series', value: 'all' },
    { label: 'iPhone 16 Pro', value: '16 Pro' },
    { label: 'iPhone 16', value: '16' },
    { label: 'iPhone 15 Pro', value: '15 Pro' },
    { label: 'iPhone SE', value: 'SE' },
    { label: 'MacBook Pro', value: 'MacBook Pro' },
    { label: 'MacBook Air', value: 'MacBook Air' },
  ];

  useEffect(() => {
    // Update state when search params change in URL
    const cat = searchParams.get('category') || 'all';
    const ser = searchParams.get('series') || 'all';
    setCategoryFilter(cat);
    setSeriesFilter(ser);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: categoryFilter,
      series: seriesFilter,
      search: searchQuery,
      maxPrice: maxPrice,
    })
      .then(data => {
        let sorted = [...data];
        if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
        setProducts(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [categoryFilter, seriesFilter, searchQuery, maxPrice, sortBy]);

  const handleCategorySelect = (val) => {
    setCategoryFilter(val);
    if (val === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', val);
    }
    setSearchParams(searchParams);
  };

  const handleSeriesSelect = (val) => {
    setSeriesFilter(val);
    if (val === 'all') {
      searchParams.delete('series');
    } else {
      searchParams.set('series', val);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
          Shop iPhone
        </h1>
        <p className="text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark">
          Explore all latest models, compare configurations, and select your favorite color & storage.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 space-y-4 border border-black/5 dark:border-white/10">
        
        {/* Category Main Selector Tabs */}
        <div className="flex items-center space-x-2 border-b border-black/5 dark:border-white/10 pb-3">
          {categoryOptions.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategorySelect(cat.value)}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
                categoryFilter === cat.value
                  ? 'bg-apple-accent text-white shadow-md scale-105'
                  : 'bg-black/5 dark:bg-white/10 text-apple-text-light dark:text-apple-text-dark hover:bg-black/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-text-subtleLight dark:text-apple-text-subtleDark" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search iPhones & MacBooks..."
              className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs sm:text-sm rounded-full pl-10 pr-4 py-2.5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
            />
          </div>

          {/* Series Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {seriesOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSeriesSelect(opt.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  seriesFilter === opt.value
                    ? 'bg-apple-accent text-white shadow-md'
                    : 'bg-black/5 dark:bg-white/10 text-apple-text-light dark:text-apple-text-dark hover:bg-black/10 dark:hover:bg-white/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <label className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark font-medium whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs font-semibold rounded-full px-3 py-2 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Price Slider */}
        <div className="pt-2 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark gap-2">
          <div className="flex items-center space-x-3 w-full sm:w-80">
            <span>Max Price: <strong>₹{maxPrice?.toLocaleString('en-IN')}</strong></span>
            <input
              type="range"
              min="40000"
              max="500000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-apple-accent cursor-pointer"
            />
          </div>
          <div>
            Showing {products.length} models
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card rounded-3xl h-96 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 space-y-4 glass-card rounded-3xl p-8">
          <p className="text-lg font-bold text-apple-text-light dark:text-apple-text-dark">No products found matching your filters.</p>
          <button
            onClick={() => {
              setSeriesFilter('all');
              setSearchQuery('');
              setMaxPrice(200000);
            }}
            className="px-6 py-2.5 rounded-full bg-apple-accent text-white text-xs font-semibold hover:bg-apple-accentHover transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={(prod) => setSelectedProduct(prod)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
