import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, LogOut, Package, Users, CreditCard, ShieldCheck, 
  TrendingUp, Plus, Trash2, Edit, RefreshCw, CheckCircle2, AlertCircle, 
  Search, Shield, BarChart3, ChevronRight, Sparkles, Inbox, Store,
  DollarSign, Calendar, DollarSign as RupeeIcon, Check, Clock, MessageSquare,
  User, Database, Star, MapPin, Phone, Mail, Settings, Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  adminLogin, fetchAdminProducts, addAdminProduct, updateAdminProduct, deleteAdminProduct,
  fetchAdminStaff, addAdminStaff, updateAdminStaffStatus,
  fetchAdminPayments, fetchAdminLogs, fetchProductReviews,
  deleteProductReview, submitProductReview, fetchOwnerProfile, updateOwnerProfile,
  fetchStoreLocations, fetchChatThreads, sendChatReply, connectMongoDB
} from '../services/api';

export const AdminPortal = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('apple_admin_token');
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab State: 'dashboard', 'products', 'reviews', 'stores', 'staff', 'payments', 'logs', 'profile', 'chat'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatThreads, setChatThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [staffReplyText, setStaffReplyText] = useState('');
  const [selectedStaffDocModal, setSelectedStaffDocModal] = useState(null);

  // Data States
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [payments, setPayments] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [storeLocations, setStoreLocations] = useState([]);
  const [ownerProfile, setOwnerProfile] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'iPhone', price: '', image: '', description: '' });
  const [editingProduct, setEditingProduct] = useState(null);


  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Senior Apple Specialist', store: 'Apple BKC (Mumbai)', status: 'On Duty', salary: '85000', payday: '1st of month', payStatus: 'Paid' });

  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ product: 'iPhone 16 Pro Max', customer: '', rating: 5, comment: '' });

  // Profile Edit & Badge State
  const [showOwnerBadgeModal, setShowOwnerBadgeModal] = useState(false);
  const [showMongoConnectModal, setShowMongoConnectModal] = useState(false);
  const [mongoPassword, setMongoPassword] = useState('');
  const [isConnectingMongo, setIsConnectingMongo] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: 'Louie Andrew',
    email: 'louieandrew11@gmail.com',
    phone: '+91 98200 11111',
    role: 'Store Owner & Chief Executive',
    location: 'Mumbai, India'
  });

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');

  // Load all admin portal data
  const loadPortalData = async () => {
    setIsLoadingData(true);
    try {
      const [prods, stf, pymts, lgs, revs, prof, strs, thrds] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminStaff(),
        fetchAdminPayments(),
        fetchAdminLogs(),
        fetchProductReviews(),
        fetchOwnerProfile(),
        fetchStoreLocations(),
        fetchChatThreads()
      ]);
      setProducts(prods);
      setChatThreads(thrds);
      if (thrds.length > 0 && !selectedThreadId) {
        setSelectedThreadId(thrds[0].threadId);
      }

      const enhancedStaff = stf.map((s, idx) => ({
        ...s,
        salary: s.salary || [95000, 85000, 110000, 78000, 72000][idx % 5],
        payday: s.payday || "1st of every month",
        payStatus: s.payStatus || (idx % 2 === 0 ? "Paid" : "Processing")
      }));

      setStaff(enhancedStaff);
      setPayments(pymts);
      setAdminLogs(lgs.adminLogs || []);
      setSupportTickets(lgs.supportInquiries || []);
      setReviews(revs);
      setOwnerProfile(prof);
      setProfileForm({
        name: prof.name || 'Louie Andrew',
        email: prof.email || 'louieandrew11@gmail.com',
        phone: prof.phone || '+91 98200 11111',
        role: prof.role || 'Store Owner & Chief Executive',
        location: prof.location || 'Mumbai, India'
      });
      setStoreLocations(strs);
    } catch (err) {
      console.error("Error loading portal data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPortalData();
    }
  }, [isAuthenticated]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Login / Logout
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await adminLogin(loginForm);
      localStorage.setItem('apple_admin_token', res.token);
      setIsAuthenticated(true);
    } catch (err) {
      setLoginError(err.message || 'Invalid Username or Password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('apple_admin_token');
    setIsAuthenticated(false);
  };

  // Actions
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedPrice = parseInt(newProduct.price) || 0;
      await addAdminProduct({ ...newProduct, price: parsedPrice });
      setShowAddProductModal(false);
      setNewProduct({ name: '', category: 'iPhone', price: '', image: '', description: '' });
      showToast("Added new catalog product successfully!");
      loadPortalData();
    } catch (err) {
      alert(err.message || 'Error adding product.');
    }
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedPrice = parseInt(editingProduct.price) || 0;
      await updateAdminProduct({ ...editingProduct, price: parsedPrice });
      setEditingProduct(null);
      showToast("Updated catalog product successfully!");
      loadPortalData();
    } catch (err) {
      alert(err.message || 'Error updating product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to remove this item from the catalog?")) {
      try {
        await deleteAdminProduct(id);
        showToast("Product deleted from catalog");
        loadPortalData();
      } catch (err) {
        alert(err.message || 'Error deleting product.');
      }
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAdminStaff(newStaff);
      setShowAddStaffModal(false);
      setNewStaff({ name: '', role: 'Senior Apple Specialist', store: 'Apple BKC (Mumbai)', status: 'On Duty', salary: '85000', payday: '1st of month', payStatus: 'Paid' });
      showToast("Specialist added to staff roster!");
      loadPortalData();
    } catch (err) {
      alert(err.message || 'Error adding staff member.');
    }
  };

  const handleToggleStaffStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'On Duty' ? 'On Break' : currentStatus === 'On Break' ? 'Off Duty' : 'On Duty';
    try {
      await updateAdminStaffStatus(id, nextStatus);
      loadPortalData();
    } catch (err) {
      alert('Error updating staff status.');
    }
  };

  const handleProcessSalaryTransfer = (staffMember) => {
    setStaff(prev => prev.map(s => s.id === staffMember.id ? { ...s, payStatus: 'Paid' } : s));
    showToast(`Processed ₹${staffMember.salary.toLocaleString()} direct bank transfer to ${staffMember.name}`);
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitProductReview(newReview);
      setShowAddReviewModal(false);
      setNewReview({ product: 'iPhone 16 Pro Max', customer: '', rating: 5, comment: '' });
      showToast("Customer review recorded successfully!");
      loadPortalData();
    } catch (err) {
      alert(err.message || 'Error adding review.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Remove this customer review?")) {
      try {
        await deleteProductReview(id);
        showToast("Review deleted");
        loadPortalData();
      } catch (err) {
        alert('Error deleting review.');
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateOwnerProfile(profileForm);
      setIsEditingProfile(false);
      showToast("Owner Profile updated successfully!");
      loadPortalData();
    } catch (err) {
      alert('Error updating profile.');
    }
  };

  // Metrics
  const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalMonthlyPayroll = staff.reduce((acc, curr) => acc + (curr.salary || 85000), 0);

  // Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-apple-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="text-center space-y-2 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-apple-accent/10 border border-apple-accent/30 text-apple-accent flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-apple-text-light dark:text-apple-text-dark">Owner & Admin Portal 🔐</h1>
            <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark">
              Authorized login for store owner. Database: <strong className="text-cyan-400">admin</strong> on MongoDB Atlas.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Username / Owner ID</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="e.g. admin"
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl pl-10 pr-4 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-apple-text-subtleLight dark:text-apple-text-subtleDark block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl pl-10 pr-4 py-3 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-apple-accent"
                />
                <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="p-3 bg-black/20 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 text-[11px] text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Default Owner ID:</span>
                <strong className="text-cyan-400">admin</strong>
              </div>
              <div className="flex justify-between">
                <span>Default Password:</span>
                <strong className="text-cyan-400">apple123</strong>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-apple-accent hover:bg-apple-accentHover disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Lock size={14} />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Owner Portal'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleSendStaffReply = async (e) => {
    e.preventDefault();
    if (!selectedThreadId || !staffReplyText.trim()) return;
    try {
      await sendChatReply(selectedThreadId, staffReplyText, 'Aarav Sharma (Apple Specialist)');
      setStaffReplyText('');
      showToast("Live support reply sent to customer!");
      loadPortalData();
    } catch (err) {
      alert("Error sending reply.");
    }
  };

  const menuItems = [
    { id: 'dashboard', name: 'Overview & Auto Graphs', icon: BarChart3 },
    { id: 'products', name: `Catalog Control (${products.length})`, icon: Package },
    { id: 'chat', name: `Live Staff Chat Desk (${chatThreads.length})`, icon: Sparkles },
    { id: 'inbox', name: `Support Inbox (${supportTickets.length})`, icon: Inbox },
    { id: 'reviews', name: `Customer Reviews (${reviews.length})`, icon: MessageSquare },
    { id: 'stores', name: `Store Operations (${storeLocations.length})`, icon: Store },
    { id: 'staff', name: `Staff & Payroll (${staff.length})`, icon: Users },
    { id: 'payments', name: `Payment Logs (${payments.length})`, icon: CreditCard },
    { id: 'logs', name: `Audit System (${adminLogs.length})`, icon: ShieldCheck },
    { id: 'profile', name: 'Owner Profile Details', icon: User }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-2 border border-emerald-400"
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="text-2xl"></span>
            <h1 className="text-3xl font-extrabold text-apple-text-light dark:text-apple-text-dark tracking-tight">
              Apple Store Owner Control Center 🔐
            </h1>
            <button
              onClick={() => setShowMongoConnectModal(true)}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5 transition-all hover:scale-105 shadow-sm"
              title="Click to Connect & Seed MongoDB Atlas Cluster"
            >
              <Database size={11} className="animate-pulse" />
              <span>MongoDB: admin (Connect Cluster 🍃)</span>
            </button>
          </div>
          <p className="text-xs text-apple-text-subtleLight dark:text-apple-text-subtleDark flex items-center space-x-2">
            <span>Owner: <strong className="text-cyan-400">{ownerProfile.name || 'Louie Andrew'}</strong> ({ownerProfile.email || 'louieandrew11@gmail.com'})</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadPortalData}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Refresh Database Logs"
          >
            <RefreshCw size={14} className={isLoadingData ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 flex items-center space-x-1.5 transition-colors"
          >
            <LogOut size={14} />
            <span>Logout Portal</span>
          </button>
        </div>
      </div>

      {/* EXPANDED MENU BAR OPTIONS */}
      <div className="flex flex-wrap border-b border-black/10 dark:border-white/10 gap-2 pb-2">
        {menuItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-apple-accent text-white shadow-md shadow-apple-accent/20'
                : 'text-apple-text-subtleLight dark:text-apple-text-subtleDark hover:text-apple-text-light dark:hover:text-apple-text-dark hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & AUTO ANALYTICS GRAPHS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-black/5 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">Total Sales Volume</p>
                <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">₹{totalRevenue.toLocaleString()}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{payments.length} Orders Processed</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-black/5 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">Catalog Products</p>
                <h3 className="text-2xl font-extrabold text-apple-accent mt-1">{products.length} Items</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">MongoDB Atlas: admin</p>
              </div>
              <div className="p-3 rounded-2xl bg-apple-accent/10 text-apple-accent">
                <Package size={24} />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-black/5 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">Monthly Payroll</p>
                <h3 className="text-2xl font-extrabold text-purple-400 mt-1">₹{totalMonthlyPayroll.toLocaleString()}</h3>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{staff.length} Active Specialists</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                <Calendar size={24} />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-black/5 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">Customer Reviews</p>
                <h3 className="text-2xl font-extrabold text-cyan-400 mt-1">{reviews.length} Ratings</h3>
                <p className="text-[10px] text-amber-400 mt-0.5 font-semibold">★ 4.9 Average Rating</p>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                <MessageSquare size={24} />
              </div>
            </div>
          </div>

          {/* AUTO ANALYTICS SVG GRAPH CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Monthly Store Revenue Analytics (in ₹ Lakhs)
                  </h3>
                  <p className="text-[11px] text-gray-400">Automated sales projection & performance trend</p>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  +34.8% YoY
                </span>
              </div>

              <div className="h-48 w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 10 120 Q 80 80 150 100 T 290 50 T 410 30 L 490 15 L 490 140 L 10 140 Z" fill="url(#revenueGrad)" />
                  <path d="M 10 120 Q 80 80 150 100 T 290 50 T 410 30 L 490 15" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  {[
                    { x: 10, y: 120, label: 'Jan' },
                    { x: 100, y: 90, label: 'Mar' },
                    { x: 200, y: 70, label: 'Jun' },
                    { x: 300, y: 45, label: 'Sep' },
                    { x: 410, y: 30, label: 'Nov' },
                    { x: 490, y: 15, label: 'Dec' }
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x={pt.x} y="145" fill="#9ca3af" fontSize="9" textAnchor="middle">{pt.label}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-apple-accent" />
                Category Share
              </h3>

              <div className="flex flex-col items-center justify-center py-2 relative">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2c2c2e" strokeWidth="3.8" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0071e3" strokeWidth="3.8" strokeDasharray="60, 100" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#a855f7" strokeWidth="3.8" strokeDasharray="25, 100" strokeDashoffset="-60" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06b6d4" strokeWidth="3.8" strokeDasharray="15, 100" strokeDashoffset="-85" />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-gray-400 font-semibold">iPhone</span>
                  <span className="text-lg font-extrabold text-white">60%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-1.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                  <strong className="block">60%</strong> iPhone
                </div>
                <div className="p-1.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                  <strong className="block">25%</strong> Mac
                </div>
                <div className="p-1.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                  <strong className="block">15%</strong> iPad
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIVE STAFF CHAT DESK */}
      {activeTab === 'chat' && (
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Live Customer Support & Staff Chat Response Desk
              </h3>
              <p className="text-xs text-gray-400">
                Incoming customer inquiry threads. Respond as Apple Store Specialist / Owner in real time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
            {/* Left Column: Threads List */}
            <div className="space-y-3 border-r border-white/10 pr-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Threads</h4>
              {chatThreads.map(th => (
                <div
                  key={th.threadId}
                  onClick={() => setSelectedThreadId(th.threadId)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-xs space-y-1 ${
                    selectedThreadId === th.threadId
                      ? 'bg-apple-accent/20 border-apple-accent text-white'
                      : 'bg-black/20 hover:bg-white/5 border-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-white">{th.customerName}</strong>
                    <span className="text-[10px] font-mono text-cyan-400">{th.threadId}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">{th.product}</p>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full inline-block mt-1">
                    {th.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column: Chat Messages & Reply Console */}
            <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
              {(() => {
                const activeThread = chatThreads.find(t => t.threadId === selectedThreadId) || chatThreads[0];
                if (!activeThread) return <div className="text-xs text-gray-400">No active chat thread.</div>;
                return (
                  <>
                    <div className="space-y-3 overflow-y-auto max-h-80 p-3 bg-black/30 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                        <span className="font-bold text-white">Conversation with {activeThread.customerName} ({activeThread.email})</span>
                        <span className="text-[10px] text-gray-400 font-mono">Product: {activeThread.product}</span>
                      </div>

                      {activeThread.messages.map((msg, mIdx) => (
                        <div
                          key={mIdx}
                          className={`flex flex-col text-xs max-w-[85%] space-y-1 ${
                            msg.sender === 'staff' ? 'ml-auto items-end' : 'mr-auto items-start'
                          }`}
                        >
                          <span className="text-[9px] text-gray-400">
                            {msg.sender === 'staff' ? (msg.staffName || 'Apple Specialist') : msg.sender === 'ai' ? (msg.staffName || ' Apple Genius AI Assistant') : activeThread.customerName} • {msg.timestamp}
                          </span>
                          <div
                            className={`p-3 rounded-2xl ${
                              msg.sender === 'staff'
                                ? 'bg-apple-accent text-white rounded-br-none'
                                : msg.sender === 'ai'
                                ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/30 rounded-bl-none'
                                : 'bg-white/10 text-gray-200 rounded-bl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Staff Reply Form */}
                    <form onSubmit={handleSendStaffReply} className="flex gap-2">
                      <input
                        type="text"
                        value={staffReplyText}
                        onChange={(e) => setStaffReplyText(e.target.value)}
                        placeholder={`Reply to ${activeThread.customerName} as Apple Specialist...`}
                        className="flex-1 bg-[#2c2c2e] text-white text-xs rounded-xl px-4 py-3 border border-white/10"
                      />
                      <button
                        type="submit"
                        className="px-5 py-3 bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1"
                      >
                        <Sparkles size={14} />
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG CONTROL */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog products..."
                className="w-full bg-apple-bg-light dark:bg-[#2c2c2e] text-apple-text-light dark:text-apple-text-dark text-xs rounded-xl pl-9 pr-4 py-2.5 border border-black/10 dark:border-white/10"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-5 py-2.5 bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg"
            >
              <Plus size={16} />
              <span>Add New Catalog Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(p => (
                <div key={p.id} className="glass-card rounded-2xl p-4 border border-black/5 dark:border-white/10 flex flex-col justify-between space-y-3 relative group">
                  <div className="flex space-x-4 items-start">
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-contain bg-black/40 rounded-xl p-1.5" />
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] uppercase font-bold text-apple-accent tracking-wider">{p.category}</span>
                      <h4 className="font-bold text-sm text-white leading-snug">{p.name}</h4>
                      <p className="text-xs font-extrabold text-emerald-400">₹{p.price?.toLocaleString()}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 line-clamp-2">{p.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs flex items-center space-x-1 transition-colors"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER PRODUCT REVIEWS & RATINGS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Customer Product Reviews & Moderation
              </h3>
              <p className="text-xs text-gray-400">
                Customer feedback stored in MongoDB Atlas database <strong className="text-cyan-400">admin -&gt; reviews</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowAddReviewModal(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md"
            >
              <Plus size={14} />
              <span>Record New Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-apple-accent uppercase">{rev.product}</span>
                    <h4 className="font-bold text-sm text-white">{rev.customer}</h4>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star size={14} className="fill-amber-400" />
                    <span className="text-xs font-bold">{rev.rating} / 5</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 italic">"{rev.comment}"</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-gray-400">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>Verified Purchase</span>
                  </span>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="text-red-400 hover:underline flex items-center space-x-1"
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STORE OPERATIONS & LOCATIONS MANAGER */}
      {activeTab === 'stores' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-400" />
                Store Locations & Operations Control
              </h3>
              <p className="text-xs text-gray-400">
                Official Apple stores in Mumbai, Delhi, Cupertino, New York, London & Singapore.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeLocations.map(st => (
              <div key={st.id} className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between space-y-4 p-5">
                <div className="space-y-3">
                  <div className="h-36 rounded-2xl overflow-hidden relative">
                    <img src={st.image} alt={st.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg">
                      {st.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{st.name}</h4>
                    <p className="text-xs text-apple-accent font-semibold">{st.tagline}</p>
                  </div>
                  <p className="text-xs text-gray-300 flex items-start space-x-1.5">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{st.address}</span>
                  </p>
                  <p className="text-xs text-gray-300 flex items-center space-x-1.5">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{st.phone}</span>
                  </p>
                  <p className="text-xs text-gray-300 flex items-center space-x-1.5">
                    <Clock size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{st.hours}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STAFF & PAYROLL */}
      {activeTab === 'staff' && (
        <div className="glass-card rounded-3xl p-6 space-y-6 border border-black/5 dark:border-white/10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Working Members Roster & Salary Schedule
              </h3>
              <p className="text-xs text-gray-400">
                Manage store team members, shift statuses, monthly salaries in ₹, and direct bank payday transfers.
              </p>
            </div>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md"
            >
              <Plus size={14} />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-3">Staff ID</th>
                  <th className="py-3 px-3">Specialist Name</th>
                  <th className="py-3 px-3">Role & Store</th>
                  <th className="py-3 px-3">Shift Status</th>
                  <th className="py-3 px-3">Monthly Salary</th>
                  <th className="py-3 px-3">Payday Schedule</th>
                  <th className="py-3 px-3">Pay Status</th>
                  <th className="py-3 px-3 text-right">Transfer Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staff.map(member => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-purple-400">{member.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{member.name}</td>
                    <td className="py-3 px-3 text-gray-300">
                      <div>{member.role}</div>
                      <div className="text-[10px] text-gray-400">{member.store}</div>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleStaffStatus(member.id, member.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          member.status === 'On Duty'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : member.status === 'On Break'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}
                      >
                        {member.status}
                      </button>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-400">
                      ₹{member.salary ? member.salary.toLocaleString() : '85,000'} / mo
                    </td>
                    <td className="py-3 px-3 text-gray-300 flex items-center space-x-1 pt-4">
                      <Clock size={12} className="text-gray-400" />
                      <span>{member.payday || '1st of month'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.payStatus === 'Paid'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}>
                        {member.payStatus || 'Paid'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedStaffDocModal(member)}
                        className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-[10px] rounded-lg transition-colors shadow-sm"
                      >
                        Doc Badge 📄
                      </button>
                      <button
                        onClick={() => handleProcessSalaryTransfer(member)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-colors shadow-sm"
                      >
                        Process Transfer (₹)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: PAYMENT LOGS */}
      {activeTab === 'payments' && (
        <div className="glass-card rounded-3xl p-6 space-y-6 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Customer Checkout & Payment Logs
              </h3>
              <p className="text-xs text-gray-400">
                Audit tray of transactions processed in Indian Rupees (₹).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Purchased Items</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{p.orderId}</td>
                    <td className="py-3 px-3 text-gray-400">{new Date(p.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-white">{p.customer}</td>
                    <td className="py-3 px-3 text-gray-300">{p.items}</td>
                    <td className="py-3 px-3 text-purple-300">{p.method}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-400">{p.formattedAmount || `₹${p.amount?.toLocaleString()}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SYSTEM AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="glass-card rounded-3xl p-6 space-y-6 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Administrative System & Security Audit Logs
              </h3>
              <p className="text-xs text-gray-400">
                Combined system activity logs, admin logins, and catalog modifications.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {adminLogs.map((log, idx) => (
              <div key={idx} className="bg-black/20 dark:bg-white/5 p-4 rounded-2xl border border-white/5 flex items-start justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-cyan-400">{log.action}</span>
                    <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">{log.user}</span>
                  </div>
                  <p className="text-gray-300">{log.details}</p>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: OWNER PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="glass-card rounded-[32px] p-8 sm:p-10 space-y-8 border border-purple-500/30 shadow-2xl max-w-4xl mx-auto relative overflow-hidden bg-gradient-to-b from-[#1c1c1e] via-[#141416] to-[#0a0a0c]"
        >
          {/* Ambient Motion Glow Overlay */}
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Profile Top Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6 relative z-10">
            <div className="flex items-center space-x-5 text-center sm:text-left">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 text-white font-black text-3xl flex items-center justify-center shadow-2xl ring-4 ring-purple-500/30"
              >
                LA
              </motion.div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-2xl font-black text-white">{ownerProfile.name || 'Louie Andrew'}</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Owner
                  </span>
                </div>
                <p className="text-xs text-cyan-400 font-bold">{ownerProfile.role || 'Store Owner & Chief Executive'}</p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1.5 justify-center sm:justify-start">
                  <MapPin size={12} className="text-purple-400" /> {ownerProfile.location || 'Mumbai, India'} • Level 5 Master Clearance
                </p>
              </div>
            </div>

            {/* Profile Header Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setShowOwnerBadgeModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <ShieldCheck size={16} />
                <span>View Executive Badge 🆔</span>
              </button>

              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors border border-white/15"
              >
                <Edit size={14} />
                <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {!isEditingProfile ? (
            <div className="space-y-6 relative z-10">
              
              {/* Executive Status Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Supervised Stores</span>
                  <span className="text-lg font-black text-cyan-400 block">6 Flagships</span>
                </div>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Store Specialists</span>
                  <span className="text-lg font-black text-purple-400 block">5 Certified</span>
                </div>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Security Auth</span>
                  <span className="text-xs font-black text-emerald-400 block pt-1">2FA Active ✓</span>
                </div>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Primary Database</span>
                  <span className="text-xs font-mono font-bold text-amber-400 block pt-1">admin (Atlas)</span>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <motion.div whileHover={{ y: -3 }} className="p-4 bg-black/30 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-gray-400 font-semibold block uppercase text-[10px]">Owner Email Address</span>
                  <span className="font-bold text-white flex items-center space-x-2">
                    <Mail size={14} className="text-cyan-400" />
                    <span>{ownerProfile.email || 'louieandrew11@gmail.com'}</span>
                  </span>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} className="p-4 bg-black/30 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-gray-400 font-semibold block uppercase text-[10px]">Contact Phone</span>
                  <span className="font-bold text-white flex items-center space-x-2">
                    <Phone size={14} className="text-emerald-400" />
                    <span>{ownerProfile.phone || '+91 98200 11111'}</span>
                  </span>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} className="p-4 bg-black/30 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-gray-400 font-semibold block uppercase text-[10px]">Connected MongoDB Cluster</span>
                  <span className="font-bold text-cyan-400 flex items-center space-x-2 font-mono">
                    <Server size={14} />
                    <span>cluster0.28idf9t.mongodb.net</span>
                  </span>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} className="p-4 bg-black/30 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-gray-400 font-semibold block uppercase text-[10px]">Database Name</span>
                  <span className="font-bold text-purple-400 flex items-center space-x-2 font-mono">
                    <Database size={14} />
                    <span>admin</span>
                  </span>
                </motion.div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs relative z-10">
              <div>
                <label className="text-gray-300 block mb-1 font-semibold">Owner Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-apple-accent hover:bg-apple-accentHover text-white font-bold rounded-xl shadow-lg"
              >
                Save Profile Updates
              </button>
            </form>
          )}
        </motion.div>
      )}

      {/* TAB 10: SUPPORT INBOX */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-purple-400" />
                Customer Support Messages
              </h3>
              <p className="text-xs text-gray-400">
                Inquiries submitted via the storefront Contact Us page.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 font-mono text-xs font-bold border border-purple-500/20">
              Total Messages: {supportTickets.length}
            </div>
          </div>

          <div className="grid gap-4">
            {supportTickets.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm font-mono border border-white/5 rounded-2xl bg-black/20">
                No support messages found.
              </div>
            ) : (
              supportTickets.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={msg.ticketId || msg._id || i}
                  className="glass-card rounded-2xl p-5 border border-white/10 space-y-3"
                >
                  <div className="flex justify-between items-start border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-bold text-white flex items-center space-x-2">
                        <span>{msg.name}</span>
                        <span className="text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                          {msg.email}
                        </span>
                      </h4>
                      <p className="text-xs font-mono text-purple-400 mt-1">Ticket ID: {msg.ticketId}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Subject</h5>
                    <p className="text-sm text-white font-medium bg-black/30 p-2.5 rounded-lg border border-white/5">
                      {msg.subject}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Message</h5>
                    <p className="text-sm text-gray-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW PRODUCT */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-apple-accent" />
                  Add New Item to Store Catalog
                </h3>
                <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. iPhone 16 Ultra"
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                    >
                      <option value="iPhone">iPhone</option>
                      <option value="MacBook">MacBook</option>
                      <option value="iPad">iPad</option>
                      <option value="Watch">Apple Watch</option>
                      <option value="AirPods">AirPods / Audio</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Price in ₹ (INR)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="e.g. 144900"
                      className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Product Image URL</label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="https://store.storeimages.cdn-apple.com/..."
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter product description..."
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-apple-accent hover:bg-apple-accentHover text-white font-bold rounded-xl shadow-lg"
                  >
                    Save Item to MongoDB
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 1B: EDIT PRODUCT */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-400" />
                  Edit Catalog Item
                </h3>
                <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleEditProductSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Item Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                    >
                      <option value="iPhone">iPhone</option>
                      <option value="Mac">Mac</option>
                      <option value="iPad">iPad</option>
                      <option value="Watch">Watch</option>
                      <option value="AirPods">AirPods</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Base Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Image URL</label>
                  <input
                    type="url"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg"
                  >
                    Update Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ADD STAFF MEMBER */}
      <AnimatePresence>
        {showAddStaffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md glass-card rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Add New Store Specialist
                </h3>
                <button onClick={() => setShowAddStaffModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Specialist Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="e.g. Rahul Mehta"
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Role</label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                    >
                      <option value="Senior Apple Specialist">Senior Apple Specialist</option>
                      <option value="Genius Bar Technician">Genius Bar Technician</option>
                      <option value="Inventory Lead">Inventory Lead</option>
                      <option value="Today at Apple Lead">Today at Apple Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Monthly Salary (₹)</label>
                    <input
                      type="number"
                      required
                      value={newStaff.salary}
                      onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                      placeholder="e.g. 85000"
                      className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg"
                  >
                    Save Specialist
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: ADD CUSTOMER REVIEW */}
      <AnimatePresence>
        {showAddReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md glass-card rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  Add Customer Review
                </h3>
                <button onClick={() => setShowAddReviewModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.customer}
                    onChange={(e) => setNewReview({ ...newReview, customer: e.target.value })}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Product Reviewed</label>
                  <select
                    value={newReview.product}
                    onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Rating (1 to 5 Stars)</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })}
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  >
                    <option value="5">★★★★★ 5.0 - Outstanding</option>
                    <option value="4.5">★★★★☆ 4.5 - Excellent</option>
                    <option value="4.0">★★★★☆ 4.0 - Very Good</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Review Comment</label>
                  <textarea
                    rows={3}
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Write review details..."
                    className="w-full bg-[#2c2c2e] text-white rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReviewModal(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg"
                  >
                    Save Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: STAFF DOCUMENT & BADGE INSPECTION */}
      <AnimatePresence>
        {selectedStaffDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 relative overflow-hidden text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Apple Staff Official Verification Document</h3>
                    <p className="text-[10px] text-gray-400 font-mono">Document ID: {selectedStaffDocModal.documentId || 'DOC-AAPL-98214-IND'}</p>
                  </div>
                </div>

                <button onClick={() => setSelectedStaffDocModal(null)} className="text-gray-400 hover:text-white font-bold text-sm">✕</button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Employee Name:</span>
                    <strong className="text-white">{selectedStaffDocModal.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Badge Number:</span>
                    <strong className="text-cyan-400 font-mono">{selectedStaffDocModal.badgeNo || 'AAPL-IND-8841'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <strong className="text-purple-300">{selectedStaffDocModal.role}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned Store:</span>
                    <strong className="text-white">{selectedStaffDocModal.store}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Compensation:</span>
                    <strong className="text-emerald-400">₹{selectedStaffDocModal.salary ? selectedStaffDocModal.salary.toLocaleString() : '85,000'} / mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verification Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <ShieldCheck size={12} />
                      <span>{selectedStaffDocModal.docStatus || 'Verified & Active'}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold block">Official Authorizations:</span>
                  <ul className="space-y-1">
                    {(selectedStaffDocModal.certifications || ["Apple Certified Technician", "AppleCare Specialist"]).map((c, i) => (
                      <li key={i} className="flex items-center space-x-2 text-gray-300">
                        <CheckCircle2 size={12} className="text-emerald-400" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setSelectedStaffDocModal(null)}
                className="w-full py-2.5 bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Close Verification Document
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: OWNER EXECUTIVE PASSPORT & ID BADGE MODAL */}
      <AnimatePresence>
        {showOwnerBadgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: 15 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ rotateY: 3, rotateX: -2, scale: 1.02 }}
              className="w-full max-w-lg glass-card rounded-[32px] p-6 sm:p-8 border-2 border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden text-left bg-gradient-to-b from-[#1c1c1e] via-[#121214] to-black"
            >
              {/* Metallic Apple Gold Badge Seal */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-black flex items-center justify-center font-black text-xl shadow-lg border border-amber-300/40">
                
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Apple Store Owner Credential Badge</h3>
                    <p className="text-[10px] text-cyan-400 font-mono">Master Clearance ID: AAPL-EXEC-8841-IND</p>
                  </div>
                </div>

                <button onClick={() => setShowOwnerBadgeModal(false)} className="text-gray-400 hover:text-white font-bold text-sm">✕</button>
              </div>

              {/* Body */}
              <div className="space-y-4 text-xs">
                {/* Photo & Role Card */}
                <div className="flex items-center space-x-4 p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 text-white font-black text-2xl flex items-center justify-center shadow-xl ring-2 ring-purple-400">
                    LA
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-base font-extrabold text-white">{ownerProfile.name || 'Louie Andrew'}</h4>
                    <p className="text-xs font-bold text-purple-300">{ownerProfile.role || 'Store Owner & Chief Executive'}</p>
                    <p className="text-[10px] text-gray-400">{ownerProfile.email || 'louieandrew11@gmail.com'}</p>
                  </div>
                </div>

                {/* Info List */}
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Clearance:</span>
                    <strong className="text-cyan-400">Level 5 Master Owner Access</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Database Authorization:</span>
                    <strong className="text-purple-300">admin (MongoDB Atlas)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cluster Node:</span>
                    <strong className="text-white">cluster0.28idf9t.mongodb.net</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Two-Factor Authentication:</span>
                    <span className="text-emerald-400 font-bold">Verified & Active ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Supervised Locations:</span>
                    <strong className="text-white">BKC Mumbai, Saket Delhi & Flagships</strong>
                  </div>
                </div>

                {/* Authorized Signature */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/10">
                  <span>Issued by Apple Executive Office</span>
                  <span className="font-mono text-cyan-400 font-bold italic">Louie Andrew (Verified)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
                >
                  Print ID Pass
                </button>
                <button
                  onClick={() => setShowOwnerBadgeModal(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Close Pass
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 6: CONNECT MONGODB ATLAS CLUSTER MODAL */}
      <AnimatePresence>
        {showMongoConnectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md glass-card rounded-3xl p-6 border border-emerald-500/40 shadow-2xl space-y-5 text-left bg-gradient-to-b from-[#1c1c1e] to-black"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  Connect MongoDB Atlas Cluster0
                </h3>
                <button onClick={() => setShowMongoConnectModal(false)} className="text-gray-400 hover:text-white font-bold text-sm">✕</button>
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs text-emerald-300 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Target Cluster:</span>
                  <strong>cluster0.28idf9t.mongodb.net</strong>
                </div>
                <div className="flex justify-between">
                  <span>Username:</span>
                  <strong>louieandrew11</strong>
                </div>
                <div className="flex justify-between">
                  <span>Target Database:</span>
                  <strong>admin</strong>
                </div>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!mongoPassword) return;
                  setIsConnectingMongo(true);
                  try {
                    const res = await connectMongoDB(mongoPassword);
                    showToast(res.message || "MongoDB Atlas Connected & Seeded Successfully! 🍃");
                    setShowMongoConnectModal(false);
                    setMongoPassword('');
                    loadPortalData();
                  } catch (err) {
                    alert(err.message || "Failed to connect to MongoDB Atlas. Check your password.");
                  } finally {
                    setIsConnectingMongo(false);
                  }
                }} 
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">MongoDB Password OR Full Connection String</label>
                  <input
                    type="text"
                    required
                    value={mongoPassword}
                    onChange={(e) => setMongoPassword(e.target.value)}
                    placeholder="Paste password or mongodb+srv://... connection string"
                    className="w-full bg-[#2c2c2e] text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:ring-2 focus:ring-emerald-400 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMongoConnectModal(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isConnectingMongo}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center gap-1.5"
                  >
                    <RefreshCw size={14} className={isConnectingMongo ? 'animate-spin' : ''} />
                    <span>{isConnectingMongo ? 'Connecting & Seeding...' : 'Connect & Seed Cluster'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
