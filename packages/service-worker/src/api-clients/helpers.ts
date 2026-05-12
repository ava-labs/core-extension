import { Account, AccountType } from '@core/types';
import {
  GetBalancesResponse,
  GetBalancesResponseError,
} from '~/api-clients/balance-api';
import {
  Caip2IdAccountTypeMap,
  NameSpaceAccountTypeMap,
} from '~/api-clients/constants';
import { BalanceResponse } from '~/api-clients/types';
import { isErrorResponse } from '~/api-clients/utils';

export const convertStreamToArray = async (
  stream: AsyncGenerator<GetBalancesResponse, unknown>,
): Promise<{
  balances: BalanceResponse[];
  errors: GetBalancesResponseError[];
}> => {
  if (!stream) {
    return { balances: [], errors: [] };
  }
  let next = await stream.next();

  const balances: BalanceResponse[] = [];
  const errors: GetBalancesResponseError[] = [];
  while (!next.done) {
    if (isErrorResponse(next.value)) {
      if ('caip2Id' in next.value) {
        errors.push(next.value);
      }
      next = await stream.next();
      continue;
    }
    balances.push(next.value);
    next = await stream.next();
  }

  return { balances, errors };
};

export const normalizeXPAddress = (address: string) => {
  const withoutPrefix = address.split('-').at(1);
  if (!withoutPrefix) {
    throw new Error('Invalid X/P address');
  }
  return withoutPrefix;
};

export const reconstructAccountFromError = (
  error: GetBalancesResponseError,
): Account => {
  // Fall back to the namespace map (e.g. any `eip155:*` → `addressC`) so the
  // fallback fetch works for EVM chains the balance service doesn't support
  // (custom networks, new L1s/L2s) — not just the ones hard-coded in
  // `Caip2IdAccountTypeMap`.
  const [namespace] = error.caip2Id.split(':');
  const accountType =
    Caip2IdAccountTypeMap[error.caip2Id] ??
    (namespace ? NameSpaceAccountTypeMap[namespace] : undefined);

  const account: Account = {
    index: 0,
    walletId: 'N/A',
    type: AccountType.PRIMARY,
    name: 'N/A',
    id: error.id,
    // these will be overwritten if the error happened with the respective chain
    addressBTC: undefined as unknown as string,
    addressC: undefined as unknown as string,
    addressCoreEth: undefined as unknown as string,
  };

  if (accountType) {
    // the id in the error is the account address
    account[accountType] = error.id;
  }

  return account;
};
