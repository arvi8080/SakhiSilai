import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';

import { filterAndRankTailors } from '../../utils/matching';
import {
  Scissors,
  MapPin,
  Sparkles,
  ShieldCheck,
  Heart,
  Star,
  CheckCircle,
  PlusCircle,
  ChevronRight,
  Quote
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  onSelectTailor: (tailorId: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, onSelectTailor, onSelectCategory }) => {
  const { tailors, categories, selectedState, selectedDistrict, selectedVillage } = useData();
  const { t, lang } = useLanguage();

  const matchResults = filterAndRankTailors(tailors, {
    userState: selectedState,
    userDistrict: selectedDistrict,
    userVillage: selectedVillage
  });

  return (
    <div className="space-y-16 animate-fade-in pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B4D3E] via-[#133A2E] to-stone-950 text-white pt-20 pb-24 rounded-3xl mx-4 sm:mx-8 shadow-2xl border border-white/10">
        {/* Glow Blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D9534F]/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#E6A100]/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-amber-300 border border-white/20 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Hyperlocal Village Tailoring Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
            {lang === 'hi' ? 'अपने गाँव की सखी दर्जियों से जुड़ें' : 'Find Skilled Home Tailors Near You'}
          </h1>

          <p className="text-base sm:text-xl text-stone-200 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('subTagline')}
          </p>

          {/* Current Location Badge */}
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/15 text-xs text-amber-200 shadow-md">
            <MapPin className="w-4 h-4 text-[#D9534F]" />
            <span>Matching location: <strong>{selectedVillage}, {selectedDistrict} ({selectedState})</strong></span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('find_tailors')}
              className="w-full sm:w-auto px-9 py-4 bg-[#D9534F] hover:bg-[#C93B37] text-white font-extrabold rounded-2xl shadow-xl hover:shadow-red-900/50 transition active:scale-95 flex items-center justify-center gap-2.5 text-base"
            >
              <Scissors className="w-5 h-5 rotate-45" />
              <span>{t('heroButtonPrimary')}</span>
            </button>

            <button
              onClick={() => setActiveTab('auth')}
              className="w-full sm:w-auto px-9 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-md transition active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              <Heart className="w-5 h-5 text-amber-400" />
              <span>{t('heroButtonSecondary')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-[#D9534F]">128+</span>
            <span className="text-xs text-stone-500 font-bold block uppercase">Women Tailors Empowered</span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-[#1B4D3E]">100%</span>
            <span className="text-xs text-stone-500 font-bold block uppercase">Earnings to Tailors (0% Fee)</span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-amber-600">15+</span>
            <span className="text-xs text-stone-500 font-bold block uppercase">Villages Covered</span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-purple-700">4.9 ★</span>
            <span className="text-xs text-stone-500 font-bold block uppercase">Customer Rating</span>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SAKHISILAI - 3 TRUST PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-stone-900">
            {t('whyChooseTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Designed for village & small-town communities where local trust comes first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-md hover:shadow-xl transition text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-stone-900">{t('sameVillageTrust')}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t('sameVillageTrustDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-md hover:shadow-xl transition text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center mx-auto shadow-sm">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-stone-900">{t('doorstepHandover')}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t('doorstepHandoverDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-md hover:shadow-xl transition text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#D9534F] flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-stone-900">{t('zeroCommission')}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t('zeroCommissionDesc')}</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">
              {lang === 'hi' ? 'सिलाई श्रेणियां चुनें' : 'Browse Stitching Services'}
            </h2>
            <p className="text-xs text-stone-500">Select what you want stitched today</p>
          </div>
          <button
            onClick={() => setActiveTab('services')}
            className="text-xs font-bold text-[#D9534F] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setActiveTab('find_tailors');
              }}
              className="group bg-white p-5 rounded-3xl border border-stone-200 hover:border-[#D9534F] shadow-sm hover:shadow-md transition cursor-pointer text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D9534F] group-hover:bg-[#D9534F] group-hover:text-white transition flex items-center justify-center mx-auto">
                <Scissors className="w-6 h-6 rotate-45" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#D9534F] transition">
                  {lang === 'hi' ? cat.nameHi : cat.nameEn}
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Starts ₹{cat.startingPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED HYPERLOCAL TAILORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">
              {lang === 'hi' ? 'आपके पास की सखी दर्जियाँ' : 'Tailors Near Your Village'}
            </h2>
            <p className="text-xs text-stone-500">Automatically matched by village proximity & trust</p>
          </div>
          <button
            onClick={() => setActiveTab('find_tailors')}
            className="text-xs font-bold text-[#D9534F] hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchResults.slice(0, 3).map(res => {
            const tProfile = res.tailor;
            const isSameVillage = res.matchTier === 'same_village';

            return (
              <div
                key={tProfile.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-md hover:shadow-xl transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img src={tProfile.avatar} alt={tProfile.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

                    {/* Same Village Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {isSameVillage ? (
                        <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t('sameVillageBadge')} ({tProfile.village})</span>
                        </span>
                      ) : (
                        <span className="bg-amber-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{t('nearbyAreaBadge')} ({tProfile.village})</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-extrabold text-lg drop-shadow">{tProfile.name}</h3>
                      <p className="text-xs text-stone-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Approx. {res.distanceKmApprox} km away</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{tProfile.bio}</p>

                    <div className="flex items-center justify-between text-xs py-2 border-y border-stone-100">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{tProfile.rating} ({tProfile.reviewCount})</span>
                      </div>
                      <span className="text-stone-500">{tProfile.experienceYears} {t('experience')}</span>
                      <span className="text-emerald-700 font-semibold">{tProfile.completedOrdersCount} Done</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">{t('startingFrom')}</span>
                    <span className="font-extrabold text-lg text-[#D9534F]">₹{tProfile.startingPrice}</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTailor(tProfile.id);
                      setActiveTab('tailor_profile');
                    }}
                    className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-xs font-bold rounded-xl shadow transition"
                  >
                    {t('viewProfileAndBook')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CUSTOM DESIGN BIDDING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-[#D9534F] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="bg-white/20 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Pinterest & Instagram Photo Stitching
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Have a Custom Dress Photo?
            </h2>
            <p className="text-xs sm:text-sm text-stone-100 leading-relaxed">
              Upload any dress photo from your phone. Nearby tailors will send you custom price & time quotes. Choose the best quote!
            </p>
          </div>

          <button
            onClick={() => setActiveTab('custom_request')}
            className="px-6 py-3.5 bg-white text-stone-900 font-extrabold rounded-2xl shadow-lg hover:bg-stone-100 transition active:scale-95 flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5 text-[#D9534F]" />
            <span>Upload Photo & Get Bids</span>
          </button>
        </div>
      </section>

      {/* COMMUNITY TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-extrabold text-stone-900">Voices of Rural Community</h2>
          <p className="text-xs text-stone-500 mt-1">Real experiences from customers and women tailors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative">
            <Quote className="w-8 h-8 text-amber-300 absolute top-4 right-4" />
            <p className="text-xs text-stone-700 italic leading-relaxed">
              "Sunita ji stitched my daughter's wedding blouse right here in Mohanlalganj. The fitting was so perfect, and I didn't have to travel 15 km to the city tailor market!"
            </p>
            <div>
              <h4 className="font-bold text-sm text-stone-900">Kavita Mishra</h4>
              <span className="text-[10px] text-stone-400">Customer, Mohanlalganj Village</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative">
            <Quote className="w-8 h-8 text-amber-300 absolute top-4 right-4" />
            <p className="text-xs text-stone-700 italic leading-relaxed">
              "I earn ₹8,000 monthly from my home stitching setup while taking care of my children. SakhiSilai gave me independent identity without taking any commission."
            </p>
            <div>
              <h4 className="font-bold text-sm text-stone-900">Sunita Devi</h4>
              <span className="text-[10px] text-stone-400">Home Tailor, Lucknow District</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
