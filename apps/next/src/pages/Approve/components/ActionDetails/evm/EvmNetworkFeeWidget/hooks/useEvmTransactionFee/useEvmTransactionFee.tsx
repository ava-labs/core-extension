import { useCallback, useEffect, useRef, useState } from 'react';

import { useConnectionContext } from '@core/ui';
import { ExtensionRequest } from '@core/types';
import { type UpdateActionTxDataHandler } from '@core/service-worker';
import { calculateGasAndFees } from '@core/common';

import { useNativeToken } from '@/hooks/useNativeToken';
import { useUpdateAccountBalance } from '@/hooks/useUpdateAccountBalance';
import { useCurrentFeesForNetwork } from '@/hooks/useCurrentFeesForNetwork';

import { EvmFeePreset, EvmGasSettings } from '../../types';
import { getFeeInfo, getInitialFeeRate, hasEnoughForFee } from './lib';
import { EvmTxSigningData, UseEvmTransactionFee } from './types';
import { getDefaultFeePreset } from '@/utils/getDefaultFeePreset';

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
    getDefaultFeePreset(network),
  );

  const fee = calculateGasAndFees({
    maxFeePerGas: getFeeInfo(signingData).feeRate,
    tokenPrice: nativeToken?.priceInCurrency,
    tokenDecimals: network?.networkToken.decimals,
    gasLimit: getFeeInfo(signingData).limit,
  });

  const updateFee = useCallback(
    async (maxFeeRate: bigint, maxTipRate?: bigint, gasLimit?: number) => {
      if (!action.actionId) {
        return;
      }

      await request<UpdateActionTxDataHandler>({
        method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
        params: [action.actionId, { maxFeeRate, maxTipRate, gasLimit }],
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
    async (preset: EvmFeePreset, feeRate?: EvmGasSettings) => {
      if (!networkFee) {
        return;
      }

      if (preset === 'custom') {
        if (!feeRate) return;

        setFeePreset('custom');
        setCustomPreset(feeRate);
        await updateFee(
          feeRate.maxFeePerGas,
          feeRate.maxPriorityFeePerGas,
          feeRate.gasLimit,
        );
        return;
      }

      setFeePreset(preset);

      await updateFee(
        networkFee[preset].maxFeePerGas,
        networkFee[preset].maxPriorityFeePerGas,
      );
    },
    [networkFee, updateFee],
  );

  const initialFeeRate = useRef<bigint | undefined>(
    getInitialFeeRate(signingData),
  );

  useEffect(() => {
    // If the dapp did not give us any fee rate, we must initialize it ourselves.
    if (!initialFeeRate.current) {
      choosePreset(getDefaultFeePreset(network));
    }
  }, [networkFee, choosePreset, network]);

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
      low: networkFee.low,
      medium: networkFee.medium,
      high: networkFee.high,
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
