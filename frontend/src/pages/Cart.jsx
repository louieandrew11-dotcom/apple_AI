import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount, totalCount } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'APPLE10') {
      setDiscount(totalAmount * 0.10);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try APPLE10 for 10% off!');
    }
  };

  const estimatedTax = totalAmount * 0.18; // GST 18% in India
  const finalTotal = totalAmount - discount + estimatedTax;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/10 mx-auto flex items-center justify-center text-apple-text-subtleLight dark:text-apple-text-subtleDark">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-apple-text-light dark:text-apple-text-dark">Your Bag is empty.</h1>
        <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark max-w-md mx-auto">
          Free shipping and free returns on all iPhone purchases. Explore our store to find your next device.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 rounded-full bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-semibold transition-colors shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
        Review your Bag.
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <motion.div
              key={item.cartItemId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-black/5 dark:border-white/10"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain drop-shadow-md"
                />
                <div>
                  <h3 className="font-bold text-base text-apple-text-light dark:text-apple-text-dark">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-0.5">
                    <span className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.hex }} />
                      <span>{item.color}</span>
                    </span>
                    <span>•</span>
                    <span>{item.storage}</span>
                  </div>
                  <p className="text-xs font-bold text-apple-accent mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-black/5 dark:border-white/10">
                {/* Quantity adjuster */}
                <div className="flex items-center space-x-2 bg-black/5 dark:bg-white/10 rounded-full px-3 py-1">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, -1)}
                    className="p-1 hover:text-apple-accent transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, 1)}
                    className="p-1 hover:text-apple-accent transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="text-right">
                  <span className="font-extrabold text-sm text-apple-text-light dark:text-apple-text-dark block">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-[11px] text-red-500 hover:underline inline-flex items-center space-x-1 mt-1"
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary Side Panel */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-6 border border-black/5 dark:border-white/10 sticky top-20">
            <h2 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark border-b border-black/5 dark:border-white/10 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                <span>Subtotal ({totalCount} items)</span>
                <span>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                <span>Estimated Delivery</span>
                <span className="text-green-500 font-semibold">FREE Express</span>
              </div>
              <div className="flex justify-between text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                <span>Estimated Tax (GST 18%)</span>
                <span>₹{estimatedTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-green-500 font-semibold">
                  <span>Promo Discount (10%)</span>
                  <span>-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-apple-text-light dark:text-apple-text-dark pt-3 border-t border-black/10 dark:border-white/10">
                <span>Total</span>
                <span className="text-apple-accent">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code (e.g. APPLE10)"
                    className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl pl-9 pr-3 py-2 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-apple-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-apple-accent hover:text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[10px] text-red-500">{promoError}</p>}
              {promoApplied && <p className="text-[10px] text-green-500">Code APPLE10 applied successfully!</p>}
            </form>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-sm rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Check Out with Apple Pay</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-apple-text-subtleLight dark:text-apple-text-subtleDark pt-2">
              <ShieldCheck size={14} className="text-apple-accent" />
              <span>Encrypted 256-bit Secure Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
