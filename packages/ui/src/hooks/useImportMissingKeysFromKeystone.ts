import { useCallback, useEffect } from 'react';
import { ChainIDAlias } from '@keystonehq/hw-app-avalanche';
import { getAddressFromXPub } from '@avalabs/core-wallets-sdk';

import {
  useWalletContext,
  useAccountsContext,
  useConnectionContext,
  useKeystoneUsbContext,
} from '../contexts';
import { ExtensionRequest } from '@core/types';
import { MigrateMissingPublicKeysFromKeystoneHandler } from '@core/service-worker';

export const useImportMissingKeysFromKeystone = () => {
  const { isWalletLocked, isKeystoneUsbWallet, walletDetails } =
    useWalletContext();
  const { request } = useConnectionContext();
  const {
    hasKeystoneTransport,
    getExtendedPublicKey,
    wasTransportAttempted,
    initKeystoneTransport,
  } = useKeystoneUsbContext();

  const { getAccountByIndex, getAccountsByWalletId } = useAccountsContext();

  const firstEvmAddress = getAccountByIndex(0)?.addressC;

  const verifyAndImport = useCallback(
    async (existingAddress: string) => {
      try {
        const evmXpub = await getExtendedPublicKey(ChainIDAlias.C, 0);
        const firstEvmAddressFromDevice = getAddressFromXPub(evmXpub, 0);

        const isCorrectDevice = firstEvmAddressFromDevice === existingAddress;

        if (isCorrectDevice) {
          await request<MigrateMissingPublicKeysFromKeystoneHandler>({
            method: ExtensionRequest.KEYSTONE_MIGRATE_MISSING_PUBKEYS,
          });
        }
      } catch (_err) {
        // some problem occured with the provider
        // just wait until KeystoneUsbProvider establishes the connection again
      }
    },
    [getExtendedPublicKey, request],
  );

  useEffect(() => {
    if (
      isWalletLocked ||
      !isKeystoneUsbWallet ||
      !firstEvmAddress ||
      !walletDetails
    ) {
      return;
    }

    const allWalletAccounts = getAccountsByWalletId(walletDetails.id);
    const hasMissingAddresses = allWalletAccounts.some(
      (account) =>
        !account.addressPVM || !account.addressAVM || !account.addressCoreEth,
    );

    if (!hasMissingAddresses) {
      return;
    }

    if (hasKeystoneTransport) {
      verifyAndImport(firstEvmAddress);
    } else if (!hasKeystoneTransport && !wasTransportAttempted) {
      initKeystoneTransport();
    }
  }, [
    verifyAndImport,
    hasKeystoneTransport,
    wasTransportAttempted,
    initKeystoneTransport,
    firstEvmAddress,
    isWalletLocked,
    isKeystoneUsbWallet,
    walletDetails,
    getAccountsByWalletId,
  ]);
};
