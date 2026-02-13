import { toast } from '@avalabs/k2-alpine';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';

import {
  AvmCapableAccount,
  NetworkWithCaipId,
  XChainTokenBalance,
} from '@core/types';
import {
  useConnectionContext,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';
import { isValidAvmAddress } from '@core/common';

import { useMaxAmountForTokenSend } from '@/hooks/useMaxAmountForTokenSend';

import { useTransactionCallbacks } from './useTransactionCallbacks';
import { buildXChainSendTx } from '../lib/buildXChainSendTx';
import { useGetXPAddresses } from '@/hooks/useGetXPAddresses';

type UseXChainSendArgs = {
  token: XChainTokenBalance;
  amount: bigint;
  from: AvmCapableAccount;
  to?: string;
  network: NetworkWithCaipId;
};

export const useXChainSend = ({
  token,
  amount,
  from,
  to,
  network,
}: UseXChainSendArgs) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { isLedgerWallet } = useWalletContext();
  const getXPAddressesFetcher = useGetXPAddresses();
  const { filterSmallUtxos } = useSettingsContext();
  const { onSendApproved, onSendFailure, onSendSuccess } =
    useTransactionCallbacks(network, from.addressAVM);
  const { maxAmount, estimatedFee } = useMaxAmountForTokenSend(from, token, to);

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');

    if (!to || !isValidAvmAddress(to)) {
      return setError(t('Selected recipient is not a valid X-Chain address.'));
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
  }, [maxAmount, token.decimals, token.symbol, t, to, estimatedFee, amount]);

  const send = useCallback(async () => {
    if (!to || !isValidAvmAddress(to)) {
      toast.error(
        t('Please provide a valid X-Chain address as the recipient.'),
      );
      return;
    }

    setIsSending(true);
    onSendApproved();

    try {
      const params = await buildXChainSendTx({
        isLedgerWallet,
        account: from,
        amount,
        to,
        network,
        addresses: await getXPAddressesFetcher('AVM')(),
        filterSmallUtxos,
      });
      const hash = await request(
        {
          method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
          params,
        },
        {
          scope: network.caipId,
        },
      );

      onSendSuccess(hash);
      return hash;
    } catch (err) {
      console.error(err);
      onSendFailure(err);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [
    to,
    request,
    t,
    onSendApproved,
    onSendFailure,
    onSendSuccess,
    isLedgerWallet,
    from,
    amount,
    network,
    getXPAddressesFetcher,
    filterSmallUtxos,
  ]);

  const isLoaded = estimatedFee !== undefined && maxAmount !== undefined;

  return {
    error,
    isSending,
    isValid: isLoaded && !error,
    send,
  };
};
