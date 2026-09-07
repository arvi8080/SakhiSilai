import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck,
  MapPin,
  Send,
  Layers
} from 'lucide-react';

interface AdminDashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
  const {
    tailors,
    orders,
    categories,
    locations,
    verifyTailor,
    addCategory,
    addVillageToDistrict,
    sendNotification
  } = useData();
  const { t } = useLanguage();

  const [activeTabSub, setActiveTabSub] = useState<'analytics' | 'tailors' | 'categories' | 'locations' | 'broadcast'>('analytics');

  // Category Form
  const [catEn, setCatEn] = useState('');
  const [catHi, setCatHi] = useState('');
  const [catPrice, setCatPrice] = useState(300);

  // Location Form
  const [targetStateId, setTargetStateId] = useState('up');
  const [targetDistId, setTargetDistId] = useState('lucknow');
  const [newVillageName, setNewVillageName] = useState('');

  // Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastRole, setBroadcastRole] = useState<'all' | 'customer' | 'tailor'>('all');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const pendingTailors = tailors.filter(t => !t.isVerified);
  const verifiedTailors = tailors.filter(t => t.isVerified);
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      nameEn: catEn,
      nameHi: catHi || catEn,
      iconName: 'Scissors',
      descriptionEn: 'Custom stitching category added by admin.',
      descriptionHi: 'प्रशासक द्वारा जोड़ी गई नई सिलाई श्रेणी।',
      startingPrice: Number(catPrice),
      estDays: 3
    });
    setCatEn('');
    setCatHi('');
  };

  const handleAddVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillageName) return;
    addVillageToDistrict(targetStateId, targetDistId, newVillageName);
    setNewVillageName('');
  };

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
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in pb-16">
      {/* ADMIN CONSOLE HEADER */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-amber-500 text-stone-900 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
            Super Admin Access
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2">Platform Master Console</h1>
          <p className="text-xs text-stone-300 mt-1">Manage rural tailors, village location hierarchy, categories & order oversight.</p>
        </div>
      </div>

      {/* DASHBOARD METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase">{t('verifiedTailors')}</span>
          <p className="text-3xl font-black text-stone-900">{verifiedTailors.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold block">Active in villages</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase">{t('pendingApprovals')}</span>
          <p className="text-3xl font-black text-amber-600">{pendingTailors.length}</p>
          <span className="text-[10px] text-amber-600 font-bold block">Awaiting verification</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase">{t('totalOrders')}</span>
          <p className="text-3xl font-black text-[#D9534F]">{orders.length}</p>
          <span className="text-[10px] text-stone-400 font-bold block">{activeOrders.length} active now</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase">Registered Villages</span>
          <p className="text-3xl font-black text-[#1B4D3E]">
            {locations.reduce((sum, st) => sum + st.districts.reduce((dSum, d) => dSum + d.villages.length, 0), 0)}
          </p>
          <span className="text-[10px] text-stone-400 font-bold block">Coverage area</span>
        </div>
      </div>

      {/* ADMIN TABS */}
      <div className="flex border-b border-stone-200 text-sm font-bold gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTabSub('analytics')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'analytics' ? 'border-amber-600 text-amber-600' : 'border-transparent text-stone-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Tailor Approvals ({pendingTailors.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('categories')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'categories' ? 'border-amber-600 text-amber-600' : 'border-transparent text-stone-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Category Management ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('locations')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'locations' ? 'border-amber-600 text-amber-600' : 'border-transparent text-stone-500'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Location Master Data</span>
        </button>

        <button
          onClick={() => setActiveTabSub('broadcast')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTabSub === 'broadcast' ? 'border-amber-600 text-amber-600' : 'border-transparent text-stone-500'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Notification</span>
        </button>
      </div>

      {/* TAB 1: TAILOR VERIFICATION MANAGEMENT */}
      {activeTabSub === 'analytics' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg text-stone-900">Tailor Registrations Verification</h3>

          {pendingTailors.length === 0 ? (
            <p className="text-xs text-stone-400 bg-white p-6 rounded-2xl border border-stone-200 text-center">
              All tailor registrations are currently verified!
            </p>
          ) : (
            pendingTailors.map(tProfile => (
              <div key={tProfile.id} className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md flex items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <img src={tProfile.avatar} alt={tProfile.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{tProfile.name}</h4>
                    <p className="text-xs text-stone-500">{tProfile.village}, {tProfile.district} • {tProfile.experienceYears} Years Exp</p>
                    <p className="text-[11px] text-stone-600 mt-1">{tProfile.bio}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => verifyTailor(tProfile.id, true)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow"
                  >
                    {t('approve')}
                  </button>
                  <button
                    onClick={() => verifyTailor(tProfile.id, false)}
                    className="px-4 py-2 bg-red-100 text-red-700 font-bold text-xs rounded-xl"
                  >
                    {t('reject')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: CATEGORY MANAGEMENT */}
      {activeTabSub === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-4">
            <h3 className="font-bold text-base text-stone-900">Add New Clothing Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Category Name (English)"
                value={catEn}
                onChange={e => setCatEn(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                required
              />
              <input
                type="text"
                placeholder="श्रेणी का नाम (हिंदी)"
                value={catHi}
                onChange={e => setCatHi(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
              />
              <input
                type="number"
                placeholder="Starting Base Price (₹)"
                value={catPrice}
                onChange={e => setCatPrice(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
              />
              <button type="submit" className="w-full py-3 bg-[#D9534F] text-white font-bold rounded-xl shadow">
                Save Dynamic Category
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-base text-stone-900">Active Categories ({categories.length})</h3>
            {categories.map(c => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-stone-900">{c.nameEn} ({c.nameHi})</h4>
                  <p className="text-stone-500">Starts ₹{c.startingPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LOCATION HIERARCHY MANAGER */}
      {activeTabSub === 'locations' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-6">
          <h3 className="font-extrabold text-lg text-stone-900">State → District → Village Master Hierarchy</h3>

          <form onSubmit={handleAddVillage} className="flex flex-col sm:flex-row gap-3 text-xs">
            <select
              value={targetStateId}
              onChange={e => setTargetStateId(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
            >
              {locations.map(st => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>

            <select
              value={targetDistId}
              onChange={e => setTargetDistId(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
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
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
              required
            />

            <button type="submit" className="px-5 py-2.5 bg-[#1B4D3E] text-white font-bold rounded-xl shadow">
              + Add Village
            </button>
          </form>

          <div className="space-y-4 pt-4 border-t border-stone-100">
            {locations.map(st => (
              <div key={st.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <h4 className="font-extrabold text-stone-900 text-sm">{st.name}</h4>
                <div className="space-y-2 pl-4">
                  {st.districts.map(d => (
                    <div key={d.id} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
                      <span className="font-bold text-stone-800">{d.name} District</span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {d.villages.map((v, idx) => (
                          <span key={idx} className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded">
                            {v}
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

      {/* TAB 4: BROADCAST NOTIFICATIONS */}
      {activeTabSub === 'broadcast' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md max-w-xl space-y-4">
          <h3 className="font-extrabold text-lg text-stone-900">Send System-Wide Announcement</h3>

          {broadcastSent && (
            <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-xl">Notification sent successfully!</p>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Target Audience</label>
              <select
                value={broadcastRole}
                onChange={e => setBroadcastRole(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
              >
                <option value="all">All Users (Customers & Tailors)</option>
                <option value="customer">Customers Only</option>
                <option value="tailor">Tailors Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Notification Title</label>
              <input
                type="text"
                placeholder="e.g. Festival Offer Season!"
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Message Content</label>
              <textarea
                rows={3}
                placeholder="Enter announcement text..."
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-medium"
                required
              ></textarea>
            </div>

            <button type="submit" className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl shadow">
              Send Broadcast Alert
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
