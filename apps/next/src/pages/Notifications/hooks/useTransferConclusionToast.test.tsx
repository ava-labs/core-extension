import { act, render, renderHook, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { PropsWithChildren } from 'react';
import { Router } from 'react-router-dom';
import { ServiceType } from '@avalabs/fusion-sdk';

import { ContextContainer } from '@core/types';
import { isSpecificContextContainer, toast } from '@core/ui';

import { useTransferConclusionToast } from './useTransferConclusionToast';

let mockContext: ContextContainer = ContextContainer.POPUP;
let mockTrackingState: {
  transfers: unknown[];
  isLoading: boolean;
} = { transfers: [], isLoading: false };

jest.mock('@core/ui', () => ({
  toast: { success: jest.fn(), error: jest.fn(), dismiss: jest.fn() },
  isSpecificContextContainer: jest.fn(),
  useTransferTrackingContext: () => mockTrackingState,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (s: string, args: Record<string, string>) =>
      s.replace(/\{\{(\w+)\}\}/g, (_, key) => args[key] ?? ''),
  }),
}));

jest.mock('@/components/TokenSelect/utils', () => ({
  getChainFilterName: () => 'chain',
}));

const makeTransfer = (
  id: string,
  status: string,
  type: ServiceType = ServiceType.LOMBARD_BTC_TO_BTCB,
  targetChainId = 'eip155:1',
) => ({
  transfer: {
    id,
    status,
    type,
    sourceAsset: { symbol: 'AVAX' },
    targetAsset: { symbol: 'USDC' },
    sourceChain: { chainId: 'eip155:43114' },
    targetChain: { chainId: targetChainId },
  },
  isRead: false,
});

const setup = () => {
  const history = createMemoryHistory({ initialEntries: ['/fusion'] });
  const wrapper = ({ children }: PropsWithChildren) => (
    <Router history={history}>{children}</Router>
  );
  const view = renderHook(() => useTransferConclusionToast(), { wrapper });

  return { history, rerender: () => view.rerender() };
};

describe('useTransferConclusionToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrackingState = { transfers: [], isLoading: false };
    mockContext = ContextContainer.POPUP;
    jest
      .mocked(isSpecificContextContainer)
      .mockImplementation((context) => context === mockContext);
  });

  it('does not toast for transfers already concluded when the UI opened', () => {
    mockTrackingState = {
      transfers: [makeTransfer('a', 'completed'), makeTransfer('b', 'failed')],
      isLoading: false,
    };
    const { rerender } = setup();
    rerender();

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('does not toast while the initial state is still loading', () => {
    mockTrackingState = { transfers: [], isLoading: true };
    const { rerender } = setup();

    mockTrackingState = {
      transfers: [makeTransfer('a', 'completed')],
      isLoading: false,
    };
    rerender();

    expect(toast.success).not.toHaveBeenCalled();
  });

  it('shows one specific success toast when a transfer completes, without duplicates', () => {
    mockTrackingState = {
      transfers: [makeTransfer('a', 'target-pending')],
      isLoading: false,
    };
    const { rerender } = setup();

    mockTrackingState = {
      transfers: [makeTransfer('a', 'completed')],
      isLoading: false,
    };
    rerender();
    mockTrackingState = {
      transfers: [makeTransfer('a', 'completed')],
      isLoading: false,
    };
    rerender();

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      'Swap from AVAX to USDC completed',
      expect.objectContaining({ id: 'transfer-concluded-a' }),
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it.each([
    ['failed', 'Swap from AVAX to USDC failed'],
    ['refunded', 'Swap from AVAX to USDC refunded'],
  ])('shows an error toast with specific copy on %s', (status, copy) => {
    mockTrackingState = {
      transfers: [makeTransfer('a', 'target-pending')],
      isLoading: false,
    };
    const { rerender } = setup();

    mockTrackingState = {
      transfers: [makeTransfer('a', status)],
      isLoading: false,
    };
    rerender();

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      copy,
      expect.objectContaining({ id: 'transfer-concluded-a' }),
    );
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('toasts a transfer first seen after load that is already concluded', () => {
    const { rerender } = setup();

    mockTrackingState = {
      transfers: [makeTransfer('new', 'completed')],
      isLoading: false,
    };
    rerender();

    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it('links the toast to the transfer progress page', () => {
    mockTrackingState = {
      transfers: [makeTransfer('a', 'target-pending')],
      isLoading: false,
    };
    const { history, rerender } = setup();

    mockTrackingState = {
      transfers: [makeTransfer('a', 'completed')],
      isLoading: false,
    };
    rerender();

    const [, options] = jest.mocked(toast.success).mock.calls[0]!;
    render(<>{options?.action}</>);
    act(() => {
      screen.getByTestId('show-transfer-progress-button').click();
    });

    expect(toast.dismiss).toHaveBeenCalledWith('transfer-concluded-a');
    expect(history.location.pathname).toBe('/fusion-transfer/a');
  });

  it('ignores same-chain transfers', () => {
    mockTrackingState = {
      transfers: [
        makeTransfer('a', 'source-pending', ServiceType.MARKR, 'eip155:43114'),
      ],
      isLoading: false,
    };
    const { rerender } = setup();

    mockTrackingState = {
      transfers: [
        makeTransfer('a', 'completed', ServiceType.MARKR, 'eip155:43114'),
      ],
      isLoading: false,
    };
    rerender();

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it.each([
    ContextContainer.CONFIRM,
    ContextContainer.HOME,
    ContextContainer.FULLSCREEN,
  ])('does not toast in the %s context', (context) => {
    mockContext = context;
    mockTrackingState = {
      transfers: [makeTransfer('a', 'target-pending')],
      isLoading: false,
    };
    const { rerender } = setup();

    mockTrackingState = {
      transfers: [makeTransfer('a', 'completed')],
      isLoading: false,
    };
    rerender();

    expect(toast.success).not.toHaveBeenCalled();
  });

  it('toasts in the side panel context', () => {
    mockContext = ContextContainer.SIDE_PANEL;
    mockTrackingState = {
      transfers: [makeTransfer('a', 'target-pending')],
      isLoading: false,
    };
    const { rerender } = setup();

    mockTrackingState = {
      transfers: [makeTransfer('a', 'completed')],
      isLoading: false,
    };
    rerender();

    expect(toast.success).toHaveBeenCalledTimes(1);
  });
});
