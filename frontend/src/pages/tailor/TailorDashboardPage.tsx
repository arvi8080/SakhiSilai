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
  MapPin
} from 'lucide-react';

interface TailorDashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const TailorDashboardPage: React.FC<TailorDashboardPageProps> = () => {
  const { tailors, orders, customRequests, updateOrderStatus, updateTailorAvailability, updateTailorCapacity, addDesign, submitQuoteOffer } = useData();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [activeTabSub, setActiveTabSub] = useState<'requests' | 'active' | 'catalog' | 'earnings'>('requests');
  const [showAddDesignModal, setShowAddDesignModal] = useState(false);
  const [quoteModalReqId, setQuoteModalReqId] = useState<string | null>(null);

  // Quote Form
  const [quotePrice, setQuotePrice] = useState<number>(550);
  const [quoteDays, setQuoteDays] = useState<number>(3);
  const [quoteNote, setQuoteNote] = useState<string>('I can stitch this exact style for you!');

  // New Design Form
  const [designTitle, setDesignTitle] = useState('');
  const [designPrice, setDesignPrice] = useState(400);
  const [designDays, setDesignDays] = useState(3);
  const [designDesc, setDesignDesc] = useState('');
  const [designCategory, setDesignCategory] = useState('Blouse Stitching');

  const tailor = tailors.find(t => t.id === 't_sunita' || t.userId === currentUser.id) || tailors[0];
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

  const handleCreateDesign = (e: React.FormEvent) => {
    e.preventDefault();
    addDesign({
      tailorId: tailor.id,
      tailorName: tailor.name,
      categoryId: 'blouse',
      categoryName: designCategory,
      title: designTitle,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      price: Number(designPrice),
      estDays: Number(designDays),
      description: designDesc,
      isAvailable: true
    });
    setShowAddDesignModal(false);
    setDesignTitle('');
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
              <span className="bg-amber-400 text-stone-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Registered Sakhi Tailor
              </span>
              <h1 className="text-2xl font-black text-white mt-1">{tailor.name}</h1>
              <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{tailor.village}, {tailor.district}</span>
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
                      <p className="text-xs text-stone-500">Customer: <strong>{ord.customerName}</strong> ({ord.customerVillage})</p>
                    </div>
                    <span className="font-extrabold text-xl text-[#1B4D3E]">₹{ord.price}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-2xl">
                    <div>
                      <span className="font-bold text-stone-700 block">Fabric Handover Option:</span>
                      <span className="text-stone-600">{ord.handoverMethod === 'customer_drop' ? 'Customer Direct Drop to your home' : 'Delivery Runner Pickup'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-stone-700 block">Required Date:</span>
                      <span className="text-stone-600">{ord.requiredDate}</span>
                    </div>
                  </div>

                  {/* TOUCH ACTION BUTTONS */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'accepted', 'Tailor accepted order')}
                      className="flex-1 py-3 bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('acceptOrder')}</span>
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
                    <p className="text-xs text-stone-500">Customer: <strong>{ord.customerName}</strong> ({ord.customerVillage}) • <a href={`tel:${ord.customerPhone}`} className="text-[#D9534F] underline">Call Customer</a></p>
                  </div>
                  <span className="font-black text-xl text-[#D9534F]">₹{ord.price}</span>
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

      {/* TAB 3: PRICING CATALOG EDITOR */}
      {activeTabSub === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-stone-900">My Service Rates Catalog</h3>
            <button
              onClick={() => setShowAddDesignModal(true)}
              className="px-4 py-2 bg-[#1B4D3E] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Design Catalog Rate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tailor.servicesOffered.map((svc, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{svc}</span>
                <span className="font-extrabold text-emerald-800">Available</span>
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
                <label className="block font-bold text-stone-700 mb-1">Your Stitching Price (₹)</label>
                <input
                  type="number"
                  value={quotePrice}
                  onChange={e => setQuotePrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Estimated Days</label>
                <input
                  type="number"
                  value={quoteDays}
                  onChange={e => setQuoteDays(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Note for Customer</label>
                <input
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

      {/* ADD CATALOG DESIGN MODAL */}
      {showAddDesignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Add New Design Catalog Price</h3>
            <form onSubmit={handleCreateDesign} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Design Title (e.g. Princess Cut Blouse)"
                  value={designTitle}
                  onChange={e => setDesignTitle(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
                <select
                  value={designCategory}
                  onChange={e => setDesignCategory(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                >
                  <option value="Blouse Stitching">Blouse Stitching</option>
                  <option value="Suit & Salwar Stitching">Suit & Salwar</option>
                  <option value="Dress & Kurti">Dress & Kurti</option>
                  <option value="Kids Clothing">Kids Clothing</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={designPrice}
                  onChange={e => setDesignPrice(Number(e.target.value))}
                  className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                />
                <input
                  type="number"
                  placeholder="Days (3)"
                  value={designDays}
                  onChange={e => setDesignDays(Number(e.target.value))}
                  className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                />
              </div>
              <textarea
                placeholder="Description & features"
                value={designDesc}
                onChange={e => setDesignDesc(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-medium"
              ></textarea>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDesignModal(false)} className="flex-1 py-2.5 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#1B4D3E] text-white rounded-xl font-bold shadow">Save Design Catalog</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
