import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, ArrowRight } from 'lucide-react';

interface ServicesPageProps {
  setActiveTab: (tab: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ setActiveTab, onSelectCategory }) => {
  const { categories } = useData();
  const { lang } = useLanguage();

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
    </div>
  );
};
