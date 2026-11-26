import { act, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Route, Router } from 'react-router-dom';

import { toast } from '@core/ui';

import {
  FusionStateContextProvider,
  useFusionState,
} from './FusionStateContext';

const mockTransferAsset = jest.fn();
const mockTrackTransfer = jest.fn();
const mockUpdateBalanceOnNetworks = jest.fn();

const SOURCE_TOKEN = {
  id: 'src-token',
  coreChainId: 43114,
  balance: 10n ** 20n,
};
const TARGET_TOKEN = { id: 'dst-token', coreChainId: 1, balance: 0n };
const ACCOUNT = { id: 'account-1' };
const QUOTE = {
  id: 'quote-1',
  aggregator: { name: 'test-aggregator' },
  sourceChain: { chainId: 'eip155:43114' },
  targetChain: { chainId: 'eip155:43114' },
  amountOut: 1n,
};
const MANAGER = {
  transferAsset: (...args: unknown[]) => mockTransferAsset(...args),
};
const ASSET_AND_CHAIN = {
  chain: { chainId: 'eip155:43114' },
  asset: { decimals: 18 },
};
const USER_ADDRESSES = { fromAddress: '0xfrom', toAddress: '0xto' };
const SLIPPAGE = {
  slippage: 1,
  setSlippage: jest.fn(),
  autoSlippage: true,
  setAutoSlippage: jest.fn(),
};
const BRIDGEABLE = {
  tokens: [TARGET_TOKEN],
  fetchNextPage: jest.fn(),
  hasNextPage: false,
  isLoading: false,
  isFetching: false,
  targetChainOptions: [],
};
const QUOTES = {
  bestQuote: QUOTE,
  quotes: [QUOTE],
  userQuote: undefined,
  selectedQuote: QUOTE,
  isUserSelectedQuote: false,
  selectQuoteById: jest.fn(),
  status: 'success',
};
const SOURCE_LIST = [SOURCE_TOKEN];
const SUPPORTED_CHAINS = new Map();
const MIN_TRANSFER = { data: undefined, isLoading: false };
const HYPERCORE = {
  hypercoreWithdrawableBalance: undefined,
  hypercoreAbstractionMode: undefined,
  exceedsHypercoreWithdrawableAmount: false,
};
const RECURRING_STATE = {
  isRecurring: false,
  frequencyUnit: 'days',
  frequencyQuantity: 1,
  numberOfOrders: 2,
  resetForm: jest.fn(),
};
const RECURRING_ELIGIBILITY = { isEligible: false };
const RECURRING_QUOTE = { scheduleFee: undefined };
const RECURRING_CREATE = {
  createRecurringSwap: jest.fn(),
  isCreatingRecurringSwap: false,
};
const PRICE_IMPACT = {
  priceImpact: undefined,
  priceImpactSeverity: undefined,
  priceImpactAvailability: undefined,
};
const TRANSFER_TRACKING = {
  trackTransfer: (...args: unknown[]) => mockTrackTransfer(...args),
};
const ANALYTICS = { capture: jest.fn() };
const BALANCES = {
  balances: { loading: false },
  updateBalanceOnNetworks: (...args: unknown[]) =>
    mockUpdateBalanceOnNetworks(...args),
};
const ACCOUNTS = { accounts: { active: ACCOUNT } };
const FEATURE_FLAGS = { selectFeatureFlag: () => 100 };
const NETWORK_FEE = { getNetworkFee: () => Promise.resolve(null) };
const SETTINGS = { feeSetting: 'medium' };

jest.mock('@core/ui', () => ({
  toast: { error: jest.fn(), pending: jest.fn(), dismiss: jest.fn() },
  useAccountsContext: () => ACCOUNTS,
  useAnalyticsContext: () => ANALYTICS,
  useBalancesContext: () => BALANCES,
  useErrorMessage: () => () => ({ title: 'error', hint: '' }),
  useFeatureFlagContext: () => FEATURE_FLAGS,
  useNetworkFeeContext: () => NETWORK_FEE,
  useSettingsContext: () => SETTINGS,
  useTransferTrackingContext: () => TRANSFER_TRACKING,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));

jest.mock('@core/types', () => ({
  ...jest.requireActual('@core/types'),
  getUniqueTokenId: (token: { id: string }) => token.id,
}));

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getTransferTxHash: () => '0xhash',
}));

jest.mock('@tanstack/react-pacer', () => ({
  useDebouncedValue: (value: unknown) => [value],
}));

jest.mock('../hooks', () => ({
  useSwapQuery: jest.requireActual('../hooks/useSwapQuery').useSwapQuery,
  useSwapDraftGuard: jest.requireActual('../hooks/useSwapDraftGuard')
    .useSwapDraftGuard,
  useSwapFormError: () => undefined,
}));

jest.mock('../hooks/usePriceImpact', () => ({
  usePriceImpact: () => PRICE_IMPACT,
}));

jest.mock('./hooks', () => ({
  useUserAddresses: () => USER_ADDRESSES,
  useTransferManager: () => ({ manager: MANAGER, error: undefined }),
  useAssetAndChain: () => ASSET_AND_CHAIN,
  useQuotes: () => QUOTES,
  useSupportedChainsMap: () => SUPPORTED_CHAINS,
  useSwapSourceTokenList: () => SOURCE_LIST,
  useSwapSourceToken: () => SOURCE_TOKEN,
  useBridgeableTargetTokenList: () => BRIDGEABLE,
  useSwapTargetToken: () => TARGET_TOKEN,
  useSlippageTolerance: () => SLIPPAGE,
  useCreateRecurringSwap: () => RECURRING_CREATE,
  useRecurringEligibility: () => RECURRING_ELIGIBILITY,
  useRecurringQuote: () => RECURRING_QUOTE,
  useHypercoreWithdrawable: () => HYPERCORE,
}));

jest.mock('./hooks/useMinimumTransferAmount', () => ({
  useFusionMinimumTransferAmount: () => MIN_TRANSFER,
}));
jest.mock('./hooks/useRequiredTokenAmounts', () => ({
  useRequiredTokenAmounts: () => undefined,
}));
jest.mock('./hooks/useMinimalQuote', () => ({
  useMinimalQuote: () => undefined,
}));
jest.mock('./RecurringSwapContext', () => ({
  useRecurringSwapState: () => RECURRING_STATE,
}));
jest.mock('./lib/getSwapStatus', () => ({
  getSwapStatus: () => 'ready',
}));

type FusionState = ReturnType<typeof useFusionState>;

const renderProvider = (initialEntry: string) => {
  const history = createMemoryHistory({ initialEntries: [initialEntry] });
  let state: FusionState | undefined;

  const Consumer = () => {
    state = useFusionState();
    return null;
  };

  render(
    <Router history={history}>
      <Route path="/fusion">
        <FusionStateContextProvider>
          <Consumer />
        </FusionStateContextProvider>
      </Route>
    </Router>,
  );

  return {
    history: history as MemoryHistory,
    getState: () => state as FusionState,
  };
};

const SWAP_URL = '/fusion?from=src-token&to=dst-token&userAmount=1.5';

describe('FusionStateContext transfer()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrackTransfer.mockResolvedValue(undefined);
    mockUpdateBalanceOnNetworks.mockResolvedValue(undefined);
  });

  it.each([
    ['same-chain', QUOTE.targetChain],
    ['cross-chain', { chainId: 'eip155:1' }],
  ])(
    'stays on the swap page, resets the amount and keeps tokens after a %s swap',
    async (_label, targetChain) => {
      mockTransferAsset.mockResolvedValue({
        id: 'transfer-1',
        sourceChain: QUOTE.sourceChain,
        targetChain,
      });
      const { history, getState } = renderProvider(SWAP_URL);
      const pushSpy = jest.spyOn(history, 'push');
      const replaceSpy = jest.spyOn(history, 'replace');

      await act(async () => {
        await getState().transfer();
      });

      const { pathname, search } = history.location;
      const params = new URLSearchParams(search);

      expect(pathname).toBe('/fusion');
      expect(params.get('userAmount')).toBe('');
      expect(params.get('from')).toBe('src-token');
      expect(params.get('to')).toBe('dst-token');
      expect(getState().isConfirming).toBe(false);
      expect(pushSpy).not.toHaveBeenCalled();
      expect(replaceSpy).toHaveBeenCalledTimes(1);
      expect(history.location.pathname).not.toMatch(/fusion-transfer/);
    },
  );

  it('shows a pending toast linking to the progress page after a cross-chain submit', async () => {
    mockTransferAsset.mockResolvedValue({
      id: 'transfer-1',
      sourceChain: QUOTE.sourceChain,
      targetChain: { chainId: 'eip155:1' },
    });
    const { history, getState } = renderProvider(SWAP_URL);

    await act(async () => {
      await getState().transfer();
    });

    expect(toast.pending).toHaveBeenCalledTimes(1);
    const [title, options] = jest.mocked(toast.pending).mock.calls[0]!;
    expect(title).toBe('Transaction pending...');
    expect(options?.id).toBe('cross-chain-transfer-pending-transfer-1');
    expect(history.location.pathname).toBe('/fusion');

    render(<>{options?.action}</>);
    act(() => {
      screen.getByTestId('show-transfer-progress-button').click();
    });

    expect(toast.dismiss).toHaveBeenCalledWith(
      'cross-chain-transfer-pending-transfer-1',
    );
    expect(history.location.pathname).toBe('/fusion-transfer/transfer-1');
  });

  it('does not show the toast for a same-chain swap', async () => {
    mockTransferAsset.mockResolvedValue({
      id: 'transfer-1',
      sourceChain: QUOTE.sourceChain,
      targetChain: QUOTE.targetChain,
    });
    const { getState } = renderProvider(SWAP_URL);

    await act(async () => {
      await getState().transfer();
    });

    expect(toast.pending).not.toHaveBeenCalled();
  });

  it('does not pull the user back when the transfer resolves after they left the swap page', async () => {
    let resolveTransfer: (value: unknown) => void = () => undefined;
    mockTransferAsset.mockReturnValue(
      new Promise((resolve) => {
        resolveTransfer = resolve;
      }),
    );
    const { history, getState } = renderProvider(SWAP_URL);

    let transferPromise: Promise<void> | undefined;
    act(() => {
      transferPromise = getState().transfer();
    });
    await waitFor(() => expect(mockTransferAsset).toHaveBeenCalled());

    act(() => {
      history.push('/notifications');
    });

    await act(async () => {
      resolveTransfer({
        id: 'transfer-1',
        sourceChain: QUOTE.sourceChain,
        targetChain: QUOTE.targetChain,
      });
      await transferPromise;
    });

    expect(history.location.pathname).toBe('/notifications');
    expect(history.location.search).toBe('');
  });

  it('still shows the pending toast with a working progress link when a cross-chain transfer resolves after the user left', async () => {
    let resolveTransfer: (value: unknown) => void = () => undefined;
    mockTransferAsset.mockReturnValue(
      new Promise((resolve) => {
        resolveTransfer = resolve;
      }),
    );
    const { history, getState } = renderProvider(SWAP_URL);

    let transferPromise: Promise<void> | undefined;
    act(() => {
      transferPromise = getState().transfer();
    });
    await waitFor(() => expect(mockTransferAsset).toHaveBeenCalled());

    act(() => {
      history.push('/notifications');
    });

    await act(async () => {
      resolveTransfer({
        id: 'transfer-1',
        sourceChain: QUOTE.sourceChain,
        targetChain: { chainId: 'eip155:1' },
      });
      await transferPromise;
    });

    expect(history.location.pathname).toBe('/notifications');
    expect(toast.pending).toHaveBeenCalledTimes(1);

    const [, options] = jest.mocked(toast.pending).mock.calls[0]!;
    render(<>{options?.action}</>);
    act(() => {
      screen.getByTestId('show-transfer-progress-button').click();
    });

    expect(history.location.pathname).toBe('/fusion-transfer/transfer-1');
  });

  it('keeps a newer draft intact when an older transfer resolves', async () => {
    let resolveTransfer: (value: unknown) => void = () => undefined;
    mockTransferAsset.mockReturnValue(
      new Promise((resolve) => {
        resolveTransfer = resolve;
      }),
    );
    const { history, getState } = renderProvider(SWAP_URL);

    let transferPromise: Promise<void> | undefined;
    act(() => {
      transferPromise = getState().transfer();
    });
    await waitFor(() => expect(mockTransferAsset).toHaveBeenCalled());

    act(() => {
      history.replace('/fusion?from=src-token&to=dst-token&userAmount=7');
    });

    await act(async () => {
      resolveTransfer({
        id: 'transfer-1',
        sourceChain: QUOTE.sourceChain,
        targetChain: QUOTE.targetChain,
      });
      await transferPromise;
    });

    expect(new URLSearchParams(history.location.search).get('userAmount')).toBe(
      '7',
    );
  });
});
