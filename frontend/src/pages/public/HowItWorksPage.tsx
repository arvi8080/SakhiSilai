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
          Hyperlocal Village Tailor Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900">
          {lang === 'hi' ? 'सखीसिलाई कैसे काम करता है?' : 'How SakhiSilai Works'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          “Ghar Se Hunar, Apni Kamai” — Tailor stays at home, customer visits tailor in same village.
        </p>

        {/* ROLE SWITCH TAB */}
        <div className="inline-flex bg-stone-200 p-1.5 rounded-full border border-stone-300 mt-4">
          <button
            onClick={() => setActiveRoleTab('customer')}
            className={`px-6 py-2 rounded-full font-bold text-xs transition ${
              activeRoleTab === 'customer'
                ? 'bg-[#E91E63] text-white shadow'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            For Customers (कपड़े सिलवाने वालों के लिए)
          </button>
          <button
            onClick={() => setActiveRoleTab('tailor')}
            className={`px-6 py-2 rounded-full font-bold text-xs transition ${
              activeRoleTab === 'tailor'
                ? 'bg-[#2A1B3D] text-amber-400 shadow'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            For Home Tailors (दर्जी बहनों के लिए)
          </button>
        </div>
      </div>

      {/* SAME VILLAGE HOME TAILOR WORKFLOW HIGHLIGHT */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#2A1B3D] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-stone-700">
        <div className="text-center space-y-2">
          <span className="bg-amber-400 text-stone-900 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
            Same Village Home Tailor Process
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-amber-300">
            {lang === 'hi' ? 'ग्रामीण होम दर्जी एवं ग्राहक प्रक्रिया' : '5-Step Same Village Booking & Handover Flow'}
          </h2>
          <p className="text-xs text-stone-300 max-w-xl mx-auto font-medium">
            The tailor stays at home. Once request is accepted, appointment & home address are confirmed!
          </p>
        </div>

        {/* 5-STEP LIFECYCLE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-bold">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h4 className="text-white font-black">1. Send Request</h4>
            <p className="text-[11px] text-stone-300 font-normal">Customer selects nearby tailor in same village & sends request.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-900 flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h4 className="text-amber-300 font-black">2. Tailor Accepts</h4>
            <p className="text-[11px] text-stone-300 font-normal">Tailor reviews design & clicks Accept Order ✅.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h4 className="text-emerald-300 font-black">3. Visit Confirmed</h4>
            <p className="text-[11px] text-stone-300 font-normal">🔓 Home address & visit appointment time unlocked & shared!</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center mx-auto text-sm">
              4
            </div>
            <h4 className="text-blue-300 font-black">4. Drop & Measure</h4>
            <p className="text-[11px] text-stone-300 font-normal">Customer visits tailor's home, drops fabric & gives measurements.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center mx-auto text-sm">
              5
            </div>
            <h4 className="text-purple-300 font-black">5. Stitch & Collect</h4>
            <p className="text-[11px] text-stone-300 font-normal">Tailor stitches at home. Customer collects finished outfit & pays!</p>
          </div>
        </div>
      </div>

      {/* CUSTOMER FLOW DETAILS */}
      {activeRoleTab === 'customer' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative overflow-hidden">
              <span className="w-10 h-10 rounded-2xl bg-pink-100 text-[#E91E63] font-black text-base flex items-center justify-center">
                1
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Select Village & Tailor</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose your village in Uttar Pradesh. SakhiSilai connects you with verified women tailors working right from home in your village.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative overflow-hidden">
              <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 font-black text-base flex items-center justify-center">
                2
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Tailor Accepts Order</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tailor checks design style & availability. When tailor accepts, the order status changes to "Visit Appointment Confirmed".
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative overflow-hidden">
              <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center">
                3
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Visit Tailor's Home & Drop Fabric</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tailor's home address & phone number unlock! Visit tailor's home, drop your cloth, and get accurate measurements taken.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3 relative overflow-hidden">
              <span className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 font-black text-base flex items-center justify-center">
                4
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Collect Finished Clothes</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Receive live updates (Fabric Received &rarr; Stitching &rarr; Ready). Visit tailor's home to collect finished outfit & pay.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActiveTab('find_tailors')}
              className="px-8 py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg transition active:scale-95 inline-flex items-center gap-2 text-sm"
            >
              <span>Find Nearby Tailor Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* TAILOR FLOW DETAILS */}
      {activeRoleTab === 'tailor' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-[#2A1B3D] text-amber-400 font-black text-base flex items-center justify-center">
                1
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Stitch Comfortably From Home</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Work independently from your home in your village. Set your own prices and control active order limits.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-900 font-black text-base flex items-center justify-center">
                2
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">Accept Bookings & Confirm Visit</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Review incoming requests from village customers. Click Accept Order to confirm visit appointment and share your home drop location.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center">
                3
              </span>
              <h3 className="font-extrabold text-lg text-stone-900">100% Direct Payouts</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                SakhiSilai charges zero commission. Collect 100% stitching payout directly from village customers upon handover.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActiveTab('auth')}
              className="px-8 py-4 bg-[#2A1B3D] hover:bg-[#1f132f] text-white font-black rounded-2xl shadow-lg transition active:scale-95 inline-flex items-center gap-2 text-sm"
            >
              <Scissors className="w-5 h-5 rotate-45 text-amber-400" />
              <span>Apply to Become a Home Tailor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
