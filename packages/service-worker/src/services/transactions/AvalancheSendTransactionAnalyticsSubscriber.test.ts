import { RpcMethod } from '@avalabs/vm-module-types';

import { getAddressForChain } from '@core/common';
import { AccountsService } from '../accounts/AccountsService';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';
import { NetworkService } from '../network/NetworkService';
import { AvalancheSendTransactionAnalyticsSubscriber } from './AvalancheSendTransactionAnalyticsSubscriber';
import { TransactionStatusEvents } from './events/transactionStatusEvents';

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getAddressForChain: jest.fn(),
}));

describe('AvalancheSendTransactionAnalyticsSubscriber', () => {
  let transactionStatusEvents: TransactionStatusEvents;
  let analyticsServicePosthog: jest.Mocked<AnalyticsServicePosthog>;
  let accountsService: jest.Mocked<AccountsService>;
  let networkService: jest.Mocked<NetworkService>;

  const txHash = '0xabc123';
  const chainId = 'eip155:43114';
  const address = '0xuser';

  beforeEach(() => {
    jest.clearAllMocks();
    transactionStatusEvents = new TransactionStatusEvents();

    analyticsServicePosthog = {
      captureEncryptedEvent: jest.fn(),
    } as any;

    accountsService = {
      getActiveAccount: jest.fn().mockResolvedValue({}),
    } as any;

    networkService = {
      getNetwork: jest.fn().mockResolvedValue({ chainId }),
    } as any;

    jest.mocked(getAddressForChain).mockReturnValue(address);
  });

  it('captures avalanche_sendTransaction_success when PENDING is emitted with AVALANCHE_SEND_TRANSACTION method', async () => {
    new AvalancheSendTransactionAnalyticsSubscriber(
      transactionStatusEvents,
      analyticsServicePosthog,
      accountsService,
      networkService,
    );

    transactionStatusEvents.emitPending(txHash, chainId, {
      method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
      requestId: 'req-1',
    });

    await new Promise(process.nextTick);

    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledWith({
      name: 'avalanche_sendTransaction_success',
      windowId: expect.any(String),
      properties: {
        address,
        txHash,
        chainId,
      },
    });
  });

  it('captures avalanche_sendTransaction_failed when REVERTED is emitted with AVALANCHE_SEND_TRANSACTION method', async () => {
    new AvalancheSendTransactionAnalyticsSubscriber(
      transactionStatusEvents,
      analyticsServicePosthog,
      accountsService,
      networkService,
    );

    transactionStatusEvents.emitReverted(txHash, chainId, {
      method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
      requestId: 'req-1',
    });

    await new Promise(process.nextTick);

    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledWith({
      name: 'avalanche_sendTransaction_failed',
      windowId: expect.any(String),
      properties: {
        address,
        txHash,
        chainId,
      },
    });
  });

  it('does not capture when event is CONFIRMED', async () => {
    new AvalancheSendTransactionAnalyticsSubscriber(
      transactionStatusEvents,
      analyticsServicePosthog,
      accountsService,
      networkService,
    );

    transactionStatusEvents.emitConfirmed(txHash, chainId, {
      method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
    });

    await new Promise(process.nextTick);

    expect(
      analyticsServicePosthog.captureEncryptedEvent,
    ).not.toHaveBeenCalled();
  });

  it('does not capture when method is not AVALANCHE_SEND_TRANSACTION', async () => {
    new AvalancheSendTransactionAnalyticsSubscriber(
      transactionStatusEvents,
      analyticsServicePosthog,
      accountsService,
      networkService,
    );

    transactionStatusEvents.emitPending(txHash, chainId, {
      method: RpcMethod.ETH_SEND_TRANSACTION,
      requestId: 'req-1',
    });

    await new Promise(process.nextTick);

    expect(
      analyticsServicePosthog.captureEncryptedEvent,
    ).not.toHaveBeenCalled();
  });

  it('does not capture when context is missing', async () => {
    new AvalancheSendTransactionAnalyticsSubscriber(
      transactionStatusEvents,
      analyticsServicePosthog,
      accountsService,
      networkService,
    );

    transactionStatusEvents.emitPending(txHash, chainId);

    await new Promise(process.nextTick);

    expect(
      analyticsServicePosthog.captureEncryptedEvent,
    ).not.toHaveBeenCalled();
  });

  it('does not capture when getAddressForChain returns empty string', async () => {
    jest.mocked(getAddressForChain).mockReturnValue('');

    new AvalancheSendTransactionAnalyticsSubscriber(
      transactionStatusEvents,
      analyticsServicePosthog,
      accountsService,
      networkService,
    );

    transactionStatusEvents.emitPending(txHash, chainId, {
      method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
      requestId: 'req-1',
    });

    await new Promise(process.nextTick);

    expect(
      analyticsServicePosthog.captureEncryptedEvent,
    ).not.toHaveBeenCalled();
  });

  it('subscribes to TransactionStatusEvents on construction', () => {
    const addListenerSpy = jest.spyOn(transactionStatusEvents, 'addListener');

    new AvalancheSendTransactionAnalyticsSubscriber(
      transactionStatusEvents,
      analyticsServicePosthog,
      accountsService,
      networkService,
    );

    expect(addListenerSpy).toHaveBeenCalledTimes(1);
  });
});
