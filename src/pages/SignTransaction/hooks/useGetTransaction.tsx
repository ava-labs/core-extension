import { useCallback, useMemo, useEffect, useState } from 'react';
import { Transaction } from '@src/background/services/transactions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { filter, map, Subscription, take } from 'rxjs';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { transactionFinalizedUpdateListener } from '@src/background/services/transactions/events/transactionFinalizedUpdateListener';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { GasFeeModifier } from '@src/components/common/CustomFees';

import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { UpdateTransactionHandler } from '@src/background/services/transactions/handlers/updateTransaction';
import { GetTransactionHandler } from '@src/background/services/transactions/handlers/getTransaction';
import { NetworkFee } from '@src/background/services/networkFee/models';
import { Network } from '@avalabs/chains-sdk';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { useDialog } from '@src/contexts/DialogContextProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';

export function useGetTransaction(requestId: string) {
  // Target network of the transaction defined by the chainId param. May differ from the active one.
  const [network, setNetwork] = useState<Network | undefined>(undefined);
  const [networkFee, setNetworkFee] = useState<NetworkFee | null>(null);
  const { request, events } = useConnectionContext();
  const tokenPrice = useNativeTokenPrice(network);
  const { getNetworkFeeForNetwork } = useNetworkFeeContext();
  const { getNetwork, network: activeNetwork } = useNetworkContext();
  const { featureFlags } = useFeatureFlagContext();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [customGas, setCustomGas] = useState<{
    gasLimit?: number;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas?: bigint;
  } | null>(null);
  const [hash, setHash] = useState<string>('');
  const [showRawTransactionData, setShowRawTransactionData] = useState(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.NORMAL
  );
  const { showDialog, clearDialog } = useDialog();
  const [hasTransactionError, setHasTransactionError] = useState(false);

  const updateTransaction = useCallback(
    (update) => {
      return request<UpdateTransactionHandler>({
        method: ExtensionRequest.TRANSACTIONS_UPDATE,
        params: [update],
      });
    },
    [request]
  );

  const setCustomFee = useCallback(
    (
      values: {
        customGasLimit?: number;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas?: bigint;
        feeType: GasFeeModifier;
      },
      tx?: Transaction
    ) => {
      const currentTx = tx ?? transaction;

      setCustomGas((currentGas) => ({
        gasLimit: values.customGasLimit ?? currentGas?.gasLimit,
        maxFeePerGas: values.maxFeePerGas ?? currentGas?.maxFeePerGas,
        maxPriorityFeePerGas:
          values.maxPriorityFeePerGas ?? currentGas?.maxPriorityFeePerGas,
      }));
      setSelectedGasFee(values.feeType);

      const feeDisplayValues = calculateGasAndFees({
        maxFeePerGas: values.maxFeePerGas,
        gasLimit:
          values.customGasLimit ??
          customGas?.gasLimit ??
          currentTx?.displayValues?.gas.gasLimit,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
      });

      updateTransaction({
        id: currentTx?.id,
        params: {
          gas: feeDisplayValues.gasLimit.toString(),
          maxFeePerGas: feeDisplayValues.maxFeePerGas,
          maxPriorityFeePerGas: values.maxPriorityFeePerGas,
        },
      });
    },
    [
      network?.networkToken.decimals,
      tokenPrice,
      customGas?.gasLimit,
      transaction,
      updateTransaction,
    ]
  );

  useEffect(() => {
    request<GetTransactionHandler>({
      method: ExtensionRequest.TRANSACTIONS_GET,
      params: [requestId],
    }).then((tx) => {
      setTransaction(tx || null);
    });
    const subscriptions = new Subscription();

    subscriptions.add(
      events?.()
        .pipe(
          filter(transactionFinalizedUpdateListener),
          map(({ value }) => value),
          filter((tx) => tx.id === requestId),
          take(1)
        )
        .subscribe({
          next(tx) {
            setHash(tx?.txHash || '');
          },
        })
    );

    return () => {
      subscriptions.unsubscribe();
    };
    // only call this once, we need to get the transaction and subscriptions only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateNetworkAndFees = async () => {
      if (network?.chainId) {
        setNetworkFee(await getNetworkFeeForNetwork(network?.chainId));
      }
    };

    updateNetworkAndFees();
  }, [getNetworkFeeForNetwork, network?.chainId]);

  useEffect(() => {
    const chainId = parseInt(transaction?.chainId ?? '');

    if (!featureFlags[FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]) {
      if (transaction && activeNetwork && chainId !== activeNetwork?.chainId) {
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
    transaction,
    updateTransaction,
    setHasTransactionError,
  ]);

  return useMemo(() => {
    const feeDisplayValues =
      networkFee &&
      transaction?.displayValues?.gas.gasLimit &&
      calculateGasAndFees({
        maxFeePerGas: customGas?.maxFeePerGas ?? networkFee.low.maxFee,
        gasLimit: customGas?.gasLimit ?? transaction.displayValues.gas.gasLimit,
        tokenPrice,
        tokenDecimals: network?.networkToken.decimals,
      });

    return {
      transaction,
      ...feeDisplayValues,
      updateTransaction,
      hash,
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
    network,
    transaction,
    customGas,
    tokenPrice,
    updateTransaction,
    hash,
    setCustomFee,
    showRawTransactionData,
    selectedGasFee,
    hasTransactionError,
    setHasTransactionError,
  ]);
}
