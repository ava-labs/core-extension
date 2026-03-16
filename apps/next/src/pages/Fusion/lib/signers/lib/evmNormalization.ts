import { TransactionParams } from '@avalabs/evm-module';
import { EvmTransactionRequest } from '@avalabs/fusion-sdk';

import { hasAtLeastTwoElements, isNotNullish } from '@core/common';

type NormalizeValue<T> = T extends bigint | number
  ? string
  : T extends null
    ? undefined
    : Exclude<T, null>;

type NormalizePayload<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: NormalizeValue<
    T[K]
  >;
};

const toHex = (value: bigint | number): string => `0x${value.toString(16)}`;

const normalizeEntry = ([key, value]: [string, unknown]): [string, unknown] => [
  key,
  typeof value === 'bigint' || typeof value === 'number' ? toHex(value) : value,
];

export const normalizeTransaction = <T extends EvmTransactionRequest>(
  payload: T,
): NormalizePayload<T> =>
  Object.fromEntries(
    Object.entries(payload)
      .filter(([, v]) => isNotNullish(v))
      .map(normalizeEntry),
  ) as NormalizePayload<T>;

export const normalizeTransactionsBatch = (
  transactions: readonly EvmTransactionRequest[],
): [TransactionParams, TransactionParams, ...TransactionParams[]] => {
  if (!hasAtLeastTwoElements(transactions)) {
    throw new Error('At least two transactions are required for a batch call.');
  }

  return transactions.map(normalizeTransaction) as [
    TransactionParams,
    TransactionParams,
    ...TransactionParams[],
  ];
};
