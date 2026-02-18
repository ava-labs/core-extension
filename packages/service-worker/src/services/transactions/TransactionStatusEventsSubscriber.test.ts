import { TransactionStatusEvents } from '@core/types';
import { TransactionStatusEvents as TransactionStatusEventsClass } from './events/transactionStatusEvents';
import { TransactionStatusEventsSubscriber } from './TransactionStatusEventsSubscriber';

jest.mock('./handlers/TransactionStatusEventsHandlers', () => ({
  TransactionStatusEventsHandlers: {
    avalanche_sendTransaction: {
      [TransactionStatusEvents.PENDING]: jest.fn(() => ({
        name: 'avalanche_sendTransaction_success',
        properties: { txHash: '0xabc', chainId: 'eip155:43114' },
      })),
    },
  },
}));

const { TransactionStatusEventsHandlers } = jest.requireMock(
  './handlers/TransactionStatusEventsHandlers',
);

describe('TransactionStatusEventsSubscriber', () => {
  let transactionStatusEvents: TransactionStatusEventsClass;
  let addListenerSpy: jest.SpyInstance;
  let mockAnalytics: { captureEncryptedEvent: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('calls the matching handler and captures the analytics event', () => {
    new TransactionStatusEventsSubscriber(
      transactionStatusEvents,
      mockAnalytics as any,
    );

    transactionStatusEvents.emitPending(
      '0xabc',
      'eip155:43114',
      'avalanche_sendTransaction',
      '0xaccount',
    );

    const pendingHandler =
      TransactionStatusEventsHandlers['avalanche_sendTransaction'][
        TransactionStatusEvents.PENDING
      ];
    expect(pendingHandler).toHaveBeenCalledTimes(1);

    expect(mockAnalytics.captureEncryptedEvent).toHaveBeenCalledTimes(1);
    expect(mockAnalytics.captureEncryptedEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'avalanche_sendTransaction_success',
        properties: { txHash: '0xabc', chainId: 'eip155:43114' },
      }),
    );
  });

  it('does not capture when no handler matches', () => {
    new TransactionStatusEventsSubscriber(
      transactionStatusEvents,
      mockAnalytics as any,
    );

    transactionStatusEvents.emitConfirmed(
      '0xabc',
      'eip155:43114',
      'eth_sendTransaction',
      '0xaccount',
    );

    expect(mockAnalytics.captureEncryptedEvent).not.toHaveBeenCalled();
  });
});
