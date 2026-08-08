import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Calendar, 
  Clock, ShieldCheck, Sparkles, Navigation, Globe, ArrowRight, QrCode, 
  Smartphone, Laptop, Tablet, Watch, ChevronRight, Check, AlertCircle, RefreshCw, Inbox, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendContactMessage, fetchInboxMessages, calculateTradeInValue, sendCustomerChatMessage, fetchChatThreads } from '../services/api';

export const Support = () => {
  const [activeSection, setActiveSection] = useState('livechat'); // 'livechat', 'form', 'inbox', 'tradein', 'genius', 'siri'
  
  // Live Customer Support AI Chat State
  const [chatThreadId] = useState(() => `TH-${Math.floor(100 + Math.random() * 900)}`);
  const [chatCustomerName, setChatCustomerName] = useState('Andrew Customer');
  const [chatEmail, setChatEmail] = useState('andrew.customer@apple.com');
  const [chatProduct, setChatProduct] = useState('iPhone 16 Pro Max');
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      staffName: ' Apple Genius AI Assistant',
      text: 'Namaste! Welcome to Andrew\'s Apple Store Support. How can I assist you today with iPhone 16 Pro Max, Trade-In offers, or HDFC EMI?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    storeLocation: 'Apple BKC (Mumbai)',
    priority: 'Normal',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Live Sent Email Inbox State
  const [inboxMessages, setInboxMessages] = useState([]);
  const [loadingInbox, setLoadingInbox] = useState(false);

  // Trade-In Estimator State
  const [tradeInForm, setTradeInForm] = useState({
    device: 'iPhone 14 Pro',
    condition: 'Good',
    storage: '128GB'
  });
  const [tradeInResult, setTradeInResult] = useState(null);
  const [isCalculatingTradeIn, setIsCalculatingTradeIn] = useState(false);

  // Genius Bar Reservation State
  const [geniusStep, setGeniusStep] = useState(1);
  const [geniusData, setGeniusData] = useState({
    device: 'iPhone 16 Pro Max',
    category: 'iPhone',
    issue: 'Screen & Camera Support',
    store: 'Apple BKC (Mumbai)',
    date: new Date().toISOString().split('T')[0],
    time: '02:30 PM',
    passGenerated: false,
    passId: ''
  });

  // Fetch Sent Email Inbox
  const loadInbox = async () => {
    setLoadingInbox(true);
    try {
      const data = await fetchInboxMessages();
      setInboxMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'inbox') {
      loadInbox();
    }
  }, [activeSection]);

  // Handle Contact Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await sendContactMessage(form);
      setSubmissionResult(res);
      loadInbox();
    } catch (err) {
      alert('Error sending message. Please check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Trade-In Calculation
  const handleCalculateTradeIn = async (e) => {
    e.preventDefault();
    setIsCalculatingTradeIn(true);
    try {
      const res = await calculateTradeInValue(tradeInForm);
      setTradeInResult(res);
    } catch (err) {
      alert('Error calculating trade-in value.');
    } finally {
      setIsCalculatingTradeIn(false);
    }
  };

  // Handle Genius Bar Reservation Generation
  const handleGeneratePass = () => {
    const randomTicket = `GB-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeniusData(prev => ({
      ...prev,
      passId: randomTicket,
      passGenerated: true
    }));
    setGeniusStep(4);
  };

  // Handle Customer Live Support Chat Submit
  const handleCustomerChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userText = chatInput;
    setChatInput('');
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { sender: 'customer', text: userText, timestamp: nowTime }]);
    setIsSendingChat(true);

    try {
      const res = await sendCustomerChatMessage({
        threadId: chatThreadId,
        customerName: chatCustomerName,
        email: chatEmail,
        product: chatProduct,
        text: userText
      });

      if (res.aiReply) {
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', staffName: ' Apple Genius AI Assistant', text: res.aiReply, timestamp: nowTime }
        ]);
      }
    } catch (err) {
      console.error("Chat message error:", err);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="relative text-center space-y-4 max-w-3xl mx-auto overflow-hidden py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-apple-accent/10 border border-apple-accent/20 text-apple-accent text-xs font-semibold"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-apple-accent" />
          <span>Official AppleCare+ & Specialist Support</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-apple-text-light dark:text-apple-text-dark"
        >
          Apple Support & Genius Hub
        </motion.h1>

        <p className="text-sm sm:text-base text-apple-text-subtleLight dark:text-apple-text-subtleDark">
          Connect directly with Apple Specialists, dispatch support inquiries to <span className="font-semibold text-apple-accent">louieandrew11@gmail.com</span>, inspect sent email logs, or estimate instant device trade-in credit.
        </p>

        {/* Support Section Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveSection('livechat')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 border border-cyan-500/30 ${
              activeSection === 'livechat'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 scale-105'
                : 'bg-white/60 dark:bg-[#2c2c2e]/60 text-apple-text-light dark:text-apple-text-dark hover:bg-white dark:hover:bg-[#3a3a3c]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Apple Genius AI & Staff Live Chat 🤖💬</span>
          </button>

          <button
            onClick={() => setActiveSection('form')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSection === 'form'
                ? 'bg-apple-accent text-white shadow-lg shadow-apple-accent/30 scale-105'
                : 'bg-white/60 dark:bg-[#2c2c2e]/60 text-apple-text-light dark:text-apple-text-dark hover:bg-white dark:hover:bg-[#3a3a3c]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Send Support Message</span>
          </button>

          <button
            onClick={() => setActiveSection('tradein')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSection === 'tradein'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105'
                : 'bg-white/60 dark:bg-[#2c2c2e]/60 text-apple-text-light dark:text-apple-text-dark hover:bg-white dark:hover:bg-[#3a3a3c]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Trade-In & EMI Calculator</span>
          </button>

          <button
            onClick={() => setActiveSection('genius')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSection === 'genius'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                : 'bg-white/60 dark:bg-[#2c2c2e]/60 text-apple-text-light dark:text-apple-text-dark hover:bg-white dark:hover:bg-[#3a3a3c]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Genius Bar Pass</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('siri');
              window.dispatchEvent(new CustomEvent('open-siri'));
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 border border-cyan-400/40 ${
              activeSection === 'siri'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                : 'bg-white/60 dark:bg-[#2c2c2e]/60 text-cyan-500 dark:text-cyan-400 hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Ask Siri AI</span>
          </button>
        </div>
      </div>

      {/* QUICK CONTACT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="glass-card rounded-2xl p-6 border border-black/5 dark:border-white/10 flex items-start space-x-4">
          <div className="p-3 rounded-2xl bg-apple-accent/10 text-apple-accent">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-apple-text-light dark:text-apple-text-dark">Call Support</h3>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-0.5">1-800-MY-APPLE (1-800-692-7753)</p>
            <p className="text-[10px] text-gray-400 mt-1">Available 24/7 Toll-Free across India & US</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-black/5 dark:border-white/10 flex items-start space-x-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-apple-text-light dark:text-apple-text-dark">AppleCare+ Coverage</h3>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-0.5">Unlimited Accidental Protection</p>
            <p className="text-[10px] text-purple-400 font-semibold mt-1">Express Screen Replacement</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-black/5 dark:border-white/10 flex items-start space-x-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-apple-text-light dark:text-apple-text-dark">Siri AI Specialist</h3>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-0.5">Instant Specs & Rupee Pricing</p>
            <p className="text-[10px] text-cyan-400 font-semibold mt-1">Active 24/7 at bottom-right</p>
          </div>
        </div>
      </div>

      {/* LIVE CUSTOMER SUPPORT AI CHAT SECTION */}
      {activeSection === 'livechat' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-extrabold text-lg shadow-inner">
                  
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-apple-text-light dark:text-apple-text-dark flex items-center gap-2">
                    Apple Genius AI & Staff Support Desk
                  </h2>
                  <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                    Real-time automated responses via Gemini AI & direct synchronization with Apple Store Owner Control Center.
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-mono font-bold px-3 py-1 rounded-full border border-cyan-500/30">
                Thread: {chatThreadId}
              </span>
            </div>

            {/* Chat Messages Container */}
            <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-black/20 dark:bg-black/40 rounded-2xl border border-black/5 dark:border-white/10">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col text-xs max-w-[85%] space-y-1 ${
                    msg.sender === 'customer' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <span className="text-[10px] text-gray-400 font-medium">
                    {msg.sender === 'customer' ? chatCustomerName : (msg.staffName || ' Apple Genius AI Assistant')} • {msg.timestamp}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === 'customer'
                        ? 'bg-apple-accent text-white rounded-br-none shadow-md'
                        : msg.sender === 'ai'
                        ? 'bg-cyan-600/30 text-cyan-100 border border-cyan-500/40 rounded-bl-none shadow-md'
                        : 'bg-purple-600/30 text-purple-100 border border-purple-500/40 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isSendingChat && (
                <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold p-2">
                  <Sparkles size={14} className="animate-spin" />
                  <span>Apple Genius AI Assistant is typing response...</span>
                </div>
              )}
            </div>

            {/* Customer Chat Input Form */}
            <form onSubmit={handleCustomerChatSubmit} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  value={chatCustomerName}
                  onChange={(e) => setChatCustomerName(e.target.value)}
                  placeholder="Your Full Name"
                  className="bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark rounded-xl px-3 py-2 border border-black/10 dark:border-white/10"
                />
                <input
                  type="text"
                  value={chatProduct}
                  onChange={(e) => setChatProduct(e.target.value)}
                  placeholder="Product Inquiry (e.g. iPhone 16 Pro)"
                  className="bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark rounded-xl px-3 py-2 border border-black/10 dark:border-white/10"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Apple Genius AI about Trade-In, HDFC EMI, or BKC Store pickup..."
                  className="flex-1 bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-4 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  disabled={isSendingChat}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 active:scale-95"
                >
                  <Send size={14} />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* SECTION 1: SUPPORT FORM */}
      {activeSection === 'form' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-6 sm:p-10 space-y-6 border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-apple-text-light dark:text-apple-text-dark flex items-center gap-2">
                  <Mail className="w-6 h-6 text-apple-accent" />
                  Send us a Support Message
                </h2>
                <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-1">
                  All messages submitted here are sent directly to <span className="font-semibold text-apple-accent">louieandrew11@gmail.com</span>
                </p>
              </div>
              <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" /> Direct Dispatch
              </span>
            </div>

            {submissionResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto border border-green-500/40 shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <h3 className="text-2xl font-bold text-apple-text-light dark:text-apple-text-dark">Message Delivered!</h3>
                  <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark leading-relaxed">
                    Thank you, <strong className="text-white">{form.name}</strong>. {submissionResult.message}
                  </p>
                </div>

                <div className="bg-black/20 dark:bg-white/5 p-4 rounded-2xl max-w-md mx-auto text-left space-y-2 border border-black/10 dark:border-white/10 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Support Ticket ID:</span>
                    <strong className="text-cyan-400 font-mono">{submissionResult.ticketId}</strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Target Recipient:</span>
                    <strong className="text-white">{submissionResult.targetRecipient}</strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Topic:</span>
                    <span className="text-gray-300">{form.topic}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmissionResult(null);
                      setForm({ name: '', email: '', topic: 'General Inquiry', storeLocation: 'Apple BKC (Mumbai)', priority: 'Normal', message: '' });
                    }}
                    className="px-6 py-2.5 bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-bold rounded-xl transition-all shadow-md"
                  >
                    Send Another Message
                  </button>

                  <button
                    onClick={() => setActiveSection('inbox')}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1"
                  >
                    <Inbox className="w-4 h-4" />
                    <span>View in Sent Inbox Log</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Steve Jobs"
                      className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs sm:text-sm rounded-xl px-4 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. steve@apple.com"
                      className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs sm:text-sm rounded-xl px-4 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Inquiry Topic</label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Trade-In Support">Trade-In Support</option>
                      <option value="AppleCare+ Repair">AppleCare+ Repair</option>
                      <option value="Siri AI Feedback">Siri AI Feedback</option>
                      <option value="Order & Shipping">Order & Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Preferred Store</label>
                    <select
                      value={form.storeLocation}
                      onChange={(e) => setForm({ ...form, storeLocation: e.target.value })}
                      className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                    >
                      <option value="Apple BKC (Mumbai)">Apple BKC (Mumbai)</option>
                      <option value="Apple Saket (Delhi)">Apple Saket (Delhi)</option>
                      <option value="Apple Fifth Avenue (NYC)">Apple Fifth Avenue (NYC)</option>
                      <option value="Apple Regent Street (London)">Apple Regent Street (London)</option>
                      <option value="Apple Park Visitor Center">Apple Park Visitor Center</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                    >
                      <option value="Normal">Normal Support</option>
                      <option value="High">High Priority</option>
                      <option value="Urgent">Urgent Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe how we can assist you with your iPhone, Mac, trade-in, or order..."
                    className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs sm:text-sm rounded-xl px-4 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    Encrypted Apple Support Email to <strong>louieandrew11@gmail.com</strong>
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-apple-accent hover:bg-apple-accentHover disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center space-x-2 active:scale-95"
                  >
                    <Send size={14} />
                    <span>{isSubmitting ? 'Sending Email...' : 'Send Message Now'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}

      {/* SECTION 2: SENT EMAIL LOG / INBOX VIEWER */}
      {activeSection === 'inbox' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-black/5 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-apple-text-light dark:text-apple-text-dark flex items-center gap-2">
                  <Inbox className="w-6 h-6 text-green-500" />
                  Sent Email Log & Audit Tray
                </h2>
                <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-1">
                  Live audit stream of all support tickets dispatched to <span className="font-semibold text-green-400">louieandrew11@gmail.com</span>
                </p>
              </div>
              <button
                onClick={loadInbox}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-semibold flex items-center space-x-1"
              >
                <RefreshCw size={14} className={loadingInbox ? 'animate-spin' : ''} />
                <span>Refresh Logs</span>
              </button>
            </div>

            {loadingInbox ? (
              <div className="text-center py-12 text-gray-400">Fetching live email audit logs...</div>
            ) : inboxMessages.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Inbox className="w-12 h-12 text-gray-500 mx-auto opacity-50" />
                <p className="text-xs text-gray-400">No sent messages recorded yet. Submit a message above to inspect!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {inboxMessages.map((item, idx) => (
                  <div key={idx} className="bg-black/20 dark:bg-white/5 p-4 rounded-2xl border border-black/10 dark:border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-cyan-400 font-bold">{item.ticketId}</span>
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">
                          {item.deliveryStatus}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-gray-300 pt-1">
                      <div>Sender: <strong className="text-white">{item.name}</strong> ({item.email})</div>
                      <div>Recipient: <strong className="text-white">{item.targetRecipient}</strong></div>
                      <div>Topic: <span className="text-purple-300">{item.topic}</span></div>
                      <div>Store: <span className="text-gray-300">{item.storeLocation}</span></div>
                    </div>

                    <div className="mt-2 p-3 bg-black/40 rounded-xl text-gray-200 leading-relaxed italic">
                      "{item.message}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* SECTION 3: TRADE-IN ESTIMATOR & EMI CALCULATOR */}
      {activeSection === 'tradein' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="glass-card rounded-3xl p-6 sm:p-10 space-y-6 border border-black/5 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-apple-text-light dark:text-apple-text-dark flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-amber-500" />
                  Apple Trade-In & Rupee Credit Estimator
                </h2>
                <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-1">
                  Get up to <span className="font-bold text-amber-400">₹67,500</span> instant credit towards your new iPhone.
                </p>
              </div>
            </div>

            <form onSubmit={handleCalculateTradeIn} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Your Current iPhone Model</label>
                <select
                  value={tradeInForm.device}
                  onChange={(e) => setTradeInForm({ ...tradeInForm, device: e.target.value })}
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-3 border border-black/10 dark:border-white/10"
                >
                  <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                  <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                  <option value="iPhone 15">iPhone 15</option>
                  <option value="iPhone 14 Pro Max">iPhone 14 Pro Max</option>
                  <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                  <option value="iPhone 14">iPhone 14</option>
                  <option value="iPhone 13 Pro Max">iPhone 13 Pro Max</option>
                  <option value="iPhone 13">iPhone 13</option>
                  <option value="iPhone 12">iPhone 12</option>
                  <option value="iPhone SE (3rd Gen)">iPhone SE (3rd Gen)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Device Condition</label>
                <select
                  value={tradeInForm.condition}
                  onChange={(e) => setTradeInForm({ ...tradeInForm, condition: e.target.value })}
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-3 border border-black/10 dark:border-white/10"
                >
                  <option value="Flawless">Flawless (No scratches)</option>
                  <option value="Good">Good (Minor wear)</option>
                  <option value="Fair">Fair (Noticeable scratches)</option>
                  <option value="Damaged">Damaged (Cracked glass/screen)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Storage Capacity</label>
                <select
                  value={tradeInForm.storage}
                  onChange={(e) => setTradeInForm({ ...tradeInForm, storage: e.target.value })}
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-3 border border-black/10 dark:border-white/10"
                >
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isCalculatingTradeIn}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  {isCalculatingTradeIn ? 'Calculating Credit...' : 'Calculate Trade-In Value (₹)'}
                </button>
              </div>
            </form>

            {tradeInResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-600/20 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Estimated Instant Apple Credit</span>
                  <h3 className="text-3xl font-extrabold text-white">{tradeInResult.formattedCredit}</h3>
                  <p className="text-xs text-gray-300 mt-1">Valid towards iPhone 16 Pro Max purchase with free home pickup.</p>
                </div>
                <button
                  onClick={() => alert(`Applied ${tradeInResult.formattedCredit} trade-in credit discount to your cart!`)}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs rounded-xl shadow-lg active:scale-95"
                >
                  Apply Credit to Order
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* SECTION 4: GENIUS BAR PASS GENERATOR */}
      {activeSection === 'genius' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {geniusStep !== 4 ? (
            <div className="glass-card rounded-3xl p-6 sm:p-10 space-y-6 border border-black/5 dark:border-white/10 shadow-2xl">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-apple-text-light dark:text-apple-text-dark flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-purple-500" />
                    Book a Genius Bar Appointment
                  </h2>
                  <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark mt-1">
                    Get hands-on hardware & software support from Apple Geniuses.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-400">
                  <span>Step {geniusStep} of 3</span>
                </div>
              </div>

              {geniusStep === 1 && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-apple-text-light dark:text-apple-text-dark block">
                    1. Select Your Apple Device:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: 'iPhone', icon: Smartphone, defaultDev: 'iPhone 16 Pro Max' },
                      { name: 'MacBook', icon: Laptop, defaultDev: 'MacBook Pro 16 M3 Max' },
                      { name: 'iPad', icon: Tablet, defaultDev: 'iPad Pro 13 M4' },
                      { name: 'Apple Watch', icon: Watch, defaultDev: 'Apple Watch Ultra 2' }
                    ].map(item => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setGeniusData({ ...geniusData, category: item.name, device: item.defaultDev })}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                          geniusData.category === item.name
                            ? 'border-apple-accent bg-apple-accent/10 ring-2 ring-apple-accent/40 text-apple-accent font-bold'
                            : 'border-black/10 dark:border-white/10 hover:border-apple-accent/50 text-gray-300'
                        }`}
                      >
                        <item.icon className="w-8 h-8" />
                        <span className="text-xs">{item.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setGeniusStep(2)}
                      className="px-6 py-2.5 bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-bold rounded-xl flex items-center space-x-2"
                    >
                      <span>Continue to Store Pick</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {geniusStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-apple-text-light dark:text-apple-text-dark block mb-1">
                        Select Apple Store:
                      </label>
                      <select
                        value={geniusData.store}
                        onChange={(e) => setGeniusData({ ...geniusData, store: e.target.value })}
                        className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-4 py-3 border border-black/10 dark:border-white/10"
                      >
                        <option value="Apple BKC (Mumbai)">Apple BKC (Mumbai)</option>
                        <option value="Apple Saket (Delhi)">Apple Saket (Delhi)</option>
                        <option value="Apple Fifth Avenue (NYC)">Apple Fifth Avenue (NYC)</option>
                        <option value="Apple Regent Street (London)">Apple Regent Street (London)</option>
                        <option value="Apple Park Visitor Center">Apple Park Visitor Center</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-apple-text-light dark:text-apple-text-dark block mb-1">
                        Preferred Date:
                      </label>
                      <input
                        type="date"
                        value={geniusData.date}
                        onChange={(e) => setGeniusData({ ...geniusData, date: e.target.value })}
                        className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-4 py-3 border border-black/10 dark:border-white/10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setGeniusStep(1)}
                      className="text-xs text-gray-400 hover:text-white font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setGeniusStep(3)}
                      className="px-6 py-2.5 bg-apple-accent hover:bg-apple-accentHover text-white text-xs font-bold rounded-xl flex items-center space-x-2"
                    >
                      <span>Continue to Time Slot</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {geniusStep === 3 && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-apple-text-light dark:text-apple-text-dark block">
                    Choose Available Time Slot:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['11:00 AM', '01:15 PM', '02:30 PM', '04:00 PM', '05:45 PM', '07:15 PM'].map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setGeniusData({ ...geniusData, time: slot })}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                          geniusData.time === slot
                            ? 'border-purple-500 bg-purple-500/20 text-purple-400 ring-2 ring-purple-500/40'
                            : 'border-black/10 dark:border-white/10 text-gray-300 hover:border-purple-500/40'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <button
                      onClick={() => setGeniusStep(2)}
                      className="text-xs text-gray-400 hover:text-white font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGeneratePass}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Genius Bar Pass</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              className="max-w-md mx-auto bg-gradient-to-b from-gray-900 via-[#1c1c1e] to-black rounded-3xl p-6 shadow-2xl border border-white/20 text-white relative overflow-hidden space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl"></span>
                  <span className="font-extrabold text-sm tracking-wider uppercase">Genius Bar Pass</span>
                </div>
                <span className="text-[10px] bg-purple-500/30 text-purple-300 border border-purple-400/40 px-2 py-0.5 rounded-full font-bold">
                  Confirmed Pass
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase text-gray-400 tracking-wider">Device Support</p>
                    <h4 className="font-bold text-base text-cyan-400">{geniusData.device}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-gray-400 tracking-wider">Location</p>
                    <h4 className="font-bold text-xs text-white">{geniusData.store}</h4>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase">Reservation Date</p>
                    <p className="font-bold text-xs text-white">{geniusData.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase">Time Slot</p>
                    <p className="font-bold text-xs text-purple-300">{geniusData.time}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <QrCode className="w-28 h-28 text-black" />
                <p className="text-[10px] font-mono text-gray-800 font-bold tracking-widest">{geniusData.passId}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2">
                <span className="text-gray-400">Present pass at Apple Store Genius Grove</span>
                <button
                  onClick={() => alert(`Genius Bar Pass ${geniusData.passId} saved!`)}
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors"
                >
                  Save Pass
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* SECTION 5: SIRI CONSOLE */}
      {activeSection === 'siri' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto glass-card rounded-3xl p-8 border border-cyan-400/30 text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="w-20 h-20 rounded-full siri-orb mx-auto flex items-center justify-center shadow-2xl">
            <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-apple-text-light dark:text-apple-text-dark flex items-center justify-center gap-2">
              Siri Support AI Console
            </h3>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark max-w-md mx-auto">
              Ask Siri about iPhone prices in Indian Rupees (₹), camera specifications, storage options, or trade-in credits.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {[
              "iPhone 16 Pro Max price in ₹",
              "Trade-in value for old iPhone",
              "Camera specs comparison",
              "No Cost EMI calculation"
            ].map((query, idx) => (
              <button
                key={idx}
                onClick={() => window.dispatchEvent(new CustomEvent('open-siri', { detail: { query } }))}
                className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-cyan-500 hover:text-white text-apple-text-light dark:text-apple-text-dark text-xs rounded-full border border-black/10 dark:border-white/10 transition-all"
              >
                {query}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-siri'))}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-full shadow-xl flex items-center space-x-2 mx-auto active:scale-95"
          >
            <MessageSquare size={16} />
            <span>Launch Live Siri Chat Assistant</span>
          </button>
        </motion.div>
      )}

    </div>
  );
};
