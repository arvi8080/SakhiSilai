import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { LocationSelectorModal } from './LocationSelectorModal';
import { Scissors, MapPin, Bell, Menu, X, PlusCircle, LayoutDashboard, HelpCircle, Info } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, currentRole } = useAuth();
  const { selectedVillage, selectedDistrict, notifications, markNotificationRead } = useData();
  const { t, lang } = useLanguage();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(
    n => !n.isRead && (n.targetRole === 'all' || n.targetRole === currentRole || n.recipientId === currentUser.id)
  );

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D9534F] to-[#E6A100] flex items-center justify-center text-white shadow-md">
                <Scissors className="w-6 h-6 rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight">
                    Sakhi<span className="text-[#D9534F]">Silai</span>
                  </span>
                  <span className="bg-amber-100 text-[#1B4D3E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-200">
                    Hyperlocal
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-[#1B4D3E] tracking-wide italic">
                  "{t('tagline')}"
                </p>
              </div>
            </div>

            {/* Location Selector Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-stone-200 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D9534F]" />
              <span className="max-w-[140px] truncate">{selectedVillage}, {selectedDistrict}</span>
              <span className="text-[10px] text-stone-500 underline">Change</span>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('home')}
                className={`hover:text-[#D9534F] transition ${activeTab === 'home' ? 'text-[#D9534F]' : 'text-stone-700'}`}
              >
                Home
              </button>
              
              <button
                onClick={() => setActiveTab('find_tailors')}
                className={`hover:text-[#D9534F] transition ${activeTab === 'find_tailors' ? 'text-[#D9534F]' : 'text-stone-700'}`}
              >
                {t('findTailors')}
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`hover:text-[#D9534F] transition ${activeTab === 'services' ? 'text-[#D9534F]' : 'text-stone-700'}`}
              >
                {t('services')}
              </button>

              <button
                onClick={() => setActiveTab('how_it_works')}
                className={`hover:text-[#D9534F] transition ${activeTab === 'how_it_works' ? 'text-[#D9534F]' : 'text-stone-700'}`}
              >
                How It Works
              </button>

              <button
                onClick={() => setActiveTab('custom_request')}
                className={`hover:text-[#D9534F] transition flex items-center gap-1 ${
                  activeTab === 'custom_request' ? 'text-[#D9534F]' : 'text-stone-700'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#D9534F]" />
                <span>Upload Design</span>
              </button>

              <button
                onClick={() => setActiveTab('about_contact')}
                className={`hover:text-[#D9534F] transition ${activeTab === 'about_contact' ? 'text-[#D9534F]' : 'text-stone-700'}`}
              >
                About & Support
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  currentRole === 'tailor'
                    ? 'bg-[#1B4D3E] text-white'
                    : currentRole === 'admin'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#D9534F] text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{currentRole.toUpperCase()} Dashboard</span>
              </button>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <LanguageToggle />

              {/* Notification Trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 relative transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#D9534F] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 p-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-[#D9534F]" />
                        <span>Notifications</span>
                      </h4>
                      <span className="text-xs text-stone-400">{unreadNotifs.length} new</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-4">No notifications yet</p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                              !n.isRead ? 'bg-amber-50/70 border-amber-200' : 'bg-stone-50 border-stone-100'
                            }`}
                          >
                            <p className="font-bold text-stone-900">{lang === 'hi' ? n.titleHi : n.titleEn}</p>
                            <p className="text-stone-600 text-[11px] mt-0.5">{lang === 'hi' ? n.messageHi : n.messageEn}</p>
                            <span className="text-[9px] text-stone-400 mt-1 block">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-stone-600 rounded-lg hover:bg-stone-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 animate-fade-in">
            <button
              onClick={() => {
                setIsLocationModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left bg-stone-100 p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-stone-800"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D9534F]" />
                <span>{selectedVillage}, {selectedDistrict}</span>
              </div>
              <span className="text-[#D9534F]">Change Location</span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-center pt-2">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-stone-100 rounded-xl font-bold text-xs text-stone-800"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveTab('find_tailors');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-stone-100 rounded-xl font-bold text-xs text-stone-800"
              >
                {t('findTailors')}
              </button>
              <button
                onClick={() => {
                  setActiveTab('services');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-stone-100 rounded-xl font-bold text-xs text-stone-800"
              >
                {t('services')}
              </button>
              <button
                onClick={() => {
                  setActiveTab('how_it_works');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-stone-100 rounded-xl font-bold text-xs text-stone-800"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  setActiveTab('custom_request');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-stone-100 rounded-xl font-bold text-xs text-stone-800"
              >
                Upload Design
              </button>
              <button
                onClick={() => {
                  setActiveTab('about_contact');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 bg-stone-100 rounded-xl font-bold text-xs text-stone-800"
              >
                About & Support
              </button>
            </div>

            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#D9534F] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to {currentRole.toUpperCase()} Dashboard</span>
            </button>
          </div>
        )}
      </header>

      <LocationSelectorModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  );
};
