import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { FireblocksBtcAccessErrorCode } from '@src/background/services/fireblocks/models';
import getFireblocksBtcAccessErrorCode from '@src/background/services/fireblocks/utils/getFireblocksBtcAccessErrorCode';

export const useFireblocksErrorMessage = () => {
  const { t } = useTranslation();

  const getErrorMessage = useCallback(
    (rawMessage: string) => {
      const btcAccessErrorCode = getFireblocksBtcAccessErrorCode(rawMessage);

      switch (btcAccessErrorCode) {
        case FireblocksBtcAccessErrorCode.BTCAddressNotFound:
          return t(
            'The BTC address could not be found for the connected vault account. Ensure your vault account has BTC wallet with a SEGWIT address format configured.'
          );

        case FireblocksBtcAccessErrorCode.VaultAccountNotFound:
          return t(
            'Could not find any vault account with the specified EVM address'
          );

        case FireblocksBtcAccessErrorCode.WrongAccountType:
          return t(
            'Fireblocks API credentials can only be configured for accounts imported from Fireblocks'
          );

        case FireblocksBtcAccessErrorCode.InvalidSecretKey:
          return t(
            'Invalid secret key was provided. Please make sure it is a valid PEM-encoded PKCS#8 string'
          );

        case FireblocksBtcAccessErrorCode.SecretsNotConfigured:
          return t('API credentials have not been provided');

        default:
          return t('An error occurred. Please reach out to Core Support');
      }
    },
    [t]
  );

  return {
    getErrorMessage,
  };
};
