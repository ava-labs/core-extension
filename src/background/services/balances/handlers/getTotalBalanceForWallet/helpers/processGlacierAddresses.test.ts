import { startsWith } from 'lodash';
import { BlockchainIds } from '@avalabs/glacier-sdk';

import { ADDRESS_GAP_LIMIT } from '../models';
import { processGlacierAddresses } from './processGlacierAddresses';

describe('src/background/services/balances/handlers/getTotalBalanceForWallet/helpers/getAccountsWithActivity', () => {
  const allAddresses = [
    'active0',
    'active1',
    'active2',
    'active3',
    'inactive4',
    'inactive5',
    'inactive6',
    'inactive7',
    'active8',
    'inactive9',
    'inactive10',
    'inactive11',
    'inactive12',
    'inactive13',
    'inactive14',
    'inactive15',
    'inactive16',
    'inactive17',
    'inactive18',
    'inactive19',
    'inactive20',
    'inactive21',
    'inactive22',
    'inactive23',
    'inactive24',
    'inactive25',
    'inactive26',
    'inactive27',
    'inactive28',
    'inactive29',
    'inactive30',
  ];

  it('returns early if gap is larger than we look for', async () => {
    const activityFetcher = jest.fn();

    expect(
      await processGlacierAddresses(
        allAddresses,
        activityFetcher,
        ADDRESS_GAP_LIMIT + 1
      )
    ).toEqual({
      gap: ADDRESS_GAP_LIMIT + 1,
      result: [],
    });

    expect(activityFetcher).not.toHaveBeenCalled();
  });

  it('fetches activity for given set of addresses', async () => {
    const activityFetcher = jest.fn().mockResolvedValueOnce({ addresses: [] });

    await processGlacierAddresses(allAddresses, activityFetcher, 0);

    expect(activityFetcher).toHaveBeenCalledWith(allAddresses);
  });

  it('sums the previous gap with the current gap', async () => {
    const mockedActivityFetcher = jest.fn().mockResolvedValueOnce({
      addresses: [],
    });

    const addressesToProcess = allAddresses.slice(-10); // all inactive
    const currentGap = 5;

    expect(
      await processGlacierAddresses(
        allAddresses.slice(-10),
        mockedActivityFetcher,
        currentGap
      )
    ).toEqual({
      gap: currentGap + addressesToProcess.length,
      result: [],
    });
  });

  it('returns all active addresses and the number of consecutive inactive addresses (gap)', async () => {
    const activeAddresses = allAddresses.filter((addr) =>
      startsWith(addr, 'active')
    );
    const mockedActivityFetcher = jest.fn().mockResolvedValueOnce({
      addresses: activeAddresses.map((address) => ({
        address,
        blockchainIds: [BlockchainIds._11111111111111111111111111111111LPO_YY],
      })),
    });

    expect(
      await processGlacierAddresses(allAddresses, mockedActivityFetcher, 0)
    ).toEqual({
      gap: 21,
      result: activeAddresses,
    });
  });
});
