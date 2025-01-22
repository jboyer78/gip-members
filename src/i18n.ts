import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations
import commonFR from './locales/fr/common.json';
import commonEN from './locales/en/common.json';

const resources = {
  fr: {
    common: commonFR
  },
  en: {
    common: commonEN
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;