import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { LocationSelectorModal } from './LocationSelectorModal';
import { Scissors, Menu, X, LogIn, UserPlus, LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isDarkMode, onToggleTheme }) => {
  const { lang, setLang } = useLanguage();
  const { isLoggedIn, currentUser, currentRole, logout } = useAuth();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-3 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-nav rounded-full px-5 py-3 shadow-lg shadow-pink-900/5 transition-all">
          <div className="flex items-center justify-between">
            {/* BRAND LOGO & TAGLINE */}
            <button
              type="button"
              aria-label={lang === 'hi' ? 'सखीसिलाई होमपेज' : 'SakhiSilai home'}
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-left"
            >
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
            </button>

            {/* DESKTOP NAVIGATION LINKS */}
            <nav className="hidden md:flex items-center gap-2 text-xs font-extrabold text-[#2A1B3D]">
              {[
                ['home', lang === 'hi' ? 'होम' : 'Home'],
                ['how_it_works', lang === 'hi' ? 'कैसे काम करता है' : 'How It Works'],
                ['services', lang === 'hi' ? 'सेवाएं' : 'Services'],
                ['find_tailors', lang === 'hi' ? 'डिज़ाइन देखें' : 'Browse Designs'],
                ['about', lang === 'hi' ? 'हमारे बारे में' : 'About Us'],
                ['contact', lang === 'hi' ? 'संपर्क करें' : 'Contact Us']
              ].map(([tabKey, label]) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`rounded-full px-3 py-2 transition-all ${
                    activeTab === tabKey
                      ? 'bg-[#FFF1F6] text-[#E91E63] shadow-sm ring-1 ring-pink-100'
                      : 'text-[#2A1B3D] hover:bg-[#FFF8FA] hover:text-[#E91E63]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isDarkMode ? (lang === 'hi' ? 'लाइट मोड चालू करें' : 'Switch to light mode') : (lang === 'hi' ? 'डार्क मोड चालू करें' : 'Switch to dark mode')}
                aria-pressed={isDarkMode}
                title={isDarkMode ? (lang === 'hi' ? 'लाइट मोड' : 'Light mode') : (lang === 'hi' ? 'डार्क मोड' : 'Dark mode')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/70 text-stone-700 transition hover:bg-pink-50 hover:text-[#E91E63]"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Language Selector */}
              <button
                onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
                className="bg-[#FFF5F8] hover:bg-[#FFE3EE] text-[#E91E63] px-3.5 py-1.5 rounded-full text-xs font-bold border border-pink-200/70 transition flex items-center gap-1 shadow-sm hover:shadow-md"
              >
                <span>{lang === 'hi' ? '🇮🇳 English' : '🌐 हिंदी'}</span>
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="flex items-center gap-1.5 bg-[#FFF1F6] hover:bg-[#FFE7F1] text-[#E91E63] px-3.5 py-1.5 rounded-full text-xs font-extrabold border border-pink-200 transition shadow-sm hover:shadow-md"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{currentUser?.name?.split(' ')[0]} ({currentRole})</span>
                    <span className="sm:hidden">{lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setActiveTab('home');
                    }}
                    title={lang === 'hi' ? 'लॉगआउट' : 'Logout'}
                    className="p-1.5 text-stone-500 hover:text-red-600 rounded-full hover:bg-stone-100 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('auth')}
                    className="hidden sm:flex items-center gap-1.5 text-stone-700 hover:text-[#E91E63] px-3 py-1.5 rounded-full text-xs font-bold transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'लॉगिन' : 'Login'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('auth')}
                    className="px-5 py-2 bg-gradient-to-r from-[#E91E63] to-[#D81B60] hover:from-[#D81B60] hover:to-[#C2185B] text-white font-extrabold text-xs rounded-full shadow-md shadow-pink-500/25 transition active:scale-95 flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'जुड़ें' : 'Join Now'}</span>
                  </button>
                </>
              )}

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
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 bg-pink-50 text-[#E91E63] font-black rounded-xl"
              >
                {lang === 'hi' ? 'मेरा डैशबोर्ड' : 'My Dashboard'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('auth');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 bg-[#E91E63] text-white font-black rounded-xl"
              >
                {lang === 'hi' ? 'लॉगिन / साइन-अप' : 'Login / Sign Up'}
              </button>
            )}
          </div>
        )}
      </header>

      <LocationSelectorModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  );
};
