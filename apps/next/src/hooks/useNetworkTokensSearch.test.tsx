import { FC, ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TokenType } from '@avalabs/vm-module-types';
import { ExtensionRequest, FungibleTokenBalance } from '@core/types';
import {
  useAccountsContext,
  useConnectionContext,
  useNetworkContext,
  useSettingsContext,
} from '@core/ui';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { useNetworkTokensSearch } from './useNetworkTokensSearch';

jest.mock('@core/ui');
jest.mock('@/hooks/useTokensForAccount');

const AVAX_CAIP = 'eip155:43114';

const heldErc20 = (
  address: string,
  balance: bigint,
  reputation: string | null = null,
): FungibleTokenBalance =>
  ({
    type: TokenType.ERC20,
    address,
    name: address,
    symbol: address,
    decimals: 18,
    balance,
    balanceDisplayValue: balance.toString(),
    reputation,
    assetType: 'evm_erc20',
    coreChainId: 43114,
    chainCaipId: AVAX_CAIP,
  }) as FungibleTokenBalance;

const heldNative = (): FungibleTokenBalance =>
  ({
    type: TokenType.NATIVE,
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    balance: 0n,
    balanceDisplayValue: '0',
    reputation: null,
    assetType: 'evm_native',
    coreChainId: 43114,
    chainCaipId: AVAX_CAIP,
  }) as unknown as FungibleTokenBalance;

const EVM_ADDRESS = `0x${'a'.repeat(40)}`;

const serverToken = (address: string) => ({
  address,
  name: address,
  symbol: address,
  decimals: 18,
  logoUri: undefined,
  isVerified: true,
  contractType: 'ERC-20' as const,
  chainId: 43114,
  caip2Id: AVAX_CAIP,
});

const createWrapper = (): FC<{ children: ReactNode }> => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('useNetworkTokensSearch', () => {
  const request = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(useConnectionContext).mockReturnValue({ request } as any);
    jest.mocked(useNetworkContext).mockReturnValue({
      enabledNetworks: [{ chainId: 43114, caipId: AVAX_CAIP }],
    } as any);
    jest.mocked(useSettingsContext).mockReturnValue({
      customTokens: {
        43114: {
          '0xcustom': {
            address: '0xCustom',
            name: 'Custom',
            symbol: 'CST',
            decimals: 18,
            contractType: 'ERC-20',
          },
        },
      },
    } as any);
    jest
      .mocked(useAccountsContext)
      .mockReturnValue({ accounts: { active: { id: 'acc' } } } as any);
    jest.mocked(useTokensForAccount).mockReturnValue([heldErc20('0xabc', 7n)]);
  });

  it('requests /v2/tokens search with the enabled networks and spam flag', async () => {
    request.mockResolvedValue({ tokens: [], currentPage: 1, hasMore: false });

    renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: true, keyword: '' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(request).toHaveBeenCalled());
    expect(request).toHaveBeenCalledWith({
      method: ExtensionRequest.SEARCH_NETWORK_TOKENS,
      params: [[AVAX_CAIP], 1, 100, undefined, true, undefined],
    });
  });

  it('sends an address filter (not keyword) when the query looks like an address', async () => {
    request.mockResolvedValue({ tokens: [], currentPage: 1, hasMore: false });

    renderHook(
      () =>
        useNetworkTokensSearch({
          includeSpamTokens: false,
          keyword: EVM_ADDRESS,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(request).toHaveBeenCalled());
    expect(request).toHaveBeenCalledWith({
      method: ExtensionRequest.SEARCH_NETWORK_TOKENS,
      params: [[AVAX_CAIP], 1, 100, undefined, false, EVM_ADDRESS],
    });
  });

  it('keeps held tokens (including natives) that the catalog omits', async () => {
    request.mockResolvedValue({ tokens: [], currentPage: 1, hasMore: false });
    jest.mocked(useTokensForAccount).mockReturnValue([heldNative()]);

    const { result } = renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: false, keyword: '' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() =>
      expect(
        result.current.tokens.some((token) => token.type === TokenType.NATIVE),
      ).toBe(true),
    );
  });

  it('hides held malicious tokens unless spam is included', async () => {
    request.mockResolvedValue({ tokens: [], currentPage: 1, hasMore: false });
    jest
      .mocked(useSettingsContext)
      .mockReturnValue({ customTokens: {} } as any);
    jest
      .mocked(useTokensForAccount)
      .mockReturnValue([heldErc20('0xspam', 1n, 'Malicious')]);

    const hidden = renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: false, keyword: '' }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(request).toHaveBeenCalled());
    expect(hidden.result.current.tokens).toHaveLength(0);

    const shown = renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: true, keyword: '' }),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(shown.result.current.tokens).toHaveLength(1));
  });

  it('still shows held and custom tokens when the search request fails', async () => {
    request.mockRejectedValue(new Error('down'));

    const { result } = renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: false, keyword: '' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    const addresses = result.current.tokens.map(
      (token) => (token as { address?: string }).address,
    );
    expect(addresses).toEqual(expect.arrayContaining(['0xCustom', '0xabc']));
  });

  it('keeps held balances and merges custom tokens with the searched catalog', async () => {
    request.mockResolvedValue({
      tokens: [serverToken('0xabc')],
      currentPage: 1,
      hasMore: false,
    });

    const { result } = renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: false, keyword: '' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.tokens).toHaveLength(2));

    const addresses = result.current.tokens.map(
      (token) => (token as { address?: string }).address,
    );
    expect(addresses).toEqual(expect.arrayContaining(['0xCustom', '0xabc']));

    const searched = result.current.tokens.find(
      (token) => (token as { address?: string }).address === '0xabc',
    );
    expect(searched?.balance).toBe(7n);
  });

  it('does not query the API for sub-2-char, non-address searches', async () => {
    request.mockResolvedValue({ tokens: [], currentPage: 1, hasMore: false });

    const { result } = renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: false, keyword: 'u' }),
      { wrapper: createWrapper() },
    );

    // 'Custom' matches 'u' client-side, so held/custom still narrow locally.
    await waitFor(() =>
      expect(result.current.tokens.length).toBeGreaterThan(0),
    );
    expect(request).not.toHaveBeenCalled();
  });

  it('exposes an initial loading state until the first page resolves', async () => {
    let resolvePage: (value: unknown) => void = () => {};
    request.mockReturnValue(
      new Promise((resolve) => {
        resolvePage = resolve;
      }),
    );

    const { result } = renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: false, keyword: '' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    resolvePage({ tokens: [], currentPage: 1, hasMore: false });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('reflects further pages via hasNextPage', async () => {
    request.mockResolvedValue({
      tokens: [serverToken('0xabc')],
      currentPage: 1,
      hasMore: true,
      nextPage: 2,
    });

    const { result } = renderHook(
      () => useNetworkTokensSearch({ includeSpamTokens: false, keyword: '' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.hasNextPage).toBe(true));
  });
});
