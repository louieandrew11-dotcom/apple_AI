import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How does the Siri AI Chatbot assist with shopping?",
      answer: "Siri AI is powered by Google Gemini and trained on our real-time product database. You can ask Siri about exact iPhone storage prices, compare camera specs between models, or get personalized recommendations based on your budget."
    },
    {
      question: "What is Apple Intelligence and which iPhones support it?",
      answer: "Apple Intelligence is the personal intelligence system built into iOS 18. It relies on Apple silicon chip architecture and is available on iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16 Plus, iPhone 16, and iPhone 15 Pro Max."
    },
    {
      question: "How does Apple Trade-In work online?",
      answer: "Select your trade-in model during purchase or in your bag. Answer a few questions about its condition to instantly receive up to ₹67,500 in instant credit towards your new iPhone purchase. A trade-in kit with prepaid shipping will be dispatched to your address."
    },
    {
      question: "What is the return and refund policy?",
      answer: "We offer a 14-day hassle-free return policy. You can return any undamaged iPhone with its original packaging either in-person at an Apple Store or by requesting a free prepaid return label online."
    },
    {
      question: "Is Next-Day shipping really free?",
      answer: "Yes! All qualifying iPhone orders placed before 3:00 PM local time qualify for free express next-day delivery straight to your doorstep."
    },
    {
      question: "What does AppleCare+ cover?",
      answer: "AppleCare+ extends your hardware coverage and includes unlimited incidents of accidental damage protection, 24/7 priority tech support, and battery replacement service if capacity drops below 80%."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark">
          Everything you need to know about purchasing, trade-ins, delivery, and Siri AI.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-apple-text-light dark:text-apple-text-dark focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  {idx === 0 && <Sparkles className="w-4 h-4 text-cyan-400 inline" />}
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-apple-text-subtleLight dark:text-apple-text-subtleDark transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-apple-accent' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5 text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed border-t border-black/5 dark:border-white/5 pt-3"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
