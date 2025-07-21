import { useTranslation } from 'react-i18next';
import { toast } from '@avalabs/core-k2-components';
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

export const useDeriveMissingKeysForSeedless = () => {
  const { t } = useTranslation();
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
    return accounts.some((acc) => !acc.addressSVM); // Currently only do it for Solana
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

    let toastId: string | undefined;

    const timer = setTimeout(() => {
      // Only show the "Updating accounts..." message if it takes more than 5 seconds
      toastId = toast.loading(t('Updating accounts...'));
    }, 5_000);

    deriveMissingKeys(walletDetails.id)
      .then(() => {
        if (toastId) {
          toast.success(t('Accounts updated'), { id: toastId });
        }
      })
      .catch(() => {
        if (!toastId) {
          // We don't show anything if it fails, as there is nothing the user can do.
          // This will be retried automatically on the next extension load (with an anti-spam delay).
          toast.dismiss(toastId);
        }
      })
      .finally(() => {
        clearTimeout(timer);
      });

    return () => {
      clearTimeout(timer);
    };
  }, [deriveMissingKeys, hasMissingAddresses, walletDetails?.id, t]);
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
