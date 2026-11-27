import { type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAllTokens } from '@/hooks/useAllTokens';
import { getNetworkTokens } from '@/hooks/useAllTokens/lib/getNetworkTokens';

import { useRecurringSwapOrders } from './useRecurringSwapOrders';
import { useRecurringOrderTokens } from './useRecurringOrderTokens';
import { useIsRecurringSwapsEnabled } from './useIsRecurringSwapsEnabled';

jest.mock('@/hooks/useAllTokens');
jest.mock('@/hooks/useAllTokens/lib/getNetworkTokens');
jest.mock('./useRecurringOrderTokens');
jest.mock('./useIsRecurringSwapsEnabled');
jest.mock('../contexts/hooks/useSharedTransferManager', () => ({
  useSharedTransferManager: () => ({
    manager: { id: 'manager', recurring: { listOrders: mockListOrders } },
    statusRevision: 0,
  }),
}));
jest.mock('../contexts/hooks/useAssetAndChain/lib/buildChain', () => ({
  buildChain: () => ({ chainId: 'eip155:43114' }),
}));
jest.mock('@core/ui', () => ({
  toast: { error: jest.fn() },
  useAccountsContext: () => ({
    accounts: { active: { addressC: '0xowner' } },
  }),
  useAnalyticsContext: () => ({ capture: jest.fn() }),
  useErrorMessage: () => jest.fn(),
  useNetworkContext: () => ({
    getNetwork: () => ({ chainId: 43114, caipId: 'eip155:43114' }),
  }),
}));

const mockListOrders = jest.fn();

const order = (id: string, tokenIn: string, tokenOut: string) => ({
  orderId: id,
  status: 'active',
  tokenIn,
  tokenOut,
  chainId: 43114,
  amount: 1_000_000n,
  frequency: { unit: 'day', value: 1 },
  numberOfOrders: 3,
  executedOrders: 0,
  nextExecutionAt: 1_700_000_000,
});

const renderOrders = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(() => useRecurringSwapOrders(), { wrapper });
};

describe('useRecurringSwapOrders', () => {
  const resolveToken = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(useIsRecurringSwapsEnabled).mockReturnValue(true);
    jest.mocked(useRecurringOrderTokens).mockReturnValue(resolveToken);
    resolveToken.mockImplementation((address: string) =>
      address === '0xin'
        ? { symbol: 'IN', coreChainId: 43114, decimals: 6 }
        : undefined,
    );
    mockListOrders.mockResolvedValue({
      orders: [order('0x1', '0xin', '0xout'), order('0x2', '0xin', '0xout')],
    });
  });

  it('never fetches the full token catalog', async () => {
    const { result } = renderOrders();

    await waitFor(() => expect(result.current.orders).toHaveLength(2));

    expect(useAllTokens).not.toHaveBeenCalled();
    expect(getNetworkTokens).not.toHaveBeenCalled();
  });

  it('passes the order token addresses to the lookup and keeps the public shape', async () => {
    const { result } = renderOrders();

    await waitFor(() => expect(result.current.orders).toHaveLength(2));

    expect(useRecurringOrderTokens).toHaveBeenLastCalledWith(
      expect.objectContaining({
        enabled: true,
        tokenAddresses: ['0xin', '0xout', '0xin', '0xout'],
      }),
    );
    expect(result.current.scheduledCount).toBe(2);
    expect(result.current.orders[0]?.sourceToken.symbol).toBe('IN');
    expect(result.current.orders[0]?.targetToken.symbol).not.toBe('IN');
  });

  it('keeps the lookup disabled when recurring swaps are off', () => {
    jest.mocked(useIsRecurringSwapsEnabled).mockReturnValue(false);

    renderOrders();

    expect(useRecurringOrderTokens).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false, tokenAddresses: [] }),
    );
  });
});
