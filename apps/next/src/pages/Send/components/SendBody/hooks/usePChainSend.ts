import { toast } from '@avalabs/k2-alpine';
import { utils } from '@avalabs/avalanchejs';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';

import {
  NetworkWithCaipId,
  PChainTokenBalance,
  PvmCapableAccount,
} from '@core/types';
import {
  useConnectionContext,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';
import { isValidPvmAddress, stripAddressPrefix } from '@core/common';

import { buildPChainSendTx } from '@/lib/buildPChainSendTx';
import { useGetXPAddresses } from '@/hooks/useGetXPAddresses';
import { useMaxAmountForTokenSend } from '@/hooks/useMaxAmountForTokenSend';

import { useTransactionCallbacks } from './useTransactionCallbacks';

type UsePChainSendArgs = {
  token: PChainTokenBalance;
  amount: bigint;
  from: PvmCapableAccount;
  to?: string;
  network: NetworkWithCaipId;
};

export const usePChainSend = ({
  token,
  amount,
  from,
  to,
  network,
}: UsePChainSendArgs) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { isLedgerWallet } = useWalletContext();
  const getXPAddressesFetcher = useGetXPAddresses();
  const { filterSmallUtxos } = useSettingsContext();
  const { onSendFailure } = useTransactionCallbacks(network);
  const { maxAmount, estimatedFee } = useMaxAmountForTokenSend(from, token, to);

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');

    if (!to || !isValidPvmAddress(to)) {
      return setError(t('Selected recipient is not a valid P-Chain address.'));
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
    if (!to || !isValidPvmAddress(to)) {
      toast.error(
        t('Please provide a valid P-Chain address as the recipient.'),
      );
      return;
    }

    setIsSending(true);

    try {
      const addresses = await getXPAddressesFetcher('PVM')();
      const unsignedTx = await buildPChainSendTx({
        isLedgerWallet,
        account: from,
        amount,
        to,
        network,
        addresses,
        filterSmallUtxos,
      });
      const manager = utils.getManagerForVM(unsignedTx.getVM());
      const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());
      const utxosAddrs = new Set(
        unsignedTx.utxos.flatMap((utxo) =>
          utxo.getOutputOwners().addrs.map(String),
        ),
      );
      const externalIndices = addresses.externalAddresses.reduce(
        (indices, addy) => {
          if (utxosAddrs.has(stripAddressPrefix(addy.address))) {
            indices.push(addy.index);
          }

          return indices;
        },
        [] as number[],
      );
      const params = {
        transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
        chainAlias: 'P',
        utxos: unsignedTx.utxos.map((utxo) =>
          utils.bufferToHex(utxo.toBytes(codec)),
        ),
        externalIndices,
      };

      const hash = await request(
        {
          method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
          params,
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
    to,
    request,
    t,
    onSendFailure,
    filterSmallUtxos,
    isLedgerWallet,
    from,
    amount,
    network,
    getXPAddressesFetcher,
  ]);

  const isLoaded = estimatedFee !== undefined && maxAmount !== undefined;

  return {
    error,
    isSending,
    isValid: isLoaded && !error,
    send,
  };
};
