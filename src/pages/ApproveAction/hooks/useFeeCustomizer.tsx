import { Skeleton, Stack } from '@avalabs/core-k2-components';
import {
  DisplayData,
  NetworkTokenWithBalance,
  RpcMethod,
  SigningData,
  TokenType,
} from '@avalabs/vm-module-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { NetworkWithCaipId } from '@src/background/services/network/models';
import { NetworkFee } from '@src/background/services/networkFee/models';

import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { SendErrorMessage } from '@src/utils/send/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { UpdateActionTxDataHandler } from '@src/background/services/actions/handlers/updateTxData';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';

const getInitialFeeRate = (data?: SigningData): bigint | undefined => {
  if (data?.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
    return BigInt(data.data.feeRate);
  }

  if (data?.type === RpcMethod.ETH_SEND_TRANSACTION) {
    return data.data.maxFeePerGas ? BigInt(data.data.maxFeePerGas) : undefined;
  }
};

export const useFeeCustomizer = ({
  actionId,
  network,
}: {
  actionId: string;
  network?: NetworkWithCaipId;
}) => {
  const { action } = useApproveAction<DisplayData>(actionId);
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
    GasFeeModifier.NORMAL,
  );
  const isFeeSelectorEnabled = Boolean(action?.displayData.networkFeeSelector);

  const tokens = useTokensWithBalances({
    chainId: network?.chainId,
  });

  const nativeToken = useMemo(
    () => tokens.find(({ type }) => type === TokenType.NATIVE) ?? null,
    [tokens],
  ) as NetworkTokenWithBalance | null;

  const signingData = useMemo(() => {
    if (!isFeeSelectorEnabled) {
      return undefined;
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
  }, [action, isFeeSelectorEnabled]);

  const updateFee = useCallback(
    async (maxFeeRate: bigint, maxTipRate?: bigint) => {
      if (!actionId || !isFeeSelectorEnabled) {
        return;
      }

      const newFeeConfig =
        signingData?.type === RpcMethod.BITCOIN_SEND_TRANSACTION
          ? { feeRate: Number(maxFeeRate) }
          : { maxFeeRate, maxTipRate };

      await request<UpdateActionTxDataHandler>({
        method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
        params: [actionId, newFeeConfig],
      });
    },
    [actionId, isFeeSelectorEnabled, request, signingData?.type],
  );

  const getFeeInfo = useCallback((data: SigningData) => {
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
    }) => {
      setMaxFeePerGas(values.maxFeePerGas);
      setMaxPriorityFeePerGas(values.maxPriorityFeePerGas);
      setGasFeeModifier(values.feeType);
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
    updateFee(maxFeePerGas, maxPriorityFeePerGas)
      .catch((err) => {
        console.error(err);
        if (!isMounted) {
          return;
        }
        setFeeError(err);
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
  }, [isFeeSelectorEnabled, maxFeePerGas, maxPriorityFeePerGas, updateFee]);

  const renderFeeWidget = useCallback(() => {
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
      />
    );
  }, [
    gasFeeModifier,
    getFeeInfo,
    network,
    networkFee,
    setCustomFee,
    signingData,
  ]);

  return {
    isCalculatingFee,
    hasEnoughForNetworkFee,
    renderFeeWidget,
    feeError,
  };
};
