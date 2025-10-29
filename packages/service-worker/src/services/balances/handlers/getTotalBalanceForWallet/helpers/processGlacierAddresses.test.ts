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

  // Helper functions to reduce code duplication
  const createMockActivityFetcher = (addresses: string[]) => {
    return jest.fn().mockResolvedValueOnce({
      addresses: addresses.map((address) => ({
        address,
        blockchainIds: [BlockchainIds._11111111111111111111111111111111LPO_YY],
      })),
    });
  };

  const createEmptyMockActivityFetcher = () => {
    return jest.fn().mockResolvedValueOnce({ addresses: [] });
  };

  const createErrorMockActivityFetcher = (error: Error) => {
    return jest.fn().mockRejectedValueOnce(error);
  };

  it('returns early if gap is larger than we look for', async () => {
    const activityFetcher = jest.fn();

    expect(
      await processGlacierAddresses(
        allAddresses,
        activityFetcher,
        ADDRESS_GAP_LIMIT + 1,
      ),
    ).toEqual({
      gap: ADDRESS_GAP_LIMIT + 1,
      result: [],
    });

    expect(activityFetcher).not.toHaveBeenCalled();
  });

  it('fetches activity for given set of addresses', async () => {
    const activityFetcher = createEmptyMockActivityFetcher();

    await processGlacierAddresses(allAddresses, activityFetcher, 0);

    expect(activityFetcher).toHaveBeenCalledWith(allAddresses);
  });

  it('sums the previous gap with the current gap', async () => {
    const mockedActivityFetcher = createEmptyMockActivityFetcher();

    const addressesToProcess = allAddresses.slice(-10); // all inactive
    const currentGap = 5;

    expect(
      await processGlacierAddresses(
        allAddresses.slice(-10),
        mockedActivityFetcher,
        currentGap,
      ),
    ).toEqual({
      gap: currentGap + addressesToProcess.length,
      result: [],
    });
  });

  it('returns all active addresses and the number of consecutive inactive addresses (gap)', async () => {
    const activeAddresses = allAddresses.filter((addr) =>
      startsWith(addr, 'active'),
    );
    const mockedActivityFetcher = createMockActivityFetcher(activeAddresses);

    expect(
      await processGlacierAddresses(allAddresses, mockedActivityFetcher, 0),
    ).toEqual({
      gap: 21,
      result: activeAddresses,
    });
  });

  describe('batch processing', () => {
    it('processes addresses in batches of 64', async () => {
      // Create 130 addresses to test batching (2 full batches + 2 remaining)
      const largeAddressList = Array.from(
        { length: 130 },
        (_, i) => `address${i}`,
      );
      const activeAddresses = largeAddressList.slice(0, 5); // First 5 are active

      const mockedActivityFetcher = jest
        .fn()
        .mockResolvedValueOnce({
          addresses: activeAddresses.map((address) => ({
            address,
            blockchainIds: [
              BlockchainIds._11111111111111111111111111111111LPO_YY,
            ],
          })),
        })
        .mockResolvedValueOnce({ addresses: [] })
        .mockResolvedValueOnce({ addresses: [] });

      const result = await processGlacierAddresses(
        largeAddressList,
        mockedActivityFetcher,
        0,
      );

      expect(mockedActivityFetcher).toHaveBeenCalledTimes(3);
      expect(mockedActivityFetcher).toHaveBeenNthCalledWith(
        1,
        largeAddressList.slice(0, 64),
      );
      expect(mockedActivityFetcher).toHaveBeenNthCalledWith(
        2,
        largeAddressList.slice(64, 128),
      );
      expect(mockedActivityFetcher).toHaveBeenNthCalledWith(
        3,
        largeAddressList.slice(128, 130),
      );
      expect(result.result).toEqual(activeAddresses);
    });
  });

  describe('edge cases', () => {
    it('handles empty addresses array', async () => {
      const mockedActivityFetcher = jest.fn();

      const result = await processGlacierAddresses(
        [],
        mockedActivityFetcher,
        0,
      );

      expect(result).toEqual({ gap: 0, result: [] });
      expect(mockedActivityFetcher).not.toHaveBeenCalled();
    });

    it('handles fetchActivity error', async () => {
      const mockedActivityFetcher = createErrorMockActivityFetcher(
        new Error('Glacier API error'),
      );

      await expect(
        processGlacierAddresses(
          ['address1', 'address2'],
          mockedActivityFetcher,
          0,
        ),
      ).rejects.toThrow('Glacier API error');
    });

    it('resets gap when active address is found', async () => {
      const addresses = [
        'inactive1',
        'inactive2',
        'active3',
        'inactive4',
        'inactive5',
      ];
      const mockedActivityFetcher = createMockActivityFetcher(['active3']);

      const result = await processGlacierAddresses(
        addresses,
        mockedActivityFetcher,
        5,
      );

      expect(result).toEqual({
        gap: 2, // 2 inactive addresses after the active one
        result: ['active3'],
      });
    });

    it('handles mixed active/inactive addresses in batches', async () => {
      const addresses = Array.from({ length: 100 }, (_, i) => `address${i}`);

      const mockedActivityFetcher = jest
        .fn()
        .mockResolvedValueOnce({
          addresses: [
            {
              address: 'address10',
              blockchainIds: [
                BlockchainIds._11111111111111111111111111111111LPO_YY,
              ],
            },
          ],
        })
        .mockResolvedValueOnce({
          addresses: [
            {
              address: 'address50',
              blockchainIds: [
                BlockchainIds._11111111111111111111111111111111LPO_YY,
              ],
            },
          ],
        });

      const result = await processGlacierAddresses(
        addresses,
        mockedActivityFetcher,
        0,
      );

      // The function processes addresses sequentially and stops when gap limit is reached
      // Since we have 40 inactive addresses between address10 and address50, it will stop
      expect(result.result).toEqual(['address10']);
      expect(result.gap).toBe(ADDRESS_GAP_LIMIT + 1); // Should exceed the limit
    });

    it('handles null/undefined addresses in the list', async () => {
      const addresses = [
        'address1',
        null,
        'address3',
        undefined,
        'address5',
      ] as any;
      const mockedActivityFetcher = createMockActivityFetcher(['address1']);

      const result = await processGlacierAddresses(
        addresses,
        mockedActivityFetcher,
        0,
      );

      expect(result.result).toEqual(['address1']);
      expect(result.gap).toBe(4); // 4 inactive addresses (including null/undefined)
    });

    it('stops processing when gap limit is reached', async () => {
      const addresses = Array.from({ length: 50 }, (_, i) => `inactive${i}`);
      const mockedActivityFetcher = createEmptyMockActivityFetcher();

      const result = await processGlacierAddresses(
        addresses,
        mockedActivityFetcher,
        ADDRESS_GAP_LIMIT - 10,
      );

      expect(result.gap).toBe(ADDRESS_GAP_LIMIT + 1); // Should be 21 (greater than limit of 20)
      expect(result.result).toEqual([]);
    });
  });
});
