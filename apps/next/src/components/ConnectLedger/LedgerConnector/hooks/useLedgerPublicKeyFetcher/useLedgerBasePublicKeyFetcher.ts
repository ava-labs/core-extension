import { useCallback, useEffect, useState } from 'react';
import {
  DerivationPath,
  getAddressPublicKeyFromXPub,
} from '@avalabs/core-wallets-sdk';

import {
  LedgerAppType,
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
  useDuplicatedWalletChecker,
} from '@core/ui';
import { EVM_BASE_DERIVATION_PATH, SecretType } from '@core/types';
import {
  getAvalancheExtendedKeyPath,
  isLedgerVersionCompatible,
} from '@core/common';

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
  if (!derivationPathSpec) {
    throw new Error('Derivation path spec is required');
  }

  const {
    appType,
    avaxAppVersion,
    popDeviceSelection,
    hasLedgerTransport,
    wasTransportAttempted,
    initLedgerTransport,
    getExtendedPublicKey,
  } = useLedgerContext();
  const checkIfWalletExists = useDuplicatedWalletChecker();

  const [error, setError] = useState<ErrorType>();
  const [status, setStatus] = useState<DerivationStatus>('waiting');

  const getExtendedPublicKeys = useCallback(
    async (indexes: number[]) => {
      const xpExtendedPublicKeys: { index: number; key: string }[] = [];

      for (const index of indexes) {
        xpExtendedPublicKeys.push({
          index,
          key: await getExtendedPublicKey(getAvalancheExtendedKeyPath(index)),
        });
      }

      return {
        evm: await getExtendedPublicKey(EVM_BASE_DERIVATION_PATH),
        xp: xpExtendedPublicKeys,
      };
    },
    [getExtendedPublicKey],
  );

  const getPublicKeys = useCallback(
    async (indexes: number[]) => {
      const publicKeys: PublicKey[] = [];
      const { evm, xp: xpExtendedKeys } = await getExtendedPublicKeys(indexes);

      for (const index of indexes) {
        const evmKey = await getAddressPublicKeyFromXPub(evm, index);
        publicKeys.push({
          index,
          vm: 'EVM',
          key: buildAddressPublicKey(evmKey, 'EVM', index, 'secp256k1'),
        });
      }

      for (const { key: xpubXP, index } of xpExtendedKeys) {
        const addressPublicKey = await getAddressPublicKeyFromXPub(xpubXP, 0);

        publicKeys.push({
          index,
          vm: 'AVM',
          key: buildAddressPublicKey(
            addressPublicKey,
            'AVM',
            index,
            'secp256k1',
          ),
        });
      }

      return {
        extendedPublicKeys: [
          buildExtendedPublicKey(evm, EVM_BASE_DERIVATION_PATH),
          ...xpExtendedKeys.map(({ key, index }) =>
            buildExtendedPublicKey(key, getAvalancheExtendedKeyPath(index)),
          ),
        ],
        addressPublicKeys: publicKeys,
      };
    },
    [getExtendedPublicKeys],
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
        const keys = await getPublicKeys(indexes);

        await assertUniqueWallet(keys);

        return keys;
      } catch (err) {
        console.error(err);
        popDeviceSelection();
        throw err;
      }
    },
    [getPublicKeys, popDeviceSelection, assertUniqueWallet],
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
