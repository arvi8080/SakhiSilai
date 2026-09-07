import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center bg-stone-100 p-1 rounded-full border border-stone-200 shadow-inner">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
          lang === 'en'
            ? 'bg-[#D9534F] text-white shadow-sm'
            : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <span>English</span>
      </button>
      <button
        onClick={() => setLang('hi')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
          lang === 'hi'
            ? 'bg-[#D9534F] text-white shadow-sm'
            : 'text-stone-600 hover:text-stone-900'
        }`}
      >
        <span>हिंदी</span>
      </button>
    </div>
  );
};
