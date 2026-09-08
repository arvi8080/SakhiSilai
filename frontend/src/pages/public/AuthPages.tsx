import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Scissors,
  UserCheck,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  UserPlus,
  LogIn,
  Lock
} from 'lucide-react';

interface AuthPagesProps {
  setActiveTab: (tab: string) => void;
  initialMode?: 'login' | 'register' | 'register_tailor';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ setActiveTab, initialMode = 'register' }) => {
  const { registerTailor, selectedState, selectedDistrict, selectedVillage } = useData();
  const {
    setRole,
    updateUserProfile,
    loginAsAdmin,
    loginAsCustomer,
    loginAsTailor,
    pendingRedirectTab,
    setPendingRedirectTab,
    redirectNotice,
    setRedirectNotice
  } = useAuth();
  const { lang } = useLanguage();

  const completeAuthRedirect = (defaultTab: string = 'dashboard') => {
    if (pendingRedirectTab) {
      const target = pendingRedirectTab;
      setPendingRedirectTab(null);
      setRedirectNotice(null);
      setActiveTab(target);
    } else {
      setActiveTab(defaultTab);
    }
  };

  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode === 'login' ? 'login' : 'register');

  // Role choice for Create Account: 'customer' or 'tailor'
  const [registerRole, setRegisterRole] = useState<'customer' | 'tailor'>(initialMode === 'register_tailor' ? 'tailor' : 'customer');

  // Common Form Fields
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState(selectedVillage || 'Mohanlalganj');
  const [district, setDistrict] = useState(selectedDistrict || 'Lucknow');
  const [stateVal] = useState(selectedState || 'Uttar Pradesh');

  // Tailor Specific Fields
  const [experience, setExperience] = useState('5');
  const [startingPrice, setStartingPrice] = useState('300');
  const [bio, setBio] = useState('अनुभवी दर्जी बहन - ब्लाउज, सूट एवं लहंगा सिलाई में विशेषज्ञ।');

  // Status screens
  const [tailorPendingSuccess, setTailorPendingSuccess] = useState(false);
  const [customerRegSuccess, setCustomerRegSuccess] = useState(false);

  // LOGIN ROLE SELECTOR STATE
  const [loginRole, setLoginRole] = useState<'auto' | 'customer' | 'tailor' | 'admin'>('auto');

  // LOGIN SUBMIT HANDLER - SINGLE LOGIN PAGE WITH AUTOMATIC REDIRECT
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().toLowerCase();
    const cleanPass = password.trim().toLowerCase();

    // 1. ADMIN REDIRECT CHECK
    if (
      loginRole === 'admin' ||
      cleanPhone === '9999900000' ||
      cleanPhone.includes('admin') ||
      cleanPass === 'admin' ||
      cleanPass === 'admin123'
    ) {
      loginAsAdmin();
      completeAuthRedirect('dashboard');
      return;
    }

    // 2. TAILOR REDIRECT CHECK
    if (
      loginRole === 'tailor' ||
      cleanPhone === '9876543210' ||
      cleanPhone.includes('tailor')
    ) {
      loginAsTailor();
      completeAuthRedirect('dashboard');
      return;
    }

    // 3. CUSTOMER REDIRECT CHECK (DEFAULT)
    if (cleanPhone) {
      updateUserProfile({ phone: cleanPhone });
    }
    loginAsCustomer();
    completeAuthRedirect();
  };

  // REGISTER CUSTOMER SUBMIT
  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name || 'Customer',
      phone,
      village,
      district,
      state: stateVal,
      role: 'customer'
    });
    setRole('customer');
    setCustomerRegSuccess(true);

    setTimeout(() => {
      completeAuthRedirect();
    }, 1200);
  };

  // REGISTER TAILOR SUBMIT (REQUIRES ADMIN VERIFICATION)
  const handleRegisterTailor = (e: React.FormEvent) => {
    e.preventDefault();
    
    registerTailor({
      userId: 'u_' + Date.now(),
      name: name || 'Sunita Devi',
      phone,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      state: stateVal,
      district,
      village,
      addressApprox: `गौतम बुद्ध मार्ग, chaupal near ${village}`,
      bio,
      experienceYears: Number(experience) || 3,
      availability: 'available',
      maxActiveOrders: 5,
      servicesOffered: ['ब्लाउज सिलाई', 'सूट सिलाई', 'ड्रेस सिलाई'],
      startingPrice: Number(startingPrice) || 300,
      estCompletionDays: 3,
      skills: ['प्रिंसेंस कट', 'राजपूती सूट', 'अल्टरेशन'],
      galleryImages: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'],
      isVerified: false // MUST BE VERIFIED BY ADMIN
    });

    setTailorPendingSuccess(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 space-y-6 animate-fade-in pb-16 pt-4">
      {/* AUTH REDIRECT NOTICE BANNER */}
      {redirectNotice && (
        <div className="bg-[#E91E63] text-white p-4 rounded-3xl shadow-xl border border-pink-700 space-y-1 animate-pulse">
          <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
            <Lock className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{redirectNotice}</span>
          </div>
          <p className="text-[11px] text-pink-100 font-medium leading-relaxed pl-7">
            {lang === 'hi'
              ? 'सफलतापूर्वक लॉगिन या पंजीकरण करने के बाद आप स्वचालित रूप से अपनी पसंदीदा प्रक्रिया/पेज पर पहुँच जाएंगे।'
              : 'After successful login or registration, you will be automatically returned to your original booking action.'}
          </p>
        </div>
      )}

      {/* BRAND BANNER HEADER */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FF4081] text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-500/25">
          <Scissors className="w-7 h-7 rotate-45" />
        </div>
        <h1 className="text-3xl font-black text-[#2A1B3D]">
          Sakhi<span className="text-[#E91E63]">Silai</span>
        </h1>
        <p className="text-xs font-extrabold text-[#E91E63] tracking-wide italic">
          “Ghar Se Hunar, Apni Kamai.”
        </p>
      </div>

      {/* TOP TOGGLE: LOGIN vs CREATE ACCOUNT */}
      <div className="flex bg-stone-100 p-1.5 rounded-full border border-stone-200 shadow-inner">
        <button
          onClick={() => {
            setAuthMode('login');
            setTailorPendingSuccess(false);
          }}
          className={`flex-1 py-3 rounded-full font-black text-xs transition flex items-center justify-center gap-2 ${
            authMode === 'login'
              ? 'bg-white text-[#2A1B3D] shadow-md border border-stone-200'
              : 'text-stone-500 hover:text-[#2A1B3D]'
          }`}
        >
          <LogIn className="w-4 h-4 text-[#E91E63]" />
          <span>{lang === 'hi' ? 'लॉगिन' : 'Login'}</span>
        </button>

        <button
          onClick={() => {
            setAuthMode('register');
            setTailorPendingSuccess(false);
          }}
          className={`flex-1 py-3 rounded-full font-black text-xs transition flex items-center justify-center gap-2 ${
            authMode === 'register'
              ? 'bg-[#E91E63] text-white shadow-lg shadow-pink-500/25'
              : 'text-stone-500 hover:text-[#2A1B3D]'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>{lang === 'hi' ? 'खाता बनाएं' : 'Create Account'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. LOGIN MODE FORM (SINGLE UNIFIED LOGIN FOR ALL ROLES) */}
      {/* ========================================================================= */}
      {authMode === 'login' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#2A1B3D]">
              {lang === 'hi' ? 'वापसी पर स्वागत है!' : 'Welcome Back!'}
            </h2>
            <p className="text-xs text-stone-500">
              {lang === 'hi'
                ? 'सिंगल लॉगिन पोर्टल — ग्राहक, टेलर या एडमिन के रूप में प्रवेश करें'
                : 'Single login portal — Sign in as Customer, Tailor, or Admin'}
            </p>
          </div>

          {/* LOGIN ROLE TARGET SELECTION */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-stone-600">लॉगिन प्रकार चुनिए (Target Account Role):</label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('customer');
                  setPhone('9812345678');
                  setPassword('123456');
                }}
                className={`py-2 px-1 rounded-xl border transition flex flex-col items-center gap-1 ${
                  loginRole === 'customer'
                    ? 'border-[#E91E63] bg-pink-50 text-[#E91E63] font-black'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="text-base">👤</span>
                <span>ग्राहक (User)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginRole('tailor');
                  setPhone('9876543210');
                  setPassword('123456');
                }}
                className={`py-2 px-1 rounded-xl border transition flex flex-col items-center gap-1 ${
                  loginRole === 'tailor'
                    ? 'border-[#E91E63] bg-pink-50 text-[#E91E63] font-black'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="text-base">👩🧵</span>
                <span>टेलर (Tailor)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginRole('admin');
                  setPhone('9999900000');
                  setPassword('admin');
                }}
                className={`py-2 px-1 rounded-xl border transition flex flex-col items-center gap-1 ${
                  loginRole === 'admin'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-black'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="text-base">🛡️</span>
                <span>एडमिन (Admin)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
            <div>
              <label htmlFor="loginPhone" className="block text-stone-700 mb-1.5">मोबाइल नंबर (Mobile Number / User ID)</label>
              <input
                id="loginPhone"
                name="loginPhone"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="उदा. 9812345678 या admin"
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D] focus:ring-2 focus:ring-[#E91E63] focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="loginPassword" className="block text-stone-700 mb-1.5">पासवर्ड (Password)</label>
              <div className="relative">
                <input
                  id="loginPassword"
                  name="loginPassword"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D] focus:ring-2 focus:ring-[#E91E63] focus:outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-4 top-4" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              <span>लॉगिन करें और आगे बढ़ें (Sign In)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-CLICK QUICK DEMO LOGIN BUTTONS */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <span className="text-[10px] font-extrabold text-stone-400 block text-center uppercase tracking-wider">
              क्विक 1-क्लिक टेस्ट (Quick Demo Access):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsCustomer();
                  completeAuthRedirect();
                }}
                className="py-2.5 px-2 bg-pink-50 hover:bg-pink-100 text-[#E91E63] font-black text-[11px] rounded-xl border border-pink-200 transition text-center"
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsTailor();
                  completeAuthRedirect();
                }}
                className="py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-[11px] rounded-xl border border-emerald-200 transition text-center"
              >
                👩🧵 Tailor
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsAdmin();
                  completeAuthRedirect('dashboard');
                }}
                className="py-2.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-[11px] rounded-xl border border-amber-200 transition text-center"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATE ACCOUNT MODE FORM */}
      {/* ========================================================================= */}
      {authMode === 'register' && !tailorPendingSuccess && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#2A1B3D]">नया खाता बनाएं</h2>
            <p className="text-xs text-stone-500">SakhiSilai प्लेटफ़ॉर्म पर अपनी भूमिका चुनें</p>
          </div>

          {/* ROLE SELECTOR CARDS */}
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setRegisterRole('customer')}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer text-center space-y-2 ${
                registerRole === 'customer'
                  ? 'border-[#E91E63] bg-pink-50/60 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#E91E63] flex items-center justify-center mx-auto text-xl">
                👤
              </div>
              <div>
                <h4 className="font-black text-xs text-[#2A1B3D]">ग्राहक (Customer)</h4>
                <p className="text-[10px] text-stone-500 font-medium">कपड़े सिलवाने के लिए</p>
              </div>
            </div>

            <div
              onClick={() => setRegisterRole('tailor')}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer text-center space-y-2 ${
                registerRole === 'tailor'
                  ? 'border-[#E91E63] bg-pink-50/60 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl">
                👩🧵
              </div>
              <div>
                <h4 className="font-black text-xs text-[#2A1B3D]">दर्जी बहन (Tailor)</h4>
                <p className="text-[10px] text-stone-500 font-medium">घर बैठे सिलाई कमाई के लिए</p>
              </div>
            </div>
          </div>

          {customerRegSuccess && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-bounce">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>खाता सफलतापूर्वक बन गया! डैशबोर्ड पर रिडायरेक्ट हो रहे हैं...</span>
            </div>
          )}

          {/* CUSTOMER REGISTRATION FORM */}
          {registerRole === 'customer' && (
            <form onSubmit={handleRegisterCustomer} className="space-y-4 text-xs font-bold">
              <div>
                <label htmlFor="regCustomerName" className="block text-stone-700 mb-1">आपका पूरा नाम (Full Name)</label>
                <input
                  id="regCustomerName"
                  name="regCustomerName"
                  type="text"
                  placeholder="उदा. प्रिया सिंह"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                  required
                />
              </div>

              <div>
                <label htmlFor="regCustomerPhone" className="block text-stone-700 mb-1">मोबाइल नंबर (Mobile Number)</label>
                <input
                  id="regCustomerPhone"
                  name="regCustomerPhone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="regCustomerVillage" className="block text-stone-700 mb-1">गाँव / क्षेत्र (Village)</label>
                  <input
                    id="regCustomerVillage"
                    name="regCustomerVillage"
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="regCustomerDistrict" className="block text-stone-700 mb-1">ज़िला (District)</label>
                  <input
                    id="regCustomerDistrict"
                    name="regCustomerDistrict"
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 text-xs flex items-center justify-center gap-2"
              >
                <span>ग्राहक खाता बनाएं (Register Customer)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAILOR REGISTRATION FORM (ADMIN VERIFICATION REQUIREMENT) */}
          {registerRole === 'tailor' && (
            <form onSubmit={handleRegisterTailor} className="space-y-3.5 text-xs font-bold">
              {/* ADMIN VERIFICATION NOTICE */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-xs text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>एडमिन सत्यापन आवश्यक (Admin Verification Policy)</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-amber-800">
                  पंजीकरण के बाद आपकी प्रोफ़ाइल SakhiSilai एडमिन के पास सत्यापन के लिए जाएगी। स्वीकृति मिलते ही आपकी प्रोफ़ाइल ग्राहकों को दिखेगी।
                </p>
              </div>

              <div>
                <label htmlFor="regTailorName" className="block text-stone-700 mb-1">दर्जी बहन का नाम (Full Name)</label>
                <input
                  id="regTailorName"
                  name="regTailorName"
                  type="text"
                  placeholder="उदा. सुनिता देवी"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                  required
                />
              </div>

              <div>
                <label htmlFor="regTailorPhone" className="block text-stone-700 mb-1">मोबाइल नंबर (Mobile Phone)</label>
                <input
                  id="regTailorPhone"
                  name="regTailorPhone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="regTailorVillage" className="block text-stone-700 mb-1">गाँव / मोहल्ला (Village)</label>
                  <input
                    id="regTailorVillage"
                    name="regTailorVillage"
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="regTailorDistrict" className="block text-stone-700 mb-1">ज़िला (District)</label>
                  <input
                    id="regTailorDistrict"
                    name="regTailorDistrict"
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="regTailorExperience" className="block text-stone-700 mb-1">अनुभव (Experience - Years)</label>
                  <input
                    id="regTailorExperience"
                    name="regTailorExperience"
                    type="number"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="regTailorStartingPrice" className="block text-stone-700 mb-1">शुरुआती सिलाई दर (₹)</label>
                  <input
                    id="regTailorStartingPrice"
                    name="regTailorStartingPrice"
                    type="number"
                    value={startingPrice}
                    onChange={e => setStartingPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="regTailorBio" className="block text-stone-700 mb-1">विशेषज्ञता एवं विवरण (About Skills)</label>
                <textarea
                  id="regTailorBio"
                  name="regTailorBio"
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-[#2A1B3D] font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 text-xs flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>दर्जी प्रोफ़ाइल जमा करें (Submit Tailor Profile)</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAILOR PENDING ADMIN VERIFICATION SUCCESS SCREEN */}
      {/* ========================================================================= */}
      {tailorPendingSuccess && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xl space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
              सत्यापन लंबित (Pending Verification)
            </span>
            <h2 className="text-2xl font-black text-[#2A1B3D]">दर्जी पंजीकरण सफलतापूर्वक जमा हो गया!</h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
              आपकी प्रोफ़ाइल **SakhiSilai एडमिन (Admin Verification)** के पास पहुँच गई है। एडमिन द्वारा अनुमोदन (Approval) मिलते ही आपकी प्रोफ़ाइल आस-पास के ग्राहकों को दिखना शुरू हो जाएगी।
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-2 text-xs font-bold text-stone-700">
            <h4 className="text-stone-900 font-black">प्रोफ़ाइल विवरण (Submitted Profile Summary):</h4>
            <div className="flex justify-between border-b border-stone-200 pb-1">
              <span>नाम:</span> <span>{name || 'Sunita Devi'}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-1">
              <span>गाँव / स्थान:</span> <span>{village}, {district}</span>
            </div>
            <div className="flex justify-between">
              <span>सत्यापन स्थिति:</span> <span className="text-amber-600 font-extrabold">⏳ एडमिन जांच जारी</span>
            </div>
          </div>

          {/* QUICK DEMO ACTION TO TEST ADMIN APPROVAL */}
          <div className="pt-2 border-t border-stone-100 space-y-3">
            <p className="text-[11px] font-bold text-stone-500">
              डेमो टेस्ट के लिए: आप तुरंत एडमिन पैनल में जाकर इस प्रोफ़ाइल को स्वीकृत (Approve) कर सकते हैं।
            </p>
            <button
              onClick={() => {
                loginAsAdmin();
                setActiveTab('admin_dashboard');
              }}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl shadow transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>एडमिन के रूप में लॉगिन करें व प्रोफ़ाइल स्वीकृत करें (Open Admin Console)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
