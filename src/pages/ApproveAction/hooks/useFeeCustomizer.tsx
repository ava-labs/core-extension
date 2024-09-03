import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { Skeleton, Stack } from '@avalabs/core-k2-components';
import { DisplayData, RpcMethod, SigningData } from '@avalabs/vm-module-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { NetworkWithCaipId } from '@src/background/services/network/models';
import { NetworkFee } from '@src/background/services/networkFee/models';
import { ActionStatus } from '@src/background/services/actions/models';

import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { buildBtcTx } from '@src/utils/send/btcSendUtils';
import { SendErrorMessage } from '@src/utils/send/models';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

const getInitialFeeRate = (data?: SigningData): bigint => {
  if (!data) {
    return 0n;
  }

  if (data.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
    return BigInt(data.data.feeRate);
  }

  return 0n;
};

export const useFeeCustomizer = ({
  actionId,
  network,
}: {
  actionId: string;
  network?: NetworkWithCaipId;
}) => {
  const { action, updateAction } = useApproveAction<DisplayData>(actionId);
  const [networkFee, setNetworkFee] = useState<NetworkFee | null>();

  const [feeError, setFeeError] = useState<SendErrorMessage>();
  const { getNetworkFee } = useNetworkFeeContext();

  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [gasFeeModifier, setGasFeeModifier] = useState<GasFeeModifier>(
    GasFeeModifier.NORMAL
  );

  const signingData = useMemo(() => {
    if (action?.signingData?.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
      return action.signingData;
    }
  }, [action]);

  const [maxFeePerGas, setMaxFeePerGas] = useState(
    getInitialFeeRate(signingData)
  );

  const setCustomFee = useCallback(
    (values: { maxFeePerGas: bigint; feeType: GasFeeModifier }) => {
      setMaxFeePerGas(values.maxFeePerGas);
      setGasFeeModifier(values.feeType);
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    if (!network) {
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
  }, [getNetworkFee, network]);

  const getUpdatedSigningData = useCallback(
    async function <T extends SigningData>(
      oldSigningData: T,
      newMaxFeePerGas: bigint
    ): Promise<T> {
      if (!network) {
        throw new Error('Not ready yet');
      }

      if (oldSigningData?.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
        const tx = await buildBtcTx(
          oldSigningData.account,
          getProviderForNetwork(network) as BitcoinProvider,
          {
            amount: oldSigningData.data.amount,
            address: oldSigningData.data.to,
            token: oldSigningData.data.balance,
            feeRate: Number(newMaxFeePerGas),
          }
        );

        if (oldSigningData.data.amount > 0 && !tx.psbt) {
          throw SendErrorMessage.INSUFFICIENT_BALANCE_FOR_FEE;
        }

        return {
          ...oldSigningData,
          data: {
            ...oldSigningData.data,
            ...tx,
            feeRate: Number(newMaxFeePerGas),
          },
        };
      }

      throw SendErrorMessage.UNKNOWN_ERROR;
    },
    [network]
  );

  useEffect(() => {
    if (!maxFeePerGas || !signingData) {
      return;
    }

    let isMounted = true;

    setIsCalculatingFee(true);
    getUpdatedSigningData(signingData, maxFeePerGas)
      .then((newSigningData) => {
        if (!isMounted || action?.status !== ActionStatus.PENDING) {
          return;
        }

        // Prevent infinite re-renders, only update the action if the feeRate actually changed
        if (signingData.data.feeRate === newSigningData.data.feeRate) {
          return;
        }

        setFeeError(undefined);
        updateAction({
          id: actionId,
          status: ActionStatus.PENDING,
          signingData: newSigningData,
        });
      })
      .catch((err) => {
        console.error(err);
        setFeeError(err);
      })
      .finally(() => {
        setIsCalculatingFee(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    actionId,
    action?.status,
    getUpdatedSigningData,
    maxFeePerGas,
    updateAction,
    signingData,
  ]);

  const getFeeInfo = useCallback((data: SigningData) => {
    switch (data.type) {
      case RpcMethod.AVALANCHE_SIGN_MESSAGE:
      case RpcMethod.ETH_SIGN:
      case RpcMethod.PERSONAL_SIGN: {
        throw new Error(
          `Unable to render fee widget for non-transaction (${data.type})`
        );
      }

      case RpcMethod.BITCOIN_SEND_TRANSACTION: {
        return {
          feeRate: BigInt(data.data.feeRate),
          limit: Math.ceil(data.data.fee / data.data.feeRate),
        };
      }

      default:
        throw new Error(`Unable to render fee widget for ${data.type}`);
    }
  }, []);

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
    renderFeeWidget,
    feeError,
  };
};
