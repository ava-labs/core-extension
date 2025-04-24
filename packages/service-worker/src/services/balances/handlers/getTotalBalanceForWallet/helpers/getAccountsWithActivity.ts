import { uniq } from 'lodash';
import { Avalanche } from '@avalabs/core-wallets-sdk';

import { getAddressesInRange } from '@core/utils';

import {
  AddressActivityFetcher,
  GLACIER_ADDRESS_FETCH_LIMIT,
  ITERATION_LIMIT,
} from '../models';

import { processGlacierAddresses } from './processGlacierAddresses';
import { isDone } from './isDone';

export async function getAccountsWithActivity(
  xpubXP: string,
  providerXP: Avalanche.JsonRpcProvider,
  activityFetcher: AddressActivityFetcher,
) {
  let externalGap = 0;
  let internalGap = 0;
  let externalStart = 0;
  let internalStart = 0;
  let tooManyIterations = false;
  let result: string[] = [];
  let iteration = 0;

  while (!isDone(externalGap) && !isDone(internalGap) && !tooManyIterations) {
    const external = getAddressesInRange(
      xpubXP,
      providerXP,
      false,
      externalStart,
    );
    const internal = getAddressesInRange(
      xpubXP,
      providerXP,
      true,
      internalStart,
    );
    const [externalResult, internalResult] = await Promise.all([
      processGlacierAddresses(external, activityFetcher, externalGap),
      processGlacierAddresses(internal, activityFetcher, internalGap),
    ]);

    result = [...result, ...externalResult.result];
    result = [...result, ...internalResult.result];

    externalGap = externalResult.gap;
    externalStart += GLACIER_ADDRESS_FETCH_LIMIT;

    internalGap = internalResult.gap;
    internalStart += GLACIER_ADDRESS_FETCH_LIMIT;

    iteration += 1;
    tooManyIterations = iteration >= ITERATION_LIMIT;
  }

  return uniq(result);
}
