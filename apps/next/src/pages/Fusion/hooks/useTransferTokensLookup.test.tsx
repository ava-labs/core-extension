import { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TokenType } from '@avalabs/fusion-sdk';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';

import { ExtensionRequest } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';
import { getNetworkTokens } from '@/hooks/useAllTokens/lib/getNetworkTokens';
import { useTokensForAccount } from '@/hooks/useTokensForAccount';

import { lookupTokenByAssetInfo } from '../lib/lookupTokenByAssetInfo';

import { useTransferTokensLookup } from './useTransferTokensLookup';

const mockRequest = jest.fn();

const avalanche = {
  chainId: 43114,
  caipId: 'eip155:43114',
  networkToken: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
};
const ethereum = {
  chainId: 1,
  caipId: 'eip155:1',
  networkToken: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};
const solana = {
  chainId: 4503599627370475,
  caipId: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  networkToken: { name: 'Solana', symbol: 'SOL', decimals: 9 },
};
const networks = [avalanche, ethereum, solana];

jest.mock('@core/ui', () => ({
  useConnectionContext: () => ({ request: mockRequest }),
  useSettingsContext: () => ({ customTokens: {} }),
  useAccountsContext: () => ({ accounts: { active: { id: 'account' } } }),
  useNetworkContext: () => ({
    getNetwork: (caipId: string) =>
      networks.find((network) => network.caipId === caipId),
  }),
}));
jest.mock('@/hooks/useTokensForAccount');
jest.mock('@/hooks/useAllTokens');
jest.mock('@/hooks/useAllTokens/lib/getNetworkTokens');
jest.mock('@/hooks/useAllTokens/lib/getNativeAssetType', () => ({
  getNativeAssetType: () => 'evm_native',
}));

const lookedUp = (address: string, chainId: number, symbol: string) => ({
  address,
  name: symbol,
  symbol,
  decimals: 6,
  contractType: 'ERC-20' as const,
  isVerified: null,
  chainId,
  caip2Id: chainId === 1 ? 'eip155:1' : 'eip155:43114',
});

const quote = {
  sourceChain: { chainId: 'eip155:43114' },
  targetChain: { chainId: 'eip155:1' },
  assetIn: { type: TokenType.ERC20, address: '0xIN' },
  assetOut: { type: TokenType.ERC20, address: '0xOUT' },
  fees: [
    {
      chainId: 'eip155:43114',
      token: { type: TokenType.NATIVE },
      amount: 1n,
    },
    {
      chainId: 'eip155:43114',
      token: { type: TokenType.ERC20, address: '0xFEE' },
      amount: 1n,
    },
  ],
} as never;

const renderLookup = (transferLike: unknown) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(
    ({ input }: { input: unknown }) => useTransferTokensLookup(input as never),
    { wrapper, initialProps: { input: transferLike } },
  );
};

describe('useTransferTokensLookup', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(useTokensForAccount).mockReturnValue([]);
  });

  it('never fetches the full token catalog', async () => {
    mockRequest.mockResolvedValue({ tokens: [], failedAddresses: [] });

    renderLookup(quote);
    await waitFor(() => expect(mockRequest).toHaveBeenCalled());

    expect(useAllTokens).not.toHaveBeenCalled();
    expect(getNetworkTokens).not.toHaveBeenCalled();
  });

  it('looks up only the referenced tokens, grouped by chain', async () => {
    mockRequest.mockResolvedValue({ tokens: [], failedAddresses: [] });

    renderLookup(quote);
    await waitFor(() => expect(mockRequest).toHaveBeenCalledTimes(2));

    const calls = mockRequest.mock.calls.map(([call]) => call);
    expect(calls).toEqual(
      expect.arrayContaining([
        {
          method: ExtensionRequest.LOOKUP_NETWORK_TOKENS,
          params: ['eip155:43114', ['0xfee', '0xin']],
        },
        {
          method: ExtensionRequest.LOOKUP_NETWORK_TOKENS,
          params: ['eip155:1', ['0xout']],
        },
      ]),
    );
  });

  it('resolves symbols and decimals from looked-up tokens and native tokens', async () => {
    mockRequest.mockImplementation(async ({ params: [caipId] }) => ({
      failedAddresses: [],
      tokens:
        caipId === 'eip155:1'
          ? [lookedUp('0xout', 1, 'OUT')]
          : [lookedUp('0xin', 43114, 'IN'), lookedUp('0xfee', 43114, 'FEE')],
    }));

    const { result } = renderLookup(quote);

    await waitFor(() =>
      expect(
        lookupTokenByAssetInfo(
          result.current.tokensByChainId['eip155:1'] ?? [],
          {
            type: TokenType.ERC20,
            address: '0xOUT',
          },
        )?.symbol,
      ).toBe('OUT'),
    );

    const onAvalanche = result.current.tokensByChainId['eip155:43114'] ?? [];
    expect(
      lookupTokenByAssetInfo(onAvalanche, {
        type: TokenType.ERC20,
        address: '0xIN',
      }),
    ).toMatchObject({ symbol: 'IN', decimals: 6 });
    expect(
      lookupTokenByAssetInfo(onAvalanche, { type: TokenType.NATIVE })?.symbol,
    ).toBe('AVAX');
  });

  it('does not look up held tokens', async () => {
    jest.mocked(useTokensForAccount).mockReturnValue([
      {
        type: VmTokenType.ERC20,
        address: '0xIN',
        symbol: 'HELD',
        decimals: 18,
        coreChainId: 43114,
        chainCaipId: 'eip155:43114',
      },
    ] as never);
    mockRequest.mockResolvedValue({ tokens: [], failedAddresses: [] });

    const { result } = renderLookup(quote);
    await waitFor(() => expect(mockRequest).toHaveBeenCalled());

    const avalancheCall = mockRequest.mock.calls
      .map(([call]) => call)
      .find((call) => call.params[0] === 'eip155:43114');
    expect(avalancheCall.params[1]).toEqual(['0xfee']);
    expect(
      lookupTokenByAssetInfo(
        result.current.tokensByChainId['eip155:43114'] ?? [],
        {
          type: TokenType.ERC20,
          address: '0xIN',
        },
      )?.symbol,
    ).toBe('HELD');
  });

  it('falls back to unresolved tokens when the lookup fails', async () => {
    mockRequest.mockRejectedValue(new Error('down'));

    const { result } = renderLookup(quote);
    await waitFor(() => expect(mockRequest).toHaveBeenCalled());

    const onAvalanche = result.current.tokensByChainId['eip155:43114'] ?? [];
    expect(
      lookupTokenByAssetInfo(onAvalanche, {
        type: TokenType.ERC20,
        address: '0xIN',
      }),
    ).toBeUndefined();
    expect(
      lookupTokenByAssetInfo(onAvalanche, { type: TokenType.NATIVE })?.symbol,
    ).toBe('AVAX');
  });

  it('supports transfers that expose sourceAsset/targetAsset', async () => {
    mockRequest.mockResolvedValue({ tokens: [], failedAddresses: [] });

    renderLookup({
      sourceChain: { chainId: 'eip155:43114' },
      targetChain: { chainId: 'eip155:1' },
      sourceAsset: { type: TokenType.ERC20, address: '0xIN' },
      targetAsset: { type: TokenType.NATIVE },
      fees: [],
    });
    await waitFor(() => expect(mockRequest).toHaveBeenCalledTimes(1));

    expect(mockRequest.mock.calls[0]?.[0].params).toEqual([
      'eip155:43114',
      ['0xin'],
    ]);
  });

  it('does not look anything up without a transfer', () => {
    renderLookup(null);

    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('treats Solana mints as case-sensitive', async () => {
    const splQuote = {
      sourceChain: { chainId: solana.caipId },
      targetChain: { chainId: solana.caipId },
      assetIn: { type: TokenType.SPL, address: 'MintAbc' },
      assetOut: { type: TokenType.SPL, address: 'mintabc' },
      fees: [],
    };
    const spl = (address: string, symbol: string) => ({
      ...lookedUp(address, solana.chainId, symbol),
      contractType: 'SPL' as const,
      caip2Id: solana.caipId,
    });
    mockRequest.mockResolvedValue({
      tokens: [spl('MintAbc', 'UPPER'), spl('mintabc', 'LOWER')],
      failedAddresses: [],
    });

    const { result } = renderLookup(splQuote);

    await waitFor(() =>
      expect(
        lookupTokenByAssetInfo(
          result.current.tokensByChainId[solana.caipId] ?? [],
          { type: TokenType.SPL, address: 'mintabc' },
        )?.symbol,
      ).toBe('LOWER'),
    );
    expect(mockRequest.mock.calls[0]?.[0].params).toEqual([
      solana.caipId,
      ['MintAbc', 'mintabc'],
    ]);
    expect(
      lookupTokenByAssetInfo(
        result.current.tokensByChainId[solana.caipId] ?? [],
        { type: TokenType.SPL, address: 'MintAbc' },
      )?.symbol,
    ).toBe('UPPER');
  });

  it('resolves EVM references that differ only by casing', async () => {
    const aliasQuote = {
      ...(quote as object),
      assetIn: { type: TokenType.ERC20, address: '0xAbC' },
      assetOut: { type: TokenType.NATIVE },
      fees: [
        {
          chainId: 'eip155:43114',
          token: { type: TokenType.ERC20, address: '0xabc' },
          amount: 1n,
        },
      ],
    };
    mockRequest.mockResolvedValue({
      tokens: [lookedUp('0xabc', 43114, 'ABC')],
      failedAddresses: [],
    });

    const { result } = renderLookup(aliasQuote);

    await waitFor(() => {
      const tokens = result.current.tokensByChainId['eip155:43114'] ?? [];
      expect(
        lookupTokenByAssetInfo(tokens, {
          type: TokenType.ERC20,
          address: '0xAbC',
        })?.symbol,
      ).toBe('ABC');
      expect(
        lookupTokenByAssetInfo(tokens, {
          type: TokenType.ERC20,
          address: '0xabc',
        })?.symbol,
      ).toBe('ABC');
    });
    expect(mockRequest.mock.calls[0]?.[0].params).toEqual([
      'eip155:43114',
      ['0xabc'],
    ]);
  });

  describe('partial failure retries', () => {
    const sameChainQuote = {
      ...(quote as object),
      targetChain: { chainId: 'eip155:43114' },
      assetOut: { type: TokenType.NATIVE },
    };

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const advance = (ms: number) =>
      act(async () => {
        await jest.advanceTimersByTimeAsync(ms);
      });

    it('retries only the failed addresses and resolves them', async () => {
      mockRequest
        .mockResolvedValueOnce({
          tokens: [lookedUp('0xin', 43114, 'IN')],
          failedAddresses: ['0xfee'],
        })
        .mockResolvedValue({
          tokens: [lookedUp('0xfee', 43114, 'FEE')],
          failedAddresses: [],
        });

      const { result } = renderLookup(sameChainQuote);
      await advance(0);

      expect(result.current.isPending).toBe(true);
      expect(
        lookupTokenByAssetInfo(
          result.current.tokensByChainId['eip155:43114'] ?? [],
          { type: TokenType.ERC20, address: '0xIN' },
        )?.symbol,
      ).toBe('IN');

      await advance(2000);
      await advance(10);

      expect(mockRequest.mock.calls[0]?.[0].params).toEqual([
        'eip155:43114',
        ['0xfee', '0xin'],
      ]);
      expect(mockRequest.mock.calls[1]?.[0].params).toEqual([
        'eip155:43114',
        ['0xfee'],
      ]);
      expect(result.current.isPending).toBe(false);
      expect(
        lookupTokenByAssetInfo(
          result.current.tokensByChainId['eip155:43114'] ?? [],
          { type: TokenType.ERC20, address: '0xFEE' },
        )?.symbol,
      ).toBe('FEE');
    });

    it('stops after the retry cap when retries keep rejecting', async () => {
      mockRequest
        .mockResolvedValueOnce({
          tokens: [],
          failedAddresses: ['0xfee', '0xin'],
        })
        .mockRejectedValue(new Error('down'));

      const { result } = renderLookup(sameChainQuote);
      await advance(0);

      expect(result.current.isPending).toBe(true);

      await advance(60_000);
      await advance(10);

      expect(mockRequest).toHaveBeenCalledTimes(6);
      expect(result.current.isPending).toBe(false);

      await advance(120_000);

      expect(mockRequest).toHaveBeenCalledTimes(6);
    });

    it('stops retrying when unmounted while the first request is in flight', async () => {
      let resolve: (value: unknown) => void = () => undefined;
      mockRequest.mockReturnValueOnce(
        new Promise((res) => {
          resolve = res;
        }),
      );
      mockRequest.mockResolvedValue({ tokens: [], failedAddresses: [] });

      const { unmount } = renderLookup(sameChainQuote);
      await advance(0);
      unmount();

      resolve({ tokens: [], failedAddresses: ['0xfee', '0xin'] });
      await advance(120_000);

      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    it('stops retrying the old key when the key changes while in flight', async () => {
      let resolve: (value: unknown) => void = () => undefined;
      mockRequest.mockReturnValueOnce(
        new Promise((res) => {
          resolve = res;
        }),
      );
      mockRequest.mockResolvedValue({ tokens: [], failedAddresses: [] });

      const { rerender } = renderLookup(sameChainQuote);
      await advance(0);

      const otherQuote = {
        ...sameChainQuote,
        assetIn: { type: TokenType.ERC20, address: '0xOTHER' },
      };
      rerender({ input: otherQuote });
      await advance(0);

      resolve({ tokens: [], failedAddresses: ['0xfee', '0xin'] });
      await advance(120_000);

      const params = mockRequest.mock.calls.map(([call]) => call.params);
      expect(params).toEqual([
        ['eip155:43114', ['0xfee', '0xin']],
        ['eip155:43114', ['0xfee', '0xother']],
      ]);
    });

    it('keeps retrying while pending between rejected attempts', async () => {
      mockRequest.mockRejectedValue(new Error('down'));

      const { result } = renderLookup(sameChainQuote);
      await advance(0);
      await advance(2000);

      expect(mockRequest).toHaveBeenCalledTimes(2);
      expect(result.current.isPending).toBe(true);
    });
  });

  it('reports pending while the lookup is in flight', async () => {
    let resolve: (value: unknown) => void = () => undefined;
    mockRequest.mockReturnValue(
      new Promise((res) => {
        resolve = res;
      }),
    );

    const { result } = renderLookup(quote);

    await waitFor(() => expect(result.current.isPending).toBe(true));

    resolve({ tokens: [], failedAddresses: [] });

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });
});
