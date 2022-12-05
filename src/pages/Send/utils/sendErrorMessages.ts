import { SendErrorMessage } from '@src/background/services/send/models';
import { t } from 'i18next';

export function getSendErrorMessage(key: SendErrorMessage): string {
  const translations = {
    [SendErrorMessage.AMOUNT_REQUIRED]: t('Amount required'),
    [SendErrorMessage.ADDRESS_REQUIRED]: t('Address required'),
    [SendErrorMessage.INVALID_ADDRESS]: t('Address is invalid'),
    [SendErrorMessage.INVALID_NETWORK_FEE]: t('Network Fee is invalid'),
    [SendErrorMessage.INSUFFICIENT_BALANCE]: t('Insufficient balance.'),
    [SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE]: t(
      'Insufficient balance for fee'
    ),
  };

  return translations[key] ?? key;
}
