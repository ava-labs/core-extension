import { omitUndefined } from '@core/common';
import { Account } from '@core/types';

export const omitUndefinedAddresses = <T extends Account>(account: T): T =>
  omitUndefined(account) as T;
