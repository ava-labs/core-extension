import {
  useDismissedBanners,
  useFeatureFlagContext,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';
import { useCallback, useEffect, useState } from 'react';
import { SOLANA_NOW_SUPPORTED_BANNER_ID } from './SolanaNowSupported';
import { isChainSupportedByWallet, openFullscreenTab } from '@core/common';
import { NetworkVMType, SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';
import { useHistory } from 'react-router-dom';
import { FeatureGates } from '@core/types';

export const useSolanaSupportModal = () => {
  const history = useHistory();
  const { isFlagEnabled } = useFeatureFlagContext();
  const { dismiss, isDismissed } = useDismissedBanners();
  const { getNetwork, setNetwork } = useNetworkContext();
  const { walletDetails, isLedgerWallet } = useWalletContext();

  const [isOpen, setIsOpen] = useState(false);

  const isSolanaSupportedByActiveWallet = isChainSupportedByWallet(
    NetworkVMType.SVM,
    walletDetails?.type,
  );

  const solana = getNetwork(SolanaCaip2ChainId.MAINNET);
  const isSolanaLaunchModalEnabled = isFlagEnabled(
    FeatureGates.SOLANA_LAUNCH_MODAL,
  );
  const isSolanaAvailable = Boolean(solana);
  const isOnDerivingScreen = location.hash.includes(
    'ledger/derive-solana-addresses',
  );

  useEffect(() => {
    if (
      !isSolanaLaunchModalEnabled ||
      !isSolanaSupportedByActiveWallet ||
      !isSolanaAvailable ||
      isOnDerivingScreen
    ) {
      return;
    }

    let isMounted = true;

    isDismissed(SOLANA_NOW_SUPPORTED_BANNER_ID).then((isAlreadyDismissed) => {
      if (!isMounted) {
        return;
      }

      setIsOpen(!isAlreadyDismissed);
    });

    return () => {
      isMounted = false;
    };
  }, [
    isDismissed,
    isSolanaLaunchModalEnabled,
    isSolanaSupportedByActiveWallet,
    isSolanaAvailable,
    isOnDerivingScreen,
  ]);

  const close = useCallback(async () => {
    await dismiss(SOLANA_NOW_SUPPORTED_BANNER_ID);
    setIsOpen(false);
  }, [dismiss]);

  const handleProceed = useCallback(async () => {
    await close();

    if (isLedgerWallet) {
      await openFullscreenTab('ledger/derive-solana-addresses');
    } else {
      setNetwork(solana!);
      history.push('/home');
    }
  }, [close, isLedgerWallet, solana, setNetwork, history]);

  return {
    isOpen,
    handleProceed,
    handleSkip: close,
  };
};
