import { type ReactNode } from 'react';
import { renderHook } from '@testing-library/react';

import { TransferManagerContext } from '../TransferManagerContext';
import { useSharedTransferManager } from './useSharedTransferManager';
import { useTransferManager } from './useTransferManager';

jest.mock('./useTransferManager');

describe('useSharedTransferManager', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .mocked(useTransferManager)
      .mockReturnValue({ manager: { id: 'own' }, error: false } as never);
  });

  it('reuses the manager from context without creating its own', () => {
    const shared = { id: 'shared' };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TransferManagerContext.Provider
        value={{ manager: shared as never, statusRevision: 3 }}
      >
        {children}
      </TransferManagerContext.Provider>
    );

    const { result } = renderHook(() => useSharedTransferManager(), {
      wrapper,
    });

    expect(result.current.manager).toBe(shared);
    expect(result.current.statusRevision).toBe(3);
    expect(useTransferManager).toHaveBeenCalledWith({ enabled: false });
  });

  it('creates its own manager outside the swap page', () => {
    const { result } = renderHook(() => useSharedTransferManager());

    expect(result.current.manager).toEqual({ id: 'own' });
    expect(useTransferManager).toHaveBeenCalledWith({ enabled: true });
  });
});
