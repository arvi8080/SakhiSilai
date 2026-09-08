import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  AlertTriangle,
  MapPin,
  Layers,
  Star,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Lock
} from 'lucide-react';
import type { OrderStatus } from '../../types';

interface AdminDashboardPageProps {
  setActiveTab: (tab: string) => void;
}

type AdminTab =
  | 'dashboard'
  | 'tailors'
  | 'customers'
  | 'orders'
  | 'complaints'
  | 'locations'
  | 'categories'
  | 'reviews'
  | 'notifications'
  | 'analytics'
  | 'settings';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
  const {
    tailors,
    orders,
    categories,
    locations,
    customers,
    complaints,
    reviews,
    verifyTailor,
    addCategory,
    deleteCategory,
    addVillageToDistrict,
    addDistrictToState,
    addState,
    sendNotification,
    toggleBlockUser,
    resolveComplaint,
    deleteReview,
    updateOrderStatus
  } = useData();
  const { lang } = useLanguage();

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  // Filters & State
  const [tailorSubFilter, setTailorSubFilter] = useState<'all' | 'pending' | 'verified' | 'suspended'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Category Form
  const [catEn, setCatEn] = useState('');
  const [catHi, setCatHi] = useState('');
  const [catPrice, setCatPrice] = useState(300);

  // Location Form
  const [targetStateId, setTargetStateId] = useState('up');
  const [targetDistId, setTargetDistId] = useState('lucknow');
  const [newVillageName, setNewVillageName] = useState('');
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newStateName, setNewStateName] = useState('');

  // Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastRole, setBroadcastRole] = useState<'all' | 'customer' | 'tailor'>('all');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Complaint Modal/Note state
  const [resolvingCmpId, setResolvingCmpId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Derived Statistics
  const pendingTailors = tailors.filter(t => !t.isVerified);
  const verifiedTailors = tailors.filter(t => t.isVerified);
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const openComplaints = complaints.filter(c => c.status !== 'resolved');

  const totalVillagesCount = locations.reduce(
    (sum, st) => sum + st.districts.reduce((dSum, d) => dSum + d.villages.length, 0),
    0
  );

  // Submit Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catEn) return;
    addCategory({
      nameEn: catEn,
      nameHi: catHi || catEn,
      iconName: 'Scissors',
      descriptionEn: 'Custom stitching category added by admin.',
      descriptionHi: 'प्रशासक द्वारा जोड़ी गई नई सिलाई श्रेणी।',
      startingPrice: Number(catPrice),
      estDays: 3
    });
    setCatEn('');
    setCatHi('');
  };

  // Submit Village
  const handleAddVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillageName) return;
    addVillageToDistrict(targetStateId, targetDistId, newVillageName);
    setNewVillageName('');
  };

  // Submit District
  const handleAddDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictName) return;
    addDistrictToState(targetStateId, newDistrictName);
    setNewDistrictName('');
  };

  // Submit State
  const handleAddState = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStateName) return;
    addState(newStateName);
    setNewStateName('');
  };

  // Submit Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    sendNotification({
      targetRole: broadcastRole,
      titleEn: broadcastTitle,
      titleHi: broadcastTitle,
      messageEn: broadcastMsg,
      messageHi: broadcastMsg,
      type: 'admin'
    });
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  // Handle Complaint Resolution
  const handleResolveSubmit = (cmpId: string) => {
    resolveComplaint(cmpId, 'resolved', resolutionNote || 'Resolved by SakhiSilai Platform Admin.');
    setResolvingCmpId(null);
    setResolutionNote('');
  };

  const navItems = [
    { id: 'dashboard', label: lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'tailors', label: lang === 'hi' ? 'दर्जी प्रबंधन' : 'Tailors', icon: UserCheck, badge: pendingTailors.length },
    { id: 'customers', label: lang === 'hi' ? 'ग्राहक' : 'Customers', icon: Users, badge: customers.length },
    { id: 'orders', label: lang === 'hi' ? 'ऑर्डर्स' : 'Orders', icon: Package, badge: activeOrders.length },
    { id: 'complaints', label: lang === 'hi' ? 'शिकायतें' : 'Complaints', icon: AlertTriangle, badge: openComplaints.length, highlight: openComplaints.length > 0 },
    { id: 'locations', label: lang === 'hi' ? 'सेवा क्षेत्र (Locations)' : 'Locations', icon: MapPin, badge: null },
    { id: 'categories', label: lang === 'hi' ? 'श्रेणियां (Categories)' : 'Categories', icon: Layers, badge: categories.length },
    { id: 'reviews', label: lang === 'hi' ? 'समीक्षाएं (Reviews)' : 'Reviews', icon: Star, badge: reviews.length },
    { id: 'notifications', label: lang === 'hi' ? 'सूचनाएं (Broadcast)' : 'Notifications', icon: Bell, badge: null },
    { id: 'analytics', label: lang === 'hi' ? 'एनालिटिक्स' : 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: lang === 'hi' ? 'सुरक्षा व सेटिंग्स' : 'Settings & Security', icon: Settings, badge: null }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-20 pt-2 animate-fade-in">
      {/* BRAND & HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#2A1B3D] text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-stone-900 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
              👑 Platform Super Admin Console
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Live DB Sync Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-400">
            Sakhi<span className="text-white">Silai</span> Central Control Room
          </h1>
          <p className="text-xs text-stone-300 font-medium mt-1">
            Full platform administration: Tailors approval, rural service expansion, complaint resolution & order monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-stone-800/80 p-2.5 rounded-2xl border border-stone-700">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-900 font-black flex items-center justify-center text-sm shadow">
            SA
          </div>
          <div className="text-xs">
            <h4 className="font-extrabold text-stone-100">Seema Sharma</h4>
            <p className="text-[10px] text-amber-400 font-semibold">Chief Admin Manager</p>
          </div>
        </div>
      </div>

      {/* LAYOUT CONTAINER: SIDEBAR + MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-2">
          {/* Mobile Scrollable Horizontal Bar */}
          <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-stone-200">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id as AdminTab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-[#E91E63] text-white shadow-md'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        item.highlight ? 'bg-amber-400 text-stone-900 animate-pulse' : isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Vertical Menu Card */}
          <div className="hidden lg:block bg-white p-3 rounded-3xl border border-stone-200 shadow-md space-y-1">
            <div className="px-3 py-2 text-[11px] font-extrabold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
              Admin Menu Options
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition ${
                    isActive
                      ? 'bg-[#2A1B3D] text-amber-400 shadow-md'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.highlight
                          ? 'bg-red-500 text-white animate-bounce'
                          : isActive
                          ? 'bg-amber-400 text-stone-900'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN DISPLAY WORKSPACE */}
        <main className="lg:col-span-9 space-y-6">
          {/* ========================================================================= */}
          {/* 1. DASHBOARD & ANALYTICS OVERVIEW */}
          {/* ========================================================================= */}
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-6">
              {/* TOP METRIC CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[11px] font-extrabold uppercase">Total Customers</span>
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-stone-900">{customers.length}</p>
                  <span className="text-[10px] text-emerald-600 font-bold block">100% Verified Users</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[11px] font-extrabold uppercase">Verified Tailors</span>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-stone-900">{verifiedTailors.length}</p>
                  <span className="text-[10px] text-amber-600 font-bold block">{pendingTailors.length} pending approval</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[11px] font-extrabold uppercase">Total Orders</span>
                    <Package className="w-4 h-4 text-[#E91E63]" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-[#E91E63]">{orders.length}</p>
                  <span className="text-[10px] text-stone-500 font-bold block">{activeOrders.length} currently active</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[11px] font-extrabold uppercase">Villages Covered</span>
                    <MapPin className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-[#1B4D3E]">{totalVillagesCount}</p>
                  <span className="text-[10px] text-stone-400 font-bold block">3 States Active</span>
                </div>
              </div>

              {/* ACTIONABLE ALERT CARDS */}
              {pendingTailors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                      👩🧵
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-amber-900">
                        {pendingTailors.length} दर्जी प्रोफ़ाइल सत्यापन के लिए लंबित (Pending Approvals)
                      </h4>
                      <p className="text-[11px] text-amber-800 font-medium">
                        New tailor registrations require SakhiSilai Admin verification before appearing to customers.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveAdminTab('tailors');
                      setTailorSubFilter('pending');
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow shrink-0"
                  >
                    Review Queue ➔
                  </button>
                </div>
              )}

              {/* QUICK DISPUTE ALERT */}
              {openComplaints.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-3xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-black">
                      🚨
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-red-900">
                        {openComplaints.length} खुला विवाद / शिकायत समाधान आवश्यक (Open Complaints)
                      </h4>
                      <p className="text-[11px] text-red-800 font-medium">
                        Unresolved order disputes require admin investigation to protect customers and tailors.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveAdminTab('complaints')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow shrink-0"
                  >
                    Resolve Disputes ➔
                  </button>
                </div>
              )}

              {/* RECENT ORDERS OVERSIGHT SNAPSHOT */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-[#2A1B3D] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#E91E63]" />
                    <span>हाल के सिलाई ऑर्डर्स (Live Order Oversight)</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className="text-xs text-[#E91E63] font-bold hover:underline"
                  >
                    View All ({orders.length})
                  </button>
                </div>

                <div className="divide-y divide-stone-100 text-xs">
                  {orders.slice(0, 5).map(ord => (
                    <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-stone-900">{ord.orderNumber}</span>
                          <span className="text-stone-400">•</span>
                          <span className="font-bold text-stone-700">{ord.designTitle}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Customer: <strong className="text-stone-800">{ord.customerName}</strong> ({ord.customerVillage}) ➔ Tailor: <strong className="text-stone-800">{ord.tailorName}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-stone-900 block">₹{ord.price}</span>
                        <span className="text-[10px] font-extrabold text-[#E91E63] uppercase bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. TAILOR MANAGEMENT (VERIFY, APPROVE, REJECT, SUSPEND) */}
          {/* ========================================================================= */}
          {activeAdminTab === 'tailors' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
                <div>
                  <h3 className="font-black text-lg text-[#2A1B3D]">👩🧵 दर्जी प्रबंधन (Tailor Management)</h3>
                  <p className="text-xs text-stone-500">Approve new tailor registrations, block suspended accounts, and inspect performance.</p>
                </div>

                {/* SUB FILTER BUTTONS */}
                <div className="flex bg-stone-100 p-1 rounded-2xl text-xs font-bold">
                  <button
                    onClick={() => setTailorSubFilter('all')}
                    className={`px-3 py-1.5 rounded-xl transition ${tailorSubFilter === 'all' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
                  >
                    All ({tailors.length})
                  </button>
                  <button
                    onClick={() => setTailorSubFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl transition ${tailorSubFilter === 'pending' ? 'bg-amber-500 text-stone-900 font-extrabold shadow' : 'text-stone-500'}`}
                  >
                    Pending ({pendingTailors.length})
                  </button>
                  <button
                    onClick={() => setTailorSubFilter('verified')}
                    className={`px-3 py-1.5 rounded-xl transition ${tailorSubFilter === 'verified' ? 'bg-emerald-600 text-white shadow' : 'text-stone-500'}`}
                  >
                    Verified ({verifiedTailors.length})
                  </button>
                </div>
              </div>

              {/* TAILOR PROFILES GRID */}
              <div className="space-y-4">
                {tailors
                  .filter(t => {
                    if (tailorSubFilter === 'pending') return !t.isVerified;
                    if (tailorSubFilter === 'verified') return t.isVerified;
                    return true;
                  })
                  .map(tProfile => (
                    <div
                      key={tProfile.id}
                      className={`bg-white p-5 sm:p-6 rounded-3xl border transition shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        !tProfile.isVerified ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200'
                      }`}
                    >
                      <div className="flex gap-4 items-start sm:items-center">
                        <img
                          src={tProfile.avatar}
                          alt={tProfile.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-[#2A1B3D]">{tProfile.name}</h4>
                            {tProfile.isVerified ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> verified
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                ⏳ Pending Approval
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 font-medium">
                            📞 {tProfile.phone} • {tProfile.village}, {tProfile.district} ({tProfile.state})
                          </p>
                          <p className="text-xs text-stone-600 font-medium leading-snug">{tProfile.bio}</p>
                          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold text-stone-500">
                            <span>⭐ {tProfile.rating || 5.0} ({tProfile.reviewCount || 0} reviews)</span>
                            <span>•</span>
                            <span>📦 {tProfile.completedOrdersCount} orders completed</span>
                            <span>•</span>
                            <span>Experience: {tProfile.experienceYears} Years</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                        {!tProfile.isVerified ? (
                          <>
                            <button
                              onClick={() => verifyTailor(tProfile.id, true)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>स्वीकृत करें (Approve)</span>
                            </button>
                            <button
                              onClick={() => verifyTailor(tProfile.id, false)}
                              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>अस्वीकार (Reject)</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => verifyTailor(tProfile.id, false)}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                          >
                            <Lock className="w-4 h-4 text-stone-500" />
                            <span>सत्यापन हटाएं (Unverify)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CUSTOMER MANAGEMENT */}
          {/* ========================================================================= */}
          {activeAdminTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-black text-lg text-[#2A1B3D]">👥 ग्राहक प्रबंधन (Customer Directory)</h3>
                  <p className="text-xs text-stone-500">View customer profiles, monitor activity, and manage block status.</p>
                </div>
                <span className="text-xs font-bold bg-stone-100 px-3 py-1.5 rounded-full text-stone-700">
                  Total Customers: {customers.length}
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 font-extrabold text-stone-500 uppercase tracking-wider">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Mobile / Email</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-stone-50/60 transition">
                        <td className="p-4 font-bold flex items-center gap-2">
                          <img
                            src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                            alt={c.name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <span>{c.name}</span>
                        </td>
                        <td className="p-4 font-semibold text-stone-600">
                          <div>{c.phone}</div>
                          <div className="text-[10px] text-stone-400">{c.email || 'No email registered'}</div>
                        </td>
                        <td className="p-4">
                          {c.village}, {c.district}
                        </td>
                        <td className="p-4 text-stone-500">{c.createdAt}</td>
                        <td className="p-4">
                          {c.isBlocked ? (
                            <span className="bg-red-100 text-red-700 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                              🚫 Blocked
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                              ✅ Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleBlockUser(c.id)}
                            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition ${
                              c.isBlocked
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                            }`}
                          >
                            {c.isBlocked ? 'Unblock User' : 'Block User 🚫'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. ORDER MANAGEMENT */}
          {/* ========================================================================= */}
          {activeAdminTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-lg text-[#2A1B3D]">📦 प्लेटफॉर्म सिलाई ऑर्डर (Order Monitoring)</h3>
                  <span className="text-xs font-bold text-stone-500">Showing {orders.length} total orders</span>
                </div>

                {/* STATUS FILTER PILLS */}
                <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
                  {['all', 'requested', 'accepted', 'fabric_received', 'cutting_started', 'stitching', 'quality_check', 'ready', 'completed', 'cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl capitalize whitespace-nowrap transition ${
                        orderStatusFilter === st
                          ? 'bg-[#E91E63] text-white shadow-md'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* ORDERS LIST */}
              <div className="space-y-4">
                {orders
                  .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                  .map(ord => (
                    <div key={ord.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-md space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3">
                        <div>
                          <span className="font-black text-sm text-[#2A1B3D]">{ord.orderNumber}</span>
                          <span className="text-stone-400 mx-2">•</span>
                          <span className="text-xs font-bold text-stone-700">{ord.categoryName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-900">₹{ord.price}</span>
                          <span className="bg-pink-100 text-[#E91E63] font-black text-[10px] uppercase px-3 py-1 rounded-full">
                            {ord.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-stone-700">
                        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-1">
                          <span className="font-extrabold text-stone-900 block text-[11px]">👤 Customer Info:</span>
                          <p>{ord.customerName} ({ord.customerPhone})</p>
                          <p className="text-stone-500">{ord.customerVillage}, {ord.customerDistrict}</p>
                        </div>

                        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-1">
                          <span className="font-extrabold text-stone-900 block text-[11px]">👩🧵 Tailor Info:</span>
                          <p>{ord.tailorName} ({ord.tailorPhone})</p>
                          <p className="text-stone-500">{ord.tailorVillage}</p>
                        </div>
                      </div>

                      {/* ADMIN FORCE OVERRIDE STATUS ACTION */}
                      <div className="flex items-center justify-between pt-2 text-xs font-bold">
                        <span className="text-stone-400 text-[11px]">Required Date: {ord.requiredDate}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-500 text-[11px]">Force Admin Update:</span>
                          <select
                            value={ord.status}
                            onChange={e => updateOrderStatus(ord.id, e.target.value as OrderStatus, 'Admin manual override')}
                            className="bg-stone-100 border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-800"
                          >
                            <option value="requested">Requested</option>
                            <option value="accepted">Accepted</option>
                            <option value="fabric_received">Fabric Received</option>
                            <option value="stitching">Stitching in Progress</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. DISPUTE & COMPLAINT MANAGEMENT */}
          {/* ========================================================================= */}
          {activeAdminTab === 'complaints' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-red-200 shadow-sm space-y-1">
                <h3 className="font-black text-lg text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>🚨 विवाद एवं शिकायत निवारण (Dispute Resolution Center)</span>
                </h3>
                <p className="text-xs text-stone-600">
                  Handle complaints from customers and tailors regarding stitching quality, delays, fabric drop, or payments.
                </p>
              </div>

              <div className="space-y-4">
                {complaints.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                    <p className="font-bold text-sm text-stone-800">No open complaints or disputes at this time!</p>
                  </div>
                ) : (
                  complaints.map(cmp => (
                    <div key={cmp.id} className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-red-100 text-red-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                            Category: {cmp.category}
                          </span>
                          <span className="font-black text-sm text-stone-900">{cmp.subject}</span>
                        </div>
                        <span
                          className={`font-black text-[10px] px-3 py-1 rounded-full uppercase ${
                            cmp.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : cmp.status === 'investigating'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-700 animate-pulse'
                          }`}
                        >
                          {cmp.status}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 font-medium leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100">
                        "{cmp.description}"
                      </p>

                      <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-bold text-stone-600 pt-1">
                        <div>
                          Complainant: <strong className="text-stone-900">{cmp.complainantName}</strong> ({cmp.complainantPhone}) ➔ Against: <strong className="text-stone-900">{cmp.againstName}</strong>
                        </div>

                        {cmp.status !== 'resolved' && (
                          <div className="flex gap-2">
                            {resolvingCmpId === cmp.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Resolution Note..."
                                  value={resolutionNote}
                                  onChange={e => setResolutionNote(e.target.value)}
                                  className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs"
                                />
                                <button
                                  onClick={() => handleResolveSubmit(cmp.id)}
                                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                                >
                                  Confirm Resolve
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setResolvingCmpId(cmp.id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                              >
                                Mark Resolved ✅
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. LOCATION MANAGEMENT (STATE -> DISTRICT -> VILLAGE) */}
          {/* ========================================================================= */}
          {activeAdminTab === 'locations' && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-6">
              <div>
                <h3 className="font-black text-lg text-[#2A1B3D]">📍 सेवा क्षेत्र पदानुक्रम (Location Hierarchy)</h3>
                <p className="text-xs text-stone-500">Expand SakhiSilai coverage area: Add State, Add District, and Add Village.</p>
              </div>

              {/* FORMS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-3xl border border-stone-200 text-xs font-bold">
                {/* Add State Form */}
                <form onSubmit={handleAddState} className="space-y-2">
                  <label className="block text-stone-700">+ Add New State</label>
                  <input
                    type="text"
                    placeholder="e.g. Madhya Pradesh"
                    value={newStateName}
                    onChange={e => setNewStateName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl p-2.5"
                    required
                  />
                  <button type="submit" className="w-full py-2 bg-[#2A1B3D] text-white rounded-xl shadow">
                    Add State
                  </button>
                </form>

                {/* Add District Form */}
                <form onSubmit={handleAddDistrict} className="space-y-2">
                  <label className="block text-stone-700">+ Add District to State</label>
                  <select
                    value={targetStateId}
                    onChange={e => setTargetStateId(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl p-2"
                  >
                    {locations.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="New District Name"
                    value={newDistrictName}
                    onChange={e => setNewDistrictName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl p-2.5"
                    required
                  />
                  <button type="submit" className="w-full py-2 bg-[#E91E63] text-white rounded-xl shadow">
                    Add District
                  </button>
                </form>

                {/* Add Village Form */}
                <form onSubmit={handleAddVillage} className="space-y-2">
                  <label className="block text-stone-700">+ Add Village to District</label>
                  <select
                    value={targetDistId}
                    onChange={e => setTargetDistId(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl p-2"
                  >
                    {locations.find(st => st.id === targetStateId)?.districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="New Village Name (e.g. Kakori)"
                    value={newVillageName}
                    onChange={e => setNewVillageName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl p-2.5"
                    required
                  />
                  <button type="submit" className="w-full py-2 bg-emerald-700 text-white rounded-xl shadow">
                    Add Village
                  </button>
                </form>
              </div>

              {/* TREE DISPLAY */}
              <div className="space-y-4 pt-2">
                {locations.map(st => (
                  <div key={st.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 text-xs">
                    <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E91E63]" />
                      <span>{st.name} State</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                      {st.districts.map(d => (
                        <div key={d.id} className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2">
                          <span className="font-bold text-stone-900">{d.name} District</span>
                          <div className="flex flex-wrap gap-1.5">
                            {d.villages.map((v, idx) => (
                              <span key={idx} className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                                📍 {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. SERVICE & CATEGORY MANAGEMENT */}
          {/* ========================================================================= */}
          {activeAdminTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-4">
                <h3 className="font-black text-base text-[#2A1B3D]">👗 नई सिलाई श्रेणी जोड़ें (Add Category)</h3>
                <form onSubmit={handleAddCategory} className="space-y-3 text-xs font-bold">
                  <div>
                    <label className="block text-stone-700 mb-1">Category Name (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Lehenga Stitching"
                      value={catEn}
                      onChange={e => setCatEn(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-1">श्रेणी का नाम (हिंदी)</label>
                    <input
                      type="text"
                      placeholder="उदा. लहंगा सिलाई"
                      value={catHi}
                      onChange={e => setCatHi(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-1">Base Price (₹)</label>
                    <input
                      type="number"
                      value={catPrice}
                      onChange={e => setCatPrice(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3"
                    />
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-[#E91E63] text-white font-black rounded-2xl shadow-lg">
                    Save Dynamic Category
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                <h3 className="font-black text-base text-[#2A1B3D]">सक्रिय श्रेणियां ({categories.length})</h3>
                {categories.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-black text-stone-900">{c.nameEn} ({c.nameHi})</h4>
                      <p className="text-stone-500 font-medium">Starting from ₹{c.startingPrice}</p>
                    </div>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="p-2 text-stone-400 hover:text-red-600 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. REVIEW MODERATION */}
          {/* ========================================================================= */}
          {activeAdminTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex justify-between items-center">
                <h3 className="font-black text-lg text-[#2A1B3D]">⭐ समीक्षा प्रबंधन (Review Moderation)</h3>
                <span className="text-xs font-bold text-stone-500">Total Reviews: {reviews.length}</span>
              </div>

              <div className="space-y-3">
                {reviews.map(rev => (
                  <div key={rev.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-stone-900">{rev.customerName}</span>
                        <span className="text-amber-500 font-bold">{"⭐".repeat(rev.rating)}</span>
                        <span className="text-stone-400 text-[10px]">• {rev.date}</span>
                      </div>
                      <p className="text-stone-700 font-medium leading-relaxed">"{rev.comment}"</p>
                    </div>

                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition shrink-0"
                    >
                      Remove Review 🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. NOTIFICATION BROADCAST */}
          {/* ========================================================================= */}
          {activeAdminTab === 'notifications' && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md max-w-xl space-y-4">
              <h3 className="font-black text-lg text-[#2A1B3D]">🔔 सिस्टम घोषणा भेजें (Broadcast Alert)</h3>

              {broadcastSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>घोषणा सफलतापूर्वक भेज दी गई! (Notification Broadcast Sent)</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block text-stone-700 mb-1">Target Audience</label>
                  <select
                    value={broadcastRole}
                    onChange={e => setBroadcastRole(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3"
                  >
                    <option value="all">All Users (Customers & Tailors)</option>
                    <option value="customer">Customers Only</option>
                    <option value="tailor">Tailors Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 🎉 SakhiSilai is now available in Kakori village!"
                    value={broadcastTitle}
                    onChange={e => setBroadcastTitle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Message Content</label>
                  <textarea
                    rows={3}
                    placeholder="Enter message body..."
                    value={broadcastMsg}
                    onChange={e => setBroadcastMsg(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-medium"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl shadow">
                  Send Broadcast Push Notification
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. ANALYTICS & EXPANSION INSIGHTS */}
          {/* ========================================================================= */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                <h3 className="font-black text-lg text-[#2A1B3D]">📈 मंच विस्तार एनालिटिक्स (Growth Analytics)</h3>
                <p className="text-xs text-stone-500">Analyze order density per village to decide next expansion locations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-md space-y-3 text-xs">
                  <h4 className="font-black text-stone-900">गाँव अनुसार ऑर्डर वितरण (Orders by Village)</h4>
                  <div className="space-y-2">
                    {['Mohanlalganj', 'Bakshi Ka Talab', 'Sanganer', 'Kakori'].map(v => {
                      const count = orders.filter(o => o.customerVillage === v || o.tailorVillage === v).length;
                      return (
                        <div key={v} className="flex justify-between items-center p-2.5 bg-stone-50 rounded-xl font-bold">
                          <span>📍 {v}</span>
                          <span className="bg-pink-100 text-[#E91E63] px-2.5 py-0.5 rounded-full">{count} Orders</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-md space-y-3 text-xs">
                  <h4 className="font-black text-stone-900">लोकप्रिय सिलाई श्रेणियां (Category Demand)</h4>
                  <div className="space-y-2">
                    {categories.map(c => {
                      const count = orders.filter(o => o.categoryId === c.id).length;
                      return (
                        <div key={c.id} className="flex justify-between items-center p-2.5 bg-stone-50 rounded-xl font-bold">
                          <span>👗 {c.nameEn}</span>
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">{count} Requests</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. SECURITY & ACCESS CONTROL */}
          {/* ========================================================================= */}
          {activeAdminTab === 'settings' && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-6">
              <div className="space-y-1">
                <h3 className="font-black text-lg text-[#2A1B3D] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <span>🛡️ प्लेटफॉर्म सुरक्षा व एक्सेस कंट्रोल (Security & Access Control)</span>
                </h3>
                <p className="text-xs text-stone-500">Super admin privilege management & role assignment policy.</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 space-y-1 text-xs font-bold">
                <p>⚠️ <strong>Important Role Security Policy:</strong></p>
                <p className="font-medium text-amber-800">
                  Only authorized SakhiSilai Platform Admins are permitted to modify or assign high-privilege roles (e.g. Tailor verification, Admin elevation).
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs font-bold text-stone-800">
                <h4 className="text-stone-900 font-black">Active Admin Accounts:</h4>
                <div className="flex justify-between items-center p-2 bg-white rounded-xl border border-stone-200">
                  <span>Seema Sharma (Chief Platform Admin)</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">Super Admin</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
