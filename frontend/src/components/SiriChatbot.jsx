import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Sparkles, RefreshCw, Volume2, Mic } from 'lucide-react';
import { sendSiriChatMessage } from '../services/api';

export const SiriChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'siri',
      text: "Namaste! I am Siri. How can I help you choose the perfect iPhone today? Ask me about prices in Indian Rupees (₹), camera specs, storage, or trade-in credit.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const quickPrompts = [
    "iPhone 16 Pro Max price in ₹ & EMI",
    "Compare camera specs of iPhone 16 Pro vs 15 Pro",
    "What is the max trade-in credit for old iPhone?",
    "Storage options and Rupee (₹) pricing for iPhone 16"
  ];

  useEffect(() => {
    const handleOpenSiri = (e) => {
      setIsOpen(true);
      if (e?.detail?.query) {
        setTimeout(() => handleSend(e.detail.query), 100);
      }
    };
    window.addEventListener('open-siri', handleOpenSiri);
    return () => window.removeEventListener('open-siri', handleOpenSiri);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userText) setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messagesRef.current.map(m => ({
        sender: m.sender === 'siri' ? 'bot' : 'user',
        text: m.text
      }));


      const replyText = await sendSiriChatMessage(textToSend.trim(), historyPayload);

      const siriMsg = {
        id: `siri-${Date.now()}`,
        sender: 'siri',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, siriMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'siri',
          text: "I'm having trouble retrieving live info right now. Please check if the Flask backend is active.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Siri Trigger Orb */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl focus:outline-none overflow-hidden group"
          title="Ask Siri AI Assistant"
        >
          {/* Animated Siri Multi-Color Gradient Background */}
          <div className="absolute inset-0 siri-orb" />
          <div className="relative z-10 text-white flex flex-col items-center justify-center">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="text-[9px] font-bold tracking-wider mt-0.5 uppercase">Siri</span>
          </div>
        </motion.button>
      )}

      {/* Siri Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass-card w-[90vw] sm:w-[380px] h-[520px] rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-white/20 dark:border-white/10"
          >
            {/* Header */}
            <div className="relative bg-black/80 dark:bg-black/90 p-4 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-3">
                {/* Micro Siri Orb */}
                <div className="relative w-9 h-9 rounded-full siri-orb flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    Siri <span className="bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text text-[10px] px-1.5 py-0.5 rounded-full border border-cyan-400/30">Apple AI</span>
                  </h3>
                  <p className="text-[10px] text-gray-300">Intelligent Shopping Assistant</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-apple-bg-light/50 dark:bg-apple-bg-dark/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-apple-accent text-white rounded-br-none'
                        : 'bg-white dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark border border-black/5 dark:border-white/10 rounded-bl-none'
                    }`}
                  >
                    {/* Render basic bold text formatting if present */}
                    <div dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }} />
                  </div>
                  <span className="text-[9px] text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 bg-white dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark rounded-2xl px-4 py-3 max-w-[70%] border border-black/5 dark:border-white/10">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-gray-400 ml-1">Siri is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length < 5 && (
              <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-black/5 dark:border-white/10 bg-white/40 dark:bg-black/40">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] bg-white dark:bg-[#2c2c2e] hover:bg-apple-accent hover:text-white dark:hover:bg-apple-accent text-apple-text-light dark:text-apple-text-dark border border-black/10 dark:border-white/10 rounded-full px-2.5 py-1 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Box */}
            <div className="p-3 bg-white/80 dark:bg-[#1c1c1e]/80 border-t border-black/5 dark:border-white/10 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Siri about iPhone prices..."
                className="flex-1 bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs sm:text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-apple-accent/50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-apple-accent hover:bg-apple-accentHover disabled:opacity-40 text-white rounded-full transition-colors flex items-center justify-center shadow-md"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple Markdown parser for Bold and Bullet lists in chat
function formatMessageText(text) {
  if (!text) return '';
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n• (.*?)/g, '<br/>• $1')
    .replace(/\n- (.*?)/g, '<br/>• $1')
    .replace(/\n/g, '<br/>');
  return formatted;
}
