import { act, renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';

import { Account, FungibleTokenBalance, NetworkFee } from '@core/types';
import {
  useNetworkContext,
  useNetworkFeeContext,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';

import { useMaxAmountForTokenSend } from './useMaxAmountForTokenSend';
import { getBtcMaxAmount } from './lib/getBtcMaxAmount';
import { getXChainMaxAmount } from './lib/getXChainMaxAmount';
import { getDefaultFeePreset } from '@/utils/getDefaultFeePreset';

jest.mock('@core/ui');
jest.mock('./lib/getBtcMaxAmount');
jest.mock('./lib/getXChainMaxAmount');
jest.mock('@/utils/getDefaultFeePreset');
jest.mock('./usePChainMaxAmount', () => ({
  usePChainMaxAmount: () => ({
    maxAmount: undefined,
    estimatedFee: undefined,
  }),
}));
const getXPAddresses = jest.fn();
jest.mock('../useGetXPAddresses', () => ({
  useGetXPAddresses: () => getXPAddresses,
}));

const makeFee = (medium: bigint): NetworkFee =>
  ({
    low: { maxFeePerGas: 1n },
    medium: { maxFeePerGas: medium },
    high: { maxFeePerGas: 100n },
  }) as unknown as NetworkFee;

const evmToken = {
  type: TokenType.NATIVE,
  assetType: 'evm_native',
  coreChainId: 43114,
  symbol: 'AVAX',
  decimals: 18,
  balance: 10n ** 9n,
} as unknown as FungibleTokenBalance;

const btcToken = {
  type: TokenType.NATIVE,
  assetType: 'btc_native',
  coreChainId: 4503599627370475,
  symbol: 'BTC',
  decimals: 8,
  balance: 100_000n,
} as unknown as FungibleTokenBalance;

const xChainToken = {
  type: TokenType.NATIVE,
  assetType: 'avm_native',
  coreChainId: 4503599627370471,
  symbol: 'AVAX',
  decimals: 9,
  balance: 10n ** 9n,
} as unknown as FungibleTokenBalance;

const account = {
  addressBTC: 'bc1source',
  addressAVM: 'X-avax1',
  addressCoreEth: 'C-core1',
  addressPVM: 'P-avax1',
  addressC: '0xabc',
} as unknown as Account;

describe('useMaxAmountForTokenSend', () => {
  const getNetworkFee = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    const getNetwork = jest.fn().mockReturnValue({ chainId: 43114 });
    jest.mocked(getDefaultFeePreset).mockReturnValue('medium');
    jest.mocked(useNetworkContext).mockReturnValue({ getNetwork } as any);
    jest.mocked(useWalletContext).mockReturnValue({
      isLedgerWallet: false,
    } as any);
    jest.mocked(useSettingsContext).mockReturnValue({
      filterSmallUtxos: false,
    } as any);
    jest.mocked(useNetworkFeeContext).mockReturnValue({
      getNetworkFee,
    } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('recomputes the max amount when the polled fee refreshes', async () => {
    getNetworkFee
      .mockResolvedValueOnce(makeFee(2n))
      .mockResolvedValue(makeFee(5n));

    const { result } = renderHook(() =>
      useMaxAmountForTokenSend(account, evmToken),
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    expect(result.current.maxAmount).toBe(10n ** 9n - 2n * 21_000n);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(30_000);
    });
    expect(result.current.maxAmount).toBe(10n ** 9n - 5n * 21_000n);
    expect(result.current.networkFee).toEqual(makeFee(5n));
  });

  it('keeps the EVM max defined across a fee refresh', async () => {
    getNetworkFee
      .mockResolvedValueOnce(makeFee(2n))
      .mockResolvedValue(makeFee(5n));

    const seen: Array<bigint | undefined> = [];
    const { result } = renderHook(() => {
      const info = useMaxAmountForTokenSend(account, evmToken);
      seen.push(info.maxAmount);
      return info;
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    const firstDefined = seen.findIndex((v) => v !== undefined);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(30_000);
    });

    expect(result.current.maxAmount).toBe(10n ** 9n - 5n * 21_000n);
    expect(seen.slice(firstDefined).every((v) => v !== undefined)).toBe(true);
  });

  it('does not poll fees or re-run the X-Chain calculation on a timer', async () => {
    jest
      .mocked(getXChainMaxAmount)
      .mockResolvedValue({ maxAmount: 7n, estimatedFee: 1n });

    const { result } = renderHook(() =>
      useMaxAmountForTokenSend(account, xChainToken),
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    expect(result.current.maxAmount).toBe(7n);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(90_000);
    });

    expect(getNetworkFee).not.toHaveBeenCalled();
    expect(getXChainMaxAmount).toHaveBeenCalledTimes(1);
  });

  it('reserves the fee tier returned by getDefaultFeePreset', async () => {
    jest.mocked(getDefaultFeePreset).mockReturnValue('high');
    getNetworkFee.mockResolvedValue(makeFee(2n));

    const { result } = renderHook(() =>
      useMaxAmountForTokenSend(account, evmToken),
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });

    expect(result.current.maxAmount).toBe(10n ** 9n - 100n * 21_000n);
  });

  it('ignores a stale BTC result when the recipient changed meanwhile', async () => {
    getNetworkFee.mockResolvedValue(makeFee(2n));

    let resolveA: (v: {
      maxAmount: bigint;
      estimatedFee: bigint;
    }) => void = () => undefined;
    let resolveB: (v: {
      maxAmount: bigint;
      estimatedFee: bigint;
    }) => void = () => undefined;

    jest.mocked(getBtcMaxAmount).mockImplementation(
      (_fee, _token, _from, to) =>
        new Promise((resolve) => {
          if (to === 'recipientA') {
            resolveA = resolve;
          } else {
            resolveB = resolve;
          }
        }),
    );

    const { result, rerender } = renderHook(
      ({ to }) => useMaxAmountForTokenSend(account, btcToken, to),
      { initialProps: { to: 'recipientA' } },
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });

    rerender({ to: 'recipientB' });

    await act(async () => {
      resolveB({ maxAmount: 900n, estimatedFee: 10n });
    });
    await act(async () => {
      resolveA({ maxAmount: 100n, estimatedFee: 10n });
    });

    expect(result.current.maxAmount).toBe(900n);
  });

  it('keeps the BTC fee paired with the max it was computed for during a refresh', async () => {
    getNetworkFee
      .mockResolvedValueOnce(makeFee(2n))
      .mockResolvedValue(makeFee(5n));

    const resolvers: Array<
      (v: { maxAmount: bigint; estimatedFee: bigint }) => void
    > = [];
    jest.mocked(getBtcMaxAmount).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvers.push(resolve);
        }),
    );

    const { result } = renderHook(() =>
      useMaxAmountForTokenSend(account, btcToken, 'recipientA'),
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      resolvers[0]!({ maxAmount: 900n, estimatedFee: 20n });
    });
    expect(result.current.networkFee).toEqual(makeFee(2n));

    await act(async () => {
      await jest.advanceTimersByTimeAsync(30_000);
    });

    expect(result.current.maxAmount).toBe(900n);
    expect(result.current.networkFee).toEqual(makeFee(2n));

    await act(async () => {
      resolvers[1]!({ maxAmount: 800n, estimatedFee: 50n });
    });

    expect(result.current.maxAmount).toBe(800n);
    expect(result.current.networkFee).toEqual(makeFee(5n));
  });

  it('invalidates the previous BTC max while a new recipient is calculated', async () => {
    getNetworkFee.mockResolvedValue(makeFee(2n));

    const resolvers: Record<
      string,
      (v: { maxAmount: bigint; estimatedFee: bigint }) => void
    > = {};

    jest.mocked(getBtcMaxAmount).mockImplementation(
      (_fee, _token, _from, to) =>
        new Promise((resolve) => {
          resolvers[to] = resolve;
        }),
    );

    const { result, rerender } = renderHook(
      ({ to }) => useMaxAmountForTokenSend(account, btcToken, to),
      { initialProps: { to: 'recipientA' } },
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    expect(result.current.isCalculating).toBe(true);

    await act(async () => {
      resolvers.recipientA!({ maxAmount: 100n, estimatedFee: 10n });
    });
    expect(result.current.maxAmount).toBe(100n);
    expect(result.current.isCalculating).toBe(false);

    rerender({ to: 'recipientB' });

    expect(result.current.maxAmount).toBeUndefined();
    expect(result.current.estimatedFee).toBeUndefined();
    expect(result.current.isCalculating).toBe(true);

    await act(async () => {
      resolvers.recipientB!({ maxAmount: 900n, estimatedFee: 10n });
    });
    expect(result.current.maxAmount).toBe(900n);
    expect(result.current.isCalculating).toBe(false);
  });
});
