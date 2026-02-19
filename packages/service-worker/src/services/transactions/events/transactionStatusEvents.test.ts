import {
  TransactionStatusEvents as TransactionStatusEventNames,
  TransactionStatusInfo,
} from '@core/types';
import { BitcoinCaip2ChainId } from '@avalabs/core-chains-sdk';

import { TransactionStatusEvents } from './transactionStatusEvents';

describe('TransactionStatusEvents', () => {
  let transactionStatusEvents: TransactionStatusEvents;

  beforeEach(() => {
    transactionStatusEvents = new TransactionStatusEvents();
  });

  const makeRequest = (overrides = {}) => ({
    requestId: 'req-1',
    method: 'avalanche_sendTransaction',
    chainId: 'eip155:43114',
    context: {},
    ...overrides,
  });

  it('emits pending event', () => {
    const handler = jest.fn();
    transactionStatusEvents.addListener(handler);

    const txHash = '0xabc123';
    const request = makeRequest({ chainId: 'eip1555:43114' });

    transactionStatusEvents.emitPending(txHash, request as any);

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

    transactionStatusEvents.emitConfirmed(txHash, request as any);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      name: TransactionStatusEventNames.CONFIRMED,
      value: {
        txHash,
        request,
      } as TransactionStatusInfo,
    });
  });

  it('emits reverted event', () => {
    const handler = jest.fn();
    transactionStatusEvents.addListener(handler);

    const txHash = '0x789ghi';
    const request = makeRequest({ chainId: BitcoinCaip2ChainId.TESTNET });

    transactionStatusEvents.emitReverted(txHash, request as any);

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
