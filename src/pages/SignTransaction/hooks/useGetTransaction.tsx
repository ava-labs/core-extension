import { useCallback, useMemo, useEffect, useState } from 'react';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { GasFeeModifier } from '@src/components/common/CustomFees';

import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkFee } from '@src/background/services/networkFee/models';
import { Network } from '@avalabs/chains-sdk';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { useDialog } from '@src/contexts/DialogContextProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { Transaction } from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { ActionStatus } from '@src/background/services/actions/models';

export function useGetTransaction(requestId: string) {
  // Target network of the transaction defined by the chainId param. May differ from the active one.
  const [network, setNetwork] = useState<Network | undefined>(undefined);
  const [networkFee, setNetworkFee] = useState<NetworkFee | null>(null);
  const { updateAction, action } = useApproveAction<Transaction>(requestId);
  const tokenPrice = useNativeTokenPrice(network);
  const { getNetworkFeeForNetwork } = useNetworkFeeContext();
  const { getNetwork, network: activeNetwork } = useNetworkContext();
  const { featureFlags } = useFeatureFlagContext();
  const [customGas, setCustomGas] = useState<{
    gasLimit?: number;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas?: bigint;
  } | null>(null);
  const [showRawTransactionData, setShowRawTransactionData] = useState(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.NORMAL
  );
  const { showDialog, clearDialog } = useDialog();
  const [hasTransactionError, setHasTransactionError] = useState(false);

  useEffect(() => {
    if (!customGas || !action) {
      return;
    }

    const feeDisplayValues = calculateGasAndFees({
      maxFeePerGas: customGas.maxFeePerGas,
      gasLimit:
        customGas?.gasLimit ?? action.displayData.displayValues.gas.gasLimit,
      tokenPrice,
      tokenDecimals: network?.networkToken.decimals,
    });

    const updatedDisplayData: Transaction = {
      ...action.displayData,
      txParams: {
        ...action.displayData.txParams,
        gas: feeDisplayValues.gasLimit,
        maxFeePerGas: feeDisplayValues.maxFeePerGas
          ? `0x${feeDisplayValues.maxFeePerGas.toString(16)}`
          : action.displayData.txParams.maxFeePerGas,
        maxPriorityFeePerGas: customGas.maxPriorityFeePerGas
          ? `0x${customGas.maxPriorityFeePerGas.toString(16)}`
          : action.displayData.txParams.maxPriorityFeePerGas,
      },
    };
    updateAction({
      id: action.actionId,
      status: ActionStatus.PENDING,
      displayData: updatedDisplayData,
    });
    // keeping `action` out of here to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customGas, network?.networkToken.decimals, tokenPrice, updateAction]);

  const setCustomFee = useCallback(
    (values: {
      customGasLimit?: number;
      maxFeePerGas: bigint;
      maxPriorityFeePerGas?: bigint;
      feeType: GasFeeModifier;
    }) => {
      setCustomGas((currentGas) => ({
        gasLimit: values.customGasLimit ?? currentGas?.gasLimit,
        maxFeePerGas: values.maxFeePerGas ?? currentGas?.maxFeePerGas,
        maxPriorityFeePerGas:
          values.maxPriorityFeePerGas ?? currentGas?.maxPriorityFeePerGas,
      }));
      setSelectedGasFee(values.feeType);
    },
    []
  );

  useEffect(() => {
    const updateNetworkAndFees = async () => {
      if (network?.chainId) {
        setNetworkFee(await getNetworkFeeForNetwork(network?.chainId));
      }
    };

    updateNetworkAndFees();
  }, [getNetworkFeeForNetwork, network?.chainId]);

  useEffect(() => {
    const chainId = parseInt(action?.displayData?.chainId ?? '');

    if (!featureFlags[FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]) {
      if (action && activeNetwork && chainId !== activeNetwork?.chainId) {
        setHasTransactionError(true);
      } else {
        setNetwork(activeNetwork);
      }
    } else {
      setNetwork(getNetwork(chainId));
    }
  }, [
    getNetwork,
    showDialog,
    clearDialog,
    featureFlags,
    activeNetwork,
    setHasTransactionError,
    action,
  ]);

  return useMemo(() => {
    const feeDisplayValues =
      networkFee &&
      action?.displayData.displayValues?.gas.gasLimit &&
      calculateGasAndFees({
        maxFeePerGas: customGas?.maxFeePerGas ?? networkFee.low.maxFee,
        gasLimit:
          customGas?.gasLimit ?? action?.displayData.displayValues.gas.gasLimit,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
      });

    return {
      transaction: action,
      ...feeDisplayValues,
      updateTransaction: updateAction,
      setCustomFee,
      showRawTransactionData,
      setShowRawTransactionData,
      selectedGasFee,
      network,
      networkFee,
      hasTransactionError,
      setHasTransactionError,
    };
  }, [
    networkFee,
    action,
    customGas?.maxFeePerGas,
    customGas?.gasLimit,
    tokenPrice,
    network,
    updateAction,
    setCustomFee,
    showRawTransactionData,
    selectedGasFee,
    hasTransactionError,
  ]);
}
