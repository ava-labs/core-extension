import { ChainAddressChainIdMap } from '@avalabs/glacier-sdk';
import {
  ADDRESS_GAP_LIMIT,
  AddressActivityFetcher,
  GLACIER_ADDRESS_FETCH_LIMIT,
  ITERATION_LIMIT,
  SearchSpace,
  XPAddressDictionary,
} from './models';
import { ChainListWithCaipIds } from '@src/background/services/network/models';
import { ChainId } from '@avalabs/core-chains-sdk';
import { isString, uniq } from 'lodash';
import { Avalanche } from '@avalabs/core-wallets-sdk';

import { Account } from '@src/background/services/accounts/models';
import getAllAddressesForAccount from '@src/utils/getAllAddressesForAccount';
import { getAddressesInRange } from '@src/background/services/accounts/utils/getAddressesInRange';
import { calculateTotalBalance } from '@src/utils/calculateTotalBalance';

import { Balances } from '../../models';

function isDone(currentGap: number) {
  return currentGap > ADDRESS_GAP_LIMIT;
}

async function processGlacierAddresses(
  addresses: string[],
  fetchActivity: AddressActivityFetcher,
  space: SearchSpace,
  start: number,
  gap: number
) {
  if (isDone(gap)) {
    return { gap, result: {} };
  } else {
    const { addresses: glacierAddresses } = await fetchActivity(addresses);

    const seenByGlacier: Record<string, ChainAddressChainIdMap> =
      glacierAddresses.reduce(
        (acc, addressInfo) => ({
          ...acc,
          [addressInfo.address]: addressInfo,
        }),
        {}
      );
    const result: XPAddressDictionary = {};
    for (let i = 0; i < addresses.length && !isDone(gap); i++) {
      const address = addresses[i];
      if (address && address in seenByGlacier) {
        result[address] = { space, index: start + i };
        gap = 0;
      } else {
        gap += 1;
      }
    }

    return { gap, result };
  }
}

function getXPChainIds(isMainnet: boolean) {
  const xChainId = isMainnet ? ChainId.AVALANCHE_X : ChainId.AVALANCHE_TEST_X;
  const pChainId = isMainnet ? ChainId.AVALANCHE_P : ChainId.AVALANCHE_TEST_P;

  return [pChainId, xChainId];
}

function getIncludedNetworks(
  isMainnet: boolean,
  currentChainList: ChainListWithCaipIds,
  favoriteChainIds: number[]
) {
  const cChainId = isMainnet
    ? ChainId.AVALANCHE_MAINNET_ID
    : ChainId.AVALANCHE_TESTNET_ID;
  const currentEnvNetworks = Object.keys(currentChainList).map(Number);

  return uniq(
    [cChainId, ...getXPChainIds(isMainnet), ...favoriteChainIds].filter(
      (chainId) => currentEnvNetworks.includes(chainId)
    )
  );
}

function getAllAddressesForAccounts(accounts: Account[]): string[] {
  return accounts.flatMap(getAllAddressesForAccount).filter(isString);
}

async function getAccountsWithActivity(
  xpubXP: string,
  providerXP: Avalanche.JsonRpcProvider,
  activityFetcher: AddressActivityFetcher
) {
  let externalGap = 0;
  let internalGap = 0;
  let externalStart = 0;
  let internalStart = 0;
  let tooManyIterations = false;
  let result: XPAddressDictionary = {};
  let iteration = 0;

  while (!isDone(externalGap) && !isDone(internalGap) && !tooManyIterations) {
    const external = getAddressesInRange(
      xpubXP,
      providerXP,
      false,
      externalStart
    );
    const internal = getAddressesInRange(
      xpubXP,
      providerXP,
      true,
      internalStart
    );
    const [externalResult, internalResult] = await Promise.all([
      processGlacierAddresses(
        external,
        activityFetcher,
        'e',
        externalStart,
        externalGap
      ),
      processGlacierAddresses(
        internal,
        activityFetcher,
        'i',
        internalStart,
        internalGap
      ),
    ]);

    result = { ...result, ...externalResult.result };
    result = { ...result, ...internalResult.result };

    externalGap = externalResult.gap;
    externalStart += GLACIER_ADDRESS_FETCH_LIMIT;

    internalGap = internalResult.gap;
    internalStart += GLACIER_ADDRESS_FETCH_LIMIT;

    iteration += 1;
    tooManyIterations = iteration >= ITERATION_LIMIT;
  }

  return result;
}

function calculateTotalBalanceForAddresses(
  balances: Balances,
  accounts: Partial<Account>[],
  chainIds: number[]
): number {
  return accounts.reduce((sum: number, account: Partial<Account>) => {
    const accountBalance = calculateTotalBalance(account, chainIds, balances);
    return sum + (accountBalance.sum ?? 0);
  }, 0);
}

export {
  calculateTotalBalanceForAddresses,
  getAccountsWithActivity,
  getAllAddressesForAccounts,
  getXPChainIds,
  getIncludedNetworks,
  isDone,
  processGlacierAddresses,
};
