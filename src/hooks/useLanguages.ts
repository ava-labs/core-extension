import {
  LanguageLinks,
  Languages,
} from '@src/background/services/settings/models';
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
      linkCode: LanguageLinks.EN,
    },
    {
      code: Languages.ZHCN,
      name: t('Chinese - Simplified'),
      originalName: '简体中文',
      linkCode: LanguageLinks.ZHCN,
    },
    {
      code: Languages.ZHTW,
      name: t('Chinese - Traditional'),
      originalName: '繁體中文',
      linkCode: LanguageLinks.ZHTW,
    },
    {
      code: Languages.DE,
      name: t('German'),
      originalName: 'Deutsch',
      linkCode: LanguageLinks.DE,
    },
    {
      code: Languages.HI,
      name: t('Hindi'),
      originalName: 'हिन्दी',
      linkCode: LanguageLinks.HI,
    },
    {
      code: Languages.JA,
      name: t('Japanese'),
      originalName: '日本',
      linkCode: LanguageLinks.JA,
    },
    {
      code: Languages.KO,
      name: t('Korean'),
      originalName: '한국인',
      linkCode: LanguageLinks.KO,
    },
    {
      code: Languages.RU,
      name: t('Russian'),
      originalName: 'Русский',
      linkCode: LanguageLinks.RU,
    },
    {
      code: Languages.ES,
      name: t('Spanish'),
      originalName: 'Español',
      linkCode: LanguageLinks.ES,
    },
    {
      code: Languages.TR,
      name: t('Turkish'),
      originalName: 'Türk',
      linkCode: LanguageLinks.TR,
    },
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
