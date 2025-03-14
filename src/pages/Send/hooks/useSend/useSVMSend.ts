/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from 'react';
import {
  transferSol,
  compileSolanaTx,
  serializeSolanaTx,
  transferToken,
  SolanaProvider,
} from '@avalabs/core-wallets-sdk';
import { isAddress, Address } from '@solana/kit';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { RpcMethod, TokenType } from '@avalabs/vm-module-types';

import { SendErrorMessage } from '@src/utils/send/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

import { SendAdapterSVM } from './models';
import { SolanaSendOptions } from '../../models';
import { stringToBigint } from '@src/utils/stringToBigint';

const RENT_EXEMPT_CACHE = new Map<bigint, bigint>();
const ACCOUNT_SPACE_CACHE = new Map<Address, bigint>();

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
  const [minAmount, setMinAmount] = useState<string>();

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
      setIsValidating(true);

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

      if (token.type === TokenType.NATIVE) {
        const spaceOccupied = await getAccountOccupiedSpace(address, provider);

        // If the recipient account does not hold any data, the first transfer
        // must be greater than the rent-exempt minimum.
        if (spaceOccupied === 0n) {
          const minimum = await getRentExemptMinimum(0n, provider);

          setMinAmount(bigIntToString(minimum, token.decimals));

          if (amountBigInt < minimum) {
            setErrorAndEndValidating(SendErrorMessage.AMOUNT_TOO_LOW);
            return;
          }
        } else {
          setMinAmount(undefined);
        }
      } else {
        setMinAmount(undefined);
      }

      setError(undefined);
      setIsValidating(false);
    },
    [provider],
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
    minAmount,
    maxAmount,
    send,
    validate,
  };
};

const getAccountOccupiedSpace = async (
  address: Address,
  provider: SolanaProvider,
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
  provider: SolanaProvider,
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
