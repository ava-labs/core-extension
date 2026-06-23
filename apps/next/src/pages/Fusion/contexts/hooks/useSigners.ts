import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BitcoinCaip2ChainId,
  SolanaCaip2ChainId,
} from '@avalabs/core-chains-sdk';

import {
  useConnectionContext,
  useFeatureFlagContext,
  useNetworkContext,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';
import { SecretType } from '@core/types';

import { getBtcSigner, getEVMSigner, getSVMSigner } from '../../lib/signers';

export const useSigners = () => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { isDeveloperMode } = useNetworkContext();
  const { maxBuy, isQuickSwapsEnabled } = useSettingsContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const { walletDetails } = useWalletContext();

  return useMemo(() => {
    if (!walletDetails) {
      return null;
    }

    const isAutoSignSupported =
      walletDetails?.type === SecretType.Mnemonic ||
      walletDetails?.type === SecretType.Seedless ||
      walletDetails?.type === SecretType.PrivateKey;

    return {
      evm: getEVMSigner(request, t, isFlagEnabled, isAutoSignSupported, {
        maxBuy,
        isQuickSwapsEnabled,
      }),
      btc: getBtcSigner(
        request,
        isDeveloperMode
          ? BitcoinCaip2ChainId.TESTNET
          : BitcoinCaip2ChainId.MAINNET,
        t,
      ),
      svm: getSVMSigner(
        request,
        isDeveloperMode
          ? SolanaCaip2ChainId.DEVNET
          : SolanaCaip2ChainId.MAINNET,
        t,
      ),
    };
  }, [
    isDeveloperMode,
    request,
    t,
    isFlagEnabled,
    walletDetails,
    maxBuy,
    isQuickSwapsEnabled,
  ]);
};
