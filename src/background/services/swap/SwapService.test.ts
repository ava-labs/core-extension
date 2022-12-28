import { ChainId } from '@avalabs/chains-sdk';
import { BuildOptions, PriceString } from 'paraswap';
import { SwapSide, Address, OptimalRate } from 'paraswap-core';
import { SwapService } from './SwapService';

const API_URL = 'https://foor.bar';
const ACTIVE_ACCOUNT_ADDRESS = '0x1';
const ROUTE_ADDRESS = '0x0000000000';
const NATIVE_TOKEN = 'nativeToken';

jest.mock('paraswap', () => ({
  ParaSwap: jest.fn().mockImplementation(() => {
    return { apiURL: API_URL };
  }),
}));

describe('background/services/swap/SwapService.ts', () => {
  const realFetch = global.fetch;
  global.fetch = jest.fn();

  const networkServiceMock = {
    isMainnet: jest.fn(),
    activeNetwork: {
      networkToken: {
        symbol: NATIVE_TOKEN,
      },
    },
  };

  const accountServiceMock = {
    activeAccount: {
      addressC: ACTIVE_ACCOUNT_ADDRESS,
    },
  };

  const swapService = new SwapService(
    networkServiceMock as any,
    accountServiceMock as any
  );

  beforeEach(() => {
    jest.resetAllMocks();
    networkServiceMock.isMainnet.mockReturnValue(true);
  });

  afterAll(() => {
    global.fetch = realFetch;
  });

  describe('getSwapRate', () => {
    const getParams = (
      override?: Record<string, string | number | undefined>
    ) => {
      const params = {
        srcToken: 'srcToken',
        srcDecimals: 10,
        destToken: 'destToken',
        destDecimals: 10,
        srcAmount: '1000',
        swapSide: SwapSide.BUY,
        ...(override ?? {}),
      };

      const paramsAsTuple = Object.values(params) as [
        string,
        number,
        string,
        number,
        string,
        SwapSide
      ];

      return { params, paramsAsTuple };
    };

    const getExpectedURL = (
      path: string,
      params: ReturnType<typeof getParams>['params']
    ) => {
      const expectedQuery = new URLSearchParams({
        srcToken: params.srcToken,
        destToken: params.destToken,
        amount: params.srcAmount,
        side: params.swapSide,
        network: `${ChainId.AVALANCHE_MAINNET_ID}`,
        srcDecimals: `${params.srcDecimals}`,
        destDecimals: `${params.destDecimals}`,
        userAddress: ACTIVE_ACCOUNT_ADDRESS,
      });

      return `${API_URL}/${path}/?${expectedQuery.toString()}`;
    };

    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          priceRoute: {
            address: ROUTE_ADDRESS,
          },
        }),
      });
    });

    it('throws if not on main net', async () => {
      networkServiceMock.isMainnet.mockReturnValueOnce(false);
      await expect(
        swapService.getSwapRate(...getParams({}).paramsAsTuple)
      ).rejects.toThrowError('Fuji network is not supported by Paraswap');
    });

    it('throws if there is no active account', async () => {
      const swapServiceWithoutActiveAccount = new SwapService(
        networkServiceMock as any,
        {} as any
      );

      await expect(
        swapServiceWithoutActiveAccount.getSwapRate(
          ...getParams({}).paramsAsTuple
        )
      ).rejects.toThrowError('Account address missing');
    });

    it('returns the correct route', async () => {
      const { params, paramsAsTuple } = getParams({});

      await expect(
        swapService.getSwapRate(...paramsAsTuple)
      ).resolves.toStrictEqual({
        address: ROUTE_ADDRESS,
      });

      expect(fetch).toHaveBeenCalledWith(getExpectedURL('prices', params));
    });

    it('returns the correct route even if the server was once busy', async () => {
      const { params, paramsAsTuple } = getParams({});

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
          error: 'Price Timeout',
        }),
      });

      await expect(
        swapService.getSwapRate(...paramsAsTuple)
      ).resolves.toStrictEqual({
        address: ROUTE_ADDRESS,
      });

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(getExpectedURL('prices', params));
    });

    it('returns the correct route even if it encountered a network issue before', async () => {
      const { params, paramsAsTuple } = getParams({});

      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new TypeError('Failed to fetch')
      );

      await expect(
        swapService.getSwapRate(...paramsAsTuple)
      ).resolves.toStrictEqual({
        address: ROUTE_ADDRESS,
      });

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(getExpectedURL('prices', params));
    });

    it('does not attempt to retry requests when there is no point in doing it', async () => {
      const { params, paramsAsTuple } = getParams({});

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          error: 'Invalid tokens',
        }),
      });

      await expect(
        swapService.getSwapRate(...paramsAsTuple)
      ).rejects.toStrictEqual(new Error('Invalid tokens'));

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(getExpectedURL('prices', params));
    });

    it('returns the correct route with native token and missing side', async () => {
      const { params, paramsAsTuple } = getParams({
        swapSide: undefined,
        srcToken: NATIVE_TOKEN,
        destToken: NATIVE_TOKEN,
      });

      await expect(
        swapService.getSwapRate(...paramsAsTuple)
      ).resolves.toStrictEqual({
        address: ROUTE_ADDRESS,
      });

      expect(fetch).toHaveBeenCalledWith(
        getExpectedURL('prices', {
          ...params,
          swapSide: SwapSide.SELL,
          srcDecimals: 18,
          destDecimals: 18,
        })
      );
    });
  });

  describe('getParaswapSpender', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          TokenTransferProxy: ROUTE_ADDRESS,
        }),
      });
    });

    it('returns the correct proxy address', async () => {
      await expect(swapService.getParaswapSpender()).resolves.toBe(
        ROUTE_ADDRESS
      );
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/adapters/contracts?network=${ChainId.AVALANCHE_MAINNET_ID}`
      );
    });
  });

  describe('buildTx', () => {
    const params = {
      network: '1111',
      srcToken: '0x0000',
      destToken: '0x0001',
      srcAmount: '10000',
      destAmount: '10000',
      priceRoute: {
        blockNumber: 1,
      },
      userAddress: '0x0002',
      partner: 'avalanche',
      partnerAddress: '0x0003',
      partnerFeeBps: 1,
      receiver: '0x0004',
      options: {
        ignoreCheck: false,
      },
      srcDecimals: 10,
      destDecimals: 10,
      permit: 'permit',
      deadline: 'deadline',
    };

    const paramsAsTuple = Object.values(params) as [
      string,
      Address,
      Address,
      PriceString,
      PriceString,
      OptimalRate,
      Address,
      string,
      string,
      number,
      Address,
      BuildOptions,
      number,
      number,
      string,
      string
    ];

    it('returns the correct transaction', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          data: 'data',
          to: '0x0004',
        }),
      });

      await expect(
        swapService.buildTx(...paramsAsTuple)
      ).resolves.toStrictEqual({
        data: 'data',
        to: '0x0004',
      });

      const {
        network,
        options,
        priceRoute,
        srcToken,
        destToken,
        srcAmount,
        destAmount,
        userAddress,
        partner,
        partnerAddress,
        partnerFeeBps,
        receiver,
        srcDecimals,
        destDecimals,
        permit,
        deadline,
      } = params;
      const expectedURL = `${API_URL}/transactions/${network}/?ignoreCheck=${options.ignoreCheck}`;

      expect(fetch).toHaveBeenCalledWith(expectedURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceRoute,
          srcToken,
          destToken,
          srcAmount,
          destAmount,
          userAddress,
          partner,
          partnerAddress,
          partnerFeeBps,
          receiver,
          srcDecimals,
          destDecimals,
          permit,
          deadline,
        }),
      });
    });
  });
});
