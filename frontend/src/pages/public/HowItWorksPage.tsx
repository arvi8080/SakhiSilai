import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, ArrowRight } from 'lucide-react';

interface HowItWorksPageProps {
  setActiveTab: (tab: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ setActiveTab }) => {
  const { lang } = useLanguage();
  const [activeRoleTab, setActiveRoleTab] = useState<'customer' | 'tailor'>('customer');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in pb-16">
      {/* HEADER BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="bg-amber-100 text-[#1B4D3E] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          Hyperlocal Stitching Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900">
          {lang === 'hi' ? 'सखीसिलाई कैसे काम करता है?' : 'How SakhiSilai Works'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          Connecting village customers with skilled women tailors working independently from home.
        </p>

        {/* ROLE SWITCH TAB */}
        <div className="inline-flex bg-stone-200 p-1.5 rounded-full border border-stone-300 mt-4">
          <button
            onClick={() => setActiveRoleTab('customer')}
            className={`px-6 py-2 rounded-full font-bold text-xs transition ${
              activeRoleTab === 'customer'
                ? 'bg-[#D9534F] text-white shadow'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            For Customers (कपड़े सिलवाने वालों के लिए)
          </button>
          <button
            onClick={() => setActiveRoleTab('tailor')}
            className={`px-6 py-2 rounded-full font-bold text-xs transition ${
              activeRoleTab === 'tailor'
                ? 'bg-[#1B4D3E] text-white shadow'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            For Women Tailors (दर्जी बहनों के लिए)
          </button>
        </div>
      </div>

      {/* CUSTOMER FLOW */}
      {activeRoleTab === 'customer' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative overflow-hidden">
              <span className="w-10 h-10 rounded-2xl bg-red-100 text-[#D9534F] font-black text-base flex items-center justify-center">
                1
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Choose Location & Village</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Select your Village, District, and State. The matching engine prioritizes verified tailors in your same village first.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative overflow-hidden">
              <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 font-black text-base flex items-center justify-center">
                2
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Select Design or Upload Photo</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Browse design catalogs with fixed rates or upload a custom Pinterest/Instagram photo to receive price bids from local tailors.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative overflow-hidden">
              <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center">
                3
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Fabric Handover & Measurements</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose direct handover to the tailor's home nearby or opt for doorstep pickup where available. Provide saved measurements.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative overflow-hidden">
              <span className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 font-black text-base flex items-center justify-center">
                4
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Live Timeline & Completion</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Track your order through 8 real-time stages (Cutting &rarr; Stitching &rarr; Ready). Pay 100% directly to tailor upon satisfaction.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActiveTab('find_tailors')}
              className="px-8 py-4 bg-[#D9534F] hover:bg-[#C93B37] text-white font-bold rounded-2xl shadow-lg transition active:scale-95 inline-flex items-center gap-2 text-sm"
            >
              <span>Find Nearby Tailor Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* TAILOR FLOW */}
      {activeRoleTab === 'tailor' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white font-black text-base flex items-center justify-center">
                1
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Register & Set Your Prices</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fill your phone number, village address, and stitching skills. Set your own service prices and turnaround completion days.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-base flex items-center justify-center">
                2
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Manage Orders & Availability</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Toggle your status (🟢 Available | 🔴 Busy) anytime. Set max active order limits so you work at your own comfortable pace from home.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center">
                3
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Keep 100% Earnings</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                SakhiSilai charges ZERO commission. Receive 100% of your listed stitching prices directly from local village customers.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActiveTab('auth')}
              className="px-8 py-4 bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-bold rounded-2xl shadow-lg transition active:scale-95 inline-flex items-center gap-2 text-sm"
            >
              <Scissors className="w-5 h-5 rotate-45 text-amber-400" />
              <span>Register as a Home Tailor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
