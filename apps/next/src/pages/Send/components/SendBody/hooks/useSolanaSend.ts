import { toast } from '@avalabs/k2-alpine';
import { Address } from '@solana/kit';
import { RpcMethod } from '@avalabs/vm-module-types';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { compileSolanaTx, serializeSolanaTx } from '@avalabs/core-wallets-sdk';

import {
  isSolanaNativeToken,
  NetworkWithCaipId,
  SolanaNativeTokenBalance,
  SolanaSplTokenBalance,
  SvmCapableAccount,
} from '@core/types';
import { isValidSvmAddress } from '@core/common';
import { useConnectionContext } from '@core/ui';

import { getSolanaProvider } from '@/lib/getSolanaProvider';
import { useMaxAmountForTokenSend } from '@/hooks/useMaxAmountForTokenSend';

import { buildSolanaSendTx } from '../lib/buildSolanaSendTx';
import { useTransactionCallbacks } from './useTransactionCallbacks';

const RENT_EXEMPT_CACHE = new Map<bigint, bigint>();
const ACCOUNT_SPACE_CACHE = new Map<Address, bigint>();

type UseSolanaSendArgs = {
  token: SolanaNativeTokenBalance | SolanaSplTokenBalance;
  amount: bigint;
  from: SvmCapableAccount;
  to?: string;
  network: NetworkWithCaipId;
};

export const useSolanaSend = ({
  token,
  amount,
  from,
  to,
  network,
}: UseSolanaSendArgs) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();

  const { onSendSuccess, onSendFailure } = useTransactionCallbacks(network);
  const { maxAmount, estimatedFee } = useMaxAmountForTokenSend(from, token, to);

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');

    if (!to || !isValidSvmAddress(to)) {
      return setError(t('Selected recipient is not a valid Solana address.'));
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

    if (isSolanaNativeToken(token)) {
      const provider = getSolanaProvider(network);
      getAccountOccupiedSpace(to, provider).then((accountSpace) => {
        if (accountSpace !== 0n) return;
        // If the recipient account does not hold any data, the first transfer
        // must be greater than the rent-exempt minimum.
        getRentExemptMinimum(0n, provider).then((minimum) => {
          if (amount >= minimum) return;
          setError(
            t('Minimum amount is {{minimum}}.', {
              minimum: `${new TokenUnit(minimum, token.decimals, token.symbol).toDisplay()} ${token.symbol}`,
            }),
          );
        });
      });
    }
  }, [maxAmount, t, to, estimatedFee, amount, token, network]);

  const send = useCallback(async () => {
    if (!to || !isValidSvmAddress(to)) {
      toast.error(t('Please provide a valid Solana address as the recipient.'));
      return;
    }

    setIsSending(true);

    try {
      const provider = getSolanaProvider(network);
      const tx = await buildSolanaSendTx({
        from,
        amount,
        to,
        token,
        provider,
      });

      const hash = await request(
        {
          method: RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION,
          params: [
            {
              account: from.addressSVM,
              serializedTx: serializeSolanaTx(compileSolanaTx(tx)),
            },
          ],
        },
        {
          scope: network.caipId,
        },
      );
      onSendSuccess(hash);
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
    onSendSuccess,
    onSendFailure,
    from,
    amount,
    network,
    token,
  ]);

  const isLoaded = estimatedFee !== undefined && maxAmount !== undefined;

  return {
    error,
    isSending,
    isValid: isLoaded && !error,
    send,
  };
};

const getAccountOccupiedSpace = async (
  address: Address,
  provider: ReturnType<typeof getSolanaProvider>,
): Promise<bigint> => {
  if (ACCOUNT_SPACE_CACHE.has(address)) {
    return ACCOUNT_SPACE_CACHE.get(address)!;
  }

  const accountInfo = await provider.getAccountInfo(address).send();
  const space = accountInfo.value?.space ?? 0n;
  ACCOUNT_SPACE_CACHE.set(address, space);

  return space;
};

const getRentExemptMinimum = async (
  space: bigint,
  provider: ReturnType<typeof getSolanaProvider>,
): Promise<bigint> => {
  if (RENT_EXEMPT_CACHE.has(space)) {
    return RENT_EXEMPT_CACHE.get(space)!;
  }

  const rentExemptMinimum = await provider
    .getMinimumBalanceForRentExemption(0n)
    .send();

  RENT_EXEMPT_CACHE.set(0n, rentExemptMinimum);

  return rentExemptMinimum;
};
