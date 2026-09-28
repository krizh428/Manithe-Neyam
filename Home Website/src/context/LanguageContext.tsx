import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isTamil: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'manithaneyam_lang_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'ta') {
        return saved;
      }
    } catch {
      // Fallback if localStorage not available
    }
    return 'ta'; // Tamil first default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage error
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ta' ? 'en' : 'ta');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ta') {
      document.body.classList.remove('font-english');
      document.body.classList.add('font-tamil');
    } else {
      document.body.classList.remove('font-tamil');
      document.body.classList.add('font-english');
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isTamil: language === 'ta',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
