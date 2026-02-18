import { TransactionStatusEvents, TransactionStatusInfo } from '@core/types';
import { TransactionStatusEvents as TransactionStatusEventsClass } from './events/transactionStatusEvents';
import { TransactionStatusEventsSubscriber } from './TransactionStatusEventsSubscriber';
import { avalancheSendTransactionHandler } from './handlers/avalancheSendTransactionHandler';

jest.mock('./handlers/avalancheSendTransactionHandler');

describe('TransactionStatusEventsSubscriber', () => {
  let transactionStatusEvents: TransactionStatusEventsClass;
  let addListenerSpy: jest.SpyInstance;
  let mockAnalytics: { captureEncryptedEvent: jest.Mock };

  beforeEach(() => {
    jest.resetAllMocks();
    transactionStatusEvents = new TransactionStatusEventsClass();
    addListenerSpy = jest.spyOn(transactionStatusEvents, 'addListener');
    mockAnalytics = { captureEncryptedEvent: jest.fn() };
  });

  it('registers listener on transaction status events in constructor', () => {
    new TransactionStatusEventsSubscriber(
      transactionStatusEvents,
      mockAnalytics as any,
    );

    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(typeof addListenerSpy.mock.calls[0][0]).toBe('function');
  });

  it('calls avalancheSendTransactionHandler with context and event when status event is emitted', () => {
    new TransactionStatusEventsSubscriber(
      transactionStatusEvents,
      mockAnalytics as any,
    );

    const event: {
      name: TransactionStatusEvents;
      value: TransactionStatusInfo;
    } = {
      name: TransactionStatusEvents.PENDING,
      value: {
        txHash: '0xabc',
        chainId: 'eip155:43114',
        method: 'avalanche_sendTransaction',
        accountAddress: '0xaccount',
      },
    };

    transactionStatusEvents.emitPending(
      event.value.txHash,
      event.value.chainId,
      event.value.method,
      event.value.accountAddress,
    );

    expect(avalancheSendTransactionHandler).toHaveBeenCalledTimes(1);
    expect(avalancheSendTransactionHandler).toHaveBeenCalledWith({
      analyticsServicePosthog: mockAnalytics,
      event: expect.objectContaining({
        name: event.name,
        value: expect.objectContaining({
          txHash: event.value.txHash,
          chainId: event.value.chainId,
          method: event.value.method,
        }),
      }),
    });
  });
});
