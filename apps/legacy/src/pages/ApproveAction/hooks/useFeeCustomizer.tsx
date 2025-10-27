import { Skeleton, Stack } from '@avalabs/core-k2-components';
import {
  NetworkTokenWithBalance,
  RpcMethod,
  SigningData,
  TokenType,
} from '@avalabs/vm-module-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Action,
  ExtensionRequest,
  MultiTxAction,
  SendErrorMessage,
  isBatchApprovalAction,
  NetworkFee,
  NetworkWithCaipId,
} from '@core/types';

import { isAvalancheNetwork } from '@core/common';
import {
  CustomFees,
  CustomGasFeesProps,
  GasFeeModifier,
} from '@/components/common/CustomFees';
import { useConnectionContext } from '@core/ui';
import { UpdateActionTxDataHandler } from '@core/service-worker';
import { useTokensWithBalances } from '@core/ui';
import { useAccountsContext } from '@core/ui';
import { useBalancesContext } from '@core/ui';
import { useNetworkFeeContext } from '@core/ui';

const getInitialFeeRate = (
  data?: SigningData | MultiTxFeeData,
): bigint | undefined => {
  if (!data) {
    return undefined;
  }

  if (isMultiTxFeeData(data)) {
    return undefined;
  }

  if (data?.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
    return BigInt(data.data.feeRate);
  }

  if (data?.type === RpcMethod.ETH_SEND_TRANSACTION) {
    return data.data.maxFeePerGas ? BigInt(data.data.maxFeePerGas) : undefined;
  }
};

const getInitialGasLimit = (
  data?: SigningData | MultiTxFeeData,
): number | undefined => {
  if (!data || data.type !== RpcMethod.ETH_SEND_TRANSACTION) {
    return undefined;
  }

  return data.data.gasLimit ? Number(data.data.gasLimit) : undefined;
};

const MultiTxSymbol: unique symbol = Symbol();

type MultiTxFeeData = {
  type: typeof MultiTxSymbol;
  gasLimit: bigint;
  feeRate?: bigint;
  maxTipRate?: bigint;
};

const isMultiTxFeeData = (
  data: SigningData | MultiTxFeeData,
): data is MultiTxFeeData => data.type === MultiTxSymbol;

export function useFeeCustomizer({
  action,
  network,
  txIndex,
}: {
  action?: Action | MultiTxAction;
  network?: NetworkWithCaipId;
  txIndex?: number;
}) {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { updateBalanceOnNetworks } = useBalancesContext();
  const { request } = useConnectionContext();
  const [networkFee, setNetworkFee] = useState<NetworkFee | null>();

  const [feeError, setFeeError] = useState<SendErrorMessage>();
  const { getNetworkFee } = useNetworkFeeContext();

  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [gasFeeModifier, setGasFeeModifier] = useState<GasFeeModifier>(
    GasFeeModifier.SLOW,
  );

  useEffect(() => {
    if (network && isAvalancheNetwork(network)) {
      setGasFeeModifier(GasFeeModifier.FAST);
    }
  }, [network]);

  const [isBatchApprovalScreen, setIsBatchApprovalScreen] = useState(false);
  const isFeeSelectorEnabled = Boolean(action?.displayData.networkFeeSelector);

  const tokens = useTokensWithBalances({ network });

  const nativeToken = useMemo(
    () => tokens.find(({ type }) => type === TokenType.NATIVE) ?? null,
    [tokens],
  ) as NetworkTokenWithBalance | null;

  const signingData = useMemo(() => {
    if (!action || !isFeeSelectorEnabled) {
      return undefined;
    }

    if (isBatchApprovalAction(action)) {
      setIsBatchApprovalScreen(true);
      if (typeof txIndex !== 'number') {
        const gasLimit = action.signingRequests.reduce((sum, req) => {
          if (req.signingData.type === RpcMethod.ETH_SEND_TRANSACTION) {
            return sum + BigInt(req.signingData.data.gasLimit ?? 0n);
          }

          throw new Error(
            'This transaction type is not supported in bulk approvals: ' +
              req.signingData.type,
          );
        }, 0n);

        return {
          type: MultiTxSymbol,
          feeRate: action.signingRequests.reduce((sum, req) => {
            if (req.signingData.type === RpcMethod.ETH_SEND_TRANSACTION) {
              const txGas = req.signingData.data.gasLimit;
              const maxFee = req.signingData.data.maxFeePerGas;

              if (!txGas || !maxFee) {
                return 0n;
              }

              const weight = Number(txGas) / Number(gasLimit);

              return sum + BigInt(Math.ceil(Number(maxFee) * weight));
            }

            throw new Error(
              'This transaction type is not supported in bulk approvals: ' +
                req.signingData.type,
            );
          }, 0n),
          gasLimit,
        } as MultiTxFeeData;
      }

      const signingRequest = (action as MultiTxAction).signingRequests[txIndex];

      if (!signingRequest) {
        return;
      }

      return signingRequest.signingData;
    }

    switch (action?.signingData?.type) {
      // Request types that we know may require a fee
      case RpcMethod.BITCOIN_SEND_TRANSACTION:
      case RpcMethod.AVALANCHE_SEND_TRANSACTION:
      case RpcMethod.ETH_SEND_TRANSACTION:
        return action.signingData;

      default:
        return undefined;
    }
  }, [action, isFeeSelectorEnabled, txIndex]);

  const updateFee = useCallback(
    async (maxFeeRate: bigint, maxTipRate?: bigint, gasLimit?: number) => {
      if (!action?.actionId || !isFeeSelectorEnabled) {
        return;
      }

      const newFeeConfig =
        signingData?.type === RpcMethod.BITCOIN_SEND_TRANSACTION
          ? { feeRate: Number(maxFeeRate) }
          : { maxFeeRate, maxTipRate, gasLimit };

      await request<UpdateActionTxDataHandler>({
        method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
        params:
          typeof txIndex === 'undefined'
            ? [action.actionId, newFeeConfig]
            : [action.actionId, newFeeConfig, txIndex],
      });
    },
    [
      action?.actionId,
      isFeeSelectorEnabled,
      request,
      signingData?.type,
      txIndex,
    ],
  );

  const getFeeInfo = useCallback((data: SigningData | MultiTxFeeData) => {
    if (isMultiTxFeeData(data)) {
      return {
        limit: Number(data.gasLimit ?? 0n),
        feeRate: data.feeRate ?? 0n,
        maxTipRate: data.maxTipRate ?? 0n,
      };
    }
    switch (data.type) {
      case RpcMethod.AVALANCHE_SIGN_MESSAGE:
      case RpcMethod.ETH_SIGN:
      case RpcMethod.PERSONAL_SIGN: {
        throw new Error(
          `Unable to render fee widget for non-transaction (${data.type})`,
        );
      }

      case RpcMethod.BITCOIN_SEND_TRANSACTION: {
        return {
          feeRate: BigInt(data.data.feeRate),
          limit: Math.ceil(data.data.fee / data.data.feeRate) || 0,
        };
      }

      case RpcMethod.ETH_SEND_TRANSACTION: {
        return {
          feeRate: data.data.maxFeePerGas ? BigInt(data.data.maxFeePerGas) : 0n,
          maxTipRate: data.data.maxPriorityFeePerGas
            ? BigInt(data.data.maxPriorityFeePerGas)
            : 0n,
          limit: Number(data.data.gasLimit ?? 0),
        };
      }

      default:
        throw new Error(`Unable to render fee widget for ${data.type}`);
    }
  }, []);

  const hasEnoughForNetworkFee = useMemo(() => {
    if (!nativeToken?.balance || !signingData) {
      return false;
    }

    const info = getFeeInfo(signingData);
    const need = info.feeRate * BigInt(info.limit);

    return nativeToken.balance > need;
  }, [getFeeInfo, nativeToken?.balance, signingData]);

  // Make sure we have gas token balances for the transaction's chain
  useEffect(() => {
    if (!activeAccount || !network?.chainId) {
      return;
    }

    updateBalanceOnNetworks([activeAccount], [network.chainId]);
  }, [activeAccount, network?.chainId, updateBalanceOnNetworks]);

  useEffect(() => {
    const nativeBalance = nativeToken?.balance;

    if (!nativeBalance || !signingData || !isFeeSelectorEnabled) {
      return;
    }

    const info = getFeeInfo(signingData);
    const need = info.feeRate * BigInt(info.limit);

    setFeeError(
      nativeToken.balance >= need
        ? undefined
        : SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE,
    );
  }, [getFeeInfo, isFeeSelectorEnabled, nativeToken?.balance, signingData]);

  const [maxFeePerGas, setMaxFeePerGas] = useState(
    getInitialFeeRate(signingData),
  );
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState(
    networkFee?.low?.maxPriorityFeePerGas,
  );
  const [customGasLimit, setCustomGasLimit] = useState(
    getInitialGasLimit(signingData),
  );

  useEffect(() => {
    if (!networkFee || !isFeeSelectorEnabled) {
      return;
    }

    // Initialize fee config with default values if they are not set at all
    setMaxFeePerGas((previous) => previous ?? networkFee.low.maxFeePerGas);
    setMaxPriorityFeePerGas(
      (previous) => previous ?? networkFee.low.maxPriorityFeePerGas,
    );
  }, [networkFee, isFeeSelectorEnabled]);

  const setCustomFee = useCallback(
    (values: {
      maxFeePerGas: bigint;
      feeType: GasFeeModifier;
      maxPriorityFeePerGas: bigint;
      customGasLimit?: number;
    }) => {
      setMaxFeePerGas(values.maxFeePerGas);
      setMaxPriorityFeePerGas(values.maxPriorityFeePerGas);
      setGasFeeModifier(values.feeType);
      setCustomGasLimit(values.customGasLimit);
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    if (!network || !isFeeSelectorEnabled) {
      return;
    }
    // If the request comes from a dApp, a different network may be active,
    // so we need to fetch current fees for Bitcoin specifically.
    getNetworkFee(network.caipId).then((fee) => {
      if (isMounted) {
        setNetworkFee(fee);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getNetworkFee, isFeeSelectorEnabled, network]);

  useEffect(() => {
    if (typeof maxFeePerGas === 'undefined' || !isFeeSelectorEnabled) {
      return;
    }

    let isMounted = true;

    setIsCalculatingFee(true);
    updateFee(maxFeePerGas, maxPriorityFeePerGas, customGasLimit)
      .catch((err) => {
        console.error(err);
        if (!isMounted) {
          return;
        }
        setFeeError(SendErrorMessage.UNKNOWN_ERROR);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }
        setIsCalculatingFee(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    isFeeSelectorEnabled,
    maxFeePerGas,
    maxPriorityFeePerGas,
    customGasLimit,
    updateFee,
    txIndex,
  ]);

  const renderFeeWidget = useCallback(
    (props?: Partial<CustomGasFeesProps>) => {
      if (!networkFee || !signingData) {
        return (
          <Stack sx={{ gap: 0.5, justifyContent: 'flex-start' }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="rounded" height={128} />
          </Stack>
        );
      }

      const { feeRate, limit } = getFeeInfo(signingData);

      return (
        <CustomFees
          maxFeePerGas={feeRate}
          limit={limit}
          onChange={setCustomFee}
          selectedGasFeeModifier={gasFeeModifier}
          network={network}
          networkFee={networkFee}
          isBatchApprovalScreen={isBatchApprovalScreen}
          {...props}
        />
      );
    },
    [
      gasFeeModifier,
      getFeeInfo,
      isBatchApprovalScreen,
      network,
      networkFee,
      setCustomFee,
      signingData,
    ],
  );

  return {
    isCalculatingFee,
    hasEnoughForNetworkFee,
    renderFeeWidget,
    feeError,
  };
}
