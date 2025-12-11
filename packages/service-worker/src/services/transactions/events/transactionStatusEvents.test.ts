import {
  TransactionStatusEvents as TransactionStatusEventNames,
  TransactionStatusInfo,
} from '@core/types';
import { ChainId } from '@avalabs/core-chains-sdk';

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
    const chainId = ChainId.AVALANCHE_MAINNET_ID;

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
    const chainId = ChainId.ETHEREUM_HOMESTEAD;

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
    const chainId = ChainId.BITCOIN_TESTNET;

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
