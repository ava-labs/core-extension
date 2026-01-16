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

  it('emits pending event', () => {
    const handler = jest.fn();
    transactionStatusEvents.addListener(handler);

    const txHash = '0xabc123';
    const chainId = 'eip1555:43114';

    transactionStatusEvents.emitPending(txHash, chainId);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      name: TransactionStatusEventNames.PENDING,
      value: {
        txHash,
        chainId,
        context: undefined,
      } as TransactionStatusInfo,
    });
  });

  it('emits confirmed event', () => {
    const handler = jest.fn();
    transactionStatusEvents.addListener(handler);

    const txHash = '0xdef456';
    const chainId = 'eip155:1';

    transactionStatusEvents.emitConfirmed(txHash, chainId);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      name: TransactionStatusEventNames.CONFIRMED,
      value: {
        txHash,
        chainId,
        context: undefined,
      } as TransactionStatusInfo,
    });
  });

  it('emits reverted event', () => {
    const handler = jest.fn();
    transactionStatusEvents.addListener(handler);

    const txHash = '0x789ghi';
    const chainId = BitcoinCaip2ChainId.TESTNET;

    transactionStatusEvents.emitReverted(txHash, chainId);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      name: TransactionStatusEventNames.REVERTED,
      value: {
        txHash,
        chainId,
        context: undefined,
      } as TransactionStatusInfo,
    });
  });
});
