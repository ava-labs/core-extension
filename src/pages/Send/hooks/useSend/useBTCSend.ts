import { stringToBN } from '@avalabs/core-utils-sdk';
import { useCallback, useEffect, useState } from 'react';
import {
  BitcoinInputUTXO,
  getMaxTransferAmount,
} from '@avalabs/core-wallets-sdk';

import { SendErrorMessage } from '@src/utils/send/models';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import {
  getBtcInputUtxos,
  validateBtcSend,
} from '@src/utils/send/btcSendUtils';
import type { BitcoinSendTransactionHandler } from '@src/background/services/wallet/handlers/bitcoin_sendTransaction';

import { SendAdapterBTC } from './models';
import { BaseSendOptions } from '../../models';

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
          0
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
          isMainnet
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
    [utxos, maxFee, from, isMainnet, nativeToken]
  );

  const send = useCallback(
    async ({ address, amount }: BaseSendOptions) => {
      setIsSending(true);

      try {
        const amountBN = stringToBN(amount || '0', nativeToken.decimals);
        const amountInSatoshis = amountBN.toNumber();

        return await request<
          BitcoinSendTransactionHandler,
          DAppProviderRequest.BITCOIN_SEND_TRANSACTION,
          string
        >({
          method: DAppProviderRequest.BITCOIN_SEND_TRANSACTION,
          params: [address, String(amountInSatoshis), Number(maxFee)],
        });
      } finally {
        setIsSending(false);
      }
    },
    [maxFee, nativeToken.decimals, request]
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
