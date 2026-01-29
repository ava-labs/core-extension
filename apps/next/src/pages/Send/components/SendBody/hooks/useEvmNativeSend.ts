import { useTranslation } from 'react-i18next';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { useCallback, useEffect, useState } from 'react';

import { chainIdToCaip } from '@core/common';
import { Account, FungibleTokenBalance, NetworkWithCaipId } from '@core/types';
import { useConnectionContext, useNetworkFeeContext } from '@core/ui';

import { useMaxAmountForTokenSend } from '@/hooks/useMaxAmountForTokenSend';
import { getEvmProvider } from '@/lib/getEvmProvider';

import { asHex } from '../lib/asHex';
import { useTransactionCallbacks } from './useTransactionCallbacks';
import { estimateGasWithStateOverride } from '../lib/estimateGasWithStateOverride';

type UseEvmNativeSendArgs = {
  token: FungibleTokenBalance;
  amount: bigint;
  from: Account;
  to?: string;
  network: NetworkWithCaipId;
};

export const useEvmNativeSend = ({
  token,
  amount,
  from,
  to,
  network,
}: UseEvmNativeSendArgs) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { getNetworkFee, isGaslessOn } = useNetworkFeeContext();

  const provider = getEvmProvider(network);

  const { maxAmount, estimatedFee } = useMaxAmountForTokenSend(from, token, to);
  const { onSendFailure } = useTransactionCallbacks(network);

  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(async () => {
    try {
      setIsSending(true);

      const networkFee = await getNetworkFee(token.coreChainId);

      if (!networkFee) {
        throw new Error('Network fee not found');
      }

      const txParams: Record<string, string | undefined> = {
        from: from.addressC,
        to,
        value: asHex(amount),
        chainId: asHex(token.coreChainId),
        maxFeePerGas: asHex(networkFee.high.maxFeePerGas),
        maxPriorityFeePerGas: asHex(networkFee.high.maxPriorityFeePerGas ?? 1n),
      };

      // When gasless is enabled, estimate gas with state override to avoid
      // "insufficient funds for gas" errors for users with 0 native balance
      if (isGaslessOn) {
        const gasLimit = await estimateGasWithStateOverride(
          provider,
          { to, value: amount },
          from.addressC,
        );
        txParams.gas = asHex(gasLimit);
      }

      const hash = await request(
        {
          method: RpcMethod.ETH_SEND_TRANSACTION,
          params: [txParams],
        },
        {
          scope: chainIdToCaip(token.coreChainId),
        },
      );

      // Transaction status will be handled by the TransactionStatusProvider
      // so we don't need to listen for events here

      return hash;
    } catch (err) {
      onSendFailure(err);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [
    request,
    onSendFailure,
    token.coreChainId,
    from.addressC,
    to,
    amount,
    getNetworkFee,
    isGaslessOn,
    provider,
  ]);

  useEffect(() => {
    setError('');

    if (!to) {
      return setError(t('Selected recipient is not a valid EVM address.'));
    }

    // Network fee data not loaded yet, we'll validate the amount when it does load.
    if (estimatedFee === undefined || maxAmount === undefined) return;

    if (!amount || amount < 0n) {
      return setError(t('Please enter a valid amount.'));
    }

    if (amount > maxAmount) {
      return setError(
        t('Maximum available amount after fees is ~{{maxAmount}}.', {
          maxAmount: `${new TokenUnit(maxAmount, token.decimals, token.symbol).toDisplay()} ${token.symbol}`,
        }),
      );
    }
  }, [
    amount,
    maxAmount,
    token.decimals,
    token.symbol,
    t,
    setError,
    to,
    estimatedFee,
  ]);

  const isLoaded = estimatedFee !== undefined && maxAmount !== undefined;

  return {
    error,
    isSending,
    isValid: isLoaded && !error,
    send,
  };
};
