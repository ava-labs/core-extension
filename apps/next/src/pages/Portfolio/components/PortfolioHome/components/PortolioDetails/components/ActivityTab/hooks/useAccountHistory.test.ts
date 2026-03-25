import { renderHook, waitFor } from '@testing-library/react';
import {
  NetworkVMType,
  TokenType,
  TransactionType,
} from '@avalabs/vm-module-types';
import { TxHistoryItem } from '@core/types';
import { useWalletContext } from '@core/ui';

import { useAccountHistory } from './useAccountHistory';

jest.mock('@core/ui');

function createDeferred<T>() {
  let resolvePromise!: (value: T) => void;
  let rejectPromise!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return { promise, resolve: resolvePromise, reject: rejectPromise };
}

function historyPromiseForAbortSignal(
  deferred: ReturnType<typeof createDeferred<TxHistoryItem[]>>,
  signal: AbortSignal | undefined,
): Promise<TxHistoryItem[]> {
  if (signal?.aborted) {
    return Promise.reject(
      new DOMException('The operation was aborted.', 'AbortError'),
    );
  }

  if (!signal) {
    return deferred.promise;
  }

  const onAbort = () => {
    deferred.reject(
      new DOMException('The operation was aborted.', 'AbortError'),
    );
  };
  signal.addEventListener('abort', onAbort);

  return deferred.promise.finally(() => {
    signal.removeEventListener('abort', onAbort);
  });
}

function txWithHash(hash: string): TxHistoryItem {
  return {
    bridgeAnalysis: { isBridgeTx: false },
    isContractCall: false,
    isIncoming: true,
    isOutgoing: false,
    isSender: false,
    timestamp: 1,
    hash,
    from: 'from',
    to: 'to',
    tokens: [
      {
        name: 't',
        symbol: 'T',
        amount: '1',
        type: TokenType.NATIVE,
      },
    ],
    gasUsed: '0',
    explorerLink: 'x',
    chainId: '1',
    txType: TransactionType.RECEIVE,
    vmType: NetworkVMType.EVM,
  };
}

describe('useAccountHistory', () => {
  const getTransactionHistory = jest.fn<
    Promise<TxHistoryItem[]>,
    [networkId?: number, options?: { signal?: AbortSignal }]
  >();

  beforeEach(() => {
    getTransactionHistory.mockReset();
    jest.mocked(useWalletContext).mockReturnValue({
      isWalletLoading: false,
      isWalletLocked: false,
      isLedgerWallet: false,
      isKeystoneUsbWallet: false,
      walletDetails: undefined,
      wallets: [],
      changeWalletPassword: jest.fn(),
      getWallet: jest.fn(),
      getUnencryptedMnemonic: jest.fn(),
      renameWallet: jest.fn(),
      getTransactionHistory,
    });
  });

  it('loads transaction history for the selected network', async () => {
    const txs = [txWithHash('0xaa')];
    getTransactionHistory.mockResolvedValueOnce(txs);

    const { result } = renderHook(() => useAccountHistory(1));

    expect(result.current).toBeNull();

    await waitFor(() => {
      expect(result.current).toEqual(txs);
    });

    expect(getTransactionHistory).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        signal: expect.objectContaining({ aborted: expect.any(Boolean) }),
      }),
    );
  });

  it('does not apply a fetch that completes after the network has changed', async () => {
    const first = createDeferred<TxHistoryItem[]>();
    const second = createDeferred<TxHistoryItem[]>();

    getTransactionHistory
      .mockImplementationOnce((_networkId, options) =>
        historyPromiseForAbortSignal(first, options?.signal),
      )
      .mockImplementationOnce((_networkId, options) =>
        historyPromiseForAbortSignal(second, options?.signal),
      );

    const { result, rerender } = renderHook(
      ({ chainId }: { chainId: number }) => useAccountHistory(chainId),
      { initialProps: { chainId: 1 } },
    );

    expect(getTransactionHistory).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        signal: expect.objectContaining({ aborted: expect.any(Boolean) }),
      }),
    );

    rerender({ chainId: 2 });

    expect(result.current).toBeNull();
    expect(getTransactionHistory).toHaveBeenCalledWith(
      2,
      expect.objectContaining({
        signal: expect.objectContaining({ aborted: expect.any(Boolean) }),
      }),
    );

    const staleForChain1 = [txWithHash('0xstale')];
    const freshForChain2 = [txWithHash('0xfresh')];

    first.resolve(staleForChain1);

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    second.resolve(freshForChain2);

    await waitFor(() => {
      expect(result.current).toEqual(freshForChain2);
    });
  });
});
