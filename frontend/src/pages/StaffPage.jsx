import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ShieldCheck, Award, FileText, MapPin, Phone, Mail, 
  Clock, CheckCircle2, DollarSign, Calendar, Sparkles, X, ChevronRight 
} from 'lucide-react';
import { fetchAdminStaff } from '../services/api';

export const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocStaff, setSelectedDocStaff] = useState(null);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchAdminStaff();
        setStaff(data);
      } catch (err) {
        console.error("Error loading staff roster:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, []);

  return (
    <div className="min-h-screen bg-apple-bg-light dark:bg-apple-bg-dark text-apple-text-light dark:text-apple-text-dark transition-colors duration-300 py-12 relative overflow-hidden">
      
      {/* Background Animated Ambient Mesh */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
            <Users size={14} />
            <span>Apple India Certified Specialists</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Meet Our Apple Store Team & Specialists
          </h1>
          <p className="text-xs sm:text-sm text-apple-text-subtleLight dark:text-apple-text-subtleDark">
            Certified Apple Specialists, Genius Bar Technicians, and Creative Leads across Apple BKC (Mumbai) & Apple Saket (New Delhi).
          </p>
        </div>

        {/* Staff Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-400">Loading specialist credentials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member, idx) => (
              <motion.div
                key={member.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-3xl p-6 border border-black/5 dark:border-white/10 flex flex-col justify-between space-y-5 shadow-xl relative group hover:border-purple-500/40 transition-all"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    Badge: {member.badgeNo || `AAPL-IND-${8840 + idx}`}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    member.status === 'On Duty'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : member.status === 'On Break'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>
                    {member.status}
                  </span>
                </div>

                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                  <img
                    src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 shadow-md"
                  />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-apple-text-light dark:text-apple-text-dark">{member.name}</h3>
                    <p className="text-xs font-semibold text-apple-accent">{member.role}</p>
                    <p className="text-[11px] text-gray-400 flex items-center space-x-1">
                      <MapPin size={11} className="text-purple-400" />
                      <span>{member.store}</span>
                    </p>
                  </div>
                </div>

                {/* Info Details */}
                <div className="space-y-2 pt-3 border-t border-black/5 dark:border-white/10 text-xs">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Mail size={12} />
                      <span>Email:</span>
                    </span>
                    <strong className="text-apple-text-light dark:text-apple-text-dark">{member.email}</strong>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Phone size={12} />
                      <span>Contact:</span>
                    </span>
                    <strong className="text-apple-text-light dark:text-apple-text-dark">{member.phone}</strong>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>Joined Apple:</span>
                    </span>
                    <strong className="text-apple-text-light dark:text-apple-text-dark">{member.joinedDate || '2022-04-15'}</strong>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center space-x-1">
                      <DollarSign size={12} className="text-emerald-400" />
                      <span>Monthly Salary:</span>
                    </span>
                    <strong className="text-emerald-400 font-extrabold">₹{member.salary ? member.salary.toLocaleString() : '85,000'} / mo</strong>
                  </div>
                </div>

                {/* Certifications & Document View Button */}
                <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">Apple Certifications</span>
                    <div className="flex flex-wrap gap-1">
                      {(member.certifications || ["Apple Certified Technician", "AppleCare Specialist"]).map((cert, cIdx) => (
                        <span key={cIdx} className="text-[9px] bg-black/20 dark:bg-white/5 border border-black/10 dark:border-white/10 text-cyan-300 font-semibold px-2 py-0.5 rounded-md">
                          ✓ {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDocStaff(member)}
                    className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <FileText size={14} />
                    <span>View Official Staff Document</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* STAFF DOCUMENT MODAL */}
      <AnimatePresence>
        {selectedDocStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Apple Staff Verification Document</h3>
                    <p className="text-[10px] text-gray-400 font-mono">Document ID: {selectedDocStaff.documentId || 'DOC-AAPL-98214-IND'}</p>
                  </div>
                </div>

                <button onClick={() => setSelectedDocStaff(null)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-black/30 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Employee Name:</span>
                    <strong className="text-white">{selectedDocStaff.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Badge Number:</span>
                    <strong className="text-cyan-400 font-mono">{selectedDocStaff.badgeNo || 'AAPL-IND-8841'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned Store:</span>
                    <strong className="text-white">{selectedDocStaff.store}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Compensation:</span>
                    <strong className="text-emerald-400">₹{selectedDocStaff.salary ? selectedDocStaff.salary.toLocaleString() : '85,000'} / mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Document Security Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <ShieldCheck size={12} />
                      <span>{selectedDocStaff.docStatus || 'Verified & Active'}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold block">Authorized Certifications:</span>
                  <ul className="space-y-1">
                    {(selectedDocStaff.certifications || ["Apple Certified Technician"]).map((c, i) => (
                      <li key={i} className="flex items-center space-x-2 text-gray-300">
                        <CheckCircle2 size={12} className="text-emerald-400" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setSelectedDocStaff(null)}
                className="w-full py-2.5 bg-apple-accent hover:bg-apple-accentHover text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Close Document View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
