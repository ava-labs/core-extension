import { uniq } from 'lodash';
import { Avalanche } from '@avalabs/core-wallets-sdk';

import { getAddressesInRange } from '@core/common';

import {
  AddressActivityFetcher,
  ITERATION_LIMIT,
  INTERNAL_ADDRESS_BATCH_SIZE,
  EXTERNAL_ADDRESS_BATCH_SIZE,
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
    // Generate addresses in batches of 100 for internal and external
    const external = getAddressesInRange(
      xpubXP,
      providerXP,
      false,
      externalStart,
      EXTERNAL_ADDRESS_BATCH_SIZE,
    );
    const internal = getAddressesInRange(
      xpubXP,
      providerXP,
      true,
      internalStart,
      INTERNAL_ADDRESS_BATCH_SIZE,
    );

    const [externalResult, internalResult] = await Promise.all([
      processGlacierAddresses(external, activityFetcher, externalGap),
      processGlacierAddresses(internal, activityFetcher, internalGap),
    ]);

    result = [...result, ...externalResult.result];
    result = [...result, ...internalResult.result];

    externalGap = externalResult.gap;
    externalStart += EXTERNAL_ADDRESS_BATCH_SIZE;

    internalGap = internalResult.gap;
    internalStart += INTERNAL_ADDRESS_BATCH_SIZE;

    iteration += 1;
    tooManyIterations = iteration >= ITERATION_LIMIT;
  }

  return uniq(result);
}
