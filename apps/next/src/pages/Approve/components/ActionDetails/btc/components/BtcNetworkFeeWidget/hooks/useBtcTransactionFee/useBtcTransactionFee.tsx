import { useCallback, useEffect, useRef, useState } from 'react';

import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { calculateGasAndFees } from '@core/common';
import { type UpdateActionTxDataHandler } from '@core/service-worker';

import { useNativeToken } from '@/hooks/useNativeToken';
import { useUpdateAccountBalance } from '@/hooks/useUpdateAccountBalance';
import { useCurrentFeesForNetwork } from '@/hooks/useCurrentFeesForNetwork';

import { BtcFeePreset } from '../../types';
import { BtcTxSigningData, UseBtcTransactionFee } from './types';
import { getFeeInfo, getInitialFeeRate, hasEnoughForFee } from './lib';

export const useBtcTransactionFee: UseBtcTransactionFee = ({
  action,
  network,
}) => {
  useUpdateAccountBalance(network);

  const { request } = useConnectionContext();

  const networkFee = useCurrentFeesForNetwork(network);
  const nativeToken = useNativeToken({ network });
  const signingData = action.signingData as BtcTxSigningData;

  const [feePreset, setFeePreset] = useState<BtcFeePreset>('slow');

  const fee = calculateGasAndFees({
    maxFeePerGas: getFeeInfo(signingData).feeRate,
    tokenPrice: nativeToken?.priceInCurrency,
    tokenDecimals: network?.networkToken.decimals,
    gasLimit: getFeeInfo(signingData).limit,
  });

  const updateFee = useCallback(
    async (feeRate: bigint) => {
      if (!action.actionId) {
        return;
      }

      await request<UpdateActionTxDataHandler>({
        method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
        params: [action.actionId, { feeRate: Number(feeRate) }],
      });
    },
    [action?.actionId, request],
  );

  const choosePreset = useCallback(
    async (preset: BtcFeePreset) => {
      if (!networkFee) {
        return;
      }

      setFeePreset(preset);

      switch (preset) {
        case 'slow':
          await updateFee(networkFee.low.maxFeePerGas);
          break;
        case 'normal':
          await updateFee(networkFee.medium.maxFeePerGas);
          break;
        case 'fast':
          await updateFee(networkFee.high.maxFeePerGas);
          break;
      }
    },
    [networkFee, updateFee],
  );

  const initialFeeRate = useRef<bigint | undefined>(
    getInitialFeeRate(signingData),
  );

  useEffect(() => {
    // If the dapp did not provide us any fee rate, we must initialize it ourselves.
    if (!initialFeeRate.current) {
      choosePreset('slow');
    }
  }, [networkFee, choosePreset]);

  if (!networkFee || !nativeToken || !signingData) {
    return {
      isLoading: true,
    };
  }

  return {
    hasEnoughForNetworkFee: hasEnoughForFee(signingData, nativeToken),
    fee,
    feePreset,
    choosePreset,
    nativeToken,
    isLoading: false,
  };
};
