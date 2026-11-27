import { type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TokenType } from '@avalabs/vm-module-types';

import { ExtensionRequest } from '@core/types';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';

import { useRecurringOrderTokens } from './useRecurringOrderTokens';

const mockRequest = jest.fn();
const mockCustomTokens: { current: Record<number, Record<string, unknown>> } = {
  current: {},
};

jest.mock('@core/ui', () => ({
  useConnectionContext: () => ({ request: mockRequest }),
  useSettingsContext: () => ({ customTokens: mockCustomTokens.current }),
  useAccountsContext: () => ({ accounts: { active: { id: 'account' } } }),
}));
jest.mock('@/hooks/useTokensForAccount');
jest.mock('@/hooks/useAllTokens/lib/getNativeAssetType', () => ({
  getNativeAssetType: () => 'evm_native',
}));

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const network = {
  chainId: 43114,
  caipId: 'eip155:43114',
  networkToken: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    logoUri: 'avax.svg',
  },
} as never;

const lookedUp = (address: string, symbol = 'TKN') => ({
  address,
  name: symbol,
  symbol,
  decimals: 6,
  contractType: 'ERC-20' as const,
  logoUri: undefined,
  isVerified: null,
  chainId: 43114,
  caip2Id: 'eip155:43114',
});

const heldToken = (address: string) => ({
  type: TokenType.ERC20,
  address,
  symbol: 'HELD',
  decimals: 18,
  coreChainId: 43114,
});

const renderTokens = (props: {
  tokenAddresses: string[];
  enabled?: boolean;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(
    () => useRecurringOrderTokens({ network, enabled: true, ...props }),
    { wrapper },
  );
};

describe('useRecurringOrderTokens', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockCustomTokens.current = {};
    jest.mocked(useTokensForAccount).mockReturnValue([]);
  });

  it('looks up the deduped order token addresses once, excluding native', async () => {
    mockRequest.mockResolvedValue({
      tokens: [lookedUp('0xAAA', 'AAA')],
      failedAddresses: [],
    });

    const { result } = renderTokens({
      tokenAddresses: [ZERO_ADDRESS, '0xAAA', '0xaaa', '0xBBB'],
    });

    await waitFor(() => expect(result.current('0xaaa')?.symbol).toBe('AAA'));

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(mockRequest).toHaveBeenCalledWith({
      method: ExtensionRequest.LOOKUP_NETWORK_TOKENS,
      params: ['eip155:43114', ['0xaaa', '0xbbb']],
    });
    expect(result.current('0xBBB')).toBeUndefined();
  });

  it('resolves the native token without a request', () => {
    const { result } = renderTokens({ tokenAddresses: [ZERO_ADDRESS] });

    expect(result.current(ZERO_ADDRESS)?.symbol).toBe('AVAX');
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('does not look up when there are no order tokens', () => {
    renderTokens({ tokenAddresses: [] });

    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('does not look up when disabled', () => {
    renderTokens({ tokenAddresses: ['0xAAA'], enabled: false });

    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('does not look up tokens the user already holds or added as custom', async () => {
    jest
      .mocked(useTokensForAccount)
      .mockReturnValue([heldToken('0xAAA')] as never);
    mockCustomTokens.current = {
      43114: {
        '0xccc': {
          address: '0xCCC',
          name: 'Custom',
          symbol: 'CST',
          decimals: 8,
          contractType: 'ERC-20',
        },
      },
    };

    const { result } = renderTokens({ tokenAddresses: ['0xaaa', '0xccc'] });

    expect(result.current('0xAAA')?.symbol).toBe('HELD');
    expect(result.current('0xccc')?.symbol).toBe('CST');
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('only looks up the tokens that are not held', async () => {
    jest
      .mocked(useTokensForAccount)
      .mockReturnValue([heldToken('0xAAA')] as never);
    mockRequest.mockResolvedValue({
      tokens: [lookedUp('0xBBB', 'BBB')],
      failedAddresses: [],
    });

    const { result } = renderTokens({ tokenAddresses: ['0xAAA', '0xBBB'] });

    await waitFor(() => expect(result.current('0xBBB')?.symbol).toBe('BBB'));

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({ params: ['eip155:43114', ['0xbbb']] }),
    );
  });
});
