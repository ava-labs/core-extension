import { useCallback, useEffect, useState } from 'react';
import {
  DerivationPath,
  getAddressPublicKeyFromXPub,
} from '@avalabs/core-wallets-sdk';
import { VM } from '@avalabs/avalanchejs';

import {
  LedgerAppType,
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
  useDuplicatedWalletChecker,
} from '@core/ui';
import {
  AddressPublicKeyJson,
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
  SecretType,
} from '@core/types';
import { isLedgerVersionCompatible } from '@core/common';

import {
  DerivationStatus,
  DerivedKeys,
  ErrorType,
  PublicKey,
  UseLedgerPublicKeyFetcher,
  WalletExistsError,
} from '../../types';
import { buildAddressPublicKey, buildExtendedPublicKey } from '../../util';

export const useLedgerBasePublicKeyFetcher: UseLedgerPublicKeyFetcher = (
  derivationPathSpec,
) => {
  const {
    appType,
    avaxAppVersion,
    popDeviceSelection,
    hasLedgerTransport,
    wasTransportAttempted,
    initLedgerTransport,
    getExtendedPublicKey,
    getPublicKey,
  } = useLedgerContext();
  const checkIfWalletExists = useDuplicatedWalletChecker();

  const [error, setError] = useState<ErrorType>();
  const [status, setStatus] = useState<DerivationStatus>('waiting');

  const getPublicKeyFromLedger = useCallback(
    async (accountIndex: number, vm: VM): Promise<AddressPublicKeyJson> => {
      const publicKey = await getPublicKey(
        accountIndex,
        DerivationPath.LedgerLive,
        vm,
      );

      return buildAddressPublicKey(publicKey, vm, accountIndex, 'secp256k1');
    },
    [getPublicKey],
  );

  // Used with LedgerLive derivation path, as with such we cannot use the extended public keys
  const getKeysDirectlyFromLedger = useCallback(
    async (indexes: number[]) => {
      const keys: PublicKey[] = [];

      // We cannot send multiple requests to the ledger at once, so we need to do one at a time
      for (const index of indexes) {
        const evmKey = await getPublicKeyFromLedger(index, 'EVM');
        keys.push({
          index,
          vm: 'EVM',
          key: evmKey,
        });

        const xpKey = await getPublicKeyFromLedger(index, 'AVM');
        keys.push({
          index,
          vm: 'AVM',
          key: xpKey,
        });
      }

      return {
        addressPublicKeys: keys,
      };
    },
    [getPublicKeyFromLedger],
  );

  // Used with BIP44 derivation path, as it's way faster to get the keys from the extended public keys
  // and derive address public keys from them than to query the device many times more.
  //
  // Having the extended public keys also allows us to derive further addresses without connecting the device
  // later on.
  const getKeysFromExtendedPublicKeys = useCallback(
    async (indexes: number[]) => {
      const evmExtendedPublicKey = await getExtendedPublicKey(
        EVM_BASE_DERIVATION_PATH,
      );
      const xpExtendedPublicKey = await getExtendedPublicKey(
        AVALANCHE_BASE_DERIVATION_PATH,
      );

      const keys: PublicKey[] = [];

      // We cannot send multiple requests to the ledger at once, so we need to do one at a time
      for (const index of indexes) {
        const evmKey = await getAddressPublicKeyFromXPub(
          evmExtendedPublicKey,
          index,
        );
        keys.push({
          index,
          vm: 'EVM',
          key: buildAddressPublicKey(evmKey, 'EVM', index, 'secp256k1'),
        });

        const xpKey = await getAddressPublicKeyFromXPub(
          xpExtendedPublicKey,
          index,
        );
        keys.push({
          index,
          vm: 'AVM',
          key: buildAddressPublicKey(xpKey, 'AVM', index, 'secp256k1'),
        });
      }

      return {
        extendedPublicKeys: [
          buildExtendedPublicKey(
            evmExtendedPublicKey,
            EVM_BASE_DERIVATION_PATH,
          ),
          buildExtendedPublicKey(
            xpExtendedPublicKey,
            AVALANCHE_BASE_DERIVATION_PATH,
          ),
        ],
        addressPublicKeys: keys,
      };
    },
    [getExtendedPublicKey],
  );

  const assertUniqueWallet = useCallback(
    async (derivedKeys: DerivedKeys) => {
      let isDuplicated = false;

      if (derivationPathSpec === DerivationPath.LedgerLive) {
        const [addressKeyInfo] = derivedKeys.addressPublicKeys;

        isDuplicated = await checkIfWalletExists(
          SecretType.LedgerLive,
          addressKeyInfo!.key.key,
        );
      } else {
        const [extKeyInfo] = derivedKeys.extendedPublicKeys!;

        isDuplicated = await checkIfWalletExists(
          SecretType.Ledger,
          extKeyInfo!.key,
        );
      }

      if (isDuplicated) {
        setStatus('error');
        setError('duplicated-wallet');
        throw new WalletExistsError('This wallet is already imported');
      }
    },
    [derivationPathSpec, checkIfWalletExists],
  );

  const retrieveKeys = useCallback(
    async (indexes: number[]) => {
      try {
        const isLedgerLive = derivationPathSpec === DerivationPath.LedgerLive;
        const keys = isLedgerLive
          ? await getKeysDirectlyFromLedger(indexes)
          : await getKeysFromExtendedPublicKeys(indexes);

        await assertUniqueWallet(keys);

        return keys;
      } catch (err) {
        console.error(err);
        popDeviceSelection();
        throw err;
      }
    },
    [
      derivationPathSpec,
      getKeysDirectlyFromLedger,
      getKeysFromExtendedPublicKeys,
      popDeviceSelection,
      assertUniqueWallet,
    ],
  );

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    // If we have a duplicated wallet error, always wait for user action,
    // do not attempt a reconnection.
    if (error === 'duplicated-wallet') {
      return;
    }

    if (hasLedgerTransport) {
      if (appType === LedgerAppType.AVALANCHE && avaxAppVersion) {
        if (
          isLedgerVersionCompatible(avaxAppVersion, REQUIRED_LEDGER_VERSION)
        ) {
          setStatus('ready');
          setError(undefined);
        } else {
          setStatus('error');
          setError('unsupported-version');
        }
      } else {
        setStatus('waiting');
      }
    } else if (!hasLedgerTransport && !wasTransportAttempted) {
      initLedgerTransport();
    } else if (!hasLedgerTransport) {
      const timer = setTimeout(() => {
        setStatus('error');
        setError('unable-to-connect');
      }, 20_000); // Give the user 20 seconds to connect their ledger, then show an error message with some instructions

      return () => clearTimeout(timer);
    }
  }, [
    appType,
    avaxAppVersion,
    hasLedgerTransport,
    initLedgerTransport,
    status,
    retrieveKeys,
    wasTransportAttempted,
    popDeviceSelection,
    error,
  ]);

  const onRetry = useCallback(async () => {
    try {
      setError(undefined);
      await popDeviceSelection();
      await initLedgerTransport();
      setStatus('waiting');
    } catch {
      setStatus('error');
      setError('unable-to-connect');
    }
  }, [popDeviceSelection, initLedgerTransport]);

  return {
    status,
    error,
    retrieveKeys,
    onRetry,
  };
};
