import { ReactNode } from 'react';
import { render, renderHook, act, waitFor } from '@testing-library/react';

import {
  TxDataUpdateProvider,
  useTxDataUpdate,
  usePendingTxDataUpdate,
} from './TxDataUpdateContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <TxDataUpdateProvider>{children}</TxDataUpdateProvider>
);

describe('TxDataUpdateContext', () => {
  describe('useTxDataUpdate', () => {
    it('throws when used outside of TxDataUpdateProvider', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      expect(() => renderHook(() => useTxDataUpdate())).toThrow(
        'useTxDataUpdate must be used within a TxDataUpdateProvider',
      );

      consoleError.mockRestore();
    });

    it('starts with isUpdating set to false', () => {
      const { result } = renderHook(() => useTxDataUpdate(), { wrapper });

      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('trackTxDataUpdate', () => {
    it('marks the context as updating while the promise is pending and clears it on resolve', async () => {
      const { result } = renderHook(() => useTxDataUpdate(), { wrapper });

      let resolve: (value: string) => void = () => undefined;
      const pending = new Promise<string>((res) => {
        resolve = res;
      });

      let tracked: Promise<string> | undefined;
      act(() => {
        tracked = result.current.trackTxDataUpdate(pending);
      });

      expect(result.current.isUpdating).toBe(true);

      await act(async () => {
        resolve('done');
        await tracked;
      });

      expect(result.current.isUpdating).toBe(false);
      await expect(tracked).resolves.toBe('done');
    });

    it('clears isUpdating when the tracked promise rejects and re-throws the error', async () => {
      const { result } = renderHook(() => useTxDataUpdate(), { wrapper });

      const error = new Error('boom');
      let reject: (reason: Error) => void = () => undefined;
      const pending = new Promise<string>((_, rej) => {
        reject = rej;
      });

      let tracked: Promise<string> | undefined;
      act(() => {
        tracked = result.current.trackTxDataUpdate(pending);
      });

      expect(result.current.isUpdating).toBe(true);

      await act(async () => {
        reject(error);
        await tracked?.catch(() => undefined);
      });

      expect(result.current.isUpdating).toBe(false);
      await expect(tracked).rejects.toBe(error);
    });

    it('stays updating until all concurrent tracked promises settle', async () => {
      const { result } = renderHook(() => useTxDataUpdate(), { wrapper });

      let resolveA: () => void = () => undefined;
      let resolveB: () => void = () => undefined;
      const a = new Promise<void>((res) => {
        resolveA = res;
      });
      const b = new Promise<void>((res) => {
        resolveB = res;
      });

      let trackedA: Promise<void> | undefined;
      let trackedB: Promise<void> | undefined;
      act(() => {
        trackedA = result.current.trackTxDataUpdate(a);
        trackedB = result.current.trackTxDataUpdate(b);
      });

      expect(result.current.isUpdating).toBe(true);

      await act(async () => {
        resolveA();
        await trackedA;
      });

      expect(result.current.isUpdating).toBe(true);

      await act(async () => {
        resolveB();
        await trackedB;
      });

      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('registerPendingTxDataUpdate', () => {
    it('marks the context as updating until the cleanup runs', () => {
      const { result } = renderHook(() => useTxDataUpdate(), { wrapper });

      let release: (() => void) | undefined;
      act(() => {
        release = result.current.registerPendingTxDataUpdate();
      });

      expect(result.current.isUpdating).toBe(true);

      act(() => {
        release?.();
      });

      expect(result.current.isUpdating).toBe(false);
    });

    it('ignores subsequent cleanup calls so the count cannot be over-decremented', () => {
      const { result } = renderHook(() => useTxDataUpdate(), { wrapper });

      let releaseFirst: (() => void) | undefined;
      let releaseSecond: (() => void) | undefined;
      act(() => {
        releaseFirst = result.current.registerPendingTxDataUpdate();
        releaseSecond = result.current.registerPendingTxDataUpdate();
      });

      expect(result.current.isUpdating).toBe(true);

      act(() => {
        releaseFirst?.();
        releaseFirst?.();
      });

      expect(result.current.isUpdating).toBe(true);

      act(() => {
        releaseSecond?.();
      });

      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('usePendingTxDataUpdate', () => {
    it('does not mark the context as updating when isPending is false', () => {
      const { result } = renderHook(
        () => {
          usePendingTxDataUpdate(false);
          return useTxDataUpdate();
        },
        { wrapper },
      );

      expect(result.current.isUpdating).toBe(false);
    });

    it('marks the context as updating while isPending is true and clears it when it flips back', async () => {
      const { result, rerender } = renderHook(
        ({ isPending }: { isPending: boolean }) => {
          usePendingTxDataUpdate(isPending);
          return useTxDataUpdate();
        },
        { wrapper, initialProps: { isPending: true } },
      );

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(true);
      });

      rerender({ isPending: false });

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
      });
    });

    it('releases the pending registration when the consuming component unmounts', async () => {
      const PendingChild = () => {
        usePendingTxDataUpdate(true);
        return null;
      };

      const Status = () => {
        const { isUpdating } = useTxDataUpdate();
        return <div data-testid="status">{String(isUpdating)}</div>;
      };

      const Tree = ({ showChild }: { showChild: boolean }) => (
        <TxDataUpdateProvider>
          <Status />
          {showChild && <PendingChild />}
        </TxDataUpdateProvider>
      );

      const { getByTestId, rerender } = render(<Tree showChild />);

      await waitFor(() => {
        expect(getByTestId('status').textContent).toBe('true');
      });

      rerender(<Tree showChild={false} />);

      await waitFor(() => {
        expect(getByTestId('status').textContent).toBe('false');
      });
    });
  });
});
