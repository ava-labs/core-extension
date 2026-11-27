import { act, renderHook, waitFor } from '@testing-library/react';
import type { TransferManager } from '@avalabs/fusion-sdk';

import { useSupportedChainsMap } from './useSupportedChainIds';

describe('useSupportedChainsMap', () => {
  it('refetches supported chains when the status revision changes', async () => {
    const getSupportedChains = jest
      .fn()
      .mockResolvedValueOnce(new Map([['a', new Set()]]))
      .mockResolvedValueOnce(
        new Map([
          ['a', new Set()],
          ['b', new Set()],
        ]),
      );
    const manager = { getSupportedChains } as unknown as TransferManager;

    const { result, rerender } = renderHook(
      ({ revision }) => useSupportedChainsMap(manager, revision),
      { initialProps: { revision: 0 } },
    );
    await waitFor(() => expect(result.current.size).toBe(1));

    rerender({ revision: 0 });
    expect(getSupportedChains).toHaveBeenCalledTimes(1);

    rerender({ revision: 1 });

    await waitFor(() => expect(result.current.size).toBe(2));
    expect(getSupportedChains).toHaveBeenCalledTimes(2);
  });

  it('ignores a stale response that resolves after a newer one', async () => {
    const resolvers: ((value: Map<string, Set<string>>) => void)[] = [];
    const getSupportedChains = jest.fn(
      () =>
        new Promise<Map<string, Set<string>>>((resolve) => {
          resolvers.push(resolve);
        }),
    );
    const manager = { getSupportedChains } as unknown as TransferManager;

    const { result, rerender } = renderHook(
      ({ revision }) => useSupportedChainsMap(manager, revision),
      { initialProps: { revision: 0 } },
    );
    rerender({ revision: 1 });
    expect(getSupportedChains).toHaveBeenCalledTimes(2);

    await act(async () => {
      resolvers[1]!(
        new Map([
          ['a', new Set<string>()],
          ['b', new Set<string>()],
        ]),
      );
    });
    await act(async () => {
      resolvers[0]!(new Map([['a', new Set<string>()]]));
    });

    expect(result.current.size).toBe(2);
  });
});
