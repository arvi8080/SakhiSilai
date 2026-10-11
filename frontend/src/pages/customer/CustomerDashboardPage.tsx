import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProfilePhotoControl } from '../../components/common/ProfilePhotoControl';
import { imageSource } from '../../utils/imageSource';
import {
  ArrowRight,
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
  const [tailorApplicationError, setTailorApplicationError] = useState('');
  const [isSubmittingTailorApplication, setIsSubmittingTailorApplication] = useState(false);

  // New Measurement Form
  const [mLabel, setMLabel] = useState('');
  const [mType] = useState('Blouse');
  const [bust, setBust] = useState('36 in');
  const [waist, setWaist] = useState('30 in');
  const [length, setLength] = useState('14.5 in');

  const myOrders = orders.filter(o => o.customerId === currentUser.id);
  const activeOrders = myOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = myOrders.filter(o => o.status === 'completed' || o.status === 'cancelled');
  const myMeasurements = measurements.filter(m => m.userId === currentUser.id);

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

  const handleTailorApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTailorApplicationError('');
    setIsSubmittingTailorApplication(true);
    try {
      await registerTailor({
        userId: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        avatar: currentUser.avatar || '',
        state: selectedState,
        district: selectedDistrict,
        village: selectedVillage,
        addressApprox: `Chaupal near ${selectedVillage}`,
        bio: tailorBio,
        experienceYears: Number(tailorExp) || 0,
        availability: 'available',
        maxActiveOrders: 5,
        servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching', 'Dress & Kurti'],
        startingPrice: Number(tailorPrice) || 300,
        estCompletionDays: 3,
        skills: [],
        galleryImages: [],
        isVerified: false
      });
      setTailorSubmitted(true);
      setTimeout(() => {
        setShowTailorModal(false);
        setTailorSubmitted(false);
      }, 2000);
    } catch (error) {
      setTailorApplicationError(error instanceof Error ? error.message : 'Application could not be submitted.');
    } finally {
      setIsSubmittingTailorApplication(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 animate-fade-in pb-16">
      <section className="overflow-hidden rounded-[28px] border border-pink-100 bg-linear-to-br from-white via-[#fff8fb] to-[#f4f0ff] p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProfilePhotoControl className="h-16 w-16 rounded-2xl sm:h-20 sm:w-20" />
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9538C]">
                {lang === 'hi' ? 'आपका डैशबोर्ड' : 'Your dashboard'}
              </span>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-[#2A1B3D] sm:text-3xl">
                {lang === 'hi' ? `नमस्ते, ${currentUser.name}` : `Welcome, ${currentUser.name}`}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-stone-500 sm:text-sm">
                <MapPin className="h-4 w-4 text-[#E91E63]" />
                <span>{selectedVillage}, {selectedDistrict} · {selectedState}</span>
                {myTailorProfile?.isVerified && (
                  <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                    Verified tailor
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setActiveTab('find_tailors')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E91E63] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#D81B60]"
            >
              <Scissors className="h-4 w-4" />
              <span>{lang === 'hi' ? 'डिज़ाइन देखें' : 'Browse designs'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            {activeOrders.length > 0 && (
              <button
                onClick={() => onTrackOrder(activeOrders[0].id)}
                className="rounded-xl border border-stone-200 bg-white/80 px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-pink-200 hover:text-[#D9538C]"
              >
                {lang === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track latest order'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section aria-label="Account summary" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: lang === 'hi' ? 'सक्रिय ऑर्डर' : 'Active orders', value: activeOrders.length, icon: Clock, color: 'text-[#D9538C]', bg: 'bg-pink-50' },
          { label: lang === 'hi' ? 'ऑर्डर इतिहास' : 'Order history', value: pastOrders.length, icon: PackageCheck, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: lang === 'hi' ? 'माप प्रोफ़ाइल' : 'Saved measurements', value: myMeasurements.length, icon: Ruler, color: 'text-violet-700', bg: 'bg-violet-50' }
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-black leading-none text-[#2A1B3D]">{value}</p>
              <p className="mt-1 text-xs font-semibold text-stone-500">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ========================================================================= */}
      {/* BECOME A TAILOR PROMOTION CARD / APPLICATION STATUS */}
      {/* ========================================================================= */}
      {myTailorProfile ? (
        myTailorProfile.isVerified ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-emerald-900">
                  {lang === 'hi' ? 'आप स्वीकृत सखीसिलाई दर्जी हैं! (Approved Tailor)' : 'You are an Approved SakhiSilai Tailor!'}
                </h3>
                <p className="text-xs font-medium text-emerald-800">
                  {lang === 'hi'
                    ? 'आप सिलाई ऑर्डर्स स्वीकार कर सकती हैं और कमाई शुरू कर सकती हैं।'
                    : 'You have full access to tailor dashboard features & customer orders.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('tailor_dashboard')}
              className="shrink-0 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-800"
            >
              Open Tailor Console ➔
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="space-y-1">
            <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#D9538C]">
              Earn From Home • घर बैठे सिलाई काम
            </span>
            <h3 className="font-black text-lg text-[#2A1B3D]">
              {lang === 'hi' ? '👩🧵 सखीसिलाई दर्जी बहन बनें (Become a Tailor)' : '👩🧵 Become a SakhiSilai Tailor Partner'}
            </h3>
            <p className="max-w-2xl text-xs font-medium text-stone-500">
              {lang === 'hi'
                ? 'क्या आप सिलाई जानती हैं? अपना दर्जी आवेदन जमा करें, एडमिन सत्यापन के बाद पास के ग्राहकों से सिलाई ऑर्डर्स पाएं।'
                : 'Do you stitch clothes? Apply to become a tailor partner and accept custom orders from nearby village customers.'}
            </p>
          </div>

          <button
            onClick={() => setShowTailorModal(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#E91E63] px-5 py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#D81B60]"
          >
            <UserCheck className="w-4 h-4" />
            <span>{lang === 'hi' ? 'दर्जी के लिए आवेदन करें (Apply Now)' : 'Apply to Become Tailor'}</span>
          </button>
        </div>
      )}

      {/* DASHBOARD TABS */}
      <div className="inline-flex w-full gap-1 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm sm:w-auto">
        <button
          onClick={() => setActiveTabSub('orders')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition sm:flex-none ${
            activeTab === 'orders' ? 'bg-pink-50 text-[#D9538C]' : 'text-stone-500 hover:bg-stone-50'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('measurements')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition sm:flex-none ${
            activeTab === 'measurements' ? 'bg-pink-50 text-[#D9538C]' : 'text-stone-500 hover:bg-stone-50'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Measurements ({myMeasurements.length})</span>
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
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[#D9538C]">
                  <Scissors className="h-5 w-5" />
                </span>
                <h4 className="mt-3 font-bold text-stone-800">No active orders yet</h4>
                <p className="mt-1 text-sm text-stone-500">Find a nearby tailor and start your next outfit.</p>
                <button
                  onClick={() => setActiveTab('find_tailors')}
                  className="mt-4 rounded-xl bg-[#E91E63] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#D81B60]"
                >
                  Find a tailor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="flex flex-col justify-between space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-400">{ord.orderNumber}</span>
                        <span className="rounded-full bg-pink-50 px-2.5 py-1 text-[10px] font-bold uppercase text-[#D9538C]">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        {ord.designImage && (
                          <img src={imageSource(ord.designImage)} alt={ord.designTitle} className="w-16 h-18 rounded-xl object-cover bg-stone-100" />
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">{ord.designTitle}</h4>
                          <p className="text-xs text-stone-500">Tailor: <strong>{ord.tailorName}</strong> ({ord.tailorVillage})</p>
                          <span className="mt-2 inline-block rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-[#1B4D3E]">
                            📅 Visit Appt: {ord.appointmentDate || ord.requiredDate} • {ord.appointmentTimeSlot || 'Morning'}
                          </span>
                          <span className="font-extrabold text-sm text-[#E91E63] block mt-1">₹{ord.price}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onTrackOrder(ord.id)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#2A1B3D] py-2.5 text-xs font-bold text-white transition hover:bg-[#1f132f]"
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
          <div className="space-y-4 border-t border-stone-200 pt-6">
            <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Order history ({pastOrders.length})</span>
            </h3>

            {pastOrders.length === 0 ? (
              <p className="rounded-2xl border border-stone-100 bg-white p-4 text-sm text-stone-500">
                Completed orders will appear here.
              </p>
            ) : pastOrders.map(ord => (
              <div key={ord.id} className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-xs shadow-sm">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${
                    ord.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {ord.status === 'completed' ? '✓' : '–'}
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900">{ord.designTitle}</h4>
                    <p className="text-stone-500">
                      {ord.status === 'completed' ? 'Completed' : 'Cancelled'} · {ord.tailorName} · ₹{ord.price}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onTrackOrder(ord.id)}
                  className="shrink-0 rounded-lg bg-stone-100 px-3 py-2 font-bold text-stone-700 transition hover:bg-stone-200"
                >
                  View details
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
            <div>
              <h3 className="font-extrabold text-lg text-stone-900">Saved measurements</h3>
              <p className="mt-1 text-xs text-stone-500">Keep your sizes ready for quicker bookings.</p>
            </div>
            <button
              onClick={() => setShowAddM(true)}
              className="px-4 py-2 bg-[#E91E63] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add measurement</span>
            </button>
          </div>

          {myMeasurements.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Ruler className="h-5 w-5" />
              </span>
              <h4 className="mt-3 font-bold text-stone-800">No measurements saved</h4>
              <p className="mt-1 text-sm text-stone-500">Add your sizes once and reuse them for future orders.</p>
              <button
                onClick={() => setShowAddM(true)}
                className="mt-4 rounded-xl bg-[#E91E63] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#D81B60]"
              >
                Add your first measurement
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {myMeasurements.map(m => (
              <div key={m.id} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="font-bold text-sm text-stone-900">{m.label}</h4>
                  <span className="rounded-full bg-pink-50 px-2.5 py-1 text-[10px] font-bold text-[#D9538C]">{m.clothingType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-stone-50 p-3 text-center text-xs">
                  <div>
                    <span className="font-bold text-stone-800">{m.bustOrChest || '—'}</span>
                    <span className="block text-[9px] uppercase text-stone-400">Bust</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">{m.waist || '—'}</span>
                    <span className="block text-[9px] uppercase text-stone-400">Waist</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">{m.length || '—'}</span>
                    <span className="block text-[9px] uppercase text-stone-400">Length</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
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
                {tailorApplicationError && <p role="alert" className="text-red-700">{tailorApplicationError}</p>}
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
                  disabled={isSubmittingTailorApplication}
                  className="w-full py-3.5 bg-[#E91E63] hover:bg-[#D81B60] disabled:opacity-60 text-white font-black rounded-2xl shadow-lg transition active:scale-95 text-xs flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isSubmittingTailorApplication ? 'Submitting...' : 'दर्जी आवेदन जमा करें (Submit Application)'}</span>
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
