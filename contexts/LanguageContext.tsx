"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../lib/i18n'; // Initialize i18n

type Language = 'km' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>('km');

  // Load saved language AFTER hydration
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'km' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
