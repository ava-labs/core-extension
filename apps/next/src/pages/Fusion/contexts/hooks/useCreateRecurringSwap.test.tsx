import { act, renderHook } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { PropsWithChildren } from 'react';
import { Route, Router } from 'react-router-dom';

import {
  RecurringSwapContextProvider,
  useRecurringSwapState,
} from '../RecurringSwapContext';
import { useCreateRecurringSwap } from './useCreateRecurringSwap';

const mockQuote = jest.fn();
const mockExecuteFirstFill = jest.fn();
const mockRequest = jest.fn();

const NETWORK_FEE = { getNetworkFee: () => Promise.resolve(null) };
const SETTINGS = { feeSetting: 'medium' };
const ANALYTICS = { capture: jest.fn() };
const CONNECTION = { request: (...args: unknown[]) => mockRequest(...args) };

jest.mock('@core/ui', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  useAnalyticsContext: () => ANALYTICS,
  useConnectionContext: () => CONNECTION,
  useErrorMessage: () => () => ({ title: 'error', hint: '' }),
  useNetworkFeeContext: () => NETWORK_FEE,
  useSettingsContext: () => SETTINGS,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));

jest.mock('../../lib/getRecurringTokenAddress', () => ({
  getRecurringTokenAddress: () => '0xtoken',
}));

const MANAGER = {
  recurring: {
    quote: (...args: unknown[]) => mockQuote(...args),
    executeFirstFill: (...args: unknown[]) => mockExecuteFirstFill(...args),
  },
} as never;
const ASSET = { decimals: 18, symbol: 'AAA' } as never;
const CHAIN = { chainId: 'eip155:43114' } as never;
const FREQUENCY = { unit: 'week', value: 1 } as never;

const setup = (initialEntry: string) => {
  const history = createMemoryHistory({ initialEntries: [initialEntry] });
  const wrapper = ({ children }: PropsWithChildren) => (
    <Router history={history}>
      <Route path="/fusion">
        <RecurringSwapContextProvider>{children}</RecurringSwapContextProvider>
      </Route>
    </Router>
  );

  const { result } = renderHook(
    () => {
      const { resetForm } = useRecurringSwapState();
      return useCreateRecurringSwap({
        manager: MANAGER,
        fromAddress: '0xfrom',
        sourceAsset: ASSET,
        targetAsset: ASSET,
        sourceChain: CHAIN,
        amount: 1n,
        gasMarginBps: 100,
        frequency: FREQUENCY,
        numberOfOrders: 4,
        onCreated: resetForm,
      });
    },
    { wrapper },
  );

  return { history, result };
};

describe('useCreateRecurringSwap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuote.mockResolvedValue({
      uuid: 'quote-uuid',
      numberOfOrders: 4,
      intervalSeconds: 604800,
      amount: 1n,
    });
    mockExecuteFirstFill.mockResolvedValue(undefined);
    mockRequest.mockResolvedValue(undefined);
  });

  it('stays on the swap page, clearing the amount and the recurring toggle while keeping tokens', async () => {
    const { history, result } = setup(
      '/fusion?from=src&to=dst&userAmount=2&recurring=true',
    );

    await act(async () => {
      await result.current.createRecurringSwap();
    });

    const params = new URLSearchParams(history.location.search);
    expect(history.location.pathname).toBe('/fusion');
    expect(params.get('userAmount')).toBe('');
    expect(params.get('recurring')).toBe('false');
    expect(params.get('from')).toBe('src');
    expect(params.get('to')).toBe('dst');
  });

  it('does not touch the query when the user left before the first fill resolved', async () => {
    let resolveFill: () => void = () => undefined;
    mockExecuteFirstFill.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveFill = resolve;
      }),
    );
    const { history, result } = setup(
      '/fusion?from=src&to=dst&userAmount=2&recurring=true',
    );

    let pending: Promise<void> | undefined;
    act(() => {
      pending = result.current.createRecurringSwap();
    });
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      history.push('/notifications');
    });

    await act(async () => {
      resolveFill();
      await pending;
    });

    expect(history.location.pathname).toBe('/notifications');
    expect(history.location.search).toBe('');
  });
});
