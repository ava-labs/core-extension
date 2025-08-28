import { useCallback, useEffect, useState } from 'react';

import { useConnectionContext } from '@core/ui';
import { ExtensionRequest, FeeRate } from '@core/types';
import { type UpdateActionTxDataHandler } from '@core/service-worker';
import { calculateGasAndFees, isAvalancheNetwork } from '@core/common';

import { useNativeToken } from '@/hooks/useNativeToken';
import { useUpdateAccountBalance } from '@/hooks/useUpdateAccountBalance';
import { useCurrentFeesForNetwork } from '@/hooks/useCurrentFeesForNetwork';

import { EvmFeePreset } from '../../types';
import { getFeeInfo, hasEnoughForFee } from './lib';
import { EvmTxSigningData, UseEvmTransactionFee } from './types';

export const useEvmTransactionFee: UseEvmTransactionFee = ({
  action,
  network,
}) => {
  useUpdateAccountBalance(network);

  const { request } = useConnectionContext();

  const networkFee = useCurrentFeesForNetwork(network);
  const nativeToken = useNativeToken({ network });
  const signingData = action.signingData as EvmTxSigningData;

  const [customPreset, setCustomPreset] = useState(networkFee?.high);

  const [feePreset, setFeePreset] = useState<EvmFeePreset>(
    isAvalancheNetwork(network) ? 'fast' : 'slow',
  );

  const fee = calculateGasAndFees({
    maxFeePerGas: getFeeInfo(signingData).feeRate,
    tokenPrice: nativeToken?.priceInCurrency,
    tokenDecimals: network?.networkToken.decimals,
    gasLimit: getFeeInfo(signingData).limit,
  });

  const updateFee = useCallback(
    async (maxFeeRate: bigint, maxTipRate?: bigint) => {
      if (!action.actionId) {
        return;
      }

      await request<UpdateActionTxDataHandler>({
        method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
        params: [action.actionId, { maxFeeRate, maxTipRate }],
      });
    },
    [action?.actionId, request],
  );

  useEffect(() => {
    if (!networkFee) {
      return;
    }

    // Initialize the custom preset with some default value.
    // Usually people will try to bump the fees, so we default to the fastest preset.
    setCustomPreset((previous) => previous ?? networkFee.high);
  }, [networkFee]);

  const choosePreset = useCallback(
    async (preset: EvmFeePreset, feeRate?: FeeRate) => {
      if (!networkFee) {
        return;
      }

      if (preset === 'custom') {
        if (!feeRate) return;

        setFeePreset('custom');
        setCustomPreset(feeRate);
        await updateFee(feeRate.maxFeePerGas, feeRate.maxPriorityFeePerGas);
        return;
      }

      setFeePreset(preset);

      switch (preset) {
        case 'slow':
          await updateFee(
            networkFee.low.maxFeePerGas,
            networkFee.low.maxPriorityFeePerGas,
          );
          break;
        case 'normal':
          await updateFee(
            networkFee.medium.maxFeePerGas,
            networkFee.medium.maxPriorityFeePerGas,
          );
          break;
        case 'fast':
          await updateFee(
            networkFee.high.maxFeePerGas,
            networkFee.high.maxPriorityFeePerGas,
          );
          break;
      }
    },
    [networkFee, updateFee],
  );

  if (!networkFee || !nativeToken || !signingData || !customPreset) {
    return {
      isLoading: true,
    };
  }

  return {
    hasEnoughForNetworkFee: hasEnoughForFee(signingData, nativeToken),
    fee,
    feeDecimals: networkFee.displayDecimals,
    feePreset,
    presets: {
      slow: networkFee.low,
      normal: networkFee.medium,
      fast: networkFee.high,
      custom: customPreset,
    },
    gasLimit: Number(signingData.data.gasLimit ?? 0),
    choosePreset,
    customPreset,
    setCustomPreset,
    nativeToken,
    isLoading: false,
  };
};
