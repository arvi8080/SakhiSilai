import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { filterAndRankTailors } from '../../utils/matching';
import {
  Scissors,
  MapPin,
  Heart,
  Star,
  CheckCircle,
  PlusCircle,
  ChevronRight
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  onSelectTailor: (tailorId: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, onSelectTailor, onSelectCategory }) => {
  const { tailors, categories, selectedState, selectedDistrict, selectedVillage } = useData();
  const { lang } = useLanguage();

  const matchResults = filterAndRankTailors(tailors, {
    userState: selectedState,
    userDistrict: selectedDistrict,
    userVillage: selectedVillage
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in pb-16">
      {/* SIMPLE HERO SECTION */}
      <section className="bg-gradient-to-r from-[#1B4D3E] to-[#133A2E] text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 border border-white/20">
          <MapPin className="w-3.5 h-3.5 text-[#D9534F]" />
          <span>Location: <strong>{selectedVillage}, {selectedDistrict}</strong></span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black leading-tight">
          {lang === 'hi' ? 'अपने पास की हुनरमंद दर्जियों से जुड़ें' : 'Find Skilled Tailors Near You'}
        </h1>

        <p className="text-stone-200 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Get your clothes stitched by skilled women near your home while supporting women to earn independently from home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('find_tailors')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#D9534F] hover:bg-[#C93B37] text-white font-extrabold rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <Scissors className="w-4 h-4 rotate-45" />
            <span>Find Tailors Near Me</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl border border-white/30 backdrop-blur-md transition active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <Heart className="w-4 h-4 text-amber-400" />
            <span>Join as a Tailor</span>
          </button>
        </div>
      </section>

      {/* SIMPLE CATEGORY CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-stone-900">
            {lang === 'hi' ? 'सिलाई श्रेणी चुनें' : 'Select What You Want Stitched'}
          </h2>
          <button
            onClick={() => setActiveTab('services')}
            className="text-xs font-bold text-[#D9534F] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                setActiveTab('find_tailors');
              }}
              className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-[#D9534F] shadow-sm hover:shadow-md transition cursor-pointer text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D9534F] flex items-center justify-center mx-auto">
                <Scissors className="w-5 h-5 rotate-45" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900">
                  {lang === 'hi' ? cat.nameHi : cat.nameEn}
                </h4>
                <p className="text-[10px] text-stone-500 mt-0.5">From ₹{cat.startingPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED NEARBY TAILORS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">
              {lang === 'hi' ? 'पास के सत्यापित दर्जी' : 'Tailors in Your Village'}
            </h2>
            <p className="text-xs text-stone-500">Same village tailors listed first for trust</p>
          </div>
          <button
            onClick={() => setActiveTab('find_tailors')}
            className="text-xs font-bold text-[#D9534F] hover:underline flex items-center gap-1"
          >
            <span>See All Tailors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {matchResults.slice(0, 3).map(res => {
            const tProfile = res.tailor;
            const isSameVillage = res.matchTier === 'same_village';

            return (
              <div
                key={tProfile.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-md hover:shadow-lg transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img src={tProfile.avatar} alt={tProfile.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      {isSameVillage ? (
                        <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Same Village ({tProfile.village})</span>
                        </span>
                      ) : (
                        <span className="bg-amber-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{tProfile.village}</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-extrabold text-base drop-shadow">{tProfile.name}</h3>
                      <p className="text-xs text-stone-200">{res.distanceKmApprox} km away</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-stone-600 line-clamp-2">{tProfile.bio}</p>

                    <div className="flex items-center justify-between text-xs py-1.5 border-y border-stone-100">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{tProfile.rating}</span>
                      </div>
                      <span className="text-stone-500">{tProfile.experienceYears} Years Exp</span>
                      <span className="text-emerald-700 font-semibold">{tProfile.completedOrdersCount} Orders</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase font-bold block">Starting From</span>
                    <span className="font-extrabold text-base text-[#D9534F]">₹{tProfile.startingPrice}</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTailor(tProfile.id);
                      setActiveTab('tailor_profile');
                    }}
                    className="px-3.5 py-2 bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-xs font-bold rounded-xl shadow transition"
                  >
                    View & Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SIMPLE 3-STEPS EXPLAINER */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-stone-900 text-center">How SakhiSilai Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-extrabold text-base flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-sm text-stone-900">Choose Location & Design</h3>
            <p className="text-xs text-stone-500 leading-relaxed">Select your village to see nearby tailors and pick your clothing design.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-base flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-sm text-stone-900">Direct Fabric Handover</h3>
            <p className="text-xs text-stone-500 leading-relaxed">Hand over your fabric directly to the tailor's home nearby or choose pickup.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 font-extrabold text-base flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-sm text-stone-900">Track Live & Pay 100%</h3>
            <p className="text-xs text-stone-500 leading-relaxed">Track stitching progress live on your phone. Tailor keeps 100% payout.</p>
          </div>
        </div>
      </section>

      {/* CUSTOM DESIGN PHOTO UPLOAD CARD */}
      <section className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-amber-200 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
            Photo Bidding System
          </span>
          <h3 className="font-extrabold text-lg text-stone-900 mt-1">Have a Custom Photo from Pinterest?</h3>
          <p className="text-xs text-stone-600">Upload any photo to receive custom price quotes from local tailors.</p>
        </div>

        <button
          onClick={() => setActiveTab('custom_request')}
          className="px-5 py-3 bg-[#D9534F] hover:bg-[#C93B37] text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Photo for Bids</span>
        </button>
      </section>
    </div>
  );
};
