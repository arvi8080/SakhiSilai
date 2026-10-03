import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, Heart, ShieldCheck, MapPin, Phone, ArrowRight, CheckCircle } from 'lucide-react';

interface FooterProps {
  setActiveTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { lang, t } = useLanguage();

  const quickLinks = [
    { key: 'find_tailors', label: lang === 'hi' ? 'पास के दर्जी देखें' : 'Find Tailors' },
    { key: 'custom_request', label: lang === 'hi' ? 'कस्टम डिजाइन' : 'Custom Design' },
    { key: 'how_it_works', label: lang === 'hi' ? 'कैसे काम करता है' : 'How It Works' },
    { key: 'about', label: lang === 'hi' ? 'हमारे बारे में' : 'About Us' },
  ];

  return (
    <footer className="mt-20 border-t border-[#F2D6E1] bg-[#FFF5F8] text-stone-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab('home')}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E91E63] to-[#FF5B8E] text-white shadow-lg shadow-pink-500/20">
                <Scissors className="h-5 w-5 rotate-45" />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-[#2A1B3D]">
                  Sakhi<span className="text-[#F48FB1]">Silai</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D43A72]">
                  {lang === 'hi' ? 'गृह सेवा' : 'Home Tailoring'}
                </div>
              </div>
            </button>

            <p className="text-sm font-medium italic text-amber-300">
              “{t('tagline')}”
            </p>

            <p className="text-sm leading-6 text-stone-600">
              {lang === 'hi'
                ? 'अपने घर के पास की सहेलियों और दर्जियों को खोजें, ऑर्डर करें और भरोसेमंद सिलाई सेवाओं का अनुभव लें।'
                : 'Discover trusted local tailors, book your order, and support skilled women artisans working close to home.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#2A1B3D]">
              {lang === 'hi' ? 'मुख्य लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-3 text-sm text-stone-600">
              {quickLinks.map(({ key, label }) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab(key)}
                    className="flex items-center gap-2 transition hover:text-[#F48FB1]"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-pink-300" />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab && setActiveTab('become_tailor')}
                  className="flex items-center gap-2 text-amber-300 transition hover:text-amber-200"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-amber-300" />
                  <span>{lang === 'hi' ? 'दर्जी बनें' : 'Become a Tailor'}</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#2A1B3D]">
              {lang === 'hi' ? 'हमारा भरोसा' : 'Why Us'}
            </h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'दर्जी बहनों को सीधे भुगतान' : 'Direct payouts to skilled tailors'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="mt-0.5 h-4 w-4 text-pink-400" />
                <span>{lang === 'hi' ? 'महिला सशक्तिकरण और आत्मनिर्भरता' : 'Women empowerment and livelihood'}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-400" />
                <span>{lang === 'hi' ? 'अपने गाँव की सुविधाएं और भरोसा' : 'Local trust with nearby support'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#2A1B3D]">
              {lang === 'hi' ? 'सहायता' : 'Support'}
            </h4>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-stone-600">
                {lang === 'hi'
                  ? 'बुकिंग, भुगतान या प्रोफाइल पंजीकरण में मदद चाहिए?'
                  : 'Need help with booking, payments, or profile registration?'}
              </p>

              <a
                href="tel:1800999000"
                className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-[#2A1B3D] transition hover:border-[#D43A72] hover:bg-[#FFF1F6]"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>Toll Free: 1800-SAKHI-SILAI</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-stone-500">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};
