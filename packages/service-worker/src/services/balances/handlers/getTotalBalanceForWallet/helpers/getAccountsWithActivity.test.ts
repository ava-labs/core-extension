import { Avalanche } from '@avalabs/core-wallets-sdk';

import { processGlacierAddresses } from './processGlacierAddresses';
import { getAccountsWithActivity } from './getAccountsWithActivity';

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('./processGlacierAddresses');

describe('src/background/services/balances/handlers/getTotalBalanceForWallet/helpers/getAccountsWithActivity', () => {
  const mockedActivityFetcher = jest.fn();
  const xpubXP = 'xpubXP';
  const providerXP = {} as any;

  beforeEach(() => {
    jest.resetAllMocks();

    jest
      .spyOn(Avalanche, 'getAddressFromXpub')
      .mockImplementation(
        (_, index, __, prefix, internal) =>
          `${prefix}-address${index}/${internal}`,
      );

    jest
      .mocked(processGlacierAddresses)
      // First batch for external addresses
      .mockResolvedValueOnce({
        gap: 5,
        result: ['ext-address-0', 'ext-address-15'],
      })
      // First batch for internal addresses
      .mockResolvedValueOnce({
        gap: 9,
        result: ['int-address-0', 'int-address-11'],
      })
      // Second batch for external addresses
      .mockResolvedValueOnce({
        gap: 21,
        result: [],
      })
      // Second batch for internal addresses
      .mockResolvedValue({
        gap: 21,
        result: [],
      });
  });

  it(`iterates until it finds a set number of addresses with no activity`, async () => {
    await getAccountsWithActivity(xpubXP, providerXP, mockedActivityFetcher);

    // We mocked only two batches (one of external, one of internal) to come back with active
    // addresses, therefore it should stop fetching after seeing the next two batches come back empty.
    expect(processGlacierAddresses).toHaveBeenCalledTimes(4);
    expect(processGlacierAddresses).toHaveBeenNthCalledWith(
      1,
      expect.any(Array),
      mockedActivityFetcher,
      0,
    );
    expect(processGlacierAddresses).toHaveBeenNthCalledWith(
      2,
      expect.any(Array),
      mockedActivityFetcher,
      0,
    );
    expect(processGlacierAddresses).toHaveBeenNthCalledWith(
      3,
      expect.any(Array),
      mockedActivityFetcher,
      5,
    );
    expect(processGlacierAddresses).toHaveBeenNthCalledWith(
      4,
      expect.any(Array),
      mockedActivityFetcher,
      9,
    );
  });

  it('returns the addresses with activity', async () => {
    expect(
      await getAccountsWithActivity(xpubXP, providerXP, mockedActivityFetcher),
    ).toEqual([
      'ext-address-0',
      'ext-address-15',
      'int-address-0',
      'int-address-11',
    ]);
  });
});
