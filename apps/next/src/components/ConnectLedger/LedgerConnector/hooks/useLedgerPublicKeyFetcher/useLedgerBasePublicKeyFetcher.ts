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
import { LedgerError, SecretType } from '@core/types';
import {
  assert,
  getAvalancheExtendedKeyPath,
  getEvmExtendedKeyPath,
  isLedgerVersionCompatible,
} from '@core/common';

import { MAX_ACCOUNTS_TO_CREATE } from '@/config/onboarding';
import { useCheckAddressActivity } from '@/hooks/useCheckAddressActivity';

import {
  DerivationStatus,
  DerivedKeys,
  ErrorType,
  ExtendedPublicKeyMap,
  PublicKey,
  UseLedgerPublicKeyFetcher,
  WalletExistsError,
} from '../../types';
import { buildAddressPublicKey, buildExtendedPublicKey } from '../../util';

export const useLedgerBasePublicKeyFetcher: UseLedgerPublicKeyFetcher = (
  derivationPathSpec,
  onActivePublicKeysDiscovered,
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
  const checkAddressActivity = useCheckAddressActivity();

  const [error, setError] = useState<ErrorType>();
  const [status, setStatus] = useState<DerivationStatus>('waiting');

  const getEvmExtendedPublicKeys = useCallback(
    async (indexes: number[]) => {
      const evmExtendedPublicKeys: ExtendedPublicKeyMap = new Map();

      for (const index of indexes) {
        evmExtendedPublicKeys.set(
          index,
          await getExtendedPublicKey(getEvmExtendedKeyPath(index)),
        );
      }

      return evmExtendedPublicKeys;
    },
    [getExtendedPublicKey],
  );

  const getXpExtendedPublicKeys = useCallback(
    async (indexes: number[]) => {
      const xpExtendedPublicKeys: { index: number; key: string }[] = [];

      for (const index of indexes) {
        xpExtendedPublicKeys.push({
          index,
          key: await getExtendedPublicKey(getAvalancheExtendedKeyPath(index)),
        });
      }

      return xpExtendedPublicKeys;
    },
    [getExtendedPublicKey],
  );

  const getXpPublicKeys = useCallback(
    async (indexes: number[]) => {
      const publicKeys: PublicKey[] = [];
      const xpExtendedKeys = await getXpExtendedPublicKeys(indexes);

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
            derivationPathSpec,
          ),
        });
      }

      return {
        extendedPublicKeys: [
          ...xpExtendedKeys.map(({ key, index }) =>
            buildExtendedPublicKey(key, getAvalancheExtendedKeyPath(index)),
          ),
        ],
        addressPublicKeys: publicKeys,
      };
    },
    [getXpExtendedPublicKeys, derivationPathSpec],
  );

  const assertUniqueWallet = useCallback(
    async (firstXpub: string) => {
      let isDuplicated = false;

      if (derivationPathSpec === DerivationPath.LedgerLive) {
        isDuplicated = await checkIfWalletExists(
          SecretType.LedgerLive,
          firstXpub,
        );
      } else {
        isDuplicated = await checkIfWalletExists(SecretType.Ledger, firstXpub);
      }

      if (isDuplicated) {
        setStatus('error');
        setError('duplicated-wallet');
        throw new WalletExistsError('This wallet is already imported');
      }
    },
    [derivationPathSpec, checkIfWalletExists],
  );

  const getEvmPublicKeysFromXpubs = useCallback(
    async (xpubs: ExtendedPublicKeyMap, indexes: number[]) => {
      const evmPublicKeys: PublicKey[] = [];
      for (const index of indexes) {
        // For BIP44 paths, we need to use the XPUB for account index 0
        // For LedgerLive, we need to use the XPUB for the account index we're interested in
        const xpubIndex =
          derivationPathSpec === DerivationPath.BIP44 ? 0 : index;

        // For BIP44 paths, we need to use the address index we're interested in
        // For LedgerLive, we need to use the address index 0
        const addressIndex =
          derivationPathSpec === DerivationPath.BIP44 ? index : 0;

        const xpub = xpubs.get(xpubIndex);

        assert(xpub, LedgerError.NoExtendedPublicKeyReturned);

        const addressPublicKey = await getAddressPublicKeyFromXPub(
          xpub,
          addressIndex,
        );

        evmPublicKeys.push({
          index,
          hasActivity: await checkAddressActivity(addressPublicKey).catch(
            () => false, // Default to false, make sure we don't block the flow if the check fails
          ),
          vm: 'EVM',
          key: buildAddressPublicKey(
            addressPublicKey,
            'EVM',
            index,
            'secp256k1',
            derivationPathSpec,
          ),
        });
      }

      return evmPublicKeys;
    },
    [derivationPathSpec, checkAddressActivity],
  );

  const shouldContinue = useCallback((evmPublicKeys: PublicKey[]) => {
    // Do not derive more than 10.
    if (evmPublicKeys.length >= MAX_ACCOUNTS_TO_CREATE) {
      return false;
    }
    // If one of the last two addresses has activity, we need to continue looking
    return evmPublicKeys.slice(-2).some(({ hasActivity }) => hasActivity);
  }, []);

  const retrieveEvmKeys = useCallback(
    async (startingIndexes: number[]) => {
      const minNumberOfKeys = startingIndexes.length;
      const evmExtendedPublicKeys = await getEvmExtendedPublicKeys(
        derivationPathSpec === DerivationPath.BIP44 ? [0] : startingIndexes, // For BIP44, we only need to get the EVM extended public key for account index 0
      );
      const evmPublicKeys = await getEvmPublicKeysFromXpubs(
        evmExtendedPublicKeys,
        startingIndexes,
      );

      onActivePublicKeysDiscovered?.(evmPublicKeys);

      await assertUniqueWallet(evmExtendedPublicKeys.get(0)!);

      let currentIndex = startingIndexes.at(-1)!;

      while (shouldContinue(evmPublicKeys)) {
        currentIndex += 1;

        if (derivationPathSpec === DerivationPath.LedgerLive) {
          evmExtendedPublicKeys.set(
            currentIndex,
            await getExtendedPublicKey(getEvmExtendedKeyPath(currentIndex)),
          );
        }

        const newEvmKeys = await getEvmPublicKeysFromXpubs(
          evmExtendedPublicKeys,
          [currentIndex],
        );
        evmPublicKeys.push(...newEvmKeys);

        if (newEvmKeys.some(({ hasActivity }) => hasActivity)) {
          onActivePublicKeysDiscovered?.(evmPublicKeys);
        }
      }

      // Remove trailing public keys if they do not have activity
      while (
        evmPublicKeys.length > minNumberOfKeys &&
        !evmPublicKeys.at(-1)?.hasActivity
      ) {
        evmPublicKeys.pop();
      }

      return {
        extendedPublicKeys: evmExtendedPublicKeys,
        addressPublicKeys: evmPublicKeys,
      };
    },
    [
      getEvmExtendedPublicKeys,
      getEvmPublicKeysFromXpubs,
      assertUniqueWallet,
      derivationPathSpec,
      shouldContinue,
      getExtendedPublicKey,
      onActivePublicKeysDiscovered,
    ],
  );

  const retrieveKeys = useCallback(
    async (minNumberOfKeys: number) => {
      if (minNumberOfKeys < 1) {
        throw new Error('Min number of keys must be greater than 0');
      }

      const startingIndexes = Array.from(
        { length: minNumberOfKeys },
        (_, i) => i,
      );

      onActivePublicKeysDiscovered?.([]); // Clear the active public keys

      try {
        const {
          addressPublicKeys: evmAddressPublicKeys,
          extendedPublicKeys: evmExtendedPublicKeys,
        } = await retrieveEvmKeys(startingIndexes);

        const xpIndexes = evmAddressPublicKeys.map(({ index }) => index);

        const {
          addressPublicKeys: xpAddressPublicKeys,
          extendedPublicKeys: xpExtendedPublicKeys,
        } = await getXpPublicKeys(xpIndexes);

        return {
          addressPublicKeys: [...evmAddressPublicKeys, ...xpAddressPublicKeys],
          extendedPublicKeys: [
            ...evmExtendedPublicKeys
              .entries()
              .map(([index, value]) =>
                buildExtendedPublicKey(value, getEvmExtendedKeyPath(index)),
              ),
            ...xpExtendedPublicKeys,
          ],
        } satisfies DerivedKeys;
      } catch (err) {
        console.error(err);
        popDeviceSelection();
        throw err;
      }
    },
    [
      popDeviceSelection,
      retrieveEvmKeys,
      getXpPublicKeys,
      onActivePublicKeysDiscovered,
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
      }, 5_000); // Wait 5 seconds to obtain the connection, then show an error message with some instructions

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
