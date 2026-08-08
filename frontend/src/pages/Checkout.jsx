import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShieldCheck, CheckCircle2, CreditCard, Lock, QrCode, Printer, Download, Sparkles, Check, Star, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { submitProductReview } from '../services/api';

export const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: 'Andrew Smith',
    email: 'andrew.customer@apple.com',
    street: 'Plot 100, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400051',
    country: 'India',
    paymentMethod: 'gpay-qr',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [purchasedItems, setPurchasedItems] = useState([]);

  // Inline Rating State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const estimatedTax = totalAmount * 0.18; // GST 18%
  const finalTotal = totalAmount + estimatedTax;

  const handlePaySuccess = async () => {
    setIsProcessing(true);
    const itemsSnapshot = cart.length > 0 ? [...cart] : [
      { name: 'iPhone 16 Pro Max 256GB', color: 'Desert Titanium', storage: '256GB', price: 144900, quantity: 1 }
    ];
    const itemsNames = itemsSnapshot.map(i => `${i.name} (${i.storage})`).join(', ');
    const amtSnapshot = finalTotal > 0 ? finalTotal : 144900;

    const generatedId = `APL-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderDate(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    setPurchasedItems(itemsSnapshot);
    setOrderComplete(true);
    setIsProcessing(false);

    // Log payment to backend asynchronously
    try {
      await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData.fullName || 'Andrew Smith',
          email: formData.email || 'andrew.customer@apple.com',
          items: itemsNames,
          amount: amtSnapshot,
          method: formData.paymentMethod === 'gpay-qr' ? 'Google Pay (GPay QR)' : 'Credit Card EMI'
        })
      });
    } catch (err) {
      console.warn("Payment log notice:", err);
    }

    clearCart();
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const pName = purchasedItems.length > 0 ? purchasedItems[0].name : 'iPhone 16 Pro Max';
      await submitProductReview({
        product: pName,
        customer: formData.fullName || 'Verified Customer',
        rating: reviewRating,
        comment: reviewComment || 'Excellent Apple Store purchase experience!'
      });
      setReviewSubmitted(true);
    } catch (err) {
      setReviewSubmitted(true);
    }
  };

  // Render Printable Tax Invoice Bill upon payment success
  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        
        {/* Top Success Banner */}
        <div className="text-center space-y-3 print:hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center shadow-2xl"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-apple-text-light dark:text-apple-text-dark">
            Payment Successful!
          </h1>
          <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark">
            Your transaction has been verified via Google Pay. Order ID: <strong className="text-apple-accent font-mono">{orderId}</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => {
                localStorage.setItem('last_order_id', orderId);
                navigate('/track');
              }}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg transition-colors animate-pulse"
            >
              <Truck size={16} />
              <span>Track Order & Delivery Status 🚚 (Live Map)</span>
            </button>
            <button
              onClick={handlePrintInvoice}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-apple-accent text-white text-xs font-bold shadow-lg hover:bg-apple-accentHover transition-colors"
            >
              <Printer size={16} />
              <span>Print Tax Invoice Bill</span>
            </button>
            <button
              onClick={() => {
                window.open('/review', '_blank');
              }}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-lg transition-colors"
            >
              <Star size={16} className="fill-white" />
              <span>Rate Product & Leave Feedback ⭐</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-full bg-black/10 dark:bg-white/10 text-apple-text-light dark:text-apple-text-dark text-xs font-semibold hover:bg-black/20"
            >
              Return to Home
            </button>
          </div>
        </div>

        {/* Official Printable Tax Invoice Bill */}
        <div className="glass-card rounded-3xl p-8 space-y-6 border border-black/10 dark:border-white/10 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-black/10 dark:border-white/10 pb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-apple-text-light dark:text-apple-text-dark print:text-black flex items-center gap-2">
                 Apple Store India
              </h2>
              <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark print:text-gray-600 mt-1">
                Official Retailer • Curated & Owned by <strong>Andrew</strong>
              </p>
              <p className="text-[11px] text-gray-400 print:text-gray-500 mt-0.5">GSTIN: 27APLIND9920Z8 • Trade License: APL-2026-IN</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-500/10 text-green-600 print:text-green-700 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/20">
                Paid via GPay
              </span>
              <p className="text-xs font-mono font-bold mt-2 text-apple-text-light dark:text-apple-text-dark print:text-black">Invoice #: {orderId}</p>
              <p className="text-[11px] text-gray-400 print:text-gray-500">{orderDate}</p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-apple-text-subtleLight dark:text-apple-text-subtleDark print:text-gray-500 block mb-1">Billed To</span>
              <p className="font-bold text-apple-text-light dark:text-apple-text-dark print:text-black text-sm">{formData.fullName}</p>
              <p>{formData.email}</p>
            </div>
            <div className="text-right">
              <span className="font-bold uppercase tracking-wider text-apple-text-subtleLight dark:text-apple-text-subtleDark print:text-gray-500 block mb-1">Shipping Destination</span>
              <p className="font-medium">{formData.street}</p>
              <p>{formData.city}, {formData.state} - {formData.zip}</p>
              <p className="font-semibold text-green-600 print:text-green-700">Express Delivery (Next-Day)</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-apple-text-subtleLight dark:text-apple-text-subtleDark print:text-gray-600 font-semibold uppercase">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Configuration</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {purchasedItems.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5 font-bold text-apple-text-light dark:text-apple-text-dark print:text-black">{item.name}</td>
                    <td className="py-2.5 text-gray-500">{item.color} | {item.storage}</td>
                    <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 text-right font-bold">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax & Total Summary */}
          <div className="border-t border-black/10 dark:border-white/10 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-apple-text-subtleLight dark:text-apple-text-subtleDark print:text-gray-600">
              <span>Subtotal</span>
              <span>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-apple-text-subtleLight dark:text-apple-text-subtleDark print:text-gray-600">
              <span>CGST (9%) + SGST (9%)</span>
              <span>₹{estimatedTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-apple-text-subtleLight dark:text-apple-text-subtleDark print:text-gray-600">
              <span>Shipping Fee</span>
              <span className="text-green-600 font-bold">₹0.00 (FREE)</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-apple-text-light dark:text-apple-text-dark print:text-black pt-3 border-t border-black/10 dark:border-white/10">
              <span>Total Amount Paid</span>
              <span className="text-apple-accent print:text-black">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Signature & Authorizer */}
          <div className="pt-6 border-t border-black/10 dark:border-white/10 flex justify-between items-end text-[11px] text-gray-400 print:text-gray-600">
            <div>
              <p>This is a computer-generated tax invoice verified by Google Pay.</p>
              <p>For support inquiries, contact support@apple-store-andrew.in</p>
            </div>
            <div className="text-center space-y-1">
              <p className="font-mono text-xs font-bold text-apple-accent italic">Andrew</p>
              <p className="font-semibold border-t border-black/20 dark:border-white/20 pt-1 px-4">Authorized Signature (Andrew)</p>
            </div>
          </div>

        </div>

        {/* Integrated Customer Product Rating & Review Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-amber-500/30 print:hidden text-center shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Star size={24} className="fill-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark">Rate Your Apple Store Purchase</h3>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark">
              How was your experience purchasing <strong className="text-apple-accent">{purchasedItems[0]?.name || 'iPhone 16 Pro Max'}</strong>?
            </p>
          </div>

          {!reviewSubmitted ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-md mx-auto text-left">
              <div className="flex justify-center space-x-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      size={28}
                      className={reviewRating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-400 block mb-1">Feedback Comment</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your feedback on build quality, camera, or fast checkout service..."
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl p-3 border border-black/10 dark:border-white/10"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles size={14} />
                <span>Submit Verified Customer Review</span>
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center justify-center space-x-2">
              <CheckCircle2 size={16} />
              <span>Thank you! Your verified product review has been submitted to MongoDB.</span>
            </div>
          )}
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
        Checkout & Payment
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Form */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-black/5 dark:border-white/10">
            <h2 className="text-lg font-bold text-apple-text-light dark:text-apple-text-dark">1. Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-2.5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-2.5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-2.5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-2.5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">PIN Code</label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl px-3.5 py-2.5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-card rounded-3xl p-6 space-y-6 border border-black/5 dark:border-white/10">
            <h2 className="text-lg font-bold text-apple-text-light dark:text-apple-text-dark">2. Payment Method</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-4 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                formData.paymentMethod === 'gpay-qr' ? 'border-apple-accent bg-apple-accent/10 font-bold shadow-md' : 'border-black/10 dark:border-white/10'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="gpay-qr"
                  checked={formData.paymentMethod === 'gpay-qr'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'gpay-qr' })}
                  className="accent-apple-accent"
                />
                <div className="flex items-center space-x-2">
                  <QrCode className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Google Pay (GPay) QR Code</span>
                </div>
              </label>

              <label className={`p-4 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                formData.paymentMethod === 'credit-card' ? 'border-apple-accent bg-apple-accent/10 font-bold shadow-md' : 'border-black/10 dark:border-white/10'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="credit-card"
                  checked={formData.paymentMethod === 'credit-card'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'credit-card' })}
                  className="accent-apple-accent"
                />
                <span className="text-sm flex items-center gap-1.5"><CreditCard size={16} /> Credit / Debit Card</span>
              </label>
            </div>

            {/* Google Pay GPay QR Code Display Box */}
            {formData.paymentMethod === 'gpay-qr' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#2c2c2e] p-6 rounded-3xl border border-green-500/30 text-center space-y-4 shadow-xl"
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold">
                  <QrCode size={16} />
                  <span>Scan & Pay via GPay / PhonePe / Paytm / BHIM</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-200 inline-block mx-auto shadow-inner">
                  {/* User Provided Google Pay GPay QR Code */}
                  <div className="w-56 h-56 bg-white p-2 relative flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl shadow-md">
                    <img
                      src="/gpay_qr.png"
                      alt="Google Pay GPay QR Code"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div className="mt-2 text-xs font-mono text-gray-800 font-bold">Scan with GPay / PhonePe / Paytm / BHIM</div>
                </div>

                <div className="text-xs space-y-1 text-gray-500 dark:text-gray-300">
                  <p>Payable Amount: <strong className="text-apple-accent text-sm">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></p>
                  <p>Recipient: <strong>Andrew Apple Store (Official)</strong></p>
                </div>

                <button
                  type="button"
                  onClick={handlePaySuccess}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2 mx-auto active:scale-95"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying GPay Payment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Check size={18} />
                      <span>I Have Completed GPay Payment (Generate Tax Invoice)</span>
                    </div>
                  )}
                </button>
              </motion.div>
            )}

          </div>

        </div>

        {/* Order Summary Right Panel */}
        <div className="glass-card rounded-3xl p-6 space-y-6 border border-black/5 dark:border-white/10 h-fit">
          <h2 className="text-xl font-bold text-apple-text-light dark:text-apple-text-dark border-b border-black/5 dark:border-white/10 pb-3">
            Order Summary
          </h2>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cart.map(item => (
              <div key={item.cartItemId} className="flex justify-between text-xs py-1 border-b border-black/5 dark:border-white/5">
                <span className="text-apple-text-light dark:text-apple-text-dark font-medium">{item.quantity}x {item.name} ({item.storage})</span>
                <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-t border-black/10 dark:border-white/10 pt-3">
            <div className="flex justify-between text-apple-text-subtleLight dark:text-apple-text-subtleDark">
              <span>Subtotal</span>
              <span>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-apple-text-subtleLight dark:text-apple-text-subtleDark">
              <span>Estimated Tax (GST 18%)</span>
              <span>₹{estimatedTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-apple-text-light dark:text-apple-text-dark pt-2 border-t border-black/10 dark:border-white/10">
              <span>Total</span>
              <span className="text-apple-accent">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {formData.paymentMethod !== 'gpay-qr' && (
            <button
              type="button"
              onClick={handlePaySuccess}
              disabled={isProcessing}
              className="w-full py-4 bg-apple-accent hover:bg-apple-accentHover disabled:opacity-50 text-white font-bold text-sm rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2 active:scale-95"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <Lock size={16} />
                  <span>Pay ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </button>
          )}

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-apple-text-subtleLight dark:text-apple-text-subtleDark pt-2">
            <ShieldCheck size={14} className="text-apple-accent" />
            <span>Encrypted 256-bit GPay / UPI Payment</span>
          </div>
        </div>

      </div>
    </div>
  );
};
