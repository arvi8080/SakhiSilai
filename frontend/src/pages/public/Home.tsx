import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { filterAndRankTailors } from '../../utils/matching';
import {
  Scissors,
  MapPin,
  CheckCircle,
  ChevronRight,
  Search,
  Navigation,
  UserCheck,
  Sparkles,
  Quote
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  onSelectTailor: (tailorId: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, onSelectTailor, onSelectCategory }) => {
  const { tailors, selectedState, selectedDistrict, selectedVillage } = useData();
  const { lang } = useLanguage();

  const [searchVillageInput, setSearchVillageInput] = useState(`${selectedVillage}, ${selectedDistrict}`);
  const [howItWorksRole, setHowItWorksRole] = useState<'customer' | 'tailor'>('customer');

  const matchResults = filterAndRankTailors(tailors, {
    userState: selectedState,
    userDistrict: selectedDistrict,
    userVillage: selectedVillage
  });

  const popularServices = [
    { id: 'blouse', titleHi: 'ब्लाउज सिलाई', titleEn: 'Blouse Stitching', price: 300, icon: '👚', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80' },
    { id: 'suit', titleHi: 'सूट सिलाई', titleEn: 'Suit Stitching', price: 450, icon: '👗', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80' },
    { id: 'dress', titleHi: 'ड्रेस सिलाई', titleEn: 'Dress Stitching', price: 500, icon: '👘', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80' },
    { id: 'kids', titleHi: 'बच्चों के कपड़े', titleEn: 'Kids Clothing', price: 250, icon: '🧒', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80' },
    { id: 'alterations', titleHi: 'अल्टरेशन', titleEn: 'Alterations', price: 80, icon: '✂️', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80' },
    { id: 'custom', titleHi: 'कस्टम डिज़ाइन', titleEn: 'Custom Design', price: 600, icon: '🎨', img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="space-y-20 animate-fade-in pb-20">
      {/* HERO SECTION - TWO COLUMN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-pink-50 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#E91E63] border border-pink-200/60">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'hi' ? 'भारत का अपना हाइपरलोकल सिलाई प्लेटफ़ॉर्म' : "India's Own Hyperlocal Stitching Platform"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2A1B3D] leading-tight tracking-tight">
              {lang === 'hi' ? (
                <>
                  नज़दीक की कुशल टेलर,<br />
                  आपके लिए, <span className="text-[#E91E63]">आपके भरोसे की</span>
                </>
              ) : (
                <>
                  Skilled Home Tailors Nearby,<br />
                  <span className="text-[#E91E63]">Trusted & For You</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-medium leading-relaxed max-w-2xl">
              {lang === 'hi'
                ? 'SakhiSilai आपको आपके आस-पास उपलब्ध कुशल महिलाओं से जोड़ता है, जो घर बैठे सिलाई सेवाएं प्रदान करती हैं।'
                : 'SakhiSilai connects you with skilled women in your neighborhood providing home-based custom tailoring services.'}
            </p>

            {/* LOCATION SEARCH CARD */}
            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xl shadow-pink-900/5 space-y-3">
              <span className="text-xs font-extrabold text-[#2A1B3D] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#E91E63]" />
                <span>{lang === 'hi' ? 'अपना स्थान चुनें' : 'Select Your Location'}</span>
              </span>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchVillageInput}
                    onChange={e => setSearchVillageInput(e.target.value)}
                    placeholder={lang === 'hi' ? 'अपना गाँव / शहर दर्ज करें' : 'Enter your village or city'}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-10 py-3 text-xs font-bold text-[#2A1B3D] focus:ring-2 focus:ring-[#E91E63] focus:outline-none"
                  />
                  <Navigation className="w-4 h-4 text-[#E91E63] absolute right-3.5 top-3.5 cursor-pointer" />
                </div>

                <button
                  onClick={() => setActiveTab('find_tailors')}
                  className="px-6 py-3 bg-[#E91E63] hover:bg-[#D81B60] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'मेरे पास टेलर खोजें' : 'Find Tailors Near Me'}</span>
                </button>
              </div>
            </div>

            {/* TWO ACTION CARDS BELOW HERO SEARCH */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('auth')}
                className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-[#E91E63] shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E91E63] group-hover:bg-[#E91E63] group-hover:text-white transition flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#2A1B3D] group-hover:text-[#E91E63]">
                    {lang === 'hi' ? 'टेलर के रूप में जुड़ें' : 'Join as a Tailor'}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {lang === 'hi' ? 'घर बैठे कमाई शुरू करें' : 'Start earning from home'}
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('find_tailors')}
                className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-[#E91E63] shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition flex items-center justify-center">
                  <Scissors className="w-6 h-6 rotate-45" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#2A1B3D] group-hover:text-[#E91E63]">
                    {lang === 'hi' ? 'डिज़ाइन देखें' : 'Browse Designs'}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {lang === 'hi' ? 'डिज़ाइन और कीमतें देखें' : 'View catalogs & pricing'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - HERO IMAGE WITH BADGE */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
                alt="Indian woman tailor stitching at home"
                className="w-full h-[450px] lg:h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#2A1B3D]/40 via-transparent to-transparent"></div>

              {/* OVERLAY BADGE */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-pink-100 shadow-xl flex items-center gap-3.5 animate-float">
                <div className="w-12 h-12 rounded-xl bg-[#E91E63] text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  👩🧵
                </div>
                <div>
                  <h4 className="font-black text-sm text-[#2A1B3D]">
                    {lang === 'hi' ? '“हजारों महिलाएं घर बैठे कमा रही हैं”' : '“Thousands of women earning from home”'}
                  </h4>
                  <p className="text-[10px] text-stone-500 font-bold">100% Direct Payout • 0% Commission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING STATISTICS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xl shadow-pink-900/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-stone-100">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#E91E63] font-bold text-lg flex items-center justify-center mx-auto mb-1">
              👩🧵
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#2A1B3D]">15,000+</span>
            <span className="text-xs font-bold text-stone-500 block">{lang === 'hi' ? 'कुशल टेलर' : 'Skilled Tailors'}</span>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 font-bold text-lg flex items-center justify-center mx-auto mb-1">
              💼
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#2A1B3D]">50,000+</span>
            <span className="text-xs font-bold text-stone-500 block">{lang === 'hi' ? 'खुश ग्राहक' : 'Happy Customers'}</span>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 font-bold text-lg flex items-center justify-center mx-auto mb-1">
              🧵
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#2A1B3D]">1,20,000+</span>
            <span className="text-xs font-bold text-stone-500 block">{lang === 'hi' ? 'पूरे किए गए ऑर्डर' : 'Orders Completed'}</span>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 font-bold text-lg flex items-center justify-center mx-auto mb-1">
              ⭐
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#2A1B3D]">4.8/5</span>
            <span className="text-xs font-bold text-stone-500 block">{lang === 'hi' ? 'औसत रेटिंग' : 'Average Rating'}</span>
          </div>
        </div>
      </section>

      {/* WHY SAKHISILAI SECTION - 5 FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-[#2A1B3D]">
            {lang === 'hi' ? 'SakhiSilai क्यों चुनें?' : 'Why Choose SakhiSilai?'}
          </h2>
          <div className="w-16 h-1 bg-[#E91E63] rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-[#E91E63] transition text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-2xl flex items-center justify-center mx-auto">
              🏠
            </div>
            <h3 className="font-extrabold text-sm text-[#2A1B3D]">{lang === 'hi' ? 'घर बैठे कमाई' : 'Earn from Home'}</h3>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {lang === 'hi' ? 'अपनी सुविधा के अनुसार काम करें और अतिरिक्त कमाई करें।' : 'Work according to your flexibility and earn independently.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-[#E91E63] transition text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-2xl flex items-center justify-center mx-auto">
              🛡️
            </div>
            <h3 className="font-extrabold text-sm text-[#2A1B3D]">{lang === 'hi' ? 'भरोसेमंद और सुरक्षित' : 'Trusted & Verified'}</h3>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {lang === 'hi' ? 'आपके आस-पास की सत्यापित टेलर सेवाएं।' : 'Verified tailoring services from women near your home.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-[#E91E63] transition text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-2xl flex items-center justify-center mx-auto">
              ₹
            </div>
            <h3 className="font-extrabold text-sm text-[#2A1B3D]">{lang === 'hi' ? 'अपनी कीमत, आपका निर्णय' : 'Your Price, Your Choice'}</h3>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {lang === 'hi' ? 'अपनी सेवाएं और कीमतें खुद तय करें।' : 'Set your own stitching rates and service offerings.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-[#E91E63] transition text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-2xl flex items-center justify-center mx-auto">
              🕒
            </div>
            <h3 className="font-extrabold text-sm text-[#2A1B3D]">{lang === 'hi' ? 'लचीला समय' : 'Flexible Hours'}</h3>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {lang === 'hi' ? 'जब चाहें उपलब्ध रहें, जब चाहें काम करें।' : 'Set your availability status whenever you wish to work.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-[#E91E63] transition text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-purple-50 text-2xl flex items-center justify-center mx-auto">
              👩🧵
            </div>
            <h3 className="font-extrabold text-sm text-[#2A1B3D]">{lang === 'hi' ? 'महिला सशक्तिकरण' : 'Women Empowerment'}</h3>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {lang === 'hi' ? 'हुनर को पहचान, सम्मान और आत्मनिर्भरता।' : 'Recognition, respect, and financial independence for skills.'}
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-black text-[#2A1B3D]">{lang === 'hi' ? 'कैसे काम करता है?' : 'How It Works?'}</h2>
          <div className="inline-flex bg-stone-200 p-1 rounded-full border border-stone-300">
            <button
              onClick={() => setHowItWorksRole('customer')}
              className={`px-5 py-2 rounded-full font-extrabold text-xs transition ${
                howItWorksRole === 'customer' ? 'bg-[#E91E63] text-white shadow' : 'text-stone-700'
              }`}
            >
              {lang === 'hi' ? 'ग्राहकों के लिए' : 'For Customers'}
            </button>
            <button
              onClick={() => setHowItWorksRole('tailor')}
              className={`px-5 py-2 rounded-full font-extrabold text-xs transition ${
                howItWorksRole === 'tailor' ? 'bg-[#1B4D3E] text-white shadow' : 'text-stone-700'
              }`}
            >
              {lang === 'hi' ? 'दर्जी बहनों के लिए' : 'For Women Tailors'}
            </button>
          </div>
        </div>

        {howItWorksRole === 'customer' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { num: '1', title: lang === 'hi' ? 'स्थान चुनें' : 'Select Location', desc: lang === 'hi' ? 'गाँव या शहर चुनें' : 'Choose village or town' },
              { num: '2', title: lang === 'hi' ? 'टेलर खोजें' : 'Find Tailor', desc: lang === 'hi' ? 'आस-पास टेलर देखें' : 'View nearby tailors' },
              { num: '3', title: lang === 'hi' ? 'डिज़ाइन चुनें' : 'Choose Design', desc: lang === 'hi' ? 'सेवा व दर चुनें' : 'Select style & rate' },
              { num: '4', title: lang === 'hi' ? 'ऑर्डर दें' : 'Place Order', desc: lang === 'hi' ? 'माप व विवरण दर्ज करें' : 'Enter size & details' },
              { num: '5', title: lang === 'hi' ? 'कपड़ा दें' : 'Handover Fabric', desc: lang === 'hi' ? 'टेलर को कपड़ा दें' : 'Drop fabric to tailor' },
              { num: '6', title: lang === 'hi' ? 'ट्रैक करें' : 'Live Tracking', desc: lang === 'hi' ? 'लाइव अपडेट देखें' : 'Track stitching progress' }
            ].map(step => (
              <div key={step.num} className="bg-white p-4 rounded-2xl border border-stone-200 text-center space-y-2 shadow-sm">
                <span className="w-8 h-8 rounded-full bg-pink-100 text-[#E91E63] font-black text-xs flex items-center justify-center mx-auto">
                  {step.num}
                </span>
                <h4 className="font-extrabold text-xs text-[#2A1B3D]">{step.title}</h4>
                <p className="text-[10px] text-stone-500">{step.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { num: '1', title: lang === 'hi' ? 'जुड़ें' : 'Sign Up', desc: lang === 'hi' ? 'निःशुल्क पंजीकरण करें' : 'Free registration' },
              { num: '2', title: lang === 'hi' ? 'सेवाएं जोड़ें' : 'Add Services', desc: lang === 'hi' ? 'सिलाई प्रकार चुनें' : 'Select stitching types' },
              { num: '3', title: lang === 'hi' ? 'कीमत तय करें' : 'Set Rates', desc: lang === 'hi' ? 'अपनी दर खुद चुनें' : 'Choose your prices' },
              { num: '4', title: lang === 'hi' ? 'उपलब्धता सेट करें' : 'Set Capacity', desc: lang === 'hi' ? 'काम की सीमा चुनें' : 'Manage active order limit' },
              { num: '5', title: lang === 'hi' ? 'ऑर्डर पाएं' : 'Get Orders', desc: lang === 'hi' ? 'पास के ऑर्डर स्वीकारें' : 'Accept nearby requests' },
              { num: '6', title: lang === 'hi' ? 'कमाई करें' : 'Earn 100%', desc: lang === 'hi' ? '100% कमाई प्राप्त करें' : 'Receive direct payout' }
            ].map(step => (
              <div key={step.num} className="bg-white p-4 rounded-2xl border border-stone-200 text-center space-y-2 shadow-sm">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center mx-auto">
                  {step.num}
                </span>
                <h4 className="font-extrabold text-xs text-[#2A1B3D]">{step.title}</h4>
                <p className="text-[10px] text-stone-500">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NEARBY TAILORS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#2A1B3D]">{lang === 'hi' ? 'आपके आस-पास की कुशल टेलर' : 'Skilled Tailors Near You'}</h2>
            <p className="text-xs text-stone-500">
              {lang === 'hi' ? 'आपके गाँव और निकटतम क्षेत्र की सत्यापित दर्जियाँ' : 'Verified tailors in your village & nearby local area'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('find_tailors')}
            className="text-xs font-bold text-[#E91E63] hover:underline flex items-center gap-1"
          >
            <span>{lang === 'hi' ? 'सभी आस-पास की टेलर देखें' : 'View All Nearby Tailors'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {matchResults.slice(0, 3).map(res => {
            const tProfile = res.tailor;
            return (
              <div key={tProfile.id} className="bg-white rounded-3xl border border-stone-200 shadow-md hover:shadow-xl transition overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img src={tProfile.avatar} alt={tProfile.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>{tProfile.village}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-extrabold text-base drop-shadow">{tProfile.name}</h3>
                      <p className="text-xs text-stone-200">📍 {res.distanceKmApprox} km {lang === 'hi' ? 'दूर' : 'away'} • ⭐ {tProfile.rating}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <p className="text-stone-600 font-semibold">{lang === 'hi' ? 'ब्लाउज | सूट | ड्रेस सिलाई' : 'Blouse | Suit | Dress Stitching'}</p>
                    <span className="inline-block bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2 py-0.5 rounded">
                      🟢 {lang === 'hi' ? 'उपलब्ध' : 'Available'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-stone-400 font-bold block">{lang === 'hi' ? 'शुरुआती कीमत' : 'Starting Price'}</span>
                    <span className="font-extrabold text-base text-[#E91E63]">₹{tProfile.startingPrice} {lang === 'hi' ? 'से शुरू' : 'onwards'}</span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTailor(tProfile.id);
                      setActiveTab('tailor_profile');
                    }}
                    className="px-4 py-2 bg-[#E91E63] hover:bg-[#D81B60] text-white text-xs font-extrabold rounded-xl shadow transition"
                  >
                    {lang === 'hi' ? 'प्रोफाइल देखें' : 'View Profile'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl font-black text-[#2A1B3D]">{lang === 'hi' ? 'लोकप्रिय सिलाई सेवाएं' : 'Popular Stitching Services'}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularServices.map(svc => (
            <div
              key={svc.id}
              onClick={() => {
                onSelectCategory(svc.id);
                setActiveTab('find_tailors');
              }}
              className="bg-white rounded-3xl border border-stone-200 hover:border-[#E91E63] overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer text-center group space-y-2 pb-3"
            >
              <img src={svc.img} alt={svc.titleHi} className="w-full h-28 object-cover group-hover:scale-105 transition" />
              <div className="px-2">
                <span className="text-lg">{svc.icon}</span>
                <h4 className="font-extrabold text-xs text-[#2A1B3D] group-hover:text-[#E91E63] transition">
                  {lang === 'hi' ? svc.titleHi : svc.titleEn}
                </h4>
                <p className="text-[10px] text-stone-500 mt-0.5">₹{svc.price} {lang === 'hi' ? 'से शुरू' : 'onwards'}</p>
                <button className="mt-1 px-3 py-1 bg-pink-50 text-[#E91E63] font-bold text-[10px] rounded-lg group-hover:bg-[#E91E63] group-hover:text-white transition">
                  {lang === 'hi' ? 'एक्सप्लोर करें' : 'Explore'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WOMEN EMPOWERMENT SECTION - EMOTIONAL SPLIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2A1B3D] via-[#372A45] to-[#1F162B] text-white rounded-3xl p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
            alt="Women Empowerment Stitching"
            className="w-full h-80 object-cover rounded-2xl border-2 border-white/20 shadow-lg"
          />

          <div className="space-y-4">
            <span className="bg-[#E91E63] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {lang === 'hi' ? 'महिला सशक्तिकरण' : 'Women Empowerment'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-300">
              {lang === 'hi' ? '“आपका हुनर, आपकी पहचान, आपकी कमाई।”' : '“Your Skill, Your Identity, Your Earnings.”'}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {lang === 'hi'
                ? 'बहुत सी महिलाएं सिलाई जानती हैं, लेकिन परिवार और घर की जिम्मेदारियों के कारण बाहर जाकर काम नहीं कर सकतीं। SakhiSilai उन्हें घर बैठे अपने हुनर से कमाई करने का अवसर देता है।'
                : 'Many skilled women know stitching but cannot leave home due to family responsibilities. SakhiSilai empowers them to earn independently from home.'}
            </p>

            <button
              onClick={() => setActiveTab('auth')}
              className="px-6 py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{lang === 'hi' ? 'टेलर के रूप में जुड़ें' : 'Join as a Tailor'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* CUSTOMER TRUST SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-[#2A1B3D]">
            {lang === 'hi' ? '“भरोसा, जो आपके अपने लोगों से शुरू होता है”' : '“Trust That Starts With Your Own People”'}
          </h2>
          <p className="text-xs text-stone-500">
            {lang === 'hi'
              ? 'सखीसिलाई हमेशा आपके अपने गाँव व पास की दर्जियों को प्राथमिकता देता है।'
              : 'SakhiSilai prioritizes nearby and same-village tailors whenever possible because local trust matters.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-2xl">📍</span>
            <h4 className="font-bold text-xs text-[#2A1B3D]">{lang === 'hi' ? 'गाँव की पहली प्राथमिकता' : 'Same Village Priority'}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-2xl">🛡️</span>
            <h4 className="font-bold text-xs text-[#2A1B3D]">{lang === 'hi' ? 'सत्यापित दर्जी बहनें' : 'Verified Tailors'}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-2xl">⭐</span>
            <h4 className="font-bold text-xs text-[#2A1B3D]">{lang === 'hi' ? 'रेटिंग और समीक्षाएं' : 'Ratings & Reviews'}</h4>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-2xl">📦</span>
            <h4 className="font-bold text-xs text-[#2A1B3D]">{lang === 'hi' ? 'कपड़ा हैंडओवर सुविधा' : 'Flexible Fabric Handover'}</h4>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl font-black text-[#2A1B3D] text-center">
          {lang === 'hi' ? 'ग्राहकों और दर्जी बहनों के अनुभव' : 'Testimonials & Stories'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative">
            <Quote className="w-8 h-8 text-pink-200 absolute top-4 right-4" />
            <p className="text-xs text-stone-700 italic leading-relaxed">
              {lang === 'hi'
                ? '“पहले मैं सिर्फ अपने परिवार के लिए सिलाई करती थी। अब मैं घर संभालते हुए अपनी कमाई भी कर रही हूं।”'
                : '“Earlier I only stitched for my family. Now I earn independently from home while managing my household.”'}
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Sunita" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-xs text-[#2A1B3D]">Sunita</h4>
                <span className="text-[10px] text-stone-400 font-bold">Tailor, Lucknow</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative">
            <Quote className="w-8 h-8 text-pink-200 absolute top-4 right-4" />
            <p className="text-xs text-stone-700 italic leading-relaxed">
              {lang === 'hi'
                ? '“अब अच्छे टेलर को ढूंढने के लिए दूर जाने की जरूरत नहीं पड़ती।”'
                : '“No more travelling far away just to get clothes stitched by a reliable tailor.”'}
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Pooja" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-xs text-[#2A1B3D]">Pooja</h4>
                <span className="text-[10px] text-stone-400 font-bold">Customer, Mohanlalganj</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#E91E63] via-[#D81B60] to-[#2A1B3D] text-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-black">
            {lang === 'hi' ? 'आज ही SakhiSilai से जुड़ें' : 'Join SakhiSilai Today'}
          </h2>
          <p className="text-stone-200 text-xs sm:text-sm max-w-xl mx-auto">
            {lang === 'hi'
              ? 'अपने हुनर को कमाई में बदलें या अपने आस-पास एक भरोसेमंद कुशल टेलर खोजें।'
              : 'Turn your sewing skill into income or find a trusted home tailor near you.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('auth')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#E91E63] font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>👩🧵 {lang === 'hi' ? 'टेलर के रूप में जुड़ें' : 'Join as a Tailor'}</span>
            </button>

            <button
              onClick={() => setActiveTab('find_tailors')}
              className="w-full sm:w-auto px-8 py-3.5 bg-black/30 hover:bg-black/40 text-white font-extrabold text-xs rounded-xl border border-white/30 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>📍 {lang === 'hi' ? 'टेलर खोजें' : 'Find Tailors'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
