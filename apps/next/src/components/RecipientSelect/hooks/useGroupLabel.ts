import { Group } from '@/components/SearchableSelect';
import { useTranslation } from 'react-i18next';
import { Recipient } from '../types';

export const useGroupLabel = () => {
  const { t } = useTranslation();

  return (recipient: Group<Recipient>) => {
    switch (recipient.id) {
      case 'account':
        return t('My Accounts');
      case 'contact':
        return t('Contacts');
      case 'recent':
        return t('Recents');
      default:
        return t('Unknown');
    }
  };
};
