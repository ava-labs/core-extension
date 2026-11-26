import { act, renderHook } from '@testing-library/react';

import { NetworkFee } from '@core/types';
import { useNetworkFeeContext } from '@core/ui';

import {
  NETWORK_FEE_REFRESH_INTERVAL_MS,
  usePolledNetworkFee,
} from './usePolledNetworkFee';

jest.mock('@core/ui');

const makeFee = (n: bigint) =>
  ({ medium: { maxFeePerGas: n } }) as unknown as NetworkFee;

describe('usePolledNetworkFee', () => {
  const getNetworkFee = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    jest.mocked(useNetworkFeeContext).mockReturnValue({
      getNetworkFee,
    } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('refreshes the fee on an interval', async () => {
    getNetworkFee
      .mockResolvedValueOnce(makeFee(1n))
      .mockResolvedValue(makeFee(2n));

    const { result } = renderHook(() => usePolledNetworkFee(1));

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    expect(result.current).toEqual(makeFee(1n));

    await act(async () => {
      await jest.advanceTimersByTimeAsync(NETWORK_FEE_REFRESH_INTERVAL_MS);
    });
    expect(result.current).toEqual(makeFee(2n));
  });

  it('does not return a fee fetched for another chain', async () => {
    getNetworkFee.mockResolvedValue(makeFee(1n));

    const { result, rerender } = renderHook(
      ({ chainId }) => usePolledNetworkFee(chainId),
      { initialProps: { chainId: 1 } },
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    expect(result.current).not.toBeNull();

    getNetworkFee.mockReturnValue(new Promise(() => undefined));
    rerender({ chainId: 2 });

    expect(result.current).toBeNull();
  });
});
