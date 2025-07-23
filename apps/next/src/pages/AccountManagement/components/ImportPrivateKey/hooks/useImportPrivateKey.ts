import { utils } from '@avalabs/avalanchejs';
import {
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPublicKeyFromPrivateKey,
} from '@avalabs/core-wallets-sdk';
import { Monitoring } from '@core/common';
import { ImportType } from '@core/types';
import { useAccountsContext, useNetworkContext } from '@core/ui';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { networks } from 'bitcoinjs-lib';

export const useImportPrivateKey = () => {
  const { t } = useTranslation();
  const [isImporting, setIsImporting] = useState(false);

  const { addAccount, allAccounts } = useAccountsContext();
  const { network } = useNetworkContext();

  const importPrivateKey = useCallback(
    async (privateKey: string) => {
      setIsImporting(true);

      try {
        const accountId = await addAccount('', {
          importType: ImportType.PRIVATE_KEY,
          data: utils.strip0x(privateKey),
        });

        return accountId;
      } catch (err: unknown) {
        if (!(err instanceof Error)) {
          throw new Error('Failed to import private key');
        }

        Monitoring.sentryCaptureException(
          err,
          Monitoring.SentryExceptionTypes.WALLET_IMPORT,
        );
        throw err;
      } finally {
        setIsImporting(false);
      }
    },
    [addAccount],
  );

  const checkIfAccountExists = useCallback(
    (address: string) => {
      const lowercasedAddress = address.toLowerCase();
      const findAccount = allAccounts.find(
        ({ addressC }) => addressC.toLowerCase() === lowercasedAddress,
      );
      return !!findAccount;
    },
    [allAccounts],
  );

  const getDerivedAddresses = useCallback(
    (valueToValidate: string) => {
      const validationError = t(
        'The key you entered is invalid. Please try again',
      );

      const strippedPk = utils.strip0x(valueToValidate);

      if (strippedPk.length !== 64) {
        throw new Error(validationError);
      }

      try {
        const publicKey = getPublicKeyFromPrivateKey(strippedPk);
        const addressC = getEvmAddressFromPubKey(publicKey);
        const isKnownAddress = checkIfAccountExists(addressC);
        const addressBTC = getBtcAddressFromPubKey(
          publicKey,
          network?.isTestnet ? networks.testnet : networks.bitcoin,
        );
        return {
          isKnownAddress,
          derivedAddresses: {
            addressC,
            addressBTC,
          },
        };
      } catch (_err) {
        throw new Error(validationError);
      }
    },
    [checkIfAccountExists, network?.isTestnet, t],
  );

  return {
    isImporting,
    importPrivateKey,
    getDerivedAddresses,
  };
};
