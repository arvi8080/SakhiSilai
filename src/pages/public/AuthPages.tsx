import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, UserCheck, CheckCircle, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

interface AuthPagesProps {
  setActiveTab: (tab: string) => void;
  initialMode?: 'login' | 'register_tailor';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ setActiveTab, initialMode = 'login' }) => {
  const { registerTailor, selectedState, selectedDistrict, selectedVillage } = useData();
  const { setRole } = useAuth();
  const { t, lang } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register_tailor'>(initialMode);
  const [phone, setPhone] = useState('9876543210');
  const [name, setName] = useState('');
  const [village, setVillage] = useState(selectedVillage);
  const [district, setDistrict] = useState(selectedDistrict);
  const [stateVal, setStateVal] = useState(selectedState);
  const [experience, setExperience] = useState('5');
  const [startingPrice, setStartingPrice] = useState('300');
  const [bio, setBio] = useState('Experienced home tailor specializing in blouse & suit stitching.');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('customer');
    setActiveTab('dashboard');
  };

  const handleRegisterTailor = (e: React.FormEvent) => {
    e.preventDefault();
    registerTailor({
      userId: 'u_' + Date.now(),
      name,
      phone,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      state: stateVal,
      district,
      village,
      addressApprox: `Near Chaupal, ${village}`,
      bio,
      experienceYears: Number(experience),
      availability: 'available',
      maxActiveOrders: 4,
      servicesOffered: ['Blouse Stitching', 'Suit & Salwar Stitching'],
      startingPrice: Number(startingPrice),
      estCompletionDays: 3,
      skills: ['Princess Cut', 'Bridal Suit'],
      galleryImages: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'],
      isVerified: false
    });

    setRegSuccess(true);
    setTimeout(() => {
      setRole('tailor');
      setActiveTab('dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-fade-in pb-16 pt-4">
      {/* MODE TABS */}
      <div className="flex bg-stone-200 p-1.5 rounded-2xl border border-stone-300">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
            mode === 'login' ? 'bg-[#D9534F] text-white shadow' : 'text-stone-700'
          }`}
        >
          {t('login')}
        </button>

        <button
          onClick={() => setMode('register_tailor')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
            mode === 'register_tailor' ? 'bg-[#1B4D3E] text-white shadow' : 'text-stone-700'
          }`}
        >
          {t('joinAsTailor')}
        </button>
      </div>

      {/* LOGIN FORM */}
      {mode === 'login' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D9534F] flex items-center justify-center mx-auto">
              <Scissors className="w-6 h-6 rotate-45" />
            </div>
            <h2 className="text-2xl font-black text-stone-900">Welcome Back</h2>
            <p className="text-xs text-stone-500">Enter mobile number to sign in to SakhiSilai</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-bold text-sm focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#D9534F] hover:bg-[#C93B37] text-white font-extrabold rounded-xl shadow-lg transition active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              <span>Login & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* REGISTER TAILOR WIZARD */}
      {mode === 'register_tailor' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-stone-900">{t('joinAsTailor')}</h2>
            <p className="text-xs text-stone-500">Earn from home using your stitching skills (0% Commission)</p>
          </div>

          {regSuccess && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              <span>Registration Submitted! Redirecting to Tailor Work Center...</span>
            </div>
          )}

          <form onSubmit={handleRegisterTailor} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Sunita Devi"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Mobile Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Starting Rate (₹)</label>
                <input
                  type="number"
                  value={startingPrice}
                  onChange={e => setStartingPrice(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Bio / About Your Work</label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-extrabold rounded-xl shadow-lg transition active:scale-95 text-xs flex items-center justify-center gap-2"
            >
              <span>Submit & Start Earning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
