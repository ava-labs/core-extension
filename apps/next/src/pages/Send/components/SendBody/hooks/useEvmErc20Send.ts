import { isAddress } from 'ethers';
import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { useCallback, useEffect, useState } from 'react';

import { chainIdToCaip } from '@core/common';
import { Account, Erc20TokenBalance, NetworkWithCaipId } from '@core/types';
import { useConnectionContext, useNetworkFeeContext } from '@core/ui';

import { getEvmProvider } from '@/lib/getEvmProvider';
import { useMaxAmountForTokenSend } from '@/hooks/useMaxAmountForTokenSend';

import { buildErc20SendTx } from '../lib/buildErc20SendTx';
import { useTransactionCallbacks } from './useTransactionCallbacks';

type UseEvmErc20SendArgs = {
  token: Erc20TokenBalance;
  amount: bigint;
  from: Account;
  to?: string;
  network: NetworkWithCaipId;
};

export const useEvmErc20Send = ({
  token,
  amount,
  from,
  to,
  network,
}: UseEvmErc20SendArgs) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { getNetworkFee, isGaslessOn } = useNetworkFeeContext();

  const { maxAmount, estimatedFee } = useMaxAmountForTokenSend(from, token, to);
  const { onSendFailure } = useTransactionCallbacks(network);

  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const provider = getEvmProvider(network);

  const send = useCallback(async () => {
    try {
      setIsSending(true);

      if (!to) {
        toast.error(t('Please enter a recipient address.'));
        return;
      }

      const networkFee = await getNetworkFee(token.coreChainId);

      if (!networkFee) {
        toast.error(t('Unable to estimate the network fee.'));
        return;
      }

      const tx = await buildErc20SendTx(from.addressC, provider, networkFee, {
        address: to,
        amount,
        token,
        isGaslessOn,
      });

      const hash = await request(
        {
          method: RpcMethod.ETH_SEND_TRANSACTION,
          params: [tx],
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
    from,
    to,
    getNetworkFee,
    token,
    t,
    amount,
    provider,
    isGaslessOn,
  ]);

  useEffect(() => {
    setError('');

    if (!isAddress(to)) {
      return setError(t('Selected recipient is not a valid EVM address.'));
    }

    // Network fee data not loaded yet, we'll validate the amount when it does load.
    if (!estimatedFee) return;

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

  return {
    error,
    isSending,
    isValid: !error,
    send,
  };
};
