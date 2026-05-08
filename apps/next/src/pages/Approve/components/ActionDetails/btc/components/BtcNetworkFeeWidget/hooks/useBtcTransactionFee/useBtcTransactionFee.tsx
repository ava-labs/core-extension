import { useCallback, useEffect, useState } from 'react';

import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { calculateGasAndFees } from '@core/common';
import { type UpdateActionTxDataHandler } from '@core/service-worker';

import { DEFAULT_FEE_PRESET } from '@/config';
import { useNativeToken } from '@/hooks/useNativeToken';
import { useUpdateAccountBalance } from '@/hooks/useUpdateAccountBalance';
import { useCurrentFeesForNetwork } from '@/hooks/useCurrentFeesForNetwork';
import {
  usePendingTxDataUpdate,
  useTxDataUpdate,
} from '@/pages/Approve/contexts';

import { BtcFeePreset } from '../../types';
import { BtcTxSigningData, UseBtcTransactionFee } from './types';
import { getFeeInfo, getInitialFeeRate, hasEnoughForFee } from './lib';

export const useBtcTransactionFee: UseBtcTransactionFee = ({
  action,
  network,
}) => {
  useUpdateAccountBalance(network);

  const { request } = useConnectionContext();
  const { trackTxDataUpdate } = useTxDataUpdate();

  const networkFee = useCurrentFeesForNetwork(network);
  const nativeToken = useNativeToken({ network });
  const signingData = action.signingData as BtcTxSigningData;

  const [feePreset, setFeePreset] = useState<BtcFeePreset>(DEFAULT_FEE_PRESET);

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

      await trackTxDataUpdate(
        request<UpdateActionTxDataHandler>({
          method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
          params: [action.actionId, { feeRate: Number(feeRate) }],
        }),
      );
    },
    [action?.actionId, request, trackTxDataUpdate],
  );

  const choosePreset = useCallback(
    async (preset: BtcFeePreset) => {
      if (!networkFee) {
        return;
      }

      setFeePreset(preset);

      await updateFee(networkFee[preset].maxFeePerGas);
    },
    [networkFee, updateFee],
  );

  const [hasInitializedFeeRate, setHasInitializedFeeRate] = useState(() =>
    Boolean(getInitialFeeRate(signingData)),
  );

  // Keep approval blocked until the initial fee rate has been pushed to the
  // service worker. Otherwise the user could submit the action while we're
  // still about to dispatch the first ACTION_UPDATE_TX_DATA call.
  usePendingTxDataUpdate(!hasInitializedFeeRate);

  useEffect(() => {
    if (hasInitializedFeeRate) {
      return;
    }
    if (!networkFee) {
      return;
    }

    choosePreset(DEFAULT_FEE_PRESET).finally(() => {
      setHasInitializedFeeRate(true);
    });
  }, [hasInitializedFeeRate, networkFee, choosePreset]);

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
