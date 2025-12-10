import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import commonKm from '../public/locales/km/common.json';
import commonEn from '../public/locales/en/common.json';

const resources = {
  km: {
    common: commonKm
  },
  en: {
    common: commonEn
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'km', // Always start with Khmer to avoid hydration mismatch
    fallbackLng: 'km',
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
