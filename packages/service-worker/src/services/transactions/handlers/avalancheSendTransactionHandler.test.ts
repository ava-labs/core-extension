import { RpcMethod } from '@avalabs/vm-module-types';
import { TransactionStatusEvents, TransactionStatusInfo } from '@core/types';
import { avalancheSendTransactionHandler } from './avalancheSendTransactionHandler';

const mockMeasureDuration = {
  start: jest.fn(),
  end: jest.fn().mockReturnValue(100),
};

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  measureDuration: jest.fn(() => mockMeasureDuration),
}));

describe('avalancheSendTransactionHandler', () => {
  const chainId = 'eip155:43114';
  const txHash = '0xabc123';
  const address = '0xaddress';

  let analyticsServicePosthog: { captureEncryptedEvent: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    analyticsServicePosthog = { captureEncryptedEvent: jest.fn() };
    mockMeasureDuration.end.mockReturnValue(100);
  });

  const makeEvent = (
    name: TransactionStatusEvents,
    value: Partial<TransactionStatusInfo>,
  ) => ({
    name,
    value: {
      txHash,
      chainId,
      method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
      accountAddress: address,
      ...value,
    },
  });

  it('captures avalanche_sendTransaction_confirmed for CONFIRMED event', async () => {
    await avalancheSendTransactionHandler({
      analyticsServicePosthog: analyticsServicePosthog as any,
      event: makeEvent(TransactionStatusEvents.CONFIRMED, {}),
    });

    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'avalanche_sendTransaction_confirmed',
        properties: { address, txHash, chainId, duration: 100 },
      }),
    );
  });

  it('does not capture when method is not avalanche_sendTransaction', async () => {
    await avalancheSendTransactionHandler({
      analyticsServicePosthog: analyticsServicePosthog as any,
      event: makeEvent(TransactionStatusEvents.PENDING, {
        method: 'eth_sendTransaction',
      }),
    });

    expect(
      analyticsServicePosthog.captureEncryptedEvent,
    ).not.toHaveBeenCalled();
  });

  it('does not capture when value is missing', async () => {
    await avalancheSendTransactionHandler({
      analyticsServicePosthog: analyticsServicePosthog as any,
      event: {
        name: TransactionStatusEvents.PENDING,
        value: undefined as any,
      },
    });

    expect(
      analyticsServicePosthog.captureEncryptedEvent,
    ).not.toHaveBeenCalled();
  });

  it('does not capture when accountAddress is missing', async () => {
    await avalancheSendTransactionHandler({
      analyticsServicePosthog: analyticsServicePosthog as any,
      event: makeEvent(TransactionStatusEvents.PENDING, {
        accountAddress: '',
      }),
    });

    expect(
      analyticsServicePosthog.captureEncryptedEvent,
    ).not.toHaveBeenCalled();
  });

  it('captures avalanche_sendTransaction_success for PENDING with avalanche_sendTransaction method', async () => {
    await avalancheSendTransactionHandler({
      analyticsServicePosthog: analyticsServicePosthog as any,
      event: makeEvent(TransactionStatusEvents.PENDING, {}),
    });

    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'avalanche_sendTransaction_success',
        properties: { address, txHash, chainId },
      }),
    );
    expect(mockMeasureDuration.start).toHaveBeenCalled();
  });

  it('captures avalanche_sendTransaction_failed for REVERTED with avalanche_sendTransaction method', async () => {
    await avalancheSendTransactionHandler({
      analyticsServicePosthog: analyticsServicePosthog as any,
      event: makeEvent(TransactionStatusEvents.REVERTED, {}),
    });

    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledTimes(
      1,
    );
    expect(analyticsServicePosthog.captureEncryptedEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'avalanche_sendTransaction_failed',
        properties: { address, txHash, chainId },
      }),
    );
    expect(mockMeasureDuration.end).toHaveBeenCalled();
  });
});
