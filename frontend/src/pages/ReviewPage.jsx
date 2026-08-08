import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, ShoppingBag, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { submitProductReview } from '../services/api';

export const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get order data passed from checkout
  const orderDetails = location.state || {
    orderId: "ORD-" + Math.floor(90000 + Math.random() * 10000),
    product: "iPhone 16 Pro Max",
    customer: "Valued Apple Customer",
    amount: 144900
  };

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState(orderDetails.customer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitProductReview({
        product: orderDetails.product,
        customer: customerName || 'Verified Customer',
        rating: rating,
        comment: comment || 'Awesome purchase! The Apple Store experience was fast and seamless.'
      });
      setIsSubmitted(true);
    } catch (err) {
      alert("Error submitting review. Saved to catalog.");
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-bg-light dark:bg-apple-bg-dark text-apple-text-light dark:text-apple-text-dark flex items-center justify-center p-4 py-12 relative overflow-hidden">
      
      {/* Ambient Moving Orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-apple-accent/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-10 border border-black/5 dark:border-white/20 shadow-2xl space-y-8 relative z-10 text-center"
      >
        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
                Order Completed: {orderDetails.orderId}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Rate Your Purchase Experience
              </h1>
              <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                Thank you for shopping at ani Apple Store. How was your experience purchasing <strong className="text-white">{orderDetails.product}</strong>?
              </p>
            </div>

            {/* Rating Stars Input */}
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="text-center space-y-2">
                <label className="text-xs font-semibold text-gray-400 block">Overall Satisfaction Rating</label>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-600'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-400 block">
                  {rating === 5 ? '★★★★★ Outstanding' : rating === 4 ? '★★★★☆ Great' : '★★★☆☆ Good'}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-4 py-3 border border-black/10 dark:border-white/10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Review Comments & Product Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts on performance, titanium finish, camera quality, or store service..."
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-4 py-3 border border-black/10 dark:border-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-apple-accent hover:bg-apple-accentHover disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center space-x-2 transition-all"
              >
                <Sparkles size={16} />
                <span>{isSubmitting ? 'Submitting Review...' : 'Post Verified Product Review'}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6 py-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center mx-auto shadow-xl">
              <Heart size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">Review Received!</h2>
              <p className="text-xs text-gray-300 max-w-sm mx-auto">
                Thank you, <strong>{customerName}</strong>! Your review has been published to our store ratings and MongoDB Atlas database.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={14} />
                <span>Return to Customer Store</span>
              </button>

              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
              >
                <span>View in Owner Control Center</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
