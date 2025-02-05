import { stringToBN } from '@avalabs/core-utils-sdk';
import { useCallback, useEffect, useState } from 'react';
import type { BitcoinInputUTXO } from '@avalabs/core-wallets-sdk';
import { getMaxTransferAmount } from '@avalabs/core-wallets-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import type { BitcoinSendTransactionParams } from '@avalabs/bitcoin-module';

import { SendErrorMessage } from '@src/utils/send/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import {
  getBtcInputUtxos,
  validateBtcSend,
} from '@src/utils/send/btcSendUtils';

import type { SendAdapterBTC } from './models';
import type { BaseSendOptions } from '../../models';

export const useBtcSend: SendAdapterBTC = ({
  isMainnet,
  from,
  provider,
  maxFee,
  nativeToken,
}) => {
  const { request } = useConnectionContext();

  const [isSending, setIsSending] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [utxos, setUtxos] = useState<BitcoinInputUTXO[]>([]);
  const [maxAmount, setMaxAmount] = useState('0');
  const [error, setError] = useState<SendErrorMessage>();

  useEffect(() => {
    let isMounted = true;

    getBtcInputUtxos(provider, nativeToken, Number(maxFee))
      .then((_utxos) => {
        if (isMounted) {
          setUtxos(_utxos);
        }
      })
      .catch(() => {
        setError(SendErrorMessage.UNABLE_TO_FETCH_UTXOS);
      });

    return () => {
      isMounted = false;
    };
  }, [provider, nativeToken, maxFee]);

  const validate = useCallback(
    async (options: BaseSendOptions) => {
      const { address, amount } = options;

      setIsValidating(true);
      setError(undefined);

      try {
        const amountBN = stringToBN(amount || '0', nativeToken.decimals);
        const amountInSatoshis = amountBN.toNumber();
        const maxTransferAmount = Math.max(
          getMaxTransferAmount(utxos, address, from, Number(maxFee)),
          0,
        );

        setMaxAmount(maxTransferAmount.toString());

        const validationError = validateBtcSend(
          from,
          {
            address,
            amount: amountInSatoshis,
            feeRate: Number(maxFee),
            token: nativeToken,
          },
          utxos,
          isMainnet,
        );

        if (validationError) {
          setError(validationError);
          return;
        } else {
          setError(undefined);
        }
      } finally {
        setIsValidating(false);
      }
    },
    [utxos, maxFee, from, isMainnet, nativeToken],
  );

  const send = useCallback(
    async ({ address, amount }: BaseSendOptions) => {
      setIsSending(true);

      try {
        const amountBN = stringToBN(amount || '0', nativeToken.decimals);
        const amountInSatoshis = amountBN.toNumber();

        return await request<BitcoinSendTransactionParams>({
          method: RpcMethod.BITCOIN_SEND_TRANSACTION,
          params: {
            from,
            to: address,
            amount: amountInSatoshis,
            feeRate: Number(maxFee),
          },
        });
      } finally {
        setIsSending(false);
      }
    },
    [from, maxFee, nativeToken.decimals, request],
  );

  return {
    error,
    isSending,
    isValid: !error,
    isValidating,
    maxAmount,
    send,
    validate,
  };
};
