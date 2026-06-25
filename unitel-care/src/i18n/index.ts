import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viCommon from '@/locales/vi.json';
import viOverride from '@/locales/vi-overide.json';
import enCommon from '@/locales/en.json';
import loCommon from '@/locales/lo.json';
import kmCommon from '@/locales/km.json';
import { merge } from 'lodash';
export const LANG_STORAGE_KEY = 'lang';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        translation: merge(viCommon, viOverride),
      },
      en: {
        translation: enCommon,
      },
      lo: {
        translation: loCommon,
      },
      km: {
        translation: kmCommon,
      },
    },

    fallbackLng: 'vi',

    supportedLngs: ['vi', 'en', 'lo', 'km'],
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANG_STORAGE_KEY,
      caches: ['localStorage'],
      convertDetectedLanguage: (lng: string) => {
        if (lng.startsWith('vi')) return 'vi';
        if (lng.startsWith('en')) return 'en';
        if (lng.startsWith('lo')) return 'lo';
        if (lng.startsWith('km')) return 'km';
        return lng;
      },
    },
  });

export default i18n;
