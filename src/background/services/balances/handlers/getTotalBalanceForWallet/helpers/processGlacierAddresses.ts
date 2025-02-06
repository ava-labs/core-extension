import type { ChainAddressChainIdMap } from '@avalabs/glacier-sdk';

import type { AddressActivityFetcher } from '../models';
import { isDone } from './isDone';

export async function processGlacierAddresses(
  addresses: string[],
  fetchActivity: AddressActivityFetcher,
  gap: number,
) {
  if (isDone(gap)) {
    return { gap, result: [] };
  } else {
    const { addresses: glacierAddresses } = await fetchActivity(addresses);

    const seenByGlacier: Record<string, ChainAddressChainIdMap> =
      glacierAddresses.reduce(
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
