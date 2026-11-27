import { act, renderHook, waitFor } from '@testing-library/react';
import { createTransferManager, ServiceType } from '@avalabs/fusion-sdk';

import { useTransferManager } from './useTransferManager';
import { useSigners } from './useSigners';
import { useTransferEnvironment } from './useTransferEnvironment';
import { useTransferServiceInitializers } from './useTransferServiceInitializers';

const mockFeatureFlags = { current: {} as Record<string, boolean> };

jest.mock('@avalabs/fusion-sdk', () => ({
  ...jest.requireActual('@avalabs/fusion-sdk'),
  createTransferManager: jest.fn(),
}));
jest.mock('@core/ui', () => ({
  useFeatureFlagContext: () => ({ featureFlags: mockFeatureFlags.current }),
}));
jest.mock('@core/common', () => ({
  hasAtLeastOneElement: (array: unknown[]) => array.length > 0,
  getEnabledTransferServices: () => mockEnabledServices.current,
}));
jest.mock('./useSigners');
jest.mock('./useTransferEnvironment');
jest.mock('./useTransferServiceInitializers');

const mockCapabilitySignature = { current: 'sign,signBatch' };
const mockSigners = { current: {} as object | null };
const mockEnabledServices = { current: [ServiceType.MARKR] as ServiceType[] };

describe('useTransferManager', () => {
  const initializers = [{ type: ServiceType.MARKR }];

  beforeEach(() => {
    jest.resetAllMocks();
    mockEnabledServices.current = [ServiceType.MARKR];
    mockSigners.current = {};
    mockCapabilitySignature.current = 'sign,signBatch';
    jest
      .mocked(useSigners)
      .mockImplementation(() => mockSigners.current as never);
    jest.mocked(useTransferEnvironment).mockReturnValue('prod' as never);
    jest.mocked(useTransferServiceInitializers).mockImplementation(() => ({
      serviceInitializers: (mockEnabledServices.current.length > 0 &&
      mockSigners.current
        ? [...initializers]
        : []) as never,
      capabilitySignature: mockCapabilitySignature.current,
    }));
    jest.mocked(createTransferManager).mockImplementation(
      async () =>
        ({
          id: Math.random(),
          status: () => ({ services: {} }),
        }) as never,
    );
  });

  it('does not rebuild the manager when initializers change identity', async () => {
    const { result, rerender } = renderHook(() => useTransferManager());

    await waitFor(() => expect(result.current.manager).toBeDefined());
    const first = result.current.manager;

    rerender();
    rerender();

    expect(createTransferManager).toHaveBeenCalledTimes(1);
    expect(result.current.manager).toBe(first);
  });

  it('rebuilds the manager when the environment changes', async () => {
    const { result, rerender } = renderHook(() => useTransferManager());
    await waitFor(() => expect(result.current.manager).toBeDefined());

    jest.mocked(useTransferEnvironment).mockReturnValue('test' as never);
    rerender();

    await waitFor(() => expect(createTransferManager).toHaveBeenCalledTimes(2));
  });

  it('rebuilds the manager when the enabled services change', async () => {
    const { result, rerender } = renderHook(() => useTransferManager());
    await waitFor(() => expect(result.current.manager).toBeDefined());

    mockEnabledServices.current = [
      ServiceType.MARKR,
      ServiceType.AVALANCHE_EVM,
    ];
    rerender();

    await waitFor(() => expect(createTransferManager).toHaveBeenCalledTimes(2));
  });

  it('rebuilds the manager when signer capabilities change', async () => {
    const { result, rerender } = renderHook(() => useTransferManager());
    await waitFor(() => expect(result.current.manager).toBeDefined());

    mockCapabilitySignature.current = 'sign';
    rerender();

    await waitFor(() => expect(createTransferManager).toHaveBeenCalledTimes(2));
  });

  it('does not rebuild the manager when capabilities stay the same', async () => {
    const { result, rerender } = renderHook(() => useTransferManager());
    await waitFor(() => expect(result.current.manager).toBeDefined());

    mockSigners.current = { account: 'other' };
    rerender();

    expect(createTransferManager).toHaveBeenCalledTimes(1);
  });

  it('drops the manager when all services become disabled', async () => {
    const { result, rerender } = renderHook(() => useTransferManager());
    await waitFor(() => expect(result.current.manager).toBeDefined());

    mockEnabledServices.current = [];
    rerender();

    await waitFor(() => expect(result.current.manager).toBeUndefined());
    expect(createTransferManager).toHaveBeenCalledTimes(1);
  });

  it('drops the manager when the signers disappear', async () => {
    const { result, rerender } = renderHook(() => useTransferManager());
    await waitFor(() => expect(result.current.manager).toBeDefined());

    mockSigners.current = null;
    rerender();

    await waitFor(() => expect(result.current.manager).toBeUndefined());
  });

  it('does not create a manager when disabled', async () => {
    const { result } = renderHook(() => useTransferManager({ enabled: false }));

    await act(async () => undefined);

    expect(result.current.manager).toBeUndefined();
    expect(createTransferManager).not.toHaveBeenCalled();
  });

  it('exposes an error when creation fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.mocked(createTransferManager).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useTransferManager());

    await act(async () => undefined);

    expect(result.current.error).toBe(true);
    expect(result.current.manager).toBeUndefined();
  });

  describe('late join support', () => {
    type Status = { services: Record<string, { status: string }> };
    const pending: Status = { services: { markr: { status: 'error' } } };
    const joined: Status = { services: { markr: { status: 'initialized' } } };

    const buildManager = (
      options: { withLateJoin?: boolean; emitOnSubscribe?: Status } = {},
    ) => {
      const { withLateJoin = true, emitOnSubscribe } = options;
      const listeners: ((status: Status) => void)[] = [];
      const unsubscribe = jest.fn();
      const dispose = jest.fn();
      const manager = {
        id: Math.random(),
        status: () => pending,
        ...(withLateJoin
          ? {
              onStatusChange: jest.fn((listener: (status: Status) => void) => {
                listeners.push(listener);
                if (emitOnSubscribe) listener(emitOnSubscribe);
                return unsubscribe;
              }),
              dispose,
            }
          : {}),
      };

      return { manager, listeners, unsubscribe, dispose };
    };

    it('increments the status revision when a service joins and cleans up on unmount', async () => {
      const built = buildManager();
      jest
        .mocked(createTransferManager)
        .mockResolvedValue(built.manager as never);

      const { result, unmount } = renderHook(() => useTransferManager());
      await waitFor(() => expect(result.current.manager).toBeDefined());
      expect(result.current.statusRevision).toBe(0);

      act(() => built.listeners[0]!(joined));

      expect(result.current.statusRevision).toBe(1);
      expect(result.current.manager).toBe(built.manager);

      unmount();

      expect(built.unsubscribe).toHaveBeenCalledTimes(1);
      expect(built.dispose).toHaveBeenCalledTimes(1);
    });

    it('does not miss a status change emitted before the manager is exposed', async () => {
      const built = buildManager({ emitOnSubscribe: joined });
      jest
        .mocked(createTransferManager)
        .mockResolvedValue(built.manager as never);

      const { result } = renderHook(() => useTransferManager());
      await waitFor(() => expect(result.current.manager).toBeDefined());

      expect(result.current.statusRevision).toBe(1);
    });

    it('does not increment the revision for late failures', async () => {
      const built = buildManager();
      jest
        .mocked(createTransferManager)
        .mockResolvedValue(built.manager as never);

      const { result } = renderHook(() => useTransferManager());
      await waitFor(() => expect(result.current.manager).toBeDefined());

      act(() =>
        built.listeners[0]!({
          services: { markr: { status: 'error' } },
        }),
      );

      expect(result.current.statusRevision).toBe(0);
    });

    it('increments only once per newly initialized service', async () => {
      const built = buildManager();
      jest
        .mocked(createTransferManager)
        .mockResolvedValue(built.manager as never);

      const { result } = renderHook(() => useTransferManager());
      await waitFor(() => expect(result.current.manager).toBeDefined());

      act(() => built.listeners[0]!(joined));
      act(() => built.listeners[0]!(joined));

      expect(result.current.statusRevision).toBe(1);
    });

    it('disposes the previous manager when it is replaced', async () => {
      const first = buildManager();
      const second = buildManager();
      jest
        .mocked(createTransferManager)
        .mockResolvedValueOnce(first.manager as never)
        .mockResolvedValueOnce(second.manager as never);

      const { result, rerender } = renderHook(() => useTransferManager());
      await waitFor(() => expect(result.current.manager).toBe(first.manager));

      jest.mocked(useTransferEnvironment).mockReturnValue('test' as never);
      rerender();

      await waitFor(() => expect(result.current.manager).toBe(second.manager));
      expect(first.dispose).toHaveBeenCalledTimes(1);
      expect(first.unsubscribe).toHaveBeenCalledTimes(1);
      expect(second.dispose).not.toHaveBeenCalled();
    });

    it('disposes a manager that finishes creating after being replaced', async () => {
      const stale = buildManager();
      const fresh = buildManager();
      let resolveStale: (value: unknown) => void = () => undefined;
      jest
        .mocked(createTransferManager)
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveStale = resolve;
            }) as never,
        )
        .mockResolvedValueOnce(fresh.manager as never);

      const { result, rerender } = renderHook(() => useTransferManager());

      jest.mocked(useTransferEnvironment).mockReturnValue('test' as never);
      rerender();
      await waitFor(() => expect(result.current.manager).toBe(fresh.manager));

      await act(async () => resolveStale(stale.manager));

      expect(stale.dispose).toHaveBeenCalledTimes(1);
      expect(stale.manager.onStatusChange).not.toHaveBeenCalled();
      expect(result.current.manager).toBe(fresh.manager);
    });

    it('works when the manager has no onStatusChange or dispose', async () => {
      const built = buildManager({ withLateJoin: false });
      jest
        .mocked(createTransferManager)
        .mockResolvedValue(built.manager as never);

      const { result, unmount } = renderHook(() => useTransferManager());
      await waitFor(() => expect(result.current.manager).toBeDefined());

      expect(result.current.statusRevision).toBe(0);
      expect(() => unmount()).not.toThrow();
    });
  });
});
