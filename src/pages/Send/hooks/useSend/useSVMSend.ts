/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from 'react';
import {
  transferSol,
  compileSolanaTx,
  serializeSolanaTx,
  transferToken,
} from '@avalabs/core-wallets-sdk';
import { isAddress } from '@solana/addresses';
import { RpcMethod, TokenType } from '@avalabs/vm-module-types';

import { SendErrorMessage } from '@src/utils/send/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

import { SendAdapterSVM } from './models';
import { NativeSendOptions, SolanaSendOptions } from '../../models';
import { stringToBigint } from '@src/utils/stringToBigint';
import { ethErrors } from 'eth-rpc-errors';
import { CommonError } from '@src/utils/errors';

export const useSvmSend: SendAdapterSVM = ({
  nativeToken,
  provider,
  account,
}) => {
  const { request } = useConnectionContext();

  const [error, setError] = useState<SendErrorMessage>();
  const [isValidating, setIsValidating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [maxAmount, setMaxAmount] = useState('0');

  function setErrorAndEndValidating(message: SendErrorMessage) {
    setError(message);
    setIsValidating(false);
  }

  const buildTransaction = useCallback(
    async ({ address, amount, token }: SolanaSendOptions) => {
      if (token.type === TokenType.NATIVE) {
        return transferSol({
          from: account.addressSVM,
          to: address,
          amount: BigInt(stringToBigint(amount, nativeToken.decimals)),
          provider,
        });
      }

      return transferToken({
        from: account.addressSVM,
        to: address,
        mint: token.address,
        amount: BigInt(stringToBigint(amount, token.decimals)),
        provider,
      });
    },
    [account.addressSVM, nativeToken.decimals, provider],
  );

  const validate = useCallback(
    async ({ address, amount, token }: SolanaSendOptions) => {
      if (!address) {
        setErrorAndEndValidating(SendErrorMessage.ADDRESS_REQUIRED);
        return;
      }

      if (!isAddress(address)) {
        setErrorAndEndValidating(SendErrorMessage.INVALID_ADDRESS);
        return;
      }

      const amountBigInt = stringToBigint(amount || '0', token.decimals);

      if (!amountBigInt || amountBigInt < 0) {
        setErrorAndEndValidating(SendErrorMessage.AMOUNT_REQUIRED);
        return;
      }

      const remainingBalance = token.balance - amountBigInt;

      // TODO: take fee into consideration
      if (remainingBalance <= 0n) {
        setErrorAndEndValidating(SendErrorMessage.INSUFFICIENT_BALANCE);
        return;
      }

      setError(undefined);
      setIsValidating(false);
    },
    [],
  );

  const send = useCallback(
    async (options: SolanaSendOptions) => {
      try {
        setIsSending(true);

        const tx = await buildTransaction(options);
        const compiledTx = compileSolanaTx(tx);

        const hash = await request({
          method: RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION,
          params: [
            {
              account: account.addressSVM,
              serializedTx: serializeSolanaTx(compiledTx),
            },
          ],
        });

        return hash;
      } catch (err) {
        console.error(err);
        setError(SendErrorMessage.UNKNOWN_ERROR);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [buildTransaction, request, account.addressSVM],
  );

  return {
    error,
    isSending,
    isValid: !isValidating && !error,
    isValidating,
    maxAmount,
    send,
    validate,
  };
};
