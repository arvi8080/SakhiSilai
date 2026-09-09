import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Scissors,
  CheckCircle,
  ArrowRight,
  UserPlus,
  LogIn,
  Lock,
  Mail,
  KeyRound,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { UP_DISTRICTS } from '../../data/upDistricts';

interface AuthPagesProps {
  setActiveTab: (tab: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ setActiveTab, initialMode = 'login' }) => {
  const {
    loginWithCredentials,
    forgotPassword,
    resetPassword,
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

  // Mode: 'login' | 'register' | 'forgot_password' | 'reset_password'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password' | 'reset_password'>(
    initialMode === 'register' ? 'register' : 'login'
  );

  // Form Fields (Email Only - Mobile Option Removed)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [village, setVillage] = useState('Mohanlalganj');
  const [district, setDistrict] = useState('Lucknow');
  const [stateVal] = useState('Uttar Pradesh');

  // Status & Messages
  const [regSuccess, setRegSuccess] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SINGLE UNIFIED LOGIN SUBMIT HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const result = await loginWithCredentials(email, password);
      if (result.success && result.role) {
        completeAuthRedirect(result.role);
      } else {
        setLoginError(result.message || (lang === 'hi' ? 'गलत ईमेल या पासवर्ड।' : 'Invalid email address or password.'));
      }
    } catch (err) {
      setLoginError(lang === 'hi' ? 'गलत ईमेल या पासवर्ड।' : 'Invalid email address or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UNIFIED SIGNUP HANDLER (EMAIL-ONLY SIGNUP)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    updateUserProfile({
      name: name || 'User',
      email: email,
      phone: '',
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

  // FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setForgotNotice(null);
    setIsSubmitting(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setForgotNotice(lang === 'hi'
          ? '🔑 पासवर्ड रीसेट सत्यापन सफल! नीचे बटन पर क्लिक करके नया पासवर्ड सेट करें।'
          : '🔑 Account verified! Click below to set your new password.');
      } else {
        setLoginError(result.message || (lang === 'hi' ? 'इस ईमेल से कोई खाता नहीं मिला।' : 'No account found with this email address.'));
      }
    } catch (err) {
      setLoginError(lang === 'hi' ? 'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // RESET PASSWORD HANDLER
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setResetNotice(null);

    if (newPassword !== confirmPassword) {
      setLoginError(lang === 'hi' ? 'दोनों पासवर्ड मेल नहीं खाते!' : 'Passwords do not match!');
      return;
    }

    if (newPassword.length < 4) {
      setLoginError(lang === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' : 'Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPassword(email, newPassword);
      if (result.success) {
        setResetNotice(lang === 'hi'
          ? '✅ पासवर्ड सफलतापूर्वक अपडेट हो गया! अब अपने नए पासवर्ड से लॉगिन करें।'
          : '✅ Password updated successfully! Please login with your new password.');
        setPassword(newPassword);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setAuthMode('login');
        }, 1500);
      } else {
        setLoginError(result.message || (lang === 'hi' ? 'पासवर्ड अपडेट करने में विफलता।' : 'Failed to update password.'));
      }
    } catch (err) {
      setLoginError(lang === 'hi' ? 'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              ? 'सफलतापूर्वक लॉगिन करने के बाद आप स्वचालित रूप से अपने गंतव्य पर पहुँच जाएंगे।'
              : 'After successful login, you will be automatically returned to your destination.'}
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
      {(authMode === 'login' || authMode === 'register') && (
        <div className="flex bg-stone-100 p-1.5 rounded-full border border-stone-200 shadow-inner">
          <button
            onClick={() => { setAuthMode('login'); setLoginError(null); }}
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
            onClick={() => { setAuthMode('register'); setLoginError(null); }}
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
      )}

      {/* ========================================================================= */}
      {/* 1. LOGIN MODE FORM (EMAIL ONLY) */}
      {/* ========================================================================= */}
      {authMode === 'login' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#2A1B3D]">
              {lang === 'hi' ? 'वापसी पर स्वागत है!' : 'Welcome Back!'}
            </h2>
            <p className="text-xs text-stone-500">
              {lang === 'hi'
                ? 'अपना ईमेल पता और पासवर्ड दर्ज करें'
                : 'Enter your Email Address & Password to login'}
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs font-bold text-red-700 text-center animate-shake">
              ❌ {loginError}
            </div>
          )}

          {resetNotice && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 text-center">
              {resetNotice}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
            <div>
              <label htmlFor="loginEmail" className="block text-stone-700 mb-1.5">
                {lang === 'hi' ? 'ईमेल पता (Email Address)' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  id="loginEmail"
                  name="loginEmail"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 pl-10 text-sm text-[#2A1B3D] focus:ring-2 focus:ring-[#E91E63] focus:outline-none font-bold"
                  required
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="loginPassword" className="block text-stone-700">
                  {lang === 'hi' ? 'पासवर्ड (Password)' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot_password'); setLoginError(null); }}
                  className="text-[11px] text-[#E91E63] hover:underline font-extrabold"
                >
                  {lang === 'hi' ? 'पासवर्ड भूल गए? (Forgot Password?)' : 'Forgot Password?'}
                </button>
              </div>

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
      {/* 2. UNIFIED CREATE ACCOUNT FORM (EMAIL ONLY SIGNUP) */}
      {/* ========================================================================= */}
      {authMode === 'register' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#2A1B3D]">
              {lang === 'hi' ? 'नया खाता बनाएं' : 'Create Account'}
            </h2>
            <p className="text-xs text-stone-500">
              {lang === 'hi'
                ? 'ईमेल से खाता बनाएं — बाद में आप दर्जी (Tailor) के रूप में आवेदन कर सकते हैं'
                : 'Sign up with email — Later apply to become a tailor from your dashboard'}
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
              <label htmlFor="regEmail" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'ईमेल पता (Email Address)' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  id="regEmail"
                  name="regEmail"
                  type="email"
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 pl-10 text-sm text-[#2A1B3D]"
                  required
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-4" />
              </div>
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

      {/* ========================================================================= */}
      {/* 3. FORGOT PASSWORD VIEW */}
      {/* ========================================================================= */}
      {authMode === 'forgot_password' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E91E63] flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-[#2A1B3D]">
              {lang === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
            </h2>
            <p className="text-xs text-stone-500">
              {lang === 'hi'
                ? 'अपना पंजीकृत ईमेल दर्ज करें, हम आपको पासवर्ड रीसेट सत्यापन भेजेंगे'
                : 'Enter your registered email address to verify & reset your password'}
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs font-bold text-red-700 text-center">
              ❌ {loginError}
            </div>
          )}

          {forgotNotice ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 text-center leading-relaxed">
                {forgotNotice}
              </div>
              <button
                onClick={() => setAuthMode('reset_password')}
                className="w-full py-4 bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-black rounded-2xl shadow-lg transition active:scale-95 text-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'नया पासवर्ड सेट करें (Reset Password)' : 'Proceed to Set New Password'}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs font-bold">
              <div>
                <label htmlFor="forgotEmail" className="block text-stone-700 mb-1.5">
                  {lang === 'hi' ? 'पंजीकृत ईमेल पता (Registered Email Address)' : 'Registered Email Address'}
                </label>
                <div className="relative">
                  <input
                    id="forgotEmail"
                    name="forgotEmail"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 pl-10 text-sm text-[#2A1B3D] focus:ring-2 focus:ring-[#E91E63] focus:outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 text-xs flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? (lang === 'hi' ? 'जाँच हो रही है...' : 'Verifying Email...') : (lang === 'hi' ? 'सत्यापित करें (Verify Email)' : 'Verify Registered Email')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLoginError(null); }}
              className="inline-flex items-center gap-1 text-xs text-stone-600 font-bold hover:text-[#E91E63]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'लॉगिन पर वापस जाएं' : 'Back to Login'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RESET PASSWORD VIEW */}
      {/* ========================================================================= */}
      {authMode === 'reset_password' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-[#2A1B3D]">
              {lang === 'hi' ? 'नया पासवर्ड बनाएं' : 'Create New Password'}
            </h2>
            <p className="text-xs text-stone-500">
              Account: <strong>{email}</strong>
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs font-bold text-red-700 text-center">
              ❌ {loginError}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-bold">
            <div>
              <label htmlFor="newPassword" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'नया पासवर्ड (New Password)' : 'New Password'}
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D]"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-4 top-4" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'पासवर्ड की पुष्टि करें (Confirm New Password)' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D]"
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
              <span>{isSubmitting ? (lang === 'hi' ? 'अपडेट हो रहा है...' : 'Updating...') : (lang === 'hi' ? 'पासवर्ड अपडेट करें' : 'Update Password')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLoginError(null); }}
              className="inline-flex items-center gap-1 text-xs text-stone-600 font-bold hover:text-[#E91E63]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'लॉगिन पर वापस जाएं' : 'Back to Login'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
