import { FeatureGates } from '@core/types';
import {
  useFeatureFlagContext,
  useWalletTotalBalanceContext,
} from '../contexts';
import { useEffect, useRef } from 'react';

export const useLiveWalletBalance = (walletId: string) => {
  const { fetchBalanceForWallet } = useWalletTotalBalanceContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const isBalanceServiceIntegrationOn = isFlagEnabled(
    FeatureGates.BALANCE_SERVICE_INTEGRATION,
  );

  const isSyncing = useRef<boolean>(false);

  useEffect(() => {
    if (!walletId || !isBalanceServiceIntegrationOn) {
      return;
    }

    const pollingIntervalId = setInterval(() => {
      if (isSyncing.current) {
        return;
      }

      isSyncing.current = true;

      fetchBalanceForWallet(walletId, true).finally(() => {
        isSyncing.current = false;
      });
    }, 5000);

    return () => {
      clearInterval(pollingIntervalId);
    };
  }, [walletId, fetchBalanceForWallet, isBalanceServiceIntegrationOn]);
};
