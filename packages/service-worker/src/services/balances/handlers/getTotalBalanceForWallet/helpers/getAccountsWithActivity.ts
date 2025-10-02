import { uniq } from 'lodash';
import { Avalanche } from '@avalabs/core-wallets-sdk';

import { getAddressesInRange } from '@core/common';

import {
  AddressActivityFetcher,
  GLACIER_ADDRESS_FETCH_LIMIT,
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

  console.log('Starting P-chain address discovery with new rules:', {
    internalBatchSize: INTERNAL_ADDRESS_BATCH_SIZE,
    externalBatchSize: EXTERNAL_ADDRESS_BATCH_SIZE,
    glacierBatchSize: GLACIER_ADDRESS_FETCH_LIMIT,
    gapLimit: 20,
  });

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

    console.log(`Iteration ${iteration + 1}: Processing addresses`, {
      externalCount: external.length,
      internalCount: internal.length,
      externalStart,
      internalStart,
      externalGap,
      internalGap,
    });

    const [externalResult, internalResult] = await Promise.all([
      processGlacierAddresses(external, activityFetcher, externalGap),
      processGlacierAddresses(internal, activityFetcher, internalGap),
    ]);

    result = [...result, ...externalResult.result];
    result = [...result, ...internalResult.result];

    console.log(`Iteration ${iteration + 1} results:`, {
      externalGap: externalResult.gap,
      internalGap: internalResult.gap,
      externalFound: externalResult.result.length,
      internalFound: internalResult.result.length,
      totalFound: result.length,
    });

    externalGap = externalResult.gap;
    externalStart += EXTERNAL_ADDRESS_BATCH_SIZE;

    internalGap = internalResult.gap;
    internalStart += INTERNAL_ADDRESS_BATCH_SIZE;

    iteration += 1;
    tooManyIterations = iteration >= ITERATION_LIMIT;
  }

  console.log('Address discovery completed:', {
    totalIterations: iteration,
    totalAddressesFound: result.length,
    externalGap,
    internalGap,
    stoppedEarly: tooManyIterations,
  });

  return uniq(result);
}
