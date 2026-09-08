import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Scissors,
  CheckCircle,
  ArrowRight,
  UserPlus,
  LogIn,
  Lock
} from 'lucide-react';
import { UP_DISTRICTS } from '../../data/upDistricts';

interface AuthPagesProps {
  setActiveTab: (tab: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ setActiveTab, initialMode = 'login' }) => {
  const {
    loginWithCredentials,
    updateUserProfile,
    pendingRedirectTab,
    setPendingRedirectTab,
    redirectNotice,
    setRedirectNotice,
    setRole
  } = useAuth();
  const { lang } = useLanguage();

  const completeAuthRedirect = (role: string = 'customer') => {
    if (pendingRedirectTab) {
      const target = pendingRedirectTab;
      setPendingRedirectTab(null);
      setRedirectNotice(null);
      setActiveTab(target);
    } else {
      if (role === 'admin') {
        setActiveTab('admin_dashboard');
      } else if (role === 'tailor') {
        setActiveTab('tailor_dashboard');
      } else {
        setActiveTab('customer_dashboard');
      }
    }
  };

  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode === 'register' ? 'register' : 'login');

  // Common Form Fields
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState('Mohanlalganj');
  const [district, setDistrict] = useState('Lucknow');
  const [stateVal] = useState('Uttar Pradesh');

  // Status screens
  const [regSuccess, setRegSuccess] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SINGLE UNIFIED LOGIN SUBMIT HANDLER FOR ALL ROLES
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const result = await loginWithCredentials(phoneOrEmail, password);
      if (result.success && result.role) {
        completeAuthRedirect(result.role);
      } else {
        setLoginError(result.message || (lang === 'hi' ? 'गलत ईमेल/फोन नंबर या पासवर्ड।' : 'Invalid email or password.'));
      }
    } catch (err) {
      setLoginError(lang === 'hi' ? 'गलत ईमेल/फोन नंबर या पासवर्ड।' : 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UNIFIED SIGNUP HANDLER (EVERYONE BECOMES NORMAL USER FIRST)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Update user profile as customer
    updateUserProfile({
      name: name || 'User',
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail : '9812345678',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : '',
      village,
      district,
      state: stateVal,
      role: 'customer'
    });
    setRole('customer');
    setRegSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      completeAuthRedirect('customer');
    }, 1200);
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
              ? 'सफलतापूर्वक लॉगिन करने के बाद आप स्वचालित रूप से अपने डैशबोर्ड पर पहुँच जाएंगे।'
              : 'After successful login, you will be automatically returned to your original destination.'}
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
          onClick={() => setAuthMode('login')}
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
          onClick={() => setAuthMode('register')}
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
                ? 'ईमेल / फोन नंबर और पासवर्ड दर्ज करें — भूमिका (Role) का पता अपने आप चल जाएगा'
                : 'Enter Email / Mobile Phone & Password — System checks your account role'}
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs font-bold text-red-700 text-center animate-shake">
              ❌ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
            <div>
              <label htmlFor="loginPhoneOrEmail" className="block text-stone-700 mb-1.5">
                {lang === 'hi' ? 'ईमेल या मोबाइल नंबर (Email / Phone)' : 'Email / Mobile Phone'}
              </label>
              <input
                id="loginPhoneOrEmail"
                name="loginPhoneOrEmail"
                type="text"
                value={phoneOrEmail}
                onChange={e => setPhoneOrEmail(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. user@gmail.com या 9812345678' : 'e.g. user@gmail.com or 9812345678'}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D] focus:ring-2 focus:ring-[#E91E63] focus:outline-none font-bold"
                required
              />
            </div>

            <div>
              <label htmlFor="loginPassword" className="block text-stone-700 mb-1.5">
                {lang === 'hi' ? 'पासवर्ड (Password)' : 'Password'}
              </label>
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
              disabled={isSubmitting}
              className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? (lang === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying...') : (lang === 'hi' ? 'लॉगिन करें (Login)' : 'Login')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-500 font-medium">
              {lang === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-[#E91E63] font-black underline hover:text-[#D81B60]"
              >
                {lang === 'hi' ? 'पंजीकरण करें (Register)' : 'Register'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. UNIFIED CREATE ACCOUNT FORM (ONE SIGNUP FOR EVERYONE) */}
      {/* ========================================================================= */}
      {authMode === 'register' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#2A1B3D]">
              {lang === 'hi' ? 'नया खाता बनाएं' : 'Create Account'}
            </h2>
            <p className="text-xs text-stone-500">
              {lang === 'hi'
                ? 'एक खाता सभी सेवाओं के लिए — बाद में आप दर्जी (Tailor) के रूप में आवेदन कर सकते हैं'
                : 'One account for everyone — Later apply to become a tailor from your dashboard'}
            </p>
          </div>

          {regSuccess && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-bounce">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>खाता सफलतापूर्वक बन गया! ग्राहक डैशबोर्ड पर रिडायरेक्ट हो रहे हैं...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs font-bold">
            <div>
              <label htmlFor="regName" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'आपका पूरा नाम (Full Name)' : 'Full Name'}
              </label>
              <input
                id="regName"
                name="regName"
                type="text"
                placeholder="उदा. अरविंद कुमार / प्रिया सिंह"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D]"
                required
              />
            </div>

            <div>
              <label htmlFor="regPhoneOrEmail" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर या ईमेल (Mobile OR Email)' : 'Mobile Number OR Email'}
              </label>
              <input
                id="regPhoneOrEmail"
                name="regPhoneOrEmail"
                type="text"
                placeholder="उदा. 9812345678 या user@gmail.com"
                value={phoneOrEmail}
                onChange={e => setPhoneOrEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D]"
                required
              />
            </div>

            <div>
              <label htmlFor="regPassword" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'पासवर्ड (Password)' : 'Password'}
              </label>
              <input
                id="regPassword"
                name="regPassword"
                type="password"
                placeholder="******"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="regVillage" className="block text-stone-700 mb-1">
                  {lang === 'hi' ? 'गाँव / क्षेत्र (Village)' : 'Village'}
                </label>
                <input
                  id="regVillage"
                  name="regVillage"
                  type="text"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D]"
                  required
                />
              </div>

              <div>
                <label htmlFor="regDistrict" className="block text-stone-700 mb-1">
                  {lang === 'hi' ? 'ज़िला (Uttar Pradesh District)' : 'District (Uttar Pradesh)'}
                </label>
                <select
                  id="regDistrict"
                  name="regDistrict"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-sm text-[#2A1B3D] font-bold focus:ring-2 focus:ring-[#E91E63] focus:outline-none"
                  required
                >
                  {UP_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              <span>{lang === 'hi' ? 'खाता बनाएं (Register)' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-500 font-medium">
              {lang === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-[#E91E63] font-black underline hover:text-[#D81B60]"
              >
                {lang === 'hi' ? 'लॉगिन करें (Login)' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
