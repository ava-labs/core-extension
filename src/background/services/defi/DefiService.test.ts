import { DefiService } from './DefiService';
import { DebankService } from './debank';
import { DefiProtocol } from './models';

const mockDebankService = {
  getUserProtocols: jest.fn(),
} as unknown as DebankService;

describe('src/background/services/defi/DefiService.ts', () => {
  let service: DefiService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new DefiService(mockDebankService);
  });

  describe('.getUserPortfolio()', () => {
    it(`fetches the list of user's defi protocols`, async () => {
      jest.mocked(mockDebankService.getUserProtocols).mockResolvedValue([]);

      service.getUserPortfolio('0x1234');

      expect(mockDebankService.getUserProtocols).toHaveBeenCalledWith('0x1234');
    });

    it('raises an error if data fetching fails', async () => {
      jest
        .mocked(mockDebankService.getUserProtocols)
        .mockRejectedValue(new Error('Failure'));

      expect(service.getUserPortfolio('0x1234')).rejects.toEqual(
        new Error(`DefiService: Unable to fetch user's portfolio: Failure`)
      );
    });

    it(`calculates the total value of user's portfolio`, async () => {
      jest.mocked(mockDebankService.getUserProtocols).mockResolvedValue([
        {
          totalUsdValue: 1,
        },
        {
          totalUsdValue: 2,
        },
      ] as DefiProtocol[]);

      const { totalUsdValue } = await service.getUserPortfolio('0x1234');

      expect(totalUsdValue).toEqual(3);
    });

    it(`sorts the defi protocols by their net value, in descending order`, async () => {
      jest.mocked(mockDebankService.getUserProtocols).mockResolvedValue([
        {
          id: 'low-value',
          totalUsdValue: 1,
        },
        {
          id: 'high-value',
          totalUsdValue: 100,
        },
        {
          id: 'mid-value',
          totalUsdValue: 20,
        },
      ] as DefiProtocol[]);

      const { protocols } = await service.getUserPortfolio('0x1234');

      expect(protocols).toEqual([
        {
          id: 'high-value',
          totalUsdValue: 100,
        },
        {
          id: 'mid-value',
          totalUsdValue: 20,
        },
        {
          id: 'low-value',
          totalUsdValue: 1,
        },
      ]);
    });
  });
});
