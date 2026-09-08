import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

import {
  Scissors,
  CheckCircle,
  Clock,
  TrendingUp,
  Sliders,
  Sparkles,
  PlusCircle,
  MapPin,
  Trash2,
  Edit,
  UserCheck,
  XCircle,
  Lock
} from 'lucide-react';

interface TailorDashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const TailorDashboardPage: React.FC<TailorDashboardPageProps> = () => {
  const { tailors, designs, orders, customRequests, updateOrderStatus, updateTailorAvailability, updateTailorCapacity, updateTailorProfile, addDesign, deleteDesign, submitQuoteOffer } = useData();
  const { currentUser } = useAuth();
  const { lang, t } = useLanguage();

  const [activeTabSub, setActiveTabSub] = useState<'requests' | 'active' | 'catalog' | 'earnings'>('requests');
  const [showAddDesignModal, setShowAddDesignModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [quoteModalReqId, setQuoteModalReqId] = useState<string | null>(null);

  const tailor = tailors.find(t => t.id === 't_sunita' || t.userId === currentUser.id) || tailors[0];

  // Profile Edit Form State
  const [profileName, setProfileName] = useState(tailor.name);
  const [profilePhone, setProfilePhone] = useState(tailor.phone);
  const [profileVillage, setProfileVillage] = useState(tailor.village);
  const [profileDistrict, setProfileDistrict] = useState(tailor.district);
  const [profileAddress, setProfileAddress] = useState(tailor.addressApprox);
  const [profileBio, setProfileBio] = useState(tailor.bio);
  const [profileExperience, setProfileExperience] = useState(tailor.experienceYears);
  const [profileStartingPrice, setProfileStartingPrice] = useState(tailor.startingPrice);
  const [profileSkills, setProfileSkills] = useState(tailor.skills.join(', '));
  const [profileAvatar, setProfileAvatar] = useState(tailor.avatar);

  // Quote Form
  const [quotePrice, setQuotePrice] = useState<number>(550);
  const [quoteDays, setQuoteDays] = useState<number>(3);
  const [quoteNote, setQuoteNote] = useState<string>('I can stitch this exact style for you!');

  // New Design Form
  const [designTitle, setDesignTitle] = useState('');
  const [designPrice, setDesignPrice] = useState<number>(450);
  const [designDays, setDesignDays] = useState<number>(3);
  const [designDesc, setDesignDesc] = useState('');
  const [designCategory, setDesignCategory] = useState('Blouse Stitching');
  const [designImage, setDesignImage] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80');

  const tailorOrders = orders.filter(o => o.tailorId === tailor.id);
  const newRequests = tailorOrders.filter(o => o.status === 'requested');
  const activeOrders = tailorOrders.filter(
    o => o.status !== 'requested' && o.status !== 'completed' && o.status !== 'cancelled'
  );
  const completedOrders = tailorOrders.filter(o => o.status === 'completed');

  // Custom Bidding requests in tailor village
  const villageRequests = customRequests.filter(
    r => r.customerVillage.toLowerCase() === tailor.village.toLowerCase() && r.status === 'open'
  );

  // Earnings calculations (100% tailor payout model)
  const totalEarned = completedOrders.reduce((sum, o) => sum + o.price, 0);

  const tailorDesigns = designs.filter(d => d.tailorId === tailor.id || d.tailorId === 't_sunita');

  const handleCreateDesign = (e: React.FormEvent) => {
    e.preventDefault();
    addDesign({
      tailorId: tailor.id,
      tailorName: tailor.name,
      categoryId: designCategory.toLowerCase().includes('blouse') ? 'blouse' : 'suit',
      categoryName: designCategory,
      title: designTitle || (lang === 'hi' ? 'विशेष सिलाई डिज़ाइन' : 'Custom Designer Style'),
      image: designImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      price: Number(designPrice) || 400,
      estDays: Number(designDays) || 3,
      description: designDesc || (lang === 'hi' ? 'उच्च गुणवत्ता सिलाई, परफेक्ट फिटिंग और सुंदर फिनिशिंग।' : 'High quality custom stitching with perfect fitting.'),
      isAvailable: true
    });
    setShowAddDesignModal(false);
    setDesignTitle('');
    setDesignDesc('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTailorProfile(tailor.id, {
      name: profileName,
      phone: profilePhone,
      village: profileVillage,
      district: profileDistrict,
      addressApprox: profileAddress,
      bio: profileBio,
      experienceYears: Number(profileExperience),
      startingPrice: Number(profileStartingPrice),
      skills: profileSkills.split(',').map(s => s.trim()).filter(Boolean),
      avatar: profileAvatar
    });
    setShowEditProfileModal(false);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalReqId) return;

    submitQuoteOffer(quoteModalReqId, {
      tailorId: tailor.id,
      tailorName: tailor.name,
      tailorVillage: tailor.village,
      tailorRating: tailor.rating,
      tailorPhone: tailor.phone,
      price: Number(quotePrice),
      estDays: Number(quoteDays),
      note: quoteNote
    });

    setQuoteModalReqId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in pb-16">
      {/* TAILOR WORK CENTER HEADER */}
      <div className="bg-gradient-to-r from-[#1B4D3E] via-[#133A2E] to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img src={tailor.avatar} alt={tailor.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-stone-100" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-stone-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                  Registered Sakhi Tailor
                </span>
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 transition"
                  title="Edit Tailor Profile"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}</span>
                </button>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">{tailor.name}</h1>
              <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{tailor.village}, {tailor.district} • Starting ₹{tailor.startingPrice} • {tailor.experienceYears}y Exp</span>
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-right w-full sm:w-auto flex sm:block justify-between items-center">
            <span className="text-[10px] text-stone-300 font-bold uppercase block">Total Earnings (100% Payout)</span>
            <span className="font-extrabold text-2xl text-emerald-400">₹{totalEarned}</span>
          </div>
        </div>

        {/* TOUCH-FRIENDLY CONTROLS: AVAILABILITY & CAPACITY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Availability Toggle */}
          <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2">
            <label className="text-xs font-bold text-stone-300 block">{t('availabilityStatus')}</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateTailorAvailability(tailor.id, 'available')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  tailor.availability === 'available' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/10 text-stone-300'
                }`}
              >
                <span>🟢 {t('availableNow')}</span>
              </button>
              <button
                onClick={() => updateTailorAvailability(tailor.id, 'limited')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  tailor.availability === 'limited' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white/10 text-stone-300'
                }`}
              >
                <span>🟡 {t('limitedSlots')}</span>
              </button>
              <button
                onClick={() => updateTailorAvailability(tailor.id, 'unavailable')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  tailor.availability === 'unavailable' ? 'bg-red-500 text-white shadow-lg' : 'bg-white/10 text-stone-300'
                }`}
              >
                <span>🔴 {t('currentlyBusy')}</span>
              </button>
            </div>
          </div>

          {/* Workload Capacity Meter */}
          <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-300 font-bold">
              <span>{t('capacityLimit')}</span>
              <span className="text-amber-300">
                {tailor.currentActiveOrders} / {tailor.maxActiveOrders} Active Orders
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-stone-800 h-3 rounded-full overflow-hidden p-0.5 border border-stone-700">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (tailor.currentActiveOrders / tailor.maxActiveOrders) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateTailorCapacity(tailor.id, Math.max(1, tailor.maxActiveOrders - 1))}
                  className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold"
                >
                  -
                </button>
                <button
                  onClick={() => updateTailorCapacity(tailor.id, tailor.maxActiveOrders + 1)}
                  className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div className="flex border-b border-stone-200 text-sm font-bold gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTabSub('requests')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'requests' ? 'border-[#1B4D3E] text-[#1B4D3E]' : 'border-transparent text-stone-500'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>New Requests ({newRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('active')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'active' ? 'border-[#1B4D3E] text-[#1B4D3E]' : 'border-transparent text-stone-500'
          }`}
        >
          <Scissors className="w-4 h-4 rotate-45" />
          <span>Active Orders ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('catalog')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'catalog' ? 'border-[#1B4D3E] text-[#1B4D3E]' : 'border-transparent text-stone-500'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>My Pricing Catalog</span>
        </button>

        <button
          onClick={() => setActiveTabSub('earnings')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'earnings' ? 'border-[#1B4D3E] text-[#1B4D3E]' : 'border-transparent text-stone-500'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Earnings & History</span>
        </button>
      </div>

      {/* TAB 1: NEW REQUESTS & CUSTOM BIDS */}
      {activeTabSub === 'requests' && (
        <div className="space-y-8">
          {/* Incoming Direct Orders */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-stone-900">Direct Customer Booking Requests ({newRequests.length})</h3>

            {newRequests.length === 0 ? (
              <p className="text-xs text-stone-400 bg-white p-6 rounded-2xl border border-stone-200 text-center">
                No new direct order requests pending right now.
              </p>
            ) : (
              newRequests.map(ord => (
                <div key={ord.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-bold text-xs text-[#D9534F]">{ord.orderNumber}</span>
                      <h4 className="font-black text-base text-stone-900">{ord.designTitle}</h4>
                      <p className="text-xs text-stone-500">Customer: <strong>{ord.customerName}</strong> (📍 {ord.customerVillage} — Approx Location)</p>
                    </div>
                    <span className="font-extrabold text-xl text-[#1B4D3E]">₹{ord.price}</span>
                  </div>

                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1 text-amber-950 font-medium">
                    <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>गोपनीयता सुरक्षा (Contact Privacy Protected):</span>
                    </div>
                    <p>
                      Customer phone number (🔒 XXXXXX{ord.customerPhone.slice(-4)}) & exact handover drop address unlock immediately after you click <strong>Accept Order ✅</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-2xl font-bold text-stone-700">
                    <div>
                      <span className="block text-stone-400 text-[10px] uppercase">Fabric Handover Option</span>
                      <span>{ord.handoverMethod === 'customer_drop' ? 'Customer Drop at your location' : 'Delivery Runner Pickup'}</span>
                    </div>
                    <div>
                      <span className="block text-[#E91E63] text-[10px] uppercase">📅 Requested Visit Appointment</span>
                      <span className="text-[#1B4D3E]">{ord.appointmentDate || ord.requiredDate} • {ord.appointmentTimeSlot || 'Morning'}</span>
                    </div>
                    <div>
                      <span className="block text-stone-400 text-[10px] uppercase">Required Completion Date</span>
                      <span>{ord.requiredDate}</span>
                    </div>
                  </div>

                  {/* TOUCH ACTION BUTTONS */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'accepted', 'Tailor accepted order')}
                      className="flex-1 py-3 bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('acceptOrder')} & Unlock Contact 🔓</span>
                    </button>

                    <button
                      onClick={() => updateOrderStatus(ord.id, 'cancelled', 'Tailor declined order')}
                      className="py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition"
                    >
                      {t('declineOrder')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Custom Village Bidding Requests */}
          <div className="space-y-4 pt-6 border-t border-stone-200">
            <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Custom Photo Design Requests in {tailor.village} ({villageRequests.length})</span>
            </h3>

            {villageRequests.map(req => (
              <div key={req.id} className="bg-white p-5 rounded-3xl border border-amber-200 shadow-md flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex gap-4">
                  <img src={req.referenceImage} alt={req.requestTitle} className="w-20 h-24 rounded-2xl object-cover" />
                  <div className="space-y-1">
                    <span className="bg-amber-100 text-amber-900 font-bold text-[9px] px-2 py-0.5 rounded uppercase">{req.clothingCategory}</span>
                    <h4 className="font-bold text-sm text-stone-900">{req.requestTitle}</h4>
                    <p className="text-xs text-stone-500">From {req.customerName} ({req.customerVillage})</p>
                    <p className="text-xs text-stone-600 font-medium italic">"{req.specialInstructions}"</p>
                  </div>
                </div>

                <button
                  onClick={() => setQuoteModalReqId(req.id)}
                  className="w-full sm:w-auto px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  {t('submitQuote')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE ORDERS WORKFLOW STATUS UPDATER */}
      {activeTabSub === 'active' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg text-stone-900">Active Work Orders ({activeOrders.length})</h3>

          {activeOrders.length === 0 ? (
            <p className="text-xs text-stone-400 bg-white p-6 rounded-2xl border border-stone-200 text-center">
              No active orders in progress right now.
            </p>
          ) : (
            activeOrders.map(ord => (
              <div key={ord.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-bold text-xs text-stone-400">{ord.orderNumber}</span>
                    <h4 className="font-extrabold text-base text-stone-900">{ord.designTitle}</h4>
                    <p className="text-xs text-stone-500">
                      Customer: <strong>{ord.customerName}</strong> ({ord.customerVillage}) • <a href={`tel:${ord.customerPhone}`} className="text-[#D9534F] underline font-bold">📞 Call Customer</a> • <span className="text-[#1B4D3E] font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">📅 Appt: {ord.appointmentDate || ord.requiredDate} ({ord.appointmentTimeSlot || 'Morning'})</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xl text-[#D9534F] block">₹{ord.price}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase inline-block bg-emerald-100 text-emerald-800">
                      {ord.paymentStatus === 'fully_paid'
                        ? '✅ Fully Paid'
                        : ord.paymentStatus === 'advance_paid'
                        ? `⚡ Advance ₹${ord.advancePaid} Paid (Due ₹${ord.price - (ord.advancePaid || 0)})`
                        : `💵 COD Due ₹${ord.price}`}
                    </span>
                  </div>
                </div>


                {/* WORKFLOW STATUS STEPPER UPDATE BUTTONS */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">Update Stitching Stage (Real-Time Customer Notification):</label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'fabric_received')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        ord.status === 'fabric_received'
                          ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      1. Fabric Received
                    </button>

                    <button
                      onClick={() => updateOrderStatus(ord.id, 'cutting_started')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        ord.status === 'cutting_started'
                          ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      2. Cutting Started
                    </button>

                    <button
                      onClick={() => updateOrderStatus(ord.id, 'stitching')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        ord.status === 'stitching'
                          ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      3. Stitching
                    </button>

                    <button
                      onClick={() => updateOrderStatus(ord.id, 'quality_check')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        ord.status === 'quality_check'
                          ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      4. Quality Check
                    </button>

                    <button
                      onClick={() => updateOrderStatus(ord.id, 'ready')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        ord.status === 'ready'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      5. Ready for Handover
                    </button>
                  </div>
                </div>

                {/* MARK COMPLETED BUTTON */}
                <div className="pt-3 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'completed', 'Order completed and payment received')}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition"
                  >
                    ✓ Mark Order Completed & Payment Received
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: PRICING & MULTIPLE DESIGN CATALOG EDITOR */}
      {activeTabSub === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-xl text-stone-900">
                {lang === 'hi' ? 'मेरी सिलाई डिज़ाइन दर सूची (Design Catalog)' : 'My Stitching Design Catalog & Rates'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi'
                  ? 'अपनी पसंदीदा सिलाई डिज़ाएन्स, फोटो, विवरण और दरें जोड़ें'
                  : 'Add custom design photos, descriptions, and stitching prices for customers'}
              </p>
            </div>
            <button
              onClick={() => setShowAddDesignModal(true)}
              className="px-5 py-2.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'hi' ? '+ नया डिज़ाइन जोड़ें' : '+ Add New Design'}</span>
            </button>
          </div>

          {/* DESIGN CATALOG GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tailorDesigns.map(d => (
              <div key={d.id} className="bg-white rounded-3xl border border-stone-200 shadow-md hover:shadow-xl transition overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img src={d.image} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute top-3 left-3 bg-[#2A1B3D]/80 backdrop-blur-md text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow">
                      {d.categoryName}
                    </div>
                    <button
                      onClick={() => deleteDesign(d.id)}
                      className="absolute top-3 right-3 p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full shadow transition"
                      title="Delete Design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-black text-base text-[#2A1B3D]">{lang === 'hi' ? (d.titleHi || d.title) : d.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{d.description}</p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold block">{lang === 'hi' ? 'सिलाई दर' : 'Stitching Rate'}</span>
                    <span className="font-black text-lg text-[#E91E63]">₹{d.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 font-bold block">{lang === 'hi' ? 'समय' : 'Turnaround'}</span>
                    <span className="font-extrabold text-xs text-stone-800">~{d.estDays} {lang === 'hi' ? 'दिन' : 'Days'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EARNINGS DASHBOARD */}
      {activeTabSub === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase">{t('todayEarnings')}</span>
              <p className="text-3xl font-black text-emerald-700">₹{completedOrders.length > 0 ? 600 : 0}</p>
              <span className="text-[10px] text-stone-400 block">100% payout to your account</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase">{t('weeklyEarnings')}</span>
              <p className="text-3xl font-black text-emerald-700">₹{totalEarned}</p>
              <span className="text-[10px] text-stone-400 block">0% commission taken</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase">{t('completedOrders')}</span>
              <p className="text-3xl font-black text-stone-900">{completedOrders.length + tailor.completedOrdersCount}</p>
              <span className="text-[10px] text-stone-400 block">Delivered on time</span>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT QUOTE MODAL */}
      {quoteModalReqId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Send Price & ETA Quote</h3>
            <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
              <div>
                <label htmlFor="quotePrice" className="block font-bold text-stone-700 mb-1">Your Stitching Price (₹)</label>
                <input
                  id="quotePrice"
                  name="quotePrice"
                  type="number"
                  value={quotePrice}
                  onChange={e => setQuotePrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label htmlFor="quoteDays" className="block font-bold text-stone-700 mb-1">Estimated Days</label>
                <input
                  id="quoteDays"
                  name="quoteDays"
                  type="number"
                  value={quoteDays}
                  onChange={e => setQuoteDays(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label htmlFor="quoteNote" className="block font-bold text-stone-700 mb-1">Note for Customer</label>
                <input
                  id="quoteNote"
                  name="quoteNote"
                  type="text"
                  value={quoteNote}
                  onChange={e => setQuoteNote(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setQuoteModalReqId(null)} className="flex-1 py-2.5 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#1B4D3E] text-white rounded-xl font-bold shadow">Send Quote</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CATALOG DESIGN MODAL WITH IMAGE, DESCRIPTION & PRICE */}
      {showAddDesignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-pink-100 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-1">
              <h3 className="font-black text-xl text-[#2A1B3D]">
                {lang === 'hi' ? 'नया सिलाई डिज़ाइन जोड़ें' : 'Add New Design Catalog'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi' ? 'डिज़ाइन का नाम, फोटो, सिलाई दर और विवरण भरें' : 'Enter design title, photo, stitching price & description'}
              </p>
            </div>

            <form onSubmit={handleCreateDesign} className="space-y-4 text-xs font-bold">
              <div>
                <label htmlFor="newDesignTitle" className="block text-stone-700 mb-1">
                  {lang === 'hi' ? 'डिज़ाइन का नाम (Design Title)' : 'Design Title'}
                </label>
                <input
                  id="newDesignTitle"
                  name="newDesignTitle"
                  type="text"
                  placeholder={lang === 'hi' ? 'उदा. प्रिंसेस कट ब्लाउज / डिजाइनर सूट' : 'e.g. Designer Cutwork Blouse'}
                  value={designTitle}
                  onChange={e => setDesignTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="newDesignCategory" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'श्रेणी (Category)' : 'Category'}
                  </label>
                  <select
                    id="newDesignCategory"
                    name="newDesignCategory"
                    value={designCategory}
                    onChange={e => setDesignCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-[#2A1B3D] font-bold"
                  >
                    <option value="Blouse Stitching">👚 Blouse Stitching</option>
                    <option value="Suit & Salwar Stitching">👗 Suit & Salwar</option>
                    <option value="Dress & Kurti">👘 Dress & Kurti</option>
                    <option value="Kids Clothing">🧒 Kids Clothing</option>
                    <option value="Alterations">✂️ Alterations</option>
                    <option value="Custom Design">🎨 Custom Design</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="newDesignPrice" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'सिलाई दर (Price ₹)' : 'Stitching Rate (₹)'}
                  </label>
                  <input
                    id="newDesignPrice"
                    name="newDesignPrice"
                    type="number"
                    value={designPrice}
                    onChange={e => setDesignPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-[#2A1B3D]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="newDesignDays" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'अनुमानित दिन (Days)' : 'Est. Completion Days'}
                  </label>
                  <input
                    id="newDesignDays"
                    name="newDesignDays"
                    type="number"
                    value={designDays}
                    onChange={e => setDesignDays(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-[#2A1B3D]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newDesignImage" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'फोटो URL (Image URL)' : 'Design Photo URL'}
                  </label>
                  <input
                    id="newDesignImage"
                    name="newDesignImage"
                    type="text"
                    value={designImage}
                    onChange={e => setDesignImage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-[#2A1B3D]"
                  />
                </div>
              </div>

              {/* SAMPLE PHOTO SELECTOR PRESETS */}
              <div className="space-y-1.5">
                <label className="block text-[11px] text-stone-500">
                  {lang === 'hi' ? 'या फोटो सैंपल चुनें (Sample Photos):' : 'Or Pick Sample Photo:'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setDesignImage('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80')}
                    className="p-1 border rounded-xl hover:border-[#E91E63] overflow-hidden text-[10px] text-center"
                  >
                    👚 Blouse
                  </button>
                  <button
                    type="button"
                    onClick={() => setDesignImage('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80')}
                    className="p-1 border rounded-xl hover:border-[#E91E63] overflow-hidden text-[10px] text-center"
                  >
                    👗 Suit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDesignImage('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80')}
                    className="p-1 border rounded-xl hover:border-[#E91E63] overflow-hidden text-[10px] text-center"
                  >
                    👘 Dress
                  </button>
                  <button
                    type="button"
                    onClick={() => setDesignImage('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80')}
                    className="p-1 border rounded-xl hover:border-[#E91E63] overflow-hidden text-[10px] text-center"
                  >
                    🧒 Kids
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="newDesignDesc" className="block text-stone-700 mb-1">
                  {lang === 'hi' ? 'विवरण एवं विशेषताएं (Description & Details)' : 'Description & Details'}
                </label>
                <textarea
                  id="newDesignDesc"
                  name="newDesignDesc"
                  rows={2}
                  placeholder={lang === 'hi' ? 'उदा. बैक नेक डोरी, प्रिंसेंस कट, अस्तर/लाइनिंग के साथ' : 'e.g. Princess cut blouse with back neck dori & lining'}
                  value={designDesc}
                  onChange={e => setDesignDesc(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-[#2A1B3D] font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDesignModal(false)}
                  className="flex-1 py-3.5 border border-stone-300 rounded-2xl font-black text-stone-600 hover:bg-stone-50"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95"
                >
                  {lang === 'hi' ? 'डिज़ाइन सहेजें (Save Design)' : 'Save Design Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TAILOR PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-amber-200 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-1">
              <h3 className="font-black text-xl text-stone-900">
                {lang === 'hi' ? 'दर्जी प्रोफ़ाइल संपादित करें' : 'Edit Tailor Profile'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi' ? 'नाम, स्थान, शुरुआती सिलाई दर एवं अनुभव विवरण बदलें' : 'Update your personal details, stitching base rate & bio'}
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-bold">
              <div>
                <label htmlFor="editProfileName" className="block text-stone-700 mb-1">
                  {lang === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'}
                </label>
                <input
                  id="editProfileName"
                  name="editProfileName"
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="editProfilePhone" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर (Phone)' : 'Phone Number'}
                  </label>
                  <input
                    id="editProfilePhone"
                    name="editProfilePhone"
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editProfileStartingPrice" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'शुरुआती सिलाई दर (₹)' : 'Starting Rate (₹)'}
                  </label>
                  <input
                    id="editProfileStartingPrice"
                    name="editProfileStartingPrice"
                    type="number"
                    value={profileStartingPrice}
                    onChange={e => setProfileStartingPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="editProfileVillage" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'गाँव / शहर (Village)' : 'Village / Location'}
                  </label>
                  <input
                    id="editProfileVillage"
                    name="editProfileVillage"
                    type="text"
                    value={profileVillage}
                    onChange={e => setProfileVillage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editProfileDistrict" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'ज़िला (District)' : 'District'}
                  </label>
                  <input
                    id="editProfileDistrict"
                    name="editProfileDistrict"
                    type="text"
                    value={profileDistrict}
                    onChange={e => setProfileDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="editProfileExperience" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'अनुभव (वर्ष)' : 'Experience (Years)'}
                  </label>
                  <input
                    id="editProfileExperience"
                    name="editProfileExperience"
                    type="number"
                    value={profileExperience}
                    onChange={e => setProfileExperience(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="editProfileAddress" className="block text-stone-700 mb-1">
                    {lang === 'hi' ? 'पता / लैंडमार्क' : 'Address / Landmark'}
                  </label>
                  <input
                    id="editProfileAddress"
                    name="editProfileAddress"
                    type="text"
                    value={profileAddress}
                    onChange={e => setProfileAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="editProfileSkills" className="block text-stone-700 mb-1">
                  {lang === 'hi' ? 'विशेषज्ञता कौशल (Skills, comma separated)' : 'Specialized Skills (Comma separated)'}
                </label>
                <input
                  id="editProfileSkills"
                  name="editProfileSkills"
                  type="text"
                  placeholder="उदा. प्रिंसेंस कट, राजपूती सूट, अल्टरेशन"
                  value={profileSkills}
                  onChange={e => setProfileSkills(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="editProfileAvatar" className="block text-stone-700 mb-1">
                  {lang === 'hi' ? 'प्रोफ़ाइल फोटो URL' : 'Profile Avatar URL'}
                </label>
                <input
                  id="editProfileAvatar"
                  name="editProfileAvatar"
                  type="text"
                  value={profileAvatar}
                  onChange={e => setProfileAvatar(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900"
                />
              </div>

              <div>
                <label htmlFor="editProfileBio" className="block text-stone-700 mb-1">
                  {lang === 'hi' ? 'विशेषज्ञता एवं विवरण (About Bio)' : 'Bio / Short Introduction'}
                </label>
                <textarea
                  id="editProfileBio"
                  name="editProfileBio"
                  rows={3}
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900 font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 py-3.5 border border-stone-300 rounded-2xl font-black text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'रद्द करें' : 'Cancel'}</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-black rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
