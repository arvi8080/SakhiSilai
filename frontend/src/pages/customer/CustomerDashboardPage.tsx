import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  Clock,
  Scissors,
  CheckCircle,
  PlusCircle,
  Ruler,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';

interface CustomerDashboardPageProps {
  setActiveTab: (tab: string) => void;
  onTrackOrder: (orderId: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ setActiveTab, onTrackOrder }) => {
  const {
    orders,
    measurements,
    saveMeasurement,
    selectedVillage,
    selectedDistrict,
    selectedState,
    tailors,
    registerTailor
  } = useData();
  const { currentUser } = useAuth();
  const { lang } = useLanguage();

  const [activeTab, setActiveTabSub] = useState<'orders' | 'measurements'>('orders');
  const [showAddM, setShowAddM] = useState(false);

  // Become a Tailor Modal state
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [tailorExp, setTailorExp] = useState('5');
  const [tailorPrice, setTailorPrice] = useState('300');
  const [tailorBio, setTailorBio] = useState('अनुभवी दर्जी बहन — ब्लाउज, सूट एवं लहंगे की सिलाई विशेषज्ञ।');
  const [tailorSubmitted, setTailorSubmitted] = useState(false);

  // New Measurement Form
  const [mLabel, setMLabel] = useState('');
  const [mType] = useState('Blouse');
  const [bust, setBust] = useState('36 in');
  const [waist, setWaist] = useState('30 in');
  const [length, setLength] = useState('14.5 in');

  const myOrders = orders.filter(o => o.customerId === currentUser.id);
  const activeOrders = myOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = myOrders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  // Check if current user has applied or is approved as a tailor
  const myTailorProfile = tailors.find(
    t => t.userId === currentUser.id || (t.phone && t.phone === currentUser.phone)
  );

  const handleSaveM = (e: React.FormEvent) => {
    e.preventDefault();
    saveMeasurement({
      userId: currentUser.id,
      label: mLabel || `${currentUser.name} - ${mType}`,
      clothingType: mType,
      bustOrChest: bust,
      waist,
      length
    });
    setShowAddM(false);
    setMLabel('');
  };

  const handleTailorApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerTailor({
      userId: currentUser.id,
      name: currentUser.name || 'Tailor Sister',
      phone: currentUser.phone || '9876543210',
      avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      state: selectedState,
      district: selectedDistrict,
      village: selectedVillage,
      addressApprox: `Chaupal near ${selectedVillage}`,
      bio: tailorBio,
      experienceYears: Number(tailorExp) || 5,
      availability: 'available',
      maxActiveOrders: 5,
      servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Dress & Kurti'],
      startingPrice: Number(tailorPrice) || 300,
      estCompletionDays: 3,
      skills: ['Princess Cut', 'Bridal Sharara', 'Piping Fitting'],
      galleryImages: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'],
      isVerified: false // Requires admin approval
    });

    setTailorSubmitted(true);
    setTimeout(() => {
      setShowTailorModal(false);
      setTailorSubmitted(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in pb-16">
      {/* USER PROFILE HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E91E63] shadow-md shrink-0"
          />
          <div>
            <span className="bg-pink-100 text-[#E91E63] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              {myTailorProfile?.isVerified ? 'Approved Tailor & Customer' : 'Customer Account'}
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-0.5">{currentUser.name}</h1>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#E91E63]" />
              <span>{selectedVillage}, {selectedDistrict} ({selectedState})</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('find_tailors')}
            className="flex-1 sm:flex-none px-5 py-3 bg-[#E91E63] text-white font-black text-xs rounded-2xl shadow-md transition hover:bg-[#D81B60] flex items-center justify-center gap-1.5"
          >
            <Scissors className="w-4 h-4 rotate-45" />
            <span>Book New Order</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BECOME A TAILOR PROMOTION CARD / APPLICATION STATUS */}
      {/* ========================================================================= */}
      {myTailorProfile ? (
        myTailorProfile.isVerified ? (
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                👩🧵
              </div>
              <div>
                <h3 className="font-black text-sm text-amber-300">
                  {lang === 'hi' ? 'आप स्वीकृत सखीसिलाई दर्जी हैं! (Approved Tailor)' : 'You are an Approved SakhiSilai Tailor!'}
                </h3>
                <p className="text-xs text-emerald-100 font-medium">
                  {lang === 'hi'
                    ? 'आप सिलाई ऑर्डर्स स्वीकार कर सकती हैं और कमाई शुरू कर सकती हैं।'
                    : 'You have full access to tailor dashboard features & customer orders.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('tailor_dashboard')}
              className="px-5 py-2.5 bg-amber-400 text-stone-900 font-black text-xs rounded-xl shadow hover:bg-amber-300 transition shrink-0"
            >
              Open Tailor Console ➔
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl">
                ⏳
              </div>
              <div>
                <h3 className="font-black text-sm text-amber-900">
                  {lang === 'hi' ? 'दर्जी आवेदन एडमिन सत्यापन के लिए लंबित है' : 'Tailor Application Pending Admin Verification'}
                </h3>
                <p className="text-xs text-amber-800 font-medium">
                  {lang === 'hi'
                    ? 'आपकी दर्जी प्रोफ़ाइल जमा हो गई है। SakhiSilai एडमिन द्वारा अनुमोदन मिलते ही आपको दर्जी सुविधाएं मिल जाएंगी।'
                    : 'Your tailor application is submitted. Once approved by SakhiSilai Admin, your tailor profile will go live.'}
                </p>
              </div>
            </div>
            <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-3 py-1.5 rounded-full uppercase shrink-0">
              Pending Admin Check
            </span>
          </div>
        )
      ) : (
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#2A1B3D] text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-stone-700">
          <div className="space-y-1">
            <span className="bg-amber-500 text-stone-900 font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider">
              Earn From Home • घर बैठे सिलाई काम
            </span>
            <h3 className="font-black text-xl text-amber-400">
              {lang === 'hi' ? '👩🧵 सखीसिलाई दर्जी बहन बनें (Become a Tailor)' : '👩🧵 Become a SakhiSilai Tailor Partner'}
            </h3>
            <p className="text-xs text-stone-300 font-medium">
              {lang === 'hi'
                ? 'क्या आप सिलाई जानती हैं? अपना दर्जी आवेदन जमा करें, एडमिन सत्यापन के बाद पास के ग्राहकों से सिलाई ऑर्डर्स पाएं।'
                : 'Do you stitch clothes? Apply to become a tailor partner and accept custom orders from nearby village customers.'}
            </p>
          </div>

          <button
            onClick={() => setShowTailorModal(true)}
            className="px-6 py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black text-xs rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 shrink-0 flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{lang === 'hi' ? 'दर्जी के लिए आवेदन करें (Apply Now)' : 'Apply to Become Tailor'}</span>
          </button>
        </div>
      )}

      {/* DASHBOARD TABS */}
      <div className="flex border-b border-stone-200 text-sm font-bold gap-6">
        <button
          onClick={() => setActiveTabSub('orders')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-stone-500'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('measurements')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'measurements' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-stone-500'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Saved Measurements ({measurements.length})</span>
        </button>
      </div>

      {/* ACTIVE ORDERS LIST */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Active Section */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E91E63]" />
              <span>Active In-Progress Orders ({activeOrders.length})</span>
            </h3>

            {activeOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
                <p className="text-sm text-stone-500">No active orders right now.</p>
                <button
                  onClick={() => setActiveTab('find_tailors')}
                  className="px-4 py-2 bg-[#E91E63] text-white text-xs font-bold rounded-xl shadow"
                >
                  Find Nearby Tailor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="bg-white p-5 rounded-3xl border border-stone-200 shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                        <span className="font-bold text-xs text-stone-400">{ord.orderNumber}</span>
                        <span className="bg-pink-100 text-[#E91E63] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        {ord.designImage && (
                          <img src={ord.designImage} alt={ord.designTitle} className="w-16 h-18 rounded-xl object-cover bg-stone-100" />
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">{ord.designTitle}</h4>
                          <p className="text-xs text-stone-500">Tailor: <strong>{ord.tailorName}</strong> ({ord.tailorVillage})</p>
                          <span className="font-extrabold text-sm text-[#E91E63] block mt-1">₹{ord.price}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onTrackOrder(ord.id)}
                      className="w-full py-2.5 bg-[#2A1B3D] hover:bg-[#1f132f] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <span>Track Live Timeline</span>
                      <ChevronRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Orders Section */}
          <div className="space-y-4 pt-6 border-t border-stone-200">
            <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Completed Order History ({pastOrders.length})</span>
            </h3>

            {pastOrders.map(ord => (
              <div key={ord.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900">{ord.designTitle}</h4>
                    <p className="text-stone-500">Completed by {ord.tailorName} • ₹{ord.price}</p>
                  </div>
                </div>

                <button
                  onClick={() => onTrackOrder(ord.id)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg"
                >
                  View Details & Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAVED MEASUREMENTS TAB */}
      {activeTab === 'measurements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-stone-900">Saved Measurement Profiles</h3>
            <button
              onClick={() => setShowAddM(true)}
              className="px-4 py-2 bg-[#E91E63] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {measurements.map(m => (
              <div key={m.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="font-bold text-sm text-stone-900">{m.label}</h4>
                  <span className="bg-pink-100 text-[#E91E63] text-[10px] font-bold px-2 py-0.5 rounded">{m.clothingType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-stone-50 p-3 rounded-2xl">
                  <div>
                    <span className="font-bold text-stone-800">{m.bustOrChest}</span>
                    <span className="text-[9px] text-stone-400 block uppercase">Bust</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">{m.waist}</span>
                    <span className="text-[9px] text-stone-400 block uppercase">Waist</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">{m.length}</span>
                    <span className="text-[9px] text-stone-400 block uppercase">Length</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BECOME A TAILOR MODAL */}
      {/* ========================================================================= */}
      {showTailorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-[#2A1B3D]">👩🧵 दर्जी आवेदन फॉर्म (Tailor Application)</h3>
                <p className="text-xs text-stone-500">SakhiSilai दर्जी पार्टनर के रूप में आवेदन करें</p>
              </div>
              <button onClick={() => setShowTailorModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {tailorSubmitted ? (
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-black text-base text-emerald-900">आवेदन सफलतापूर्वक जमा हो गया!</h4>
                <p className="text-xs text-emerald-800">
                  आपकी प्रोफ़ाइल **SakhiSilai एडमिन** के पास सत्यापन के लिए पहुँच गई है। सत्यापन स्वीकृत होते ही आपको दर्जी सुविधाएं मिल जाएंगी।
                </p>
              </div>
            ) : (
              <form onSubmit={handleTailorApplicationSubmit} className="space-y-3.5 text-xs font-bold">
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-medium">
                    आवेदन जमा करने के बाद SakhiSilai Admin सत्यापन करेगा। स्वीकृत होने पर आपका खाता दर्जी सुविधाओं के लिए अपडेट हो जाएगा।
                  </span>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">आपका नाम (Full Name)</label>
                  <input
                    type="text"
                    value={currentUser.name}
                    disabled
                    className="w-full bg-stone-100 border border-stone-200 rounded-xl p-3 text-stone-600 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 mb-1">अनुभव (Experience - Years)</label>
                    <input
                      type="number"
                      value={tailorExp}
                      onChange={e => setTailorExp(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-1">शुरुआती सिलाई दर (₹)</label>
                    <input
                      type="number"
                      value={tailorPrice}
                      onChange={e => setTailorPrice(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">विशेषज्ञता विवरण (Skills & Bio)</label>
                  <textarea
                    rows={2}
                    value={tailorBio}
                    onChange={e => setTailorBio(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 font-medium"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg transition active:scale-95 text-xs flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>दर्जी आवेदन जमा करें (Submit Application)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ADD MEASUREMENT MODAL */}
      {showAddM && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Save New Measurement</h3>
            <form onSubmit={handleSaveM} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-stone-700 mb-1">Profile Name</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Blouse Measurement"
                  value={mLabel}
                  onChange={e => setMLabel(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-700 mb-1">Bust</label>
                  <input
                    type="text"
                    value={bust}
                    onChange={e => setBust(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Waist</label>
                  <input
                    type="text"
                    value={waist}
                    onChange={e => setWaist(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Length</label>
                  <input
                    type="text"
                    value={length}
                    onChange={e => setLength(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddM(false)}
                  className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#E91E63] text-white font-bold rounded-xl shadow"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
