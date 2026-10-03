import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Heart, MapPin, Scissors, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  const { lang, t } = useLanguage();
  const benefits = [
    {
      icon: Heart,
      title: lang === 'hi' ? 'महिलाओं का हुनर, उनकी कमाई' : 'Women-led work',
      description: lang === 'hi'
        ? 'दर्जी अपने घर से काम करती हैं और अपने काम व समय पर नियंत्रण रखती हैं।'
        : 'Home tailors choose the work they take on and build income around their schedule.',
      iconClass: 'bg-[#FFF1F6] text-[#D43A72]'
    },
    {
      icon: MapPin,
      title: lang === 'hi' ? 'आपके गाँव के पास' : 'Close to home',
      description: lang === 'hi'
        ? 'अपने गाँव की दर्जी खोजें और कपड़ा देने या माप लेने के लिए आसानी से मिलें।'
        : 'Find a tailor nearby and meet in person for measurements and fabric handover.',
      iconClass: 'bg-[#F2F8F6] text-[#1B4D3E]'
    },
    {
      icon: ShieldCheck,
      title: lang === 'hi' ? 'भरोसे के साथ बुक करें' : 'Book with confidence',
      description: lang === 'hi'
        ? 'प्रोफ़ाइल और उपलब्ध जानकारी देखकर अपनी ज़रूरत के अनुसार दर्जी चुनें।'
        : 'Compare tailor profiles and service details to choose the right fit for your order.',
      iconClass: 'bg-[#FFF7E4] text-[#9A6A00]'
    }
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-4 animate-fade-in sm:px-6">
      <section className="grid overflow-hidden rounded-[32px] border border-[#F2D6E1] bg-[#FFF5F8] shadow-[0_20px_60px_rgba(42,27,61,0.07)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col items-start justify-center p-6 sm:p-10 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F7C0D8] bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D43A72]">
            <Sparkles className="h-3.5 w-3.5" />
            {lang === 'hi' ? 'हमारा उद्देश्य' : 'Our purpose'}
          </div>

          <h1 className="mt-5 text-4xl font-black leading-tight text-[#2A1B3D] sm:text-5xl">
            “{t('tagline')}”
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
            {lang === 'hi'
              ? 'SakhiSilai गाँव और छोटे शहरों की महिलाओं को उनके हुनर से जोड़ता है। ग्राहक अपने पास की दर्जी खोज सकते हैं और दर्जी घर से अपना काम आगे बढ़ा सकती हैं।'
              : 'SakhiSilai brings local customers and skilled home tailors together. Customers can find stitching nearby, while women grow their craft and work from home.'}
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => setActiveTab('find_tailors')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#1B4D3E] px-5 text-sm font-extrabold text-white transition hover:bg-[#133A2E]"
            >
              <Scissors className="h-4 w-4" />
              {lang === 'hi' ? 'पास की दर्जी खोजें' : 'Find a nearby tailor'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('become_tailor')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#E8CAD7] bg-white px-5 text-sm font-extrabold text-[#2A1B3D] transition hover:border-[#D43A72] hover:text-[#D43A72]"
            >
              <UserCheck className="h-4 w-4" />
              {lang === 'hi' ? 'दर्जी के रूप में जुड़ें' : 'Join as a tailor'}
            </button>
          </div>
        </div>

        <div className="relative min-h-64 md:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=85"
            alt={lang === 'hi' ? 'भारतीय फैशन और स्थानीय सिलाई का वास्तविक दृश्य' : 'Real Indian fashion and local tailoring scene'}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B3D]/45 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:to-[#FFF5F8]/10" />
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-xs font-bold text-[#2A1B3D] shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6">
            <Heart className="h-4 w-4 text-[#D43A72]" />
            {lang === 'hi' ? 'स्थानीय हुनर, स्थानीय भरोसा' : 'Local craft, local connection'}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D43A72]">
            {lang === 'hi' ? 'सखीसिलाई क्यों?' : 'Why SakhiSilai'}
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#2A1B3D] sm:text-3xl">
            {lang === 'hi' ? 'सिलाई का काम, आसान और पास' : 'Good tailoring, closer to home'}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description, iconClass }) => (
            <article key={title} className="rounded-[24px] border border-stone-200 bg-white p-5 sm:p-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-[#2A1B3D]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
