import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LocationSelectorModal } from './LocationSelectorModal';
import { Scissors, Menu, X, LogIn, UserPlus } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { lang, setLang } = useLanguage();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-3 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-nav rounded-full px-5 py-3 shadow-lg shadow-pink-900/5 transition-all">
          <div className="flex items-center justify-between">
            {/* BRAND LOGO & TAGLINE */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FF4081] flex items-center justify-center text-white shadow-md shadow-pink-500/20">
                <Scissors className="w-5 h-5 rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xl text-[#2A1B3D] tracking-tight">
                    Sakhi<span className="text-[#E91E63]">Silai</span>
                  </span>
                </div>
                <p className="text-[10px] font-bold text-[#E91E63] tracking-wide italic">
                  Ghar Se Hunar, Apni Kamai.
                </p>
              </div>
            </div>

            {/* DESKTOP NAVIGATION LINKS */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-extrabold text-[#2A1B3D]">
              <button
                onClick={() => setActiveTab('home')}
                className={`hover:text-[#E91E63] transition ${activeTab === 'home' ? 'text-[#E91E63] font-black' : ''}`}
              >
                {lang === 'hi' ? 'होम' : 'Home'}
              </button>

              <button
                onClick={() => setActiveTab('how_it_works')}
                className={`hover:text-[#E91E63] transition ${activeTab === 'how_it_works' ? 'text-[#E91E63] font-black' : ''}`}
              >
                {lang === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`hover:text-[#E91E63] transition ${activeTab === 'services' ? 'text-[#E91E63] font-black' : ''}`}
              >
                {lang === 'hi' ? 'सेवाएं' : 'Services'}
              </button>

              <button
                onClick={() => setActiveTab('find_tailors')}
                className={`hover:text-[#E91E63] transition ${activeTab === 'find_tailors' ? 'text-[#E91E63] font-black' : ''}`}
              >
                {lang === 'hi' ? 'डिज़ाइन देखें' : 'Browse Designs'}
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`hover:text-[#E91E63] transition ${activeTab === 'about' ? 'text-[#E91E63] font-black' : ''}`}
              >
                {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`hover:text-[#E91E63] transition ${activeTab === 'contact' ? 'text-[#E91E63] font-black' : ''}`}
              >
                {lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}
              </button>
            </nav>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Selector */}
              <button
                onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
                className="bg-pink-50 hover:bg-pink-100 text-[#E91E63] px-3.5 py-1.5 rounded-full text-xs font-bold border border-pink-200/60 transition flex items-center gap-1 shadow-sm"
              >
                <span>{lang === 'hi' ? '🇮🇳 English' : '🌐 हिंदी'}</span>
              </button>

              {/* Login Button */}
              <button
                onClick={() => setActiveTab('auth')}
                className="hidden sm:flex items-center gap-1.5 text-stone-700 hover:text-[#E91E63] px-3 py-1.5 rounded-full text-xs font-bold transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'लॉगिन' : 'Login'}</span>
              </button>

              {/* Primary Pink CTA Button */}
              <button
                onClick={() => setActiveTab('auth')}
                className="px-5 py-2 bg-gradient-to-r from-[#E91E63] to-[#D81B60] hover:from-[#D81B60] hover:to-[#C2185B] text-white font-extrabold text-xs rounded-full shadow-md shadow-pink-500/25 transition active:scale-95 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'जुड़ें' : 'Join Now'}</span>
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-stone-700 rounded-full hover:bg-pink-50"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-2xl mt-2 p-4 border border-pink-100 shadow-xl space-y-2 text-xs font-bold text-[#2A1B3D] animate-fade-in">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-pink-50 rounded-xl"
            >
              {lang === 'hi' ? 'होम' : 'Home'}
            </button>
            <button
              onClick={() => {
                setActiveTab('how_it_works');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-pink-50 rounded-xl"
            >
              {lang === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
            </button>
            <button
              onClick={() => {
                setActiveTab('services');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-pink-50 rounded-xl"
            >
              {lang === 'hi' ? 'सेवाएं' : 'Services'}
            </button>
            <button
              onClick={() => {
                setActiveTab('find_tailors');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-pink-50 rounded-xl"
            >
              {lang === 'hi' ? 'डिज़ाइन देखें' : 'Browse Designs'}
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-pink-50 rounded-xl"
            >
              {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
            </button>
            <button
              onClick={() => {
                setActiveTab('contact');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-pink-50 rounded-xl"
            >
              {lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}
            </button>
          </div>
        )}
      </header>

      <LocationSelectorModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  );
};
