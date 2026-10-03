import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { filterAndRankTailors } from '../../utils/matching';
import { MapPin, Search, Star, CheckCircle, ArrowRight } from 'lucide-react';

interface FindTailorsPageProps {
  setActiveTab: (tab: string) => void;
  onSelectTailor: (tailorId: string) => void;
  selectedCategoryFilter?: string;
}

export const FindTailorsPage: React.FC<FindTailorsPageProps> = ({
  setActiveTab,
  onSelectTailor,
  selectedCategoryFilter
}) => {
  const { tailors, categories, selectedState, selectedDistrict, selectedVillage } = useData();
  const { t, lang } = useLanguage();

  const [category, setCategory] = useState<string>(selectedCategoryFilter || 'all');
  const [onlySameVillage, setOnlySameVillage] = useState<boolean>(false);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTailors = filterAndRankTailors(tailors, {
    userState: selectedState,
    userDistrict: selectedDistrict,
    userVillage: selectedVillage,
    selectedCategory: category !== 'all' ? category : undefined,
    onlyAvailable
  }).filter(res => {
    if (onlySameVillage && res.matchTier !== 'same_village') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        res.tailor.name.toLowerCase().includes(q) ||
        res.tailor.village.toLowerCase().includes(q) ||
        res.tailor.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="overflow-hidden rounded-[32px] border border-[#F2D6E1] bg-[#FFF5F8] p-6 shadow-[0_20px_60px_rgba(42,27,61,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#F7C0D8] bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D43A72]">
              <MapPin className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'आपका स्थान' : 'Matching location'}: {selectedVillage}, {selectedDistrict}</span>
            </div>

            <h1 className="text-3xl font-black text-[#2A1B3D] sm:text-4xl">
              {lang === 'hi' ? 'पास के सत्यापित दर्जी' : 'Discover nearby tailors'}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              {lang === 'hi'
                ? 'समान गाँव की दर्जियों को पहले दिखाया जाता है ताकि भरोसा, कम दूरी और कपड़ा उठाकर देने की प्रक्रिया आसान रहे।'
                : 'Same-village tailors are shown first for trust, comfort, and easier fabric handover.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOnlySameVillage(false)}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-extrabold text-[#2A1B3D] shadow-sm transition hover:border-[#D43A72] hover:text-[#D43A72]"
          >
            {lang === 'hi' ? 'सड़क के पास भी देखें' : 'View nearby villages'}
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <label htmlFor="tailorSearchQuery" className="sr-only">Search Tailors</label>
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              id="tailorSearchQuery"
              name="tailorSearchQuery"
              type="text"
              placeholder="Search tailor name, village, or skills (e.g. Princess Cut)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="sm:w-56">
            <label htmlFor="tailorCategoryFilter" className="sr-only">Filter by Category</label>
            <select
              id="tailorCategoryFilter"
              name="tailorCategoryFilter"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {lang === 'hi' ? c.nameHi : c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs">
          <label htmlFor="onlySameVillage" className="flex items-center gap-2 cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full font-semibold text-stone-700 transition">
            <input
              id="onlySameVillage"
              name="onlySameVillage"
              type="checkbox"
              checked={onlySameVillage}
              onChange={e => setOnlySameVillage(e.target.checked)}
              className="accent-[#D9534F] rounded"
            />
            <span>{t('sameVillageBadge')} Only ({selectedVillage})</span>
          </label>

          <label htmlFor="onlyAvailable" className="flex items-center gap-2 cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full font-semibold text-stone-700 transition">
            <input
              id="onlyAvailable"
              name="onlyAvailable"
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <span>{t('availableNow')} Only</span>
          </label>

          <span className="text-stone-400 ml-auto font-medium">
            Found {filteredTailors.length} tailors
          </span>
        </div>
      </div>

      {/* TAILORS GRID */}
      {filteredTailors.length === 0 ? (
        <div className="rounded-[32px] border border-stone-200 bg-white p-8 text-center shadow-[0_12px_30px_rgba(42,27,61,0.04)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1F6] text-[#D43A72]">
            <Search className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-black text-[#2A1B3D] sm:text-2xl">
            {lang === 'hi' ? 'इस फ़िल्टर में कोई दर्जी नहीं मिला' : 'No tailors match this exact filter'}
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
            {lang === 'hi'
              ? 'समान गाँव के फ़िल्टर को बंद करें, ताकि पास के गाँवों की दर्जियों को भी देखा जा सके।'
              : 'Try turning off “Same Village Only” to widen the search and explore nearby villages.'}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => {
                setOnlySameVillage(false);
                setCategory('all');
                setSearchQuery('');
              }}
              className="rounded-2xl bg-[#D9534F] px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_28px_rgba(217,83,79,0.25)] transition hover:bg-[#C94A45]"
            >
              {lang === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset filters'}
            </button>

            <button
              onClick={() => setOnlySameVillage(false)}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-100"
            >
              {lang === 'hi' ? 'पास के गाँव देखें' : 'Show nearby villages'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTailors.map(res => {
            const tProfile = res.tailor;
            const isSameVillage = res.matchTier === 'same_village';

            return (
              <div
                key={tProfile.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-md hover:shadow-xl transition flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img src={tProfile.avatar} alt={tProfile.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

                    {/* Same Village Badge */}
                    <div className="absolute top-3 left-3">
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

                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                      <div>
                        <h3 className="font-extrabold text-lg drop-shadow">{tProfile.name}</h3>
                        <p className="text-xs text-stone-200 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{tProfile.addressApprox}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{tProfile.bio}</p>

                    <div className="grid grid-cols-3 gap-2 text-center bg-stone-50 p-2.5 rounded-2xl border border-stone-100 text-xs">
                      <div>
                        <span className="text-amber-500 font-bold flex items-center justify-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{tProfile.rating}</span>
                        </span>
                        <span className="text-[10px] text-stone-400 block">Rating</span>
                      </div>
                      <div>
                        <span className="font-bold text-stone-800">{tProfile.experienceYears}y</span>
                        <span className="text-[10px] text-stone-400 block">Experience</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700">{tProfile.completedOrdersCount}</span>
                        <span className="text-[10px] text-stone-400 block">Orders</span>
                      </div>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1">
                      {tProfile.skills.map((sk, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-200/50">
                          {sk}
                        </span>
                      ))}
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
                    className="px-4 py-2.5 bg-[#D9534F] hover:bg-[#C93B37] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1"
                  >
                    <span>View Profile & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
