import {
  GetBalancesResponse,
  GetBalancesResponseError,
} from '~/api-clients/balance-api';
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
