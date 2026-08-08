import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast = () => {
  const { toastMessage } = useCart();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-50 glass-card px-5 py-3.5 rounded-2xl shadow-2xl border border-apple-accent/30 flex items-center space-x-3 text-apple-text-light dark:text-apple-text-dark text-xs sm:text-sm font-semibold"
        >
          <div className="w-8 h-8 rounded-full bg-apple-accent text-white flex items-center justify-center">
            <ShoppingBag size={16} />
          </div>
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
