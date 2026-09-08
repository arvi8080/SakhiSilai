import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, ShieldCheck, Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

export const AboutContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in pb-16">
      {/* MISSION BANNER */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-stone-800">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="bg-[#D9534F] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Our Core Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-amber-400 italic">
            "{t('tagline')}"
          </h1>
          <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
            There are millions of skilled women in Indian villages and small towns who know beautiful blouse, suit, dress, and kids stitching. SakhiSilai connects them directly with nearby customers so they can earn independently from home while managing family responsibilities.
          </p>
        </div>
      </div>

      {/* CORE VALUES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Heart className="w-6 h-6 text-[#D9534F]" />
          </div>
          <h3 className="font-extrabold text-lg text-stone-900">Women Empowerment</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Tailors are independent entrepreneurs who decide their own prices, services, availability, and workload capacity.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-stone-900">100% Payout Model</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            SakhiSilai takes ZERO commission from tailors. 100% of the stitching fee goes directly to the woman tailor.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-stone-900">Hyperlocal Village Trust</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Prioritizing same-village tailors so customers deal with community members they already know and trust.
          </p>
        </div>
      </div>

      {/* CONTACT & HELPLINE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HELPLINE CARDS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-6">
          <div>
            <h3 className="font-extrabold text-xl text-stone-900">Sakhi Support & Helpline</h3>
            <p className="text-xs text-stone-500 mt-1">Need help registering as a tailor or placing an order?</p>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-amber-800 font-bold uppercase block">Toll-Free Helpline</span>
                <span className="font-black text-lg text-stone-900">1800-SAKHI-SILAI (1800-72544-74524)</span>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Support Email</span>
                <span className="font-bold text-sm text-stone-900">help@sakhisilai.org</span>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D9534F] text-white flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Headquarters</span>
                <span className="font-bold text-sm text-stone-900">Lucknow & Jaipur Rural Tech Center, UP & RJ</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-4">
          <h3 className="font-extrabold text-xl text-stone-900">Send Us a Message</h3>

          {sentSuccess && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Thank you! Your message has been received by our Sakhi support team.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="contactName" className="block font-bold text-stone-700 mb-1">Your Name</label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block font-bold text-stone-700 mb-1">Mobile Phone Number</label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="contactMessage" className="block font-bold text-stone-700 mb-1">Message / Inquiry</label>
              <textarea
                id="contactMessage"
                name="contactMessage"
                rows={4}
                placeholder="Write your question, suggestion, or feedback..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-medium"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#D9534F] hover:bg-[#C93B37] text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
