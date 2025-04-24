import { t } from 'i18next';

import { SendErrorMessage } from '@core/types';

export function getSendErrorMessage(
  key: SendErrorMessage,
  details?: Record<string, string | undefined>,
): string {
  if (key === SendErrorMessage.AMOUNT_TOO_LOW) {
    return details?.minAmount
      ? t('At least {{minAmount}} is required', details)
      : t('Amount too low');
  }

  const translations = {
    [SendErrorMessage.AMOUNT_REQUIRED]: t('Amount required'),
    [SendErrorMessage.ADDRESS_REQUIRED]: t('Address required'),
    [SendErrorMessage.INVALID_ADDRESS]: t('Address is invalid'),
    [SendErrorMessage.INVALID_NETWORK_FEE]: t('Network Fee is invalid'),
    [SendErrorMessage.INSUFFICIENT_BALANCE]: t('Insufficient balance.'),
    [SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE]: t(
      'Insufficient balance for fee',
    ),
    [SendErrorMessage.TOKEN_REQUIRED]: t('Token is required'),
    [SendErrorMessage.UNABLE_TO_FETCH_UTXOS]: t(
      'Internal error. Please try again',
    ),
    [SendErrorMessage.UNSUPPORTED_TOKEN]: t('Unsupported token'),
    [SendErrorMessage.UNKNOWN_ERROR]: t('Unknown error'),
    [SendErrorMessage.EXCESSIVE_NETWORK_FEE]: t('Selected fee is too high'),
  };

  return translations[key] ?? key;
}
