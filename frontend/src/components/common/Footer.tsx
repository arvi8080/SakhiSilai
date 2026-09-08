import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, Heart, ShieldCheck, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  setActiveTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#1F162B] text-stone-300 pt-12 pb-8 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab && setActiveTab('home')}>
              <div className="w-8 h-8 rounded-lg bg-[#E91E63] flex items-center justify-center text-white">
                <Scissors className="w-4 h-4 rotate-45" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Sakhi<span className="text-[#E91E63]">Silai</span>
              </span>
            </div>
            <p className="text-amber-300 text-xs font-bold italic">
              "{t('tagline')}"
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              {lang === 'hi'
                ? 'अपने घर के पास की हुनरमंद महिलाओं से कपड़े सिलवाएं और उन्हें घर बैठे आत्मनिर्भर बनाएं।'
                : 'Empowering skilled rural women to earn independently from home while connecting customers with trusted nearby tailors.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">
              {lang === 'hi' ? 'मुख्य लिंक' : 'Platform Links'}
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => setActiveTab && setActiveTab('find_tailors')} className="hover:text-[#E91E63] transition text-left">
                  {lang === 'hi' ? 'पास की दर्जियां खोजें' : 'Find Nearby Tailors'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab && setActiveTab('custom_request')} className="hover:text-[#E91E63] transition text-left">
                  {lang === 'hi' ? 'कस्टम डिज़ाइन अपलोड करें' : 'Upload Custom Design'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab && setActiveTab('how_it_works')} className="hover:text-[#E91E63] transition text-left">
                  {lang === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab && setActiveTab('become_tailor')} className="hover:text-[#E91E63] transition text-left text-amber-300 font-extrabold">
                  👩🧵 {lang === 'hi' ? 'दर्जी के रूप में जुड़ें / दर्जी बनें' : 'Join / Become a Tailor'}
                </button>
              </li>
            </ul>
          </div>

          {/* Core Values */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">
              {lang === 'hi' ? 'हमारा भरोसा' : 'Our Trust Promise'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'दर्जी बहनों को 100% कमाई' : '100% Direct Payout to Tailors'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-stone-300">
                <Heart className="w-4 h-4 text-[#E91E63]" />
                <span>{lang === 'hi' ? 'महिला सशक्तिकरण व आत्मनिर्भरता' : 'Women Empowerment'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'आपके अपने गाँव की प्राथमिकता' : 'Same Village Priority'}</span>
              </li>
            </ul>
          </div>

          {/* Helpline & Support */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">
              {lang === 'hi' ? 'सखी सहायता केंद्र' : 'Sakhi Helpline'}
            </h4>
            <p className="text-xs text-stone-400 mb-2">
              {lang === 'hi' ? 'सिलाई बुकिंग या दुकान पंजीकरण में सहायता चाहिए?' : 'Need help booking or registering your tailoring profile?'}
            </p>
            <a
              href="tel:1800999000"
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-700 transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Toll Free: 1800-SAKHI-SILAI</span>
            </a>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};
