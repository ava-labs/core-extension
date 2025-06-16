import { hex } from '@scure/base';
import { useCallback, useEffect, useState } from 'react';
import {
  DerivationPath,
  getAddressDerivationPath,
  getAddressPublicKeyFromXPub,
  getEvmAddressFromPubKey,
} from '@avalabs/core-wallets-sdk';
import { VM } from '@avalabs/avalanchejs';

import {
  LedgerAppType,
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
} from '@core/ui';
import {
  AddressPublicKeyJson,
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
} from '@core/types';
import { isLedgerVersionCompatible } from '@core/common';

export type DerivationStatus = 'waiting' | 'ready' | 'error';
export type ErrorType = 'unable-to-connect' | 'unsupported-version';
export type PublicKeyAVM = {
  key: AddressPublicKeyJson;
  vm: 'AVM';
  index: number;
};
export type PublicKeyEVM = {
  key: AddressPublicKeyJson;
  vm: 'EVM';
  index: number;
  address: string;
};
export type PublicKey = PublicKeyAVM | PublicKeyEVM;

const buildAddressPublicKey = (
  key: Buffer,
  vm: VM,
  accountIndex: number,
): AddressPublicKeyJson => ({
  curve: 'secp256k1',
  derivationPath: getAddressDerivationPath(
    accountIndex,
    DerivationPath.LedgerLive,
    vm,
  ),
  type: 'address-pubkey',
  key: hex.encode(Uint8Array.from(key)),
});

export const useBasePublicKeys = (derivationPathSpec: DerivationPath) => {
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

  const [error, setError] = useState<ErrorType>();
  const [status, setStatus] = useState<DerivationStatus>('waiting');

  const getPublicKeyFromLedger = useCallback(
    async (accountIndex: number, vm: VM): Promise<AddressPublicKeyJson> => {
      const publicKey = await getPublicKey(
        accountIndex,
        DerivationPath.LedgerLive,
        vm,
      );

      return buildAddressPublicKey(publicKey, vm, accountIndex);
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
          address: getEvmAddressFromPubKey(Buffer.from(hex.decode(evmKey.key))),
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
          key: buildAddressPublicKey(evmKey, 'EVM', index),
          address: getEvmAddressFromPubKey(evmKey),
        });

        const xpKey = await getAddressPublicKeyFromXPub(
          xpExtendedPublicKey,
          index,
        );
        keys.push({
          index,
          vm: 'AVM',
          key: buildAddressPublicKey(xpKey, 'AVM', index),
        });
      }

      return {
        extendedPublicKeys: [evmExtendedPublicKey, xpExtendedPublicKey],
        addressPublicKeys: keys,
      };
    },
    [getExtendedPublicKey],
  );

  const retrieveKeys = useCallback(
    async (indexes: number[]) => {
      try {
        if (derivationPathSpec === DerivationPath.LedgerLive) {
          return getKeysDirectlyFromLedger(indexes);
        }

        return getKeysFromExtendedPublicKeys(indexes);
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
    ],
  );

  // Attempt to automatically connect as soon as we establish the transport.
  useEffect(() => {
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
  ]);

  const onRetry = useCallback(async () => {
    try {
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
