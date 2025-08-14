import { useTranslation } from 'react-i18next';
import { Recipient } from '../types';

export const useRecipientName = () => {
  const { t } = useTranslation();

  return (recipient: Recipient) => {
    switch (recipient.type) {
      case 'account':
        return recipient.account.name;
      case 'contact':
        return recipient.contact.name;
      case 'recent':
        return t('Recent');
      case 'unknown':
        return t('Unknown');
    }
  };
};
