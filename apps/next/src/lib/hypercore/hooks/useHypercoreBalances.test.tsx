import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TokenType } from '@avalabs/vm-module-types';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type PropsWithChildren } from 'react';
import {
  useHypercoreBalances,
  useHypercoreTokensForAddresses,
} from './useHypercoreBalances';
import { useHypercoreSpotTokens } from './useHypercoreSpotTokens';

const mockGetSpotMeta = jest.fn();
const mockGetSpotClearinghouseState = jest.fn();
const mockGetClearinghouseState = jest.fn();
const mockGetUserAbstraction = jest.fn();

jest.mock('@core/ui', () => ({
  useIsHyperliquidEnabled: jest.fn(() => true),
  useIsMainnet: jest.fn(() => true),
  useNetworkContext: jest.fn(() => ({
    enabledNetworks: [{ chainId: 9999 }],
  })),
}));

jest.mock('@avalabs/hypercore-module', () => {
  const actual = jest.requireActual('@avalabs/hypercore-module');
  return {
    ...actual,
    HypercoreInfoClient: jest.fn().mockImplementation(() => ({
      getSpotMeta: mockGetSpotMeta,
      getSpotClearinghouseState: mockGetSpotClearinghouseState,
      getClearinghouseState: mockGetClearinghouseState,
      getUserAbstraction: mockGetUserAbstraction,
    })),
  };
});

import {
  useIsHyperliquidEnabled,
  useIsMainnet,
  useNetworkContext,
} from '@core/ui';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const Wrapper = ({ children }: PropsWithChildren) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  return Wrapper;
};

describe('useHypercoreSpotTokens', () => {
  beforeEach(() => {
    jest.mocked(useIsHyperliquidEnabled).mockReturnValue(true);
    jest.mocked(useIsMainnet).mockReturnValue(true);
    jest.mocked(useNetworkContext).mockReturnValue({
      enabledNetworks: [{ chainId: 9999 }],
    } as ReturnType<typeof useNetworkContext>);
    mockGetSpotMeta.mockResolvedValue({
      tokens: [
        {
          name: 'USDC',
          index: 0,
          weiDecimals: 8,
          fullName: 'USD Coin',
        },
      ],
    });
  });

  it('fetches and maps spot meta when enabled', async () => {
    const { result } = renderHook(() => useHypercoreSpotTokens(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      {
        type: TokenType.HYPERCORE_SPOT,
        index: 0,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 8,
        evmContract: undefined,
      },
    ]);
  });

  it('does not fetch when the feature flag is off', async () => {
    jest.mocked(useIsHyperliquidEnabled).mockReturnValue(false);

    const { result } = renderHook(() => useHypercoreSpotTokens(), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGetSpotMeta).not.toHaveBeenCalled();
  });
});

describe('useHypercoreBalances', () => {
  beforeEach(() => {
    jest.mocked(useIsHyperliquidEnabled).mockReturnValue(true);
    jest.mocked(useIsMainnet).mockReturnValue(true);
    jest.mocked(useNetworkContext).mockReturnValue({
      enabledNetworks: [{ chainId: 9999 }],
    } as ReturnType<typeof useNetworkContext>);
    mockGetSpotMeta.mockResolvedValue({
      tokens: [
        {
          name: 'USDC',
          index: 0,
          weiDecimals: 8,
          fullName: 'USD Coin',
        },
        {
          name: 'PURR',
          index: 5,
          weiDecimals: 6,
          fullName: 'Purr',
          evmContract: {
            address: '0xabc0000000000000000000000000000000000001',
          },
        },
      ],
    });
    mockGetSpotClearinghouseState.mockResolvedValue({
      balances: [
        { coin: 'USDC', token: 0, total: '100', hold: '0' },
        { coin: 'PURR', token: 5, total: '12.5', hold: '0' },
      ],
    });
    mockGetClearinghouseState.mockResolvedValue({
      assetPositions: [{ position: { unrealizedPnl: '10' } }],
      crossMarginSummary: { accountValue: '50' },
    });
    mockGetUserAbstraction.mockResolvedValue('default');
  });

  it('builds tokens with perp collateral folded into USDC', async () => {
    const { result } = renderHook(
      () =>
        useHypercoreBalances({
          evmAddress: '0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data?.map((token) => token.symbol)).toEqual([
      'USDC',
      'PURR',
    ]);
    expect(result.current.data?.[0]?.balance).toBe('140');
    expect(result.current.data?.[1]).toMatchObject({
      kind: 'spot',
      index: 5,
      evmContract: '0xabc0000000000000000000000000000000000001',
    });
  });

  it('soft-fails individual info calls and still builds from partial data', async () => {
    mockGetClearinghouseState.mockRejectedValue(new Error('perp down'));
    mockGetUserAbstraction.mockRejectedValue(new Error('abstraction down'));

    const { result } = renderHook(
      () =>
        useHypercoreBalances({
          evmAddress: '0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data?.[0]?.balance).toBe('100');
  });

  it('skips fetching without an address', () => {
    const { result } = renderHook(() => useHypercoreBalances({}), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(mockGetSpotClearinghouseState).not.toHaveBeenCalled();
  });

  it('skips fetching when HyperCore is not in enabled networks', () => {
    jest.mocked(useNetworkContext).mockReturnValue({
      enabledNetworks: [{ chainId: 43114 }],
    } as ReturnType<typeof useNetworkContext>);

    const { result } = renderHook(
      () =>
        useHypercoreBalances({
          evmAddress: '0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD',
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.data).toBeUndefined();
    expect(mockGetSpotClearinghouseState).not.toHaveBeenCalled();
  });
});

describe('useHypercoreTokensForAddresses', () => {
  beforeEach(() => {
    jest.mocked(useIsHyperliquidEnabled).mockReturnValue(true);
    jest.mocked(useIsMainnet).mockReturnValue(true);
    jest.mocked(useNetworkContext).mockReturnValue({
      enabledNetworks: [{ chainId: 9999 }],
    } as ReturnType<typeof useNetworkContext>);
    mockGetSpotMeta.mockResolvedValue({
      tokens: [
        {
          name: 'USDC',
          index: 0,
          weiDecimals: 8,
          fullName: 'USD Coin',
        },
      ],
    });
    mockGetSpotClearinghouseState.mockImplementation(
      async (address: string) => ({
        balances: [
          {
            coin: 'USDC',
            token: 0,
            total: address.endsWith('1') ? '10' : '25',
            hold: '0',
          },
        ],
      }),
    );
    mockGetClearinghouseState.mockResolvedValue({
      assetPositions: [],
      crossMarginSummary: { accountValue: '0' },
    });
    mockGetUserAbstraction.mockResolvedValue('unifiedAccount');
  });

  it('fetches and flattens HyperCore tokens for multiple addresses', async () => {
    const { result } = renderHook(
      () =>
        useHypercoreTokensForAddresses({
          evmAddresses: [
            '0x0000000000000000000000000000000000000001',
            '0x0000000000000000000000000000000000000002',
          ],
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.tokens.length).toBe(2));

    expect(result.current.tokens.map((token) => token.balance)).toEqual([
      '10',
      '25',
    ]);
    expect(mockGetSpotClearinghouseState).toHaveBeenCalledTimes(2);
  });

  it('skips fetching with an empty address list', () => {
    const { result } = renderHook(
      () => useHypercoreTokensForAddresses({ evmAddresses: [] }),
      { wrapper: createWrapper() },
    );

    expect(result.current.tokens).toEqual([]);
    expect(mockGetSpotClearinghouseState).not.toHaveBeenCalled();
  });
});
