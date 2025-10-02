import { ChainAddressChainIdMap } from '@avalabs/glacier-sdk';

import { AddressActivityFetcher } from '../models';
import { isDone } from './isDone';

export async function processGlacierAddresses(
  addresses: string[],
  fetchActivity: AddressActivityFetcher,
  gap: number,
) {
  if (isDone(gap)) {
    return { gap, result: [] };
  } else {
    // Request to Glacier in batches of 64 addresses
    const glacierBatchSize = 64;
    const allGlacierAddresses: ChainAddressChainIdMap[] = [];

    for (let i = 0; i < addresses.length; i += glacierBatchSize) {
      const batch = addresses.slice(i, i + glacierBatchSize);

      const { addresses: glacierAddresses } = await fetchActivity(batch);
      allGlacierAddresses.push(...glacierAddresses);
    }

    const seenByGlacier: Record<string, ChainAddressChainIdMap> =
      allGlacierAddresses.reduce(
        (acc, addressInfo) => ({
          ...acc,
          [addressInfo.address]: addressInfo,
        }),
        {},
      );

    const result: string[] = [];
    for (let i = 0; i < addresses.length && !isDone(gap); i++) {
      const address = addresses[i];
      if (address && address in seenByGlacier) {
        result.push(address);
        gap = 0;
      } else {
        gap += 1;
      }
    }
    return { gap, result };
  }
}
