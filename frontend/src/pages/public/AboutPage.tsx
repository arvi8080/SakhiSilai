import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Heart,
  ShieldCheck,
  MapPin,
  Sparkles,
  Award,
  Scissors,
  UserCheck
} from 'lucide-react';

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in pb-16 pt-4">
      {/* HERO / MISSION BANNER */}
      <div className="bg-gradient-to-r from-[#2A1B3D] via-[#372A45] to-[#1F162B] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-pink-900/30 space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#E91E63]/20 text-pink-300 px-3.5 py-1 rounded-full text-xs font-extrabold border border-pink-500/30">
          <Sparkles className="w-4 h-4 text-[#E91E63]" />
          <span>{lang === 'hi' ? 'सखीसिलाई के बारे में' : 'About SakhiSilai'}</span>
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-amber-300 leading-tight">
            “{t('tagline')}”
          </h1>
          <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
            {lang === 'hi'
              ? 'भारत के ग्रामीण क्षेत्रों और छोटे कस्बों में लाखों ऐसी हुनरमंद महिलाएं हैं, जिन्हें बेहतरीन सिलाई (ब्लाउज, सूट, ड्रेस, बच्चों के कपड़े) आती है। SakhiSilai का लक्ष्य इन दर्जी बहनों को सीधे उनके गाँव के ग्राहकों से जोड़ना है ताकि वे घर संभालने के साथ अपनी खुद की कमाई कर सकें।'
              : 'Millions of skilled women in Indian villages and small towns possess incredible tailoring talents. SakhiSilai connects them directly with nearby customers, allowing them to earn financial independence from home while managing family responsibilities.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={() => setActiveTab('auth')}
            className="px-6 py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{lang === 'hi' ? 'दर्जी के रूप में जुड़ें' : 'Join as a Tailor'}</span>
          </button>
          <button
            onClick={() => setActiveTab('find_tailors')}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl border border-white/20 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Scissors className="w-4 h-4 rotate-45" />
            <span>{lang === 'hi' ? 'आस-पास दर्जी खोजें' : 'Find Nearby Tailors'}</span>
          </button>
        </div>
      </div>

      {/* OUR 4 PILLARS */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-[#2A1B3D]">
            {lang === 'hi' ? 'सखीसिलाई के 4 मुख्य स्तंभ' : 'Our 4 Foundational Pillars'}
          </h2>
          <p className="text-xs text-stone-500">
            {lang === 'hi' ? 'ग्रामीण भारत की बहनों को आत्मनिर्भर बनाने का संकल्प' : 'Building trust and economic freedom for rural women artisans'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E91E63] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#2A1B3D]">
              {lang === 'hi' ? 'महिला सशक्तिकरण' : 'Women Empowerment'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'दर्जी बहनें स्वयं की उद्यमी हैं। वे अपनी दरें, काम के घंटे और सिलाई के प्रकार खुद तय करती हैं।'
                : 'Tailors operate as independent entrepreneurs, deciding their own rates, working hours, and workload.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#2A1B3D]">
              {lang === 'hi' ? '100% सीधी कमाई' : '100% Direct Payout'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'सखीसिलाई दर्जियों से 0% कमीशन लेता है। ग्राहक द्वारा दी गई सिलाई का पूरा 100% पैसा दर्जी बहन को मिलता है।'
                : 'SakhiSilai charges ZERO commission from tailors. 100% of the stitching fee goes straight to the tailor.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#2A1B3D]">
              {lang === 'hi' ? 'गाँव की पहली प्राथमिकता' : 'Same Village Priority'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'ग्राहक को सबसे पहले उसी के गाँव की दर्जी दिखाई जाती है, जिससे आपसी भरोसा और सुरक्षा बनी रहती है।'
                : 'Prioritizing same-village tailors ensures high trust, easy fabric handover, and localized convenience.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#2A1B3D]">
              {lang === 'hi' ? 'गुणवत्ता व भरोसा' : 'Quality & Verification'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === 'hi'
                ? 'सभी दर्जी बहनों का एडमिन द्वारा सत्यापन (Verification) किया जाता है ताकि ग्राहकों को उच्च गुणवत्ता मिले।'
                : 'All tailors undergo admin verification and rating reviews to ensure top-notch stitching quality.'}
            </p>
          </div>
        </div>
      </div>

      {/* IMPACT NUMBERS */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <span className="text-3xl sm:text-4xl font-black text-pink-400">15,000+</span>
          <span className="text-xs font-bold text-stone-400 block mt-1">
            {lang === 'hi' ? 'पंजीकृत दर्जी बहनें' : 'Registered Women Tailors'}
          </span>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-black text-amber-400">50,000+</span>
          <span className="text-xs font-bold text-stone-400 block mt-1">
            {lang === 'hi' ? 'संतुष्ट ग्राहक' : 'Happy Customers'}
          </span>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-black text-emerald-400">1,20,000+</span>
          <span className="text-xs font-bold text-stone-400 block mt-1">
            {lang === 'hi' ? 'पूरे किए गए ऑर्डर' : 'Stitching Orders Completed'}
          </span>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-black text-purple-400">800+</span>
          <span className="text-xs font-bold text-stone-400 block mt-1">
            {lang === 'hi' ? 'शामिल गाँव व क्षेत्र' : 'Villages Covered'}
          </span>
        </div>
      </div>
    </div>
  );
};
