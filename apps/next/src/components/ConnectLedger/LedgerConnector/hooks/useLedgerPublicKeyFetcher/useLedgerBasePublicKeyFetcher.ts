import {
  Avalanche,
  DerivationPath,
  getAddressPublicKeyFromXPub,
} from '@avalabs/core-wallets-sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  LedgerAppType,
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
  useDuplicatedWalletChecker,
  useActiveLedgerAppInfo,
} from '@core/ui';
import {
  DerivationStatus,
  IsKnownSecretResult,
  LedgerError,
  SecretType,
} from '@core/types';
import {
  AVALANCHE_LEDGER_APP_NAME,
  assert,
  getAvalancheExtendedKeyPath,
  getEvmExtendedKeyPath,
  getLedgerAutoOpenAppFailedMessage,
  getLedgerQuitAppFailedMessage,
  isLedgerVersionCompatible,
} from '@core/common';

import { MAX_ACCOUNTS_TO_CREATE } from '@/config/onboarding';
import { useCheckAddressActivity } from '@/hooks/useCheckAddressActivity';
import { useCheckXPAddressBalance } from '@/hooks/useCheckXPAddressBalance';

import { getLedgerTransport } from '@core/ui/src/contexts/utils/getLedgerTransport';
import {
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
    popDeviceSelection,
    hasLedgerTransport,
    wasTransportAttempted,
    initLedgerTransport,
    getExtendedPublicKey,
    prepareTransportForAvalancheOnboarding,
  } = useLedgerContext();
  const { appType, appVersion } = useActiveLedgerAppInfo(true);
  const checkIfWalletExists = useDuplicatedWalletChecker();
  const checkAddressActivity = useCheckAddressActivity();
  const checkXPAddressBalance = useCheckXPAddressBalance();

  const avalancheProvider = useMemo(
    () => Avalanche.JsonRpcProvider.getDefaultMainnetProvider(),
    [],
  );

  const [error, setError] = useState<ErrorType>();
  const [duplicatedWalletName, setDuplicatedWalletName] = useState<string>();
  const [status, setStatus] = useState<DerivationStatus>('waiting');
  const [wasManualConnectionAttempted, setWasManualConnectionAttempted] =
    useState(false);
  const appSwitchInFlight = useRef(false);

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

  const deriveXpKeyForIndex = useCallback(
    async (index: number) => {
      const xpubXP = await getExtendedPublicKey(
        getAvalancheExtendedKeyPath(index),
      );
      const addressPublicKey = await getAddressPublicKeyFromXPub(xpubXP, 0);

      const xpAddress = avalancheProvider.getAddress(addressPublicKey, 'X');
      const hasXPActivity = await checkXPAddressBalance(xpAddress).catch(
        () => false,
      );

      return {
        avmKey: {
          index,
          vm: 'AVM' as const,
          hasActivity: hasXPActivity,
          key: buildAddressPublicKey(
            addressPublicKey,
            'AVM',
            index,
            'secp256k1',
            derivationPathSpec,
          ),
        },
        extendedKey: { index, key: xpubXP },
      };
    },
    [
      getExtendedPublicKey,
      avalancheProvider,
      checkXPAddressBalance,
      derivationPathSpec,
    ],
  );

  const assertUniqueWallet = useCallback(
    async (firstXpub: string) => {
      let checkResult: IsKnownSecretResult = { isKnown: false };

      setDuplicatedWalletName(undefined);

      if (derivationPathSpec === DerivationPath.LedgerLive) {
        checkResult = await checkIfWalletExists(
          SecretType.LedgerLive,
          firstXpub,
        );
      } else {
        checkResult = await checkIfWalletExists(SecretType.Ledger, firstXpub);
      }

      if (checkResult.isKnown) {
        setStatus('error');
        setError('duplicated-wallet');
        setDuplicatedWalletName(checkResult.name);
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

  const retrieveAllKeys = useCallback(
    async (startingIndexes: number[]) => {
      const minNumberOfKeys = startingIndexes.length;
      const evmExtendedPublicKeys = await getEvmExtendedPublicKeys(
        derivationPathSpec === DerivationPath.BIP44 ? [0] : startingIndexes,
      );
      const evmPublicKeys = await getEvmPublicKeysFromXpubs(
        evmExtendedPublicKeys,
        startingIndexes,
      );

      const avmPublicKeys: PublicKey[] = [];
      const xpExtendedKeys: { index: number; key: string }[] = [];

      for (const index of startingIndexes) {
        const { avmKey, extendedKey } = await deriveXpKeyForIndex(index);
        avmPublicKeys.push(avmKey);
        xpExtendedKeys.push(extendedKey);

        const evmKey = evmPublicKeys.find((k) => k.index === index);
        if (evmKey && !evmKey.hasActivity && avmKey.hasActivity) {
          evmKey.hasActivity = true;
        }
      }

      onActivePublicKeysDiscovered?.([...evmPublicKeys, ...avmPublicKeys]);

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

        const { avmKey, extendedKey } = await deriveXpKeyForIndex(currentIndex);
        avmPublicKeys.push(avmKey);
        xpExtendedKeys.push(extendedKey);

        const [firstEvmKey] = newEvmKeys;
        if (firstEvmKey) {
          firstEvmKey.hasActivity ||= avmKey.hasActivity;
        }

        evmPublicKeys.push(...newEvmKeys);

        if (newEvmKeys.some(({ hasActivity }) => hasActivity)) {
          onActivePublicKeysDiscovered?.([...evmPublicKeys, ...avmPublicKeys]);
        }
      }

      // Remove trailing public keys if they do not have activity
      while (
        evmPublicKeys.length > minNumberOfKeys &&
        !evmPublicKeys.at(-1)?.hasActivity
      ) {
        evmPublicKeys.pop();
        avmPublicKeys.pop();
      }

      return {
        evmExtendedPublicKeys,
        evmPublicKeys,
        avmPublicKeys,
        xpExtendedKeys,
      };
    },
    [
      getEvmExtendedPublicKeys,
      getEvmPublicKeysFromXpubs,
      deriveXpKeyForIndex,
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
          evmExtendedPublicKeys,
          evmPublicKeys,
          avmPublicKeys,
          xpExtendedKeys,
        } = await retrieveAllKeys(startingIndexes);

        return {
          addressPublicKeys: [...evmPublicKeys, ...avmPublicKeys],
          extendedPublicKeys: [
            ...evmExtendedPublicKeys
              .entries()
              .map(([index, value]) =>
                buildExtendedPublicKey(value, getEvmExtendedKeyPath(index)),
              ),
            ...xpExtendedKeys.map(({ key, index }) =>
              buildExtendedPublicKey(key, getAvalancheExtendedKeyPath(index)),
            ),
          ],
        } satisfies DerivedKeys;
      } catch (err) {
        console.error(err);
        popDeviceSelection();
        throw err;
      }
    },
    [popDeviceSelection, retrieveAllKeys, onActivePublicKeysDiscovered],
  );

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
    // If we have a duplicated wallet error, always wait for user action,
    // do not attempt a reconnection.
    if (error === 'duplicated-wallet' || status === 'needs-user-gesture') {
      return;
    }

    if (hasLedgerTransport) {
      if (appType === LedgerAppType.AVALANCHE && appVersion) {
        if (isLedgerVersionCompatible(appVersion, REQUIRED_LEDGER_VERSION)) {
          setStatus('ready');
          setError(undefined);
        } else {
          setStatus('error');
          setError('unsupported-version');
        }
        return;
      }

      if (status === 'error' && error) {
        return;
      }

      if (appSwitchInFlight.current) {
        return;
      }

      setStatus('waiting');
      setError(undefined);

      let cancelled = false;
      appSwitchInFlight.current = true;

      prepareTransportForAvalancheOnboarding()
        .catch((err: unknown) => {
          if (cancelled) {
            return;
          }
          const message = err instanceof Error ? err.message : String(err);
          if (message.includes('not installed on this Ledger device')) {
            setStatus('error');
            setError('app-not-installed');
            return;
          }
          if (
            message ===
            getLedgerAutoOpenAppFailedMessage(AVALANCHE_LEDGER_APP_NAME)
          ) {
            setStatus('error');
            setError('no-app');
            return;
          }
          if (message === getLedgerQuitAppFailedMessage()) {
            setStatus('error');
            setError('no-app');
            return;
          }
          if (message.includes('no device detected')) {
            setStatus('error');
            setError('unable-to-connect');
            return;
          }
          setStatus('error');
          setError('device-locked');
        })
        .finally(() => {
          appSwitchInFlight.current = false;
        });

      return () => {
        cancelled = true;
      };
    } else if (!hasLedgerTransport && !wasTransportAttempted) {
      initLedgerTransport();
    } else if (!hasLedgerTransport && !wasManualConnectionAttempted) {
      getLedgerTransport().then((transport) => {
        if (!transport) {
          // If it fails, it's either disconnected or the call was not triggered by user gesture.
          setStatus('needs-user-gesture');
          setWasManualConnectionAttempted(true);
        }
      });
    }
  }, [
    appType,
    appVersion,
    hasLedgerTransport,
    initLedgerTransport,
    status,
    wasTransportAttempted,
    popDeviceSelection,
    error,
    wasManualConnectionAttempted,
    prepareTransportForAvalancheOnboarding,
  ]);

  const onRetry = useCallback(async () => {
    try {
      await popDeviceSelection();
      await initLedgerTransport();
      setError(undefined);
      setStatus('waiting');
    } catch {
      setStatus('error');
      setError('unable-to-connect');
    }
  }, [popDeviceSelection, initLedgerTransport]);

  return {
    status,
    error,
    duplicatedWalletName,
    retrieveKeys,
    onRetry,
  };
};
