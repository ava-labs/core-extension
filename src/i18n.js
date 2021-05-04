import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import languageAF from '@src/locales/aafrikans.json';
import languageAR from '@src/locales/arabic.json';
import languageCA from '@src/locales/ca.json';
import languageCS from '@src/locales/cs.json';
import languageDA from '@src/locales/danish.json';
import languageEN from '@src/locales/en.json';
import languageES from '@src/locales/es.json';
import languageFI from '@src/locales/finnish.json';
import languageFR from '@src/locales/fr.json';
import languageEL from '@src/locales/greek.json';
import languageHE from '@src/locales/hebrew.json';
import languageHU from '@src/locales/hungarian.json';
import languageIT from '@src/locales/it.json';
import languageJP from '@src/locales/japanese.json';
import languageKR from '@src/locales/kr.json';
import languageNL from '@src/locales/nl.json';
import languageNO from '@src/locales/norwegian.json';
import languagePL from '@src/locales/polish.json';
import languagePT from '@src/locales/pt.json';
import languageRO from '@src/locales/romanian.json';
import languageRU from '@src/locales/ru.json';
import languageSR from '@src/locales/serbian.json';
import languageSV from '@src/locales/swedish.json';
import languageTH from '@src/locales/thai.json';
import languageTR from '@src/locales/tr.json';
import languageUK from '@src/locales/uk.json';
import languageVN from '@src/locales/vn.json';
import languageZH_HANS from '@src/locales/zh_hans.json';
import languageZH_HANT from '@src/locales/zh_hant.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      af: { translation: languageAF },
      ar: { translation: languageAR },
      ca: { translation: languageCA },
      cs: { translation: languageCS },
      da: { translation: languageDA },
      en: { translation: languageEN },
      eS: { translation: languageES },
      fi: { translation: languageFI },
      fr: { translation: languageFR },
      jp: { translation: languageJP },
      el: { translation: languageEL },
      he: { translation: languageHE },
      hu: { translation: languageHU },
      it: { translation: languageIT },
      kr: { translation: languageKR },
      nl: { translation: languageNL },
      no: { translation: languageNO },
      pl: { translation: languagePL },
      pt: { translation: languagePT },
      ro: { translation: languageRO },
      ru: { translation: languageRU },
      sr: { translation: languageSR },
      sv: { translation: languageSV },
      th: { translation: languageTH },
      tr: { translation: languageTR },
      uk: { translation: languageUK },
      vn: { translation: languageVN },
      zh_hans: { translation: languageZH_HANS },
      zh_hant: { translation: languageZH_HANT },
    },
    // backend: {
    //   loadPath: '/src/locales/{{lng}}.json',
    // },
    lng: 'en',
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production' ? true : false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
  });

export default i18n;
