import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppleLoadingScreen = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Apple Intelligence...");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 12) + 7;
        if (next >= 100) {
          clearInterval(interval);
          setStatusText("Welcome to ani Apple Store");
          setTimeout(() => {
            setIsFinished(true);
            if (onComplete) onComplete();
          }, 450);
          return 100;
        }

        if (next > 70) {
          setStatusText("Calculating No Cost EMI & Bank Offers...");
        } else if (next > 35) {
          setStatusText("Connecting Live Siri AI Assistant...");
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508] text-white overflow-hidden select-none"
        >
          {/* Chromatic Siri Glow Mesh Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.22)_0,rgba(127,0,255,0.18)_35%,rgba(255,0,127,0.1)_60%,transparent_85%)] pointer-events-none animate-pulse duration-1000" />
          
          {/* Animated Background Laser Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center space-y-9 px-4">
            
            {/* NEW 3D CHROMATIC APPLE LOGO DESIGN */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              
              {/* Siri Glow Aura Field */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.7, 1.3, 1.05], opacity: [0.4, 0.9, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 blur-3xl opacity-70"
              />

              {/* Rotating Concentric Siri Particle Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-12px] border border-cyan-400/20 rounded-full border-dashed pointer-events-none"
              />

              {/* VECTOR APPLE LOGO WITH CHROMATIC GRADIENT */}
              <svg viewBox="0 0 170 170" className="w-32 h-32 filter drop-shadow-[0_0_30px_rgba(0,242,254,0.7)] z-10">
                <defs>
                  <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="45%" stopColor="#4facfe" />
                    <stop offset="75%" stopColor="#7f00ff" />
                    <stop offset="100%" stopColor="#ff007f" />
                  </linearGradient>

                  <linearGradient id="appleGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* JOINING APPLE LEAF */}
                <motion.path
                  initial={{ y: -60, opacity: 0, scale: 0.2 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  d="M102.5,23 C108,16 116,11.5 124.5,11.5 C125.5,20.5 117.5,29.5 110,34.5 C104.5,38 96.5,37 95.5,28.5 C95.5,28 97,26.5 102.5,23 Z"
                  fill="url(#appleGradient)"
                  filter="drop-shadow(0 0 10px rgba(0,242,254,0.8))"
                />

                {/* JOINING LEFT APPLE BODY HALF */}
                <motion.path
                  initial={{ x: -90, opacity: 0, scale: 0.5 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  d="M85,42.5 C72,42.5 59.5,50 51.5,63 C40,81.5 44,113 58,136.5 C64.5,147 72.5,158.5 83.5,158.5 C88.5,158.5 88.5,155.5 85,142.5 L85,42.5 Z"
                  fill="url(#appleGradient)"
                />

                {/* JOINING RIGHT APPLE BODY HALF */}
                <motion.path
                  initial={{ x: 90, opacity: 0, scale: 0.5 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  d="M85,42.5 L85,142.5 C94,155.5 98,158.5 103,158.5 C114,158.5 122,147 128.5,136.5 C139,119 142.5,94 135,76.5 C130.5,65.5 119.5,59 110,59 C103,59 95.5,42.5 85,42.5 Z"
                  fill="url(#appleGradient)"
                />

                {/* LOGO SPECULAR GLOSS OVERLAY */}
                <path
                  d="M85,42.5 C72,42.5 59.5,50 51.5,63 C40,81.5 44,113 58,136.5 C64.5,147 72.5,158.5 83.5,158.5 C93.5,158.5 97,152 103,152 C109,152 112,158.5 122,158.5 C133,158.5 141,147 147.5,136.5 C158,119 162.5,94 155,76.5 C150.5,65.5 139.5,59 130,59 C119,59 112.5,66 103,66 C93.5,66 87.5,59 77,59 Z"
                  fill="url(#appleGloss)"
                  opacity="0.15"
                />
              </svg>

              {/* Impact Shockwave Pulse */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2.2, 1], opacity: [0, 1, 0.2] }}
                transition={{ duration: 1.5, delay: 0.9 }}
                className="absolute inset-0 border-4 border-cyan-300 rounded-full animate-ping pointer-events-none"
              />
            </div>

            {/* BRANDING TYPOGRAPHY BELOW LOGO */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center space-y-2"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-white uppercase flex items-center justify-center gap-2">
                <span className="font-extrabold text-cyan-400 lowercase tracking-wide">ani</span>
                <span className="text-2xl"></span>
                <span className="font-bold text-white tracking-normal">Apple Store</span>
              </h1>
              <p className="text-xs text-gray-300 tracking-wider font-medium">
                Apple Intelligence & Siri AI Shopping Experience
              </p>
            </motion.div>

            {/* DYNAMIC PROGRESS BAR & STATUS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-72 space-y-2 flex flex-col items-center"
            >
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15 backdrop-blur-xl">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(0,242,254,0.9)]"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between w-full text-[10px] text-gray-400 font-mono tracking-wider px-1">
                <span className="truncate max-w-[190px] text-cyan-200">{statusText}</span>
                <span className="text-cyan-400 font-bold ml-2">{loadingProgress}%</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
