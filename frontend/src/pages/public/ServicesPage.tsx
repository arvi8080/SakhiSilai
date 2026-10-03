import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Clock3, MapPin, Scissors, Shirt } from 'lucide-react';

interface ServicesPageProps {
  setActiveTab: (tab: string) => void;
  onSelectCategory: (catId: string) => void;
  onBookDesign: (tailorId: string, designId?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setActiveTab, onSelectCategory, onBookDesign }) => {
  const { categories, designs, tailors } = useData();
  const { lang } = useLanguage();
  const tailorServices = designs.filter(design =>
    design.isAvailable && tailors.some(tailor => tailor.id === design.tailorId && tailor.isVerified)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in pb-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="bg-amber-100 text-[#1B4D3E] text-xs font-bold px-3 py-1 rounded-full uppercase">
          Crafted by Skilled Home Tailors
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900">
          {lang === 'hi' ? 'सिलाई सेवाएं एवं दर सूची' : 'Stitching Services & Categories'}
        </h1>
        <p className="text-stone-600 text-sm">
          Get custom stitching for all clothing types by skilled women in your village and district.
        </p>
      </div>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D43A72]">
              {lang === 'hi' ? 'दर्जी द्वारा सूचीबद्ध' : 'Made and priced by local tailors'}
            </p>
            <h2 className="mt-2 text-2xl font-black text-stone-900 sm:text-3xl">
              {lang === 'hi' ? 'दर्जी की सेवाएं' : 'Services from local tailors'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('find_tailors')}
            className="hidden items-center gap-2 text-sm font-bold text-[#1B4D3E] hover:text-[#133A2E] sm:inline-flex"
          >
            {lang === 'hi' ? 'दर्जी खोजें' : 'Browse tailors'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {tailorServices.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tailorServices.map(service => {
              const tailor = tailors.find(item => item.id === service.tailorId);
              return (
                <article key={service.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img src={service.image} alt={service.title} loading="lazy" className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1B4D3E] shadow-sm">
                      {service.categoryName}
                    </span>
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-extrabold text-stone-900">{lang === 'hi' ? (service.titleHi || service.title) : service.title}</h3>
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-stone-600">
                        {service.description || (lang === 'hi' ? 'दर्जी से अपनी ज़रूरत के अनुसार विवरण पूछें।' : 'Ask the tailor about customization and fabric requirements.')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-stone-100 pt-3 text-xs font-semibold text-stone-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Shirt className="h-3.5 w-3.5 text-[#D43A72]" />
                        {service.tailorName || tailor?.name || (lang === 'hi' ? 'स्थानीय दर्जी' : 'Local tailor')}
                      </span>
                      {tailor && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#1B4D3E]" />
                          {tailor.village}, {tailor.district}
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-stone-400">
                          {lang === 'hi' ? 'सिलाई की कीमत' : 'Stitching price'}
                        </span>
                        <span className="text-xl font-black text-[#D43A72]">₹{service.price}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-bold uppercase text-stone-400">
                          {lang === 'hi' ? 'तैयारी का समय' : 'Ready in'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-stone-700">
                          <Clock3 className="h-3.5 w-3.5" /> {service.estDays} {lang === 'hi' ? 'दिन' : 'days'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onBookDesign(service.tailorId, service.id)}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1B4D3E] px-4 text-sm font-extrabold text-white transition hover:bg-[#133A2E]"
                    >
                      {lang === 'hi' ? 'इस सेवा को बुक करें' : 'Book this service'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border-y border-stone-200 py-8 text-center text-sm text-stone-600">
            {lang === 'hi'
              ? 'दर्जियों की नई सेवाएं जल्द यहां दिखेंगी। नीचे से सिलाई श्रेणी चुनें।'
              : 'Tailor-listed services will appear here as they are added. Choose a stitching category below.'}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D43A72]">
            {lang === 'hi' ? 'सिलाई के प्रकार' : 'Stitching types'}
          </p>
          <h2 className="mt-2 text-2xl font-black text-stone-900 sm:text-3xl">
            {lang === 'hi' ? 'श्रेणी के अनुसार सेवाएं' : 'Browse by category'}
          </h2>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md hover:shadow-xl transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#D9534F] flex items-center justify-center">
                <Scissors className="w-7 h-7 rotate-45" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-stone-900">
                  {lang === 'hi' ? cat.nameHi : cat.nameEn}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  {lang === 'hi' ? cat.descriptionHi : cat.descriptionEn}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Starting Price</span>
                <span className="font-extrabold text-xl text-[#D9534F]">₹{cat.startingPrice}</span>
              </div>

              <button
                onClick={() => {
                  onSelectCategory(cat.id);
                  setActiveTab('find_tailors');
                }}
                className="px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1"
              >
                <span>Find Tailors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      </section>
    </div>
  );
};
