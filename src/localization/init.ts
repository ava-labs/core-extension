import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
i18next
  .use(initReactI18next)
  .use(HttpApi) // Registering the back-end plugin
  .init({
    // Remove resources from here
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: [
      'en',
      'de-DE',
      'hi-IN',
      'ko-KR',
      'ru-RU',
      'tr-TR',
      'zh-CN',
      'zh-TW',
      'es-EM',
      'ja-JP',
    ],
    interpolation: {
      escapeValue: false,
    },
    // turn on if you want to print out to the console the whole translation object (e.g. check your key and value has been added to the json)
    debug: false,
  });

export default i18next;
