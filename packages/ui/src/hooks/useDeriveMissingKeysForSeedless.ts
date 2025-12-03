import { storage } from 'webextension-polyfill';
import { useCallback, useEffect, useMemo } from 'react';

import {
  useAccountsContext,
  useConnectionContext,
  useSeedlessAuthPromptState,
  useWalletContext,
} from '@core/ui';
import { ExtensionRequest, SecretType } from '@core/types';
import type { DeriveMissingKeysHandler } from '@core/service-worker';

type ToastCallbacks = {
  // Display a loading toast
  onLoading: () => void;
  // Display a success toast
  onSuccess: () => void;
  // Dismiss a toast
  onFailure: () => void;
};

export const useDeriveMissingKeysForSeedless = ({
  onLoading,
  onSuccess,
  onFailure,
}: ToastCallbacks) => {
  const { request } = useConnectionContext();
  const { walletDetails } = useWalletContext();
  const { isAuthPromptVisible } = useSeedlessAuthPromptState();
  const {
    accounts: { primary },
  } = useAccountsContext();

  const hasMissingAddresses = useMemo(() => {
    // Make sure not to render the dialog for non-Seedless wallets
    // and also when user is first asked to re-authenticate.
    if (
      !walletDetails ||
      walletDetails.type !== SecretType.Seedless ||
      !primary ||
      isAuthPromptVisible
    ) {
      return false;
    }

    // When we detect some of the addresses are missing, we try to derive them.
    const accounts = primary[walletDetails.id] ?? [];
    return accounts.some(
      (acc) => !acc.addressSVM || !acc.addressAVM || !acc.addressPVM,
    ); // Currently only do it for Solana and X/P chains
  }, [primary, isAuthPromptVisible, walletDetails]);

  const deriveMissingKeys = useCallback(
    async (walletId: string) => {
      const canAttempt = await hasDelayPassed();
      if (!canAttempt) {
        return;
      }

      logLastAttemptTime();

      return request<DeriveMissingKeysHandler>({
        method: ExtensionRequest.SEEDLESS_DERIVE_MISSING_KEYS,
        params: {
          walletId,
        },
      });
    },
    [request],
  );

  useEffect(() => {
    if (!walletDetails?.id || !hasMissingAddresses) {
      return;
    }

    // Only show the "Updating accounts..." message if it takes more than 5 seconds
    const timer = setTimeout(onLoading, 5_000);

    deriveMissingKeys(walletDetails.id)
      .then(onSuccess)
      .catch(onFailure)
      .finally(() => {
        clearTimeout(timer);
      });

    return () => {
      clearTimeout(timer);
    };
  }, [
    deriveMissingKeys,
    hasMissingAddresses,
    walletDetails?.id,
    onLoading,
    onSuccess,
    onFailure,
  ]);
};

const STORAGE_KEY = 'missingKeysDerivationLastAttemptAt' as const;
const MIN_DELAY_BETWEEN_ATTEMPTS = 60_000; // 1 minute

const hasDelayPassed = async () => {
  const lastAttemptTime = await getLastAttemptTime();
  if (!lastAttemptTime) {
    return true;
  }
  return Date.now() - lastAttemptTime > MIN_DELAY_BETWEEN_ATTEMPTS;
};

const logLastAttemptTime = async () => {
  await storage.session.set({ [STORAGE_KEY]: Date.now() });
};

const getLastAttemptTime = async () => {
  const result = await storage.session.get(STORAGE_KEY);
  return result[STORAGE_KEY];
};
