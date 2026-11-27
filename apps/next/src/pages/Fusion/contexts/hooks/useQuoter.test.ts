import { renderHook } from '@testing-library/react';
import type { TransferManager } from '@avalabs/fusion-sdk';

import { useQuoter } from './useQuoter';

jest.mock('../../lib/formatAvalancheCctQuoteAddress', () => ({
  formatAvalancheCctQuoteAddress: (address: string) => address,
}));

describe('useQuoter', () => {
  const buildProps = (statusRevision?: number) => {
    const getQuoter = jest.fn((_props: unknown) => ({}));

    return {
      getQuoter,
      props: {
        manager: { getQuoter } as unknown as TransferManager,
        fromAddress: '0x1',
        toAddress: '0x2',
        sourceAsset: {} as never,
        sourceChain: {} as never,
        targetAsset: {} as never,
        targetChain: {} as never,
        amount: 1n,
        statusRevision,
      },
    };
  };

  it('creates a new quoter when the status revision changes', () => {
    const { getQuoter, props } = buildProps(0);
    const { result, rerender } = renderHook((p) => useQuoter(p), {
      initialProps: props,
    });
    const first = result.current;

    rerender({ ...props });
    expect(getQuoter).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(first);

    rerender({ ...props, statusRevision: 1 });

    expect(getQuoter).toHaveBeenCalledTimes(2);
    expect(result.current).not.toBe(first);
  });

  it('does not pass the status revision to the quoter', () => {
    const { getQuoter, props } = buildProps(3);

    renderHook(() => useQuoter(props));

    expect(getQuoter.mock.calls[0]?.[0]).not.toHaveProperty('statusRevision');
  });

  it('works without a status revision', () => {
    const { getQuoter, props } = buildProps(undefined);

    renderHook(() => useQuoter(props));

    expect(getQuoter).toHaveBeenCalledTimes(1);
  });
});
