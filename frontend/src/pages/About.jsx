import React from 'react';
import { Cpu, ShieldCheck, Leaf, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Brand Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-apple-accent">Apple Philosophy</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
          Think different. Innovation at the core.
        </h1>
        <p className="text-base sm:text-lg text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
          At Apple, we create products that empower people to realize their full creative potential while protecting privacy and respecting the environment.
        </p>
      </section>

      {/* Grid of Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card rounded-3xl p-8 space-y-4 border border-black/5 dark:border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark">Apple Intelligence</h3>
          <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
            Built directly into the core of iOS 18. Personal context powered by Private Cloud Compute ensures your sensitive personal data remains strictly on your device.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card rounded-3xl p-8 space-y-4 border border-black/5 dark:border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark">Apple 2030 Carbon Neutral</h3>
          <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
            100% recycled aluminum enclosures, 100% recycled rare earth elements in all magnets, and clean energy manufacturing across our entire global supply chain.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card rounded-3xl p-8 space-y-4 border border-black/5 dark:border-white/10"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark">Privacy First</h3>
          <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
            Privacy is a fundamental human right. From Face ID hardware encryption to Safari anti-tracking, every feature is designed to put you in complete control.
          </p>
        </motion.div>
      </section>

      {/* Store Founder Executive Card */}
      <section className="glass-card rounded-3xl p-8 border border-apple-accent/30 bg-gradient-to-r from-apple-accent/10 to-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-apple-accent px-3 py-1 rounded-full bg-apple-accent/20">Store Owner & Executive Founder</span>
          <h2 className="text-3xl font-extrabold text-apple-text-light dark:text-apple-text-dark">
            Founded & Curated by Andrew
          </h2>
          <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark max-w-xl leading-relaxed">
            Andrew established this flagship Apple online store to deliver an uncompromised digital shopping experience combining high-performance Apple engineering, Grade 5 Titanium products, and Siri artificial intelligence guidance.
          </p>
        </div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black shadow-2xl">
          A
        </div>
      </section>

      {/* Titanium Showcase */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-black/5 dark:border-white/10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Craftsmanship</span>
          <h2 className="text-3xl font-extrabold text-apple-text-light dark:text-apple-text-dark">
            Precision Metallurgy & Micro-blasted Finish
          </h2>
          <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
            Grade 5 Titanium is thermomechanically processed to forge an atomic bond with the aluminum internal substructure. The result is superior thermal dissipation and unmatched durability.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop"
            alt="Apple Titanium"
            className="max-h-64 object-contain filter drop-shadow-2xl"
          />
        </div>
      </section>
    </div>
  );
};
