import { Languages } from '@src/background/services/settings/models';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useTranslation } from 'react-i18next';

export function useLanguage() {
  const { setLanguage, language } = useSettingsContext();
  const changeLanguage = (lang: Languages) => setLanguage(lang);
  const { t } = useTranslation();

  const availableLanguages = [
    {
      code: Languages.EN,
      name: t('English'),
      originalName: 'English',
    },
    {
      code: Languages.DE,
      name: t('German'),
      originalName: 'Deutsch',
    },
    {
      code: Languages.HI,
      name: t('Hindi'),
      originalName: 'हिन्दी',
    },
    {
      code: Languages.KO,
      name: t('Korean'),
      originalName: '한국인',
    },
    {
      code: Languages.RU,
      name: t('Russian'),
      originalName: 'Русский',
    },
    {
      code: Languages.TR,
      name: t('Turkish'),
      originalName: 'Türk',
    },
    {
      code: Languages.ZH,
      name: t('Chinese'),
      originalName: '简体中文',
    },
    {
      code: Languages.ES,
      name: t('Spanish'),
      originalName: 'Español',
    },
    // {
    //   code: Languages.JA,
    //   label: 'Japanese (日本)',
    //   name: '日本',
    // },
  ];

  const currentLanguage = availableLanguages.find(
    (lang) => lang.code === language
  );
  return {
    changeLanguage,
    availableLanguages,
    currentLanguage,
  };
}
