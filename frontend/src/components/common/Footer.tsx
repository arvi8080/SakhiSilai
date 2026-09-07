import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scissors, Heart, ShieldCheck, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D9534F] flex items-center justify-center text-white">
                <Scissors className="w-4 h-4 rotate-45" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Sakhi<span className="text-[#D9534F]">Silai</span>
              </span>
            </div>
            <p className="text-amber-400 text-xs font-bold italic">
              "{t('tagline')}"
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Empowering skilled rural women to earn independently from home while giving customers nearby trusted stitching services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#find-tailors" className="hover:text-[#D9534F] transition">Find Nearby Tailors</a></li>
              <li><a href="#custom-design" className="hover:text-[#D9534F] transition">Upload Custom Design</a></li>
              <li><a href="#how-it-works" className="hover:text-[#D9534F] transition">How It Works</a></li>
              <li><a href="#join-tailor" className="hover:text-[#D9534F] transition">Register as a Tailor</a></li>
            </ul>
          </div>

          {/* Core Values */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Our Trust Promise</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Payout to Tailors</span>
              </li>
              <li className="flex items-center gap-1.5 text-stone-300">
                <Heart className="w-4 h-4 text-[#D9534F]" />
                <span>Women Empowerment</span>
              </li>
              <li className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Hyperlocal Village Priority</span>
              </li>
            </ul>
          </div>

          {/* Helpline & Support */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Sakhi Helpline</h4>
            <p className="text-xs text-stone-400 mb-2">Need help booking or registering your tailoring shop?</p>
            <a
              href="tel:1800999000"
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-700 transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Toll Free: 1800-SAKHI-SILAI</span>
            </a>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 text-center text-xs text-stone-500">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};
