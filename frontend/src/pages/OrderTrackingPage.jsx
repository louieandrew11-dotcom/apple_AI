import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, MapPin, Phone, MessageSquare, ShieldCheck, CheckCircle2, 
  Clock, Navigation, Package, ArrowLeft, Printer, AlertCircle, Sparkles, User, ExternalLink, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(() => localStorage.getItem('last_order_id') || 'APL-IN-884921');
  const [minsRemaining, setMinsRemaining] = useState(35);
  const [copiedOtp, setCopiedOtp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMinsRemaining(prev => (prev > 1 ? prev - 1 : 1));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyOtp = () => {
    navigator.clipboard.writeText('8841');
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const trackingSteps = [
    {
      id: 1,
      title: 'Order Placed & Payment Verified',
      subtitle: 'Verified via Google Pay (GPay QR)',
      time: '11:15 AM Today',
      status: 'completed',
      icon: ShieldCheck
    },
    {
      id: 2,
      title: 'Inspected & Packed at Store',
      subtitle: 'Apple BKC Flagship (Jio World Drive, Mumbai)',
      time: '11:30 AM Today',
      status: 'completed',
      icon: Package
    },
    {
      id: 3,
      title: 'Out for Express Delivery',
      subtitle: 'Assigned to Driver Vikram Singh (TVS iQube EV #MH-02-EQ-8841)',
      time: `Live • ${minsRemaining} Mins Away`,
      status: 'current',
      icon: Truck
    },
    {
      id: 4,
      title: 'Delivered to Destination',
      subtitle: 'Plot 100, Bandra Kurla Complex, Mumbai',
      time: 'Expected by 12:30 PM Today',
      status: 'upcoming',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-apple-text-light dark:text-apple-text-dark"
            title="Return to Store"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-apple-accent">Apple Express Delivery</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Tracking
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
              Order #{orderId}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-black/10 dark:bg-white/10 text-apple-text-light dark:text-apple-text-dark text-xs font-semibold hover:bg-black/20 transition-colors"
          >
            <Printer size={14} />
            <span>Print Order Bill</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tracking & Map, Right Store & Driver Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visual Map Structure & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Animated Visual Map Structure Box */}
          <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-apple-text-light dark:text-apple-text-dark flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                Live Express Route & GPS Structure Map
              </h3>
              <span className="text-xs font-mono font-bold text-cyan-400">{minsRemaining} MINS REMAINING</span>
            </div>

            {/* Simulated Graphic Map Route Box */}
            <div className="relative h-56 bg-slate-900 rounded-2xl p-4 overflow-hidden border border-white/10 flex flex-col justify-between">
              {/* Background Roads Map Pattern Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Top Store Node */}
              <div className="relative z-10 flex items-center space-x-3 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 max-w-fit">
                <div className="w-8 h-8 rounded-lg bg-apple-accent text-white flex items-center justify-center font-bold text-xs">
                  
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Apple BKC Store (Origin)</h4>
                  <p className="text-[10px] text-gray-400">Jio World Drive, Bandra Kurla Complex</p>
                </div>
              </div>

              {/* Animated Express Delivery Scooter on Route */}
              <motion.div
                animate={{ x: [0, 180, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 self-center flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-2xl border border-emerald-400 font-bold text-xs"
              >
                <Truck size={16} className="animate-bounce" />
                <span>Express Courier Rider • TVS iQube EV</span>
              </motion.div>

              {/* Bottom Customer Destination Node */}
              <div className="relative z-10 flex items-center space-x-3 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 max-w-fit ml-auto">
                <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold text-xs">
                  <MapPin size={16} />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-white">Destination (Plot 100, BKC)</h4>
                  <p className="text-[10px] text-gray-400">Express Delivery • OTP: 8841</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Structure */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-black/5 dark:border-white/10 shadow-xl">
            <h3 className="font-bold text-base text-apple-text-light dark:text-apple-text-dark">
              Order Timeline & Progress
            </h3>

            <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-black/10 dark:before:bg-white/10">
              {trackingSteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="relative flex items-start space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                        step.status === 'completed'
                          ? 'bg-green-500 text-white shadow-lg'
                          : step.status === 'current'
                          ? 'bg-apple-accent text-white ring-4 ring-apple-accent/30 animate-pulse'
                          : 'bg-gray-300 dark:bg-[#3a3a3c] text-gray-500'
                      }`}
                    >
                      <StepIcon size={16} />
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between items-center">
                        <h4 className={`text-xs sm:text-sm font-bold ${step.status === 'current' ? 'text-apple-accent' : 'text-apple-text-light dark:text-apple-text-dark'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[11px] font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark">{step.time}</span>
                      </div>
                      <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Driver Contact & Store Details & Order Bill */}
        <div className="space-y-6">
          
          {/* Driver Contact & OTP Verification Box */}
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start border-b border-black/5 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Assigned Driver Specialist</span>
                <h3 className="text-lg font-extrabold text-apple-text-light dark:text-apple-text-dark">Vikram Singh</h3>
                <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark">Apple Certified Express Courier</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xl shadow-inner">
                🛵
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-black/5 dark:bg-white/5 rounded-xl">
                <span className="text-gray-400">Vehicle:</span>
                <strong className="text-apple-text-light dark:text-apple-text-dark font-mono">TVS iQube EV (#MH-02-EQ-8841)</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-black/5 dark:bg-white/5 rounded-xl">
                <span className="text-gray-400">Phone Number:</span>
                <strong className="text-cyan-400 font-mono">+91 98765 43210</strong>
              </div>
            </div>

            {/* Delivery Verification OTP */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Delivery Verification OTP</span>
              <div className="flex items-center justify-center space-x-3">
                <span className="font-mono text-2xl font-black text-amber-400 tracking-widest">8841</span>
                <button
                  onClick={handleCopyOtp}
                  className="text-xs bg-amber-500 text-white font-bold px-2.5 py-1 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  {copiedOtp ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-gray-400">Provide this OTP code to Vikram upon package arrival</p>
            </div>

            {/* Contact Driver Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href="tel:+919876543210"
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Phone size={14} />
                <span>Call Driver</span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageSquare size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Dispatching Store Information */}
          <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-apple-text-light dark:text-apple-text-dark flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-3">
              <MapPin size={16} className="text-apple-accent" />
              Dispatching Retail Store
            </h3>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-apple-text-light dark:text-apple-text-dark text-sm"> Apple BKC (Mumbai)</h4>
              <p className="text-apple-text-subtleLight dark:text-apple-text-subtleDark">
                Jio World Drive, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051
              </p>
              <div className="pt-2 space-y-1 text-gray-400">
                <p>Phone: <strong className="text-apple-text-light dark:text-apple-text-dark">+91 22 6123 7800</strong></p>
                <p>Store Owner: <strong className="text-apple-accent">Andrew (Louie Andrew)</strong></p>
                <p>GSTIN: <strong className="text-gray-300 font-mono">27APLIND9920Z8</strong></p>
              </div>
            </div>
          </div>

          {/* Order Bill Summary */}
          <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-apple-text-light dark:text-apple-text-dark border-b border-black/5 dark:border-white/10 pb-3">
              Order Bill Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">iPhone 16 Pro Max 256GB</span>
                <strong className="text-apple-text-light dark:text-apple-text-dark">₹1,44,900.00</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GST (18%)</span>
                <span>₹26,082.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Express Delivery</span>
                <span className="text-green-500 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-black/10 dark:border-white/10">
                <span>Total Paid via GPay</span>
                <span className="text-apple-accent">₹1,70,982.00</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
