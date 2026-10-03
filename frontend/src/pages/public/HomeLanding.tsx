import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { LocationSelectorModal } from '../../components/common/LocationSelectorModal';
import { filterAndRankTailors } from '../../utils/matching';
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  MapPin,
  Search,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users,
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  onSelectTailor: (tailorId: string) => void;
  onSelectCategory: (catId: string) => void;
}

const serviceImages: Record<string, string> = {
  blouse: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80',
  suit: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80',
  dress: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=80',
  kids: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80',
  alterations: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80',
  custom: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=80'
};
const fallbackServiceImages = Object.values(serviceImages);

export const HomeLanding: React.FC<HomeProps> = ({ setActiveTab, onSelectTailor, onSelectCategory }) => {
  const { categories, tailors, selectedState, selectedDistrict, selectedVillage } = useData();
  const { lang } = useLanguage();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const nearbyTailors = filterAndRankTailors(tailors, {
    userState: selectedState,
    userDistrict: selectedDistrict,
    userVillage: selectedVillage,
  }).slice(0, 3);
  const featuredServices = categories.slice(0, 6);

  return (
    <div className="animate-fade-in pb-16">
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-4 sm:px-6 lg:px-8 lg:pb-18 lg:pt-8">
        <div className="overflow-hidden rounded-[32px] border border-[#F2D6E1] bg-[radial-gradient(circle_at_top_left,_rgba(233,30,99,0.12),_transparent_28%),linear-gradient(135deg,#fff9fb_0%,#fdf4f7_28%,#f7f7f2_100%)] shadow-[0_24px_70px_rgba(42,27,61,0.08)]">
          <div className="grid items-center gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F7C0D8] bg-white/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-[#D43A72] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {lang === 'hi' ? 'आपके पास भरोसेमंद सेवाएं' : 'Trusted local services'}
              </div>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-black leading-[1.08] text-[#2A1B3D] sm:text-5xl lg:text-[3.3rem]">
                  {lang === 'hi'
                    ? 'अपने गाँव की टेलर से सिलाई, भरोसे और कमाई — सब एक जगह.'
                    : 'Tailoring, trust, and local earning power in one place.'}
                </h1>

                <p className="max-w-lg text-base leading-7 text-stone-600">
                  {lang === 'hi'
                    ? 'सत्यापित दर्जियों, आसान ऑर्डरिंग और भरोसेमंद सेवा के साथ अपने ड्रेस, कुर्ता, बच्चों के कपड़े और कस्टम डिज़ाइन को तुरंत बुक करें।'
                    : 'Book custom stitching, blouse tailoring, kidswear, and outfit alterations with trusted local women tailors near you.'}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex min-h-[56px] flex-1 items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 text-left shadow-sm transition hover:border-[#D43A72] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D43A72]"
                  aria-label={lang === 'hi' ? 'अपना स्थान बदलें' : 'Change your location'}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1F6] text-[#D43A72]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                      {lang === 'hi' ? 'आपका स्थान' : 'Your location'}
                    </span>
                    <span className="block truncate text-sm font-extrabold text-stone-900">
                      {selectedVillage}, {selectedDistrict}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('find_tailors')}
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[#1B4D3E] px-6 text-sm font-extrabold text-white shadow-[0_18px_40px_rgba(27,77,62,0.24)] transition hover:bg-[#133A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4D3E]"
                >
                  <Search className="h-4 w-4" />
                  <span>{lang === 'hi' ? 'टेलर खोजें' : 'Find tailors'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-sm text-stone-600">
                {[
                  { icon: ShieldCheck, label: lang === 'hi' ? 'सत्यापित टेलर' : 'Verified talent' },
                  { icon: Users, label: lang === 'hi' ? 'गाँवों तक पहुँच' : 'Local network' },
                  { icon: Scissors, label: lang === 'hi' ? 'कस्टम फिटिंग' : 'Custom fitting' }
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 px-3 py-1.5">
                    <Icon className="h-4 w-4 text-[#D43A72]" />
                    <span className="font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-[#FDD7E7] blur-2xl" />
              <div className="absolute -right-6 bottom-10 h-24 w-24 rounded-full bg-[#D9F6D9] blur-2xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/40 p-2 shadow-[0_20px_50px_rgba(42,27,61,0.12)] backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&auto=format&fit=crop&crop=faces&q=95"
                  alt={lang === 'hi' ? 'आधुनिक भारतीय सिलाई और फैशन दृश्य' : 'Modern Indian tailoring and fashion scene'}
                  className="aspect-[4/3] w-full rounded-[20px] object-cover object-[50%_25%]"
                  fetchPriority="high"
                />

                <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 p-3 shadow-lg backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F8F2] text-[#1B4D3E]">
                    <Scissors className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-stone-900">{lang === 'hi' ? 'स्थानीय हुनर' : 'Local craft'}</p>
                    <p className="text-xs text-stone-500">{lang === 'hi' ? 'सीधे टेलर से' : 'Direct from the tailor'}</p>
                  </div>
                </div>

                <div className="absolute right-5 top-5 rounded-2xl border border-emerald-100 bg-white/90 px-3 py-2 shadow-md">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-extrabold">{lang === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D43A72]">
              {lang === 'hi' ? 'सेवाएं' : 'Popular services'}
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#2A1B3D]">
              {lang === 'hi' ? 'लोकप्रिय सिलाई सेवाएं' : 'Popular tailoring services'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className="hidden items-center gap-2 text-sm font-bold text-[#D43A72] hover:text-[#B63B62] sm:flex"
          >
            <span>{lang === 'hi' ? 'सभी सेवाएं' : 'See all services'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {featuredServices.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {featuredServices.map((service, index) => (
              <button
                type="button"
                key={service.id}
                onClick={() => onSelectCategory(service.id)}
                className="group overflow-hidden rounded-[26px] border border-stone-200 bg-white text-left shadow-[0_12px_30px_rgba(42,27,61,0.05)] transition hover:-translate-y-1 hover:border-[#E9B7C8] hover:shadow-[0_18px_36px_rgba(233,30,99,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D43A72]"
              >
                <div className="overflow-hidden">
                  <img
                    src={serviceImages[service.id] || fallbackServiceImages[index % fallbackServiceImages.length]}
                    alt={lang === 'hi' ? service.nameHi : service.nameEn}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <div className="text-lg font-extrabold text-stone-900">{lang === 'hi' ? service.nameHi : service.nameEn}</div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-stone-500">{lang === 'hi' ? 'शुरुआती कीमत' : 'Starting at'}</span>
                    <span className="font-extrabold text-[#D43A72]">₹{service.startingPrice}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-stone-200 bg-white p-8 text-center text-stone-600">
            {lang === 'hi' ? 'सेवाएं जल्द उपलब्ध होंगी।' : 'Services will appear here soon.'}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D43A72]">
              {lang === 'hi' ? 'पास के टेलर' : 'Near you'}
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#2A1B3D]">
              {lang === 'hi' ? 'सत्यापित दर्जी' : 'Top tailors nearby'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('find_tailors')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#D43A72] hover:text-[#B63B62]"
          >
            <span>{lang === 'hi' ? 'सभी देखें' : 'View all'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {nearbyTailors.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {nearbyTailors.map(({ tailor, distanceKmApprox }) => (
              <article key={tailor.id} className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_14px_28px_rgba(42,27,61,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(42,27,61,0.08)]">
                <div className="relative">
                  <img src={tailor.avatar} alt={tailor.name} loading="lazy" className="h-56 w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white shadow-md">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {lang === 'hi' ? 'सत्यापित' : 'Verified'}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                    <div>
                      <h3 className="text-xl font-extrabold">{tailor.name}</h3>
                      <p className="text-xs text-stone-200">
                        {tailor.village}, {tailor.district}
                      </p>
                    </div>
                    <div className="rounded-full bg-white/15 px-2 py-1 text-sm font-bold backdrop-blur-sm">
                      {distanceKmApprox} km
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {tailor.rating.toFixed(1)}
                    </span>
                    <span>{tailor.experienceYears}+ yrs exp</span>
                  </div>

                  <p className="text-sm leading-6 text-stone-600">{tailor.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {tailor.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="rounded-full bg-[#FFF2F7] px-2.5 py-1 text-[10px] font-bold text-[#B9376B]">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                        {lang === 'hi' ? 'शुरुआती कीमत' : 'From'}
                      </div>
                      <div className="text-xl font-black text-[#2A1B3D]">₹{tailor.startingPrice}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectTailor(tailor.id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#E91E63] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_22px_rgba(233,30,99,0.22)] transition hover:bg-[#D81B60]"
                    >
                      <span>{lang === 'hi' ? 'प्रोफाइल देखें' : 'View profile'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-stone-200 bg-white p-8 text-center">
            <p className="text-base font-bold text-stone-800">
              {lang === 'hi' ? 'इस स्थान के लिए अभी टेलर सूचीबद्ध नहीं हैं।' : 'No tailors are listed for this location yet.'}
            </p>
            <button type="button" onClick={() => setIsLocationModalOpen(true)} className="mt-4 text-sm font-bold text-[#D43A72]">
              {lang === 'hi' ? 'दूसरा स्थान चुनें' : 'Choose another location'}
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-[#E9D3DF] bg-[linear-gradient(135deg,#fff7fa_0%,#f7f5ef_100%)] p-6 shadow-[0_18px_36px_rgba(42,27,61,0.05)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D43A72]">
                {lang === 'hi' ? 'कार्यक्षमता' : 'How it works'}
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#2A1B3D]">
                {lang === 'hi' ? 'तीन आसान कदम में ऑर्डर पूरा करें' : 'Three simple steps to get started'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('become_tailor')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#1B4D3E] px-5 py-3 text-sm font-extrabold text-[#1B4D3E] transition hover:bg-[#EEF8F4]"
            >
              <UserCheck className="h-4 w-4" />
              <span>{lang === 'hi' ? 'टेलर के रूप में जुड़ें' : 'Join as tailor'}</span>
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                number: '01',
                title: lang === 'hi' ? 'स्थान चुनें' : 'Choose your location',
                text: lang === 'hi' ? 'अपने आस-पास के भरोसेमंद टेलर देखें।' : 'Find nearby tailors serving your area.'
              },
              {
                number: '02',
                title: lang === 'hi' ? 'सेवा चुनें' : 'Pick your service',
                text: lang === 'hi' ? 'रिव्यू, कीमत और शिल्पकारी का चयन करें।' : 'Compare experience, pricing, and style options.'
              },
              {
                number: '03',
                title: lang === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track your order',
                text: lang === 'hi' ? 'बुकिंग, अपडेट और डिलीवरी को आसान तरीके से देखें।' : 'Book, track progress, and receive updates easily.'
              }
            ].map((step) => (
              <div key={step.number} className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFEAF3] text-sm font-black text-[#D43A72]">
                  {step.number}
                </div>
                <h3 className="text-lg font-extrabold text-[#2A1B3D]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LocationSelectorModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </div>
  );
};