import { Account, AccountType } from '@core/types';
import {
  GetBalancesResponse,
  GetBalancesResponseError,
} from '~/api-clients/balance-api';
import { BalanceResponse } from '~/api-clients/types';
import { isErrorResponse } from '~/api-clients/utils';
import { Caip2IdAccountTypeMap } from '~/api-clients/constants';

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
  return {
    index: 0,
    walletId: 'N/A',
    type: AccountType.PRIMARY,
    name: 'N/A',
    id: error.id,
    // these will be overwritten if the error happened with the respective chain
    addressBTC: 'N/A',
    addressC: 'N/A',
    addressCoreEth: 'N/A',
    // the id in the error is the account address
    [Caip2IdAccountTypeMap[error.caip2Id] ?? '']: error.id,
  };
};
