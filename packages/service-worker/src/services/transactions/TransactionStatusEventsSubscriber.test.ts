import { TransactionStatusEvents } from '@core/types';
import { RpcMethod } from '@avalabs/vm-module-types';
import { TransactionStatusEvents as TransactionStatusEventsClass } from './events/transactionStatusEvents';
import { TransactionStatusEventsSubscriber } from './TransactionStatusEventsSubscriber';

const mockBuilderResult = {
  name: 'avalanche_sendTransaction_success',
  properties: { txHash: '0xabc', chainId: 43114 },
};

jest.mock('./handlers/avalancheSendTransactionHandler', () => ({
  getAvalancheSendTransactionHandlers: jest.fn(() => ({
    [TransactionStatusEvents.PENDING]: jest.fn(() =>
      Promise.resolve(mockBuilderResult),
    ),
  })),
  TransactionStatusEventBuilders: {},
}));

const { getAvalancheSendTransactionHandlers } = jest.requireMock(
  './handlers/avalancheSendTransactionHandler',
);

describe('TransactionStatusEventsSubscriber', () => {
  let transactionStatusEvents: TransactionStatusEventsClass;
  let addListenerSpy: jest.SpyInstance;
  let mockAnalytics: { captureEncryptedEvent: jest.Mock };
  let mockAccountsService: { getAccountList: jest.Mock };
  let mockNetworkService: { getNetwork: jest.Mock };

  const makeRequest = (method: string) => ({
    requestId: 'req-1',
    method,
    chainId: 'eip155:43114',
    context: {},
  });

  beforeEach(() => {
    jest.clearAllMocks();
    transactionStatusEvents = new TransactionStatusEventsClass();
    addListenerSpy = jest.spyOn(transactionStatusEvents, 'addListener');
    mockAnalytics = { captureEncryptedEvent: jest.fn() };
    mockAccountsService = { getAccountList: jest.fn() };
    mockNetworkService = { getNetwork: jest.fn() };
  });

  it('registers listener on transaction status events in constructor', () => {
    new TransactionStatusEventsSubscriber(
      transactionStatusEvents,
      mockAnalytics as any,
      mockAccountsService as any,
      mockNetworkService as any,
    );

    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(typeof addListenerSpy.mock.calls[0][0]).toBe('function');
  });

  it('initializes handlers via getAvalancheSendTransactionHandlers', () => {
    new TransactionStatusEventsSubscriber(
      transactionStatusEvents,
      mockAnalytics as any,
      mockAccountsService as any,
      mockNetworkService as any,
    );

    expect(getAvalancheSendTransactionHandlers).toHaveBeenCalledWith(
      mockAccountsService,
      mockNetworkService,
    );
  });

  it('calls the matching handler and captures the analytics event', async () => {
    new TransactionStatusEventsSubscriber(
      transactionStatusEvents,
      mockAnalytics as any,
      mockAccountsService as any,
      mockNetworkService as any,
    );

    transactionStatusEvents.emitPending(
      '0xabc',
      makeRequest(RpcMethod.AVALANCHE_SEND_TRANSACTION) as any,
    );

    await new Promise(process.nextTick);

    const handlers = getAvalancheSendTransactionHandlers.mock.results[0].value;
    expect(handlers[TransactionStatusEvents.PENDING]).toHaveBeenCalledTimes(1);

    expect(mockAnalytics.captureEncryptedEvent).toHaveBeenCalledTimes(1);
    expect(mockAnalytics.captureEncryptedEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'avalanche_sendTransaction_success',
        properties: { txHash: '0xabc', chainId: 43114 },
      }),
    );
  });

  it('does not capture when no handler matches', async () => {
    new TransactionStatusEventsSubscriber(
      transactionStatusEvents,
      mockAnalytics as any,
      mockAccountsService as any,
      mockNetworkService as any,
    );

    transactionStatusEvents.emitConfirmed(
      '0xabc',
      makeRequest('eth_sendTransaction') as any,
    );

    await new Promise(process.nextTick);

    expect(mockAnalytics.captureEncryptedEvent).not.toHaveBeenCalled();
  });
});
