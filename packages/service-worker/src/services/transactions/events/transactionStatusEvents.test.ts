import {
  TransactionStatusEvents as TransactionStatusEventNames,
  TransactionStatusInfo,
} from '@core/types';
import { BitcoinCaip2ChainId } from '@avalabs/core-chains-sdk';
import { RpcMethod, RpcRequest } from '@avalabs/vm-module-types';

import { TransactionStatusEvents } from './transactionStatusEvents';

describe('TransactionStatusEvents', () => {
  let transactionStatusEvents: TransactionStatusEvents;

  beforeEach(() => {
    transactionStatusEvents = new TransactionStatusEvents();
  });

  const makeRequest = (overrides: Partial<RpcRequest> = {}): RpcRequest => ({
    requestId: 'req-1',
    sessionId: 'session-1',
    method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
    chainId: 'eip155:43114',
    params: undefined,
    dappInfo: { name: 'test-dapp', url: 'https://test.com', icon: '' },
    context: {},
    ...overrides,
  });

  it('emits pending event', () => {
    const handler = jest.fn();
    transactionStatusEvents.addListener(handler);

    const txHash = '0xabc123';
    const request = makeRequest({ chainId: 'eip1555:43114' });

    transactionStatusEvents.emitPending(txHash, request);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      name: TransactionStatusEventNames.PENDING,
      value: {
        txHash,
        request,
      } as TransactionStatusInfo,
    });
  });

  it('emits confirmed event', () => {
    const handler = jest.fn();
    transactionStatusEvents.addListener(handler);

    const txHash = '0xdef456';
    const request = makeRequest({ chainId: 'eip155:1' });
    const explorerLink = 'https://explorer.avax.network/tx/0xdef456';

    transactionStatusEvents.emitConfirmed(txHash, request, explorerLink);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      name: TransactionStatusEventNames.CONFIRMED,
      value: {
        txHash,
        request,
        explorerLink,
      } as TransactionStatusInfo,
    });
  });

  it('emits reverted event', () => {
    const handler = jest.fn();
    transactionStatusEvents.addListener(handler);

    const txHash = '0x789ghi';
    const request = makeRequest({ chainId: BitcoinCaip2ChainId.TESTNET });

    transactionStatusEvents.emitReverted(txHash, request);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      name: TransactionStatusEventNames.REVERTED,
      value: {
        txHash,
        request,
      } as TransactionStatusInfo,
    });
  });
});
