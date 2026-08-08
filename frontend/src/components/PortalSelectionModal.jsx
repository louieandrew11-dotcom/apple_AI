import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Lock, ShieldCheck, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PortalSelectionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChoice = (e, path) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    sessionStorage.setItem('has_selected_portal', 'true');
    onClose();
    if (window.location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl space-y-8 relative overflow-hidden text-center"
        >
          {/* Ambient Glowing Background Orbs */}
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-apple-accent/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />

          {/* Header */}
          <div className="space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/20 text-white flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-4xl"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ani Apple Store Experience
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
              Engineered for Apple Intelligence. Welcome to the premier online Apple destination.
            </p>
          </div>

          {/* BIG PROMINENT SHOP BUTTON IN CENTER */}
          <div className="relative z-10 py-2">
            <motion.div
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => handleChoice(e, '/')}
              className="p-8 rounded-3xl bg-gradient-to-b from-apple-accent/30 via-blue-600/20 to-black/60 border-2 border-apple-accent/70 hover:border-cyan-400 cursor-pointer text-center space-y-5 shadow-2xl group transition-all relative overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 opacity-10 text-white font-bold text-9xl pointer-events-none">
                
              </div>

              <div className="w-16 h-16 rounded-2xl bg-apple-accent text-white flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest font-extrabold text-cyan-400">Main Experience</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-center space-x-2">
                  <span>ENTER CUSTOMER APPLE STORE 🛒</span>
                </h3>
                <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Browse iPhone 16 Pro Max, Grade 5 Titanium finishes, 3D color previewer, Trade-In estimators, and live Siri AI Assistant.
                </p>
              </div>

              <div className="px-8 py-3.5 bg-apple-accent hover:bg-apple-accentHover text-white font-extrabold text-xs sm:text-sm rounded-full shadow-xl flex items-center justify-center space-x-2 mx-auto transition-all group-hover:px-10 inline-flex">
                <span>OPEN STORE FRONT NOW</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>

          {/* FOOTER BAR WITH SMALL ADMIN PORTAL BUTTON IN RIGHT SIDE DOWN */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
            <span className="text-[11px] text-gray-400">
              Powered by Siri AI & Python Flask
            </span>

            {/* SMALL COMPACT OWNER PORTAL BUTTON RIGHT SIDE DOWN */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleChoice(e, '/admin')}
              className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center space-x-2 shadow-lg transition-all"
              title="Store Owner & Admin Portal Login"
            >
              <Lock size={14} className="text-purple-400" />
              <span>Owner & Admin Portal 🔐</span>
            </motion.button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
