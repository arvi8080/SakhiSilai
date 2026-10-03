import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, CheckCircle, MapPin, Scissors, ShieldCheck, Sparkles, Users } from 'lucide-react';

interface HowItWorksPageProps {
  setActiveTab: (tab: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ setActiveTab }) => {
  const { lang } = useLanguage();
  const [activeRoleTab, setActiveRoleTab] = useState<'customer' | 'tailor'>('customer');

  const customerSteps = [
    {
      number: '1',
      title: lang === 'hi' ? 'गाँव चुनें' : 'Choose your village',
      text: lang === 'hi'
        ? 'अपना गाँव चुनें और पास के सत्यापित दर्जी देखें।'
        : 'Pick your village and browse trusted home tailors nearby.'
    },
    {
      number: '2',
      title: lang === 'hi' ? 'ऑर्डर भेजें' : 'Send request',
      text: lang === 'hi'
        ? 'आकृति, माप और डिज़ाइन चुनकर अनुरोध भेजें।'
        : 'Share your style, fabric requirement, and delivery preference.'
    },
    {
      number: '3',
      title: lang === 'hi' ? 'मिलन की पुष्टि' : 'Confirm visit',
      text: lang === 'hi'
        ? 'दर्जी द्वारा स्वीकार करने पर पता और समय खुल जाएगा।'
        : 'Once accepted, your tailor shares the address and visit time.'
    },
    {
      number: '4',
      title: lang === 'hi' ? 'सिलाई और संग्रह' : 'Stitch and collect',
      text: lang === 'hi'
        ? 'कपड़ा देकर माप लें और सिलाई के बाद अपने चुने हुए कपड़े लेकर जाएँ।'
        : 'Drop off fabric, get measurements, and collect the finished outfit.'
    }
  ];

  const tailorSteps = [
    {
      number: '1',
      title: lang === 'hi' ? 'घर से काम शुरू करें' : 'Work from home',
      text: lang === 'hi'
        ? 'अपने घर से सिलाई करें और अपने गाँव के ग्राहकों से जुड़ें।'
        : 'Stitch from home and serve customers in your own village.'
    },
    {
      number: '2',
      title: lang === 'hi' ? 'ऑर्डर स्वीकार करें' : 'Accept bookings',
      text: lang === 'hi'
        ? 'अनुरोध को देखें, माप और समय की पुष्टि करें।'
        : 'Review requests and confirm visit details with the customer.'
    },
    {
      number: '3',
      title: lang === 'hi' ? 'सीधा भुगतान' : 'Direct earning',
      text: lang === 'hi'
        ? 'संपूर्ण भुगतान सीधे ग्राहक से प्राप्त करें।'
        : 'Receive honest, direct payment from the customer after handover.'
    }
  ];

  return (
    <div className="mx-auto max-w-6xl animate-fade-in space-y-12 px-4 pb-16 sm:px-6">
      <section className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F5D6E5] bg-[#FFF8FB] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#D43A72]">
          <Sparkles className="h-3.5 w-3.5" />
          Hyperlocal Village Tailor Platform
        </div>

        <h1 className="mt-5 text-4xl font-black leading-tight text-[#2A1B3D] sm:text-5xl">
          {lang === 'hi' ? 'सखीसिलाई कैसे काम करती है?' : 'How SakhiSilai works'}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">
          “Ghar Se Hunar, Apni Kamai” — {lang === 'hi'
            ? 'दर्जी घर पर रहती है, ग्राहक उसी गाँव में उसके घर तक जाता है।'
            : 'The tailor stays at home, and the customer visits her nearby home in the same village.'}
        </p>

        <div className="mt-6 inline-flex rounded-full border border-stone-200 bg-stone-100 p-1.5 shadow-inner">
          <button
            onClick={() => setActiveRoleTab('customer')}
            className={`rounded-full px-5 py-2.5 text-xs font-extrabold transition sm:px-7 ${
              activeRoleTab === 'customer'
                ? 'bg-[#E91E63] text-white shadow-lg shadow-pink-500/20'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            {lang === 'hi' ? 'ग्राहक के लिए' : 'For customers'}
          </button>
          <button
            onClick={() => setActiveRoleTab('tailor')}
            className={`rounded-full px-5 py-2.5 text-xs font-extrabold transition sm:px-7 ${
              activeRoleTab === 'tailor'
                ? 'bg-[#1B4D3E] text-white shadow-lg shadow-emerald-900/20'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            {lang === 'hi' ? 'दर्जी बहन के लिए' : 'For home tailors'}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-[#E8DDE5] bg-[linear-gradient(135deg,#1f1628_0%,#2d1d35_45%,#1a1a1a_100%)] p-6 text-white shadow-[0_24px_70px_rgba(42,27,61,0.12)] sm:p-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F8C74D] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-stone-900">
            <MapPin className="h-3.5 w-3.5" />
            {lang === 'hi' ? 'समान गाँव की प्रक्रिया' : 'Same-village home tailor process'}
          </div>

          <h2 className="mt-4 text-2xl font-black text-[#F7D565] sm:text-3xl">
            {lang === 'hi' ? '4 आसान कदम' : 'A simple 4-step flow'}
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {customerSteps.map((step) => (
            <div key={step.number} className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F871A7] to-[#E91E63] text-lg font-black text-white shadow-lg">
                {step.number}
              </div>
              <h3 className="mt-4 text-base font-extrabold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-300">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {activeRoleTab === 'customer' && (
        <section className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {customerSteps.map((step) => (
              <div key={step.number} className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_14px_24px_rgba(42,27,61,0.04)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F6] text-xl font-black text-[#D43A72]">
                  {step.number}
                </div>
                <h3 className="text-lg font-extrabold text-[#2A1B3D]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveTab('find_tailors')}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#E91E63] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_32px_rgba(233,30,99,0.22)] transition hover:bg-[#D81B60]"
            >
              <span>{lang === 'hi' ? 'पास की दर्जी देखें' : 'Find nearby tailor now'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {activeRoleTab === 'tailor' && (
        <section className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            {tailorSteps.map((step) => (
              <div key={step.number} className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_14px_24px_rgba(42,27,61,0.04)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2F8F6] text-xl font-black text-[#1B4D3E]">
                  {step.number}
                </div>
                <h3 className="text-lg font-extrabold text-[#2A1B3D]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveTab('become_tailor')}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1B4D3E] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_32px_rgba(27,77,62,0.2)] transition hover:bg-[#133A2E]"
            >
              <Scissors className="h-4 w-4 rotate-45 text-amber-300" />
              <span>{lang === 'hi' ? 'दर्जी बनें' : 'Become a home tailor'}</span>
            </button>
          </div>
        </section>
      )}

      <section className="rounded-[30px] border border-stone-200 bg-[#F7F5F0] p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: lang === 'hi' ? 'स्थानिक भरोसा' : 'Local trust',
              text: lang === 'hi'
                ? 'आपके गाँव की दर्जियों को आसानी से ढूँढें और भरोसा करें।'
                : 'Find trusted local tailors you can easily meet in your village.'
            },
            {
              icon: ShieldCheck,
              title: lang === 'hi' ? 'सत्यापित सेवाएँ' : 'Verified service',
              text: lang === 'hi'
                ? 'सत्यापन और रेटिंग के साथ सुरक्षित अनुभव।'
                : 'Verified profiles and reviews make every order more reliable.'
            },
            {
              icon: CheckCircle,
              title: lang === 'hi' ? 'सीधा भुगतान' : 'Simple payment',
              text: lang === 'hi'
                ? 'सिलाई के बाद सीधा भुगतान और स्पष्ट प्रक्रिया।'
                : 'Clear order flow and direct payment after completion.'
            }
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[24px] border border-stone-200 bg-white p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECF3] text-[#D43A72]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#2A1B3D]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
