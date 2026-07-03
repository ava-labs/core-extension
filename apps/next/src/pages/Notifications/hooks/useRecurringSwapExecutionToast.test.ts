import { renderHook } from '@testing-library/react';

import { AppNotification } from '@core/types';

import { useRecurringSwapExecutionToast } from './useRecurringSwapExecutionToast';
import { useNotificationCenterList } from './useNotificationCenterList';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const toastSuccess = jest.fn();
const toastError = jest.fn();
jest.mock('@core/ui', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

jest.mock('./useNotificationCenterList');
const mockUseNotificationCenterList = jest.mocked(useNotificationCenterList);

const mockNotifications = (notifications: AppNotification[]) => {
  mockUseNotificationCenterList.mockReturnValue({
    data: notifications,
  } as ReturnType<typeof useNotificationCenterList>);
};

const createRecurringNotification = ({
  id = 'rs-1',
  timestamp,
  status = 'active',
}: {
  id?: string;
  timestamp: number;
  status?: string;
}): AppNotification => ({
  id,
  type: 'RECURRING_SWAP',
  category: 'TRANSACTION' as AppNotification['category'],
  title: 'Recurring swap executed',
  body: 'Swapped 5 USDC for AVAX',
  timestamp,
  data: { orderId: '0xabc', status },
});

describe('useRecurringSwapExecutionToast', () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
    mockUseNotificationCenterList.mockReset();
  });

  it('does not toast notifications already present on mount', () => {
    mockNotifications([
      createRecurringNotification({ timestamp: Date.now() - 60_000 }),
    ]);

    renderHook(() => useRecurringSwapExecutionToast());

    expect(toastSuccess).not.toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });

  it('toasts a millisecond-stamped notification that arrives after mount', () => {
    mockNotifications([]);
    const { rerender } = renderHook(() => useRecurringSwapExecutionToast());

    mockNotifications([
      createRecurringNotification({ timestamp: Date.now() + 60_000 }),
    ]);
    rerender();

    expect(toastSuccess).toHaveBeenCalledTimes(1);
  });

  it('toasts a second-stamped notification that arrives after mount', () => {
    mockNotifications([]);
    const { rerender } = renderHook(() => useRecurringSwapExecutionToast());

    // Backend `createdAt` can be epoch seconds; without normalization this
    // would be treated as ~1970 and always skipped.
    mockNotifications([
      createRecurringNotification({
        timestamp: Math.floor(Date.now() / 1000) + 60,
      }),
    ]);
    rerender();

    expect(toastSuccess).toHaveBeenCalledTimes(1);
  });

  it('skips a second-stamped notification from before mount', () => {
    mockNotifications([]);
    const { rerender } = renderHook(() => useRecurringSwapExecutionToast());

    mockNotifications([
      createRecurringNotification({
        timestamp: Math.floor(Date.now() / 1000) - 60,
      }),
    ]);
    rerender();

    expect(toastSuccess).not.toHaveBeenCalled();
  });

  it('uses an error toast for a failed leg execution', () => {
    mockNotifications([]);
    const { rerender } = renderHook(() => useRecurringSwapExecutionToast());

    mockNotifications([
      createRecurringNotification({
        timestamp: Date.now() + 60_000,
        status: 'failed',
      }),
    ]);
    rerender();

    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  it('toasts each new notification only once', () => {
    mockNotifications([]);
    const { rerender } = renderHook(() => useRecurringSwapExecutionToast());

    const notification = createRecurringNotification({
      timestamp: Date.now() + 60_000,
    });
    mockNotifications([notification]);
    rerender();
    rerender();

    expect(toastSuccess).toHaveBeenCalledTimes(1);
  });
});
