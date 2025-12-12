import { toast } from '@avalabs/k2-alpine';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { BitcoinSendTransactionParams } from '@avalabs/bitcoin-module';

import {
  BtcCapableAccount,
  BtcTokenBalance,
  NetworkFee,
  NetworkWithCaipId,
} from '@core/types';
import { useConnectionContext, useNetworkFeeContext } from '@core/ui';
import { isBtcAddressInNetwork, isValidBtcAddress } from '@core/common';

import { useMaxAmountForTokenSend } from '@/hooks/useMaxAmountForTokenSend';

import { useTransactionCallbacks } from './useTransactionCallbacks';

type UseBtcSendArgs = {
  token: BtcTokenBalance;
  amount: bigint;
  from: BtcCapableAccount;
  to?: string;
  network: NetworkWithCaipId;
};

export const useBtcSend = ({
  token,
  amount,
  from,
  to,
  network,
}: UseBtcSendArgs) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { getNetworkFee } = useNetworkFeeContext();

  const { onSendFailure } = useTransactionCallbacks(network);
  const { maxAmount, estimatedFee } = useMaxAmountForTokenSend(from, token, to);

  const [isSending, setIsSending] = useState(false);
  const [networkFee, setNetworkFee] = useState<NetworkFee | null>(null);
  const [error, setError] = useState('');

  const maxInitialFee = networkFee?.low.maxFeePerGas;

  useEffect(() => {
    getNetworkFee(network.caipId).then(setNetworkFee);
  }, [getNetworkFee, network.caipId]);

  useEffect(() => {
    setError('');

    if (!to || !isValidBtcAddress(to)) {
      return setError(t('Selected recipient is not a valid Bitcoin address.'));
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
  }, [maxAmount, token.decimals, token.symbol, t, to, estimatedFee, amount]);

  const send = useCallback(async () => {
    if (
      !to ||
      !isValidBtcAddress(to) ||
      !isBtcAddressInNetwork(to, !network.isTestnet)
    ) {
      toast.error(
        t('Please provide a valid Bitcoin address as the recipient.'),
      );
      return;
    }

    setIsSending(true);

    try {
      const hash = await request<BitcoinSendTransactionParams>(
        {
          method: RpcMethod.BITCOIN_SEND_TRANSACTION,
          params: {
            from: from.addressBTC,
            to,
            amount: Number(amount),
            feeRate: Number(maxInitialFee),
          },
        },
        {
          scope: network.caipId,
        },
      );
      // Transaction status will be handled by the TransactionStatusProvider
      // so we don't need to listen for events here

      return hash;
    } catch (err) {
      console.error(err);
      onSendFailure(err);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [
    from.addressBTC,
    maxInitialFee,
    to,
    amount,
    request,
    t,
    onSendFailure,
    network.isTestnet,
    network.caipId,
  ]);

  return {
    error,
    isSending,
    isValid: !error,
    send,
  };
};
