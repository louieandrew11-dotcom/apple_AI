import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-apple-bg-light dark:bg-black text-apple-text-subtleLight dark:text-apple-text-subtleDark border-t border-black/10 dark:border-white/10 mt-auto text-xs transition-colors duration-300">
      {/* Apple Guarantee Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-black/5 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Truck className="w-6 h-6 text-apple-accent" />
            <h4 className="font-semibold text-apple-text-light dark:text-apple-text-dark text-sm">Free Next-Day Delivery</h4>
            <p className="text-xs">On all qualifying iPhone orders with express dispatch.</p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <ShieldCheck className="w-6 h-6 text-apple-accent" />
            <h4 className="font-semibold text-apple-text-light dark:text-apple-text-dark text-sm">AppleCare+ Coverage</h4>
            <p className="text-xs">Unlimited repairs for accidental damage protection.</p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <RotateCcw className="w-6 h-6 text-apple-accent" />
            <h4 className="font-semibold text-apple-text-light dark:text-apple-text-dark text-sm">14-Day Easy Returns</h4>
            <p className="text-xs">Return or exchange hassle-free in store or online.</p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <Cpu className="w-6 h-6 text-apple-accent" />
            <h4 className="font-semibold text-apple-text-light dark:text-apple-text-dark text-sm">Apple Intelligence</h4>
            <p className="text-xs">Deep AI integration across iOS 18 devices.</p>
          </div>
        </div>
      </div>

      {/* Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-apple-text-light dark:text-apple-text-dark mb-3">Shop iPhone</h3>
          <ul className="space-y-2">
            <li><Link to="/shop?series=16%20Pro" className="hover:underline">iPhone 16 Pro Max</Link></li>
            <li><Link to="/shop?series=16%20Pro" className="hover:underline">iPhone 16 Pro</Link></li>
            <li><Link to="/shop?series=16" className="hover:underline">iPhone 16</Link></li>
            <li><Link to="/shop?series=15%20Pro" className="hover:underline">iPhone 15 Pro</Link></li>
            <li><Link to="/shop?series=SE" className="hover:underline">iPhone SE</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-apple-text-light dark:text-apple-text-dark mb-3">Apple AI & Siri</h3>
          <ul className="space-y-2">
            <li><span className="hover:underline cursor-pointer">Siri Voice & Chatbot</span></li>
            <li><span className="hover:underline cursor-pointer">Apple Intelligence</span></li>
            <li><span className="hover:underline cursor-pointer">Writing Tools</span></li>
            <li><span className="hover:underline cursor-pointer">Visual Intelligence</span></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-apple-text-light dark:text-apple-text-dark mb-3">Customer Service & Stores</h3>
          <ul className="space-y-2">
            <li><Link to="/support" className="hover:underline">AppleCare+ Support</Link></li>
            <li><Link to="/stores" className="hover:underline">Store Locator & Map</Link></li>
            <li><Link to="/gallery" className="hover:underline">Media & Video Library</Link></li>
            <li><Link to="/faq" className="hover:underline">Shopping FAQs</Link></li>
            <li><Link to="/cart" className="hover:underline">Order Status</Link></li>
            <li><Link to="/admin" className="hover:underline text-cyan-400 font-semibold">Owner & Admin Portal 🔐</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-apple-text-light dark:text-apple-text-dark mb-3">About Apple</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:underline">Newsroom</Link></li>
            <li><Link to="/about" className="hover:underline">Apple Leadership</Link></li>
            <li><Link to="/about" className="hover:underline">Career Opportunities</Link></li>
            <li><Link to="/about" className="hover:underline">Ethics & Compliance</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] space-y-2 md:space-y-0">
        <p>Copyright © 2026 <strong>ani Apple Store</strong>. All rights reserved. Powered by Siri AI Assistant & Python Flask.</p>
        <div className="flex space-x-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms of Use</span>
          <span className="hover:underline cursor-pointer">Sales Policy</span>
          <span className="hover:underline cursor-pointer">Legal</span>
        </div>
      </div>
    </footer>
  );
};
