import { TransactionStatusEvents, TransactionStatusInfo } from '@core/types';
import { AvalancheSendTransactionHandlers } from './avalancheSendTransactionHandler';

const mockMeasureDuration = {
  start: jest.fn(),
  end: jest.fn().mockReturnValue(100),
};

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  measureDuration: jest.fn(() => mockMeasureDuration),
}));

describe('AvalancheSendTransactionHandlers', () => {
  const chainId = 'eip155:43114';
  const txHash = '0xabc123';
  const accountAddress = '0xaddress';

  beforeEach(() => {
    jest.clearAllMocks();
    mockMeasureDuration.end.mockReturnValue(100);
  });

  const makeEvent = (name: string, value: Partial<TransactionStatusInfo>) => ({
    name,
    value: {
      txHash,
      chainId,
      method: 'avalanche_sendTransaction',
      accountAddress,
      ...value,
    },
  });

  describe('PENDING handler', () => {
    const handler =
      AvalancheSendTransactionHandlers[TransactionStatusEvents.PENDING]!;

    it('starts duration measurement and returns success event', () => {
      const result = handler(
        makeEvent(TransactionStatusEvents.PENDING, {}) as any,
      );

      expect(mockMeasureDuration.start).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_success',
        properties: { address: accountAddress, txHash, chainId },
      });
    });
  });

  describe('REVERTED handler', () => {
    const handler =
      AvalancheSendTransactionHandlers[TransactionStatusEvents.REVERTED]!;

    it('ends duration measurement and returns failed event', () => {
      const result = handler(
        makeEvent(TransactionStatusEvents.REVERTED, {}) as any,
      );

      expect(mockMeasureDuration.end).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_failed',
        properties: { address: accountAddress, txHash, chainId },
      });
    });
  });

  describe('CONFIRMED handler', () => {
    const handler =
      AvalancheSendTransactionHandlers[TransactionStatusEvents.CONFIRMED]!;

    it('ends duration measurement and returns confirmed event with duration', () => {
      const result = handler(
        makeEvent(TransactionStatusEvents.CONFIRMED, {}) as any,
      );

      expect(mockMeasureDuration.end).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_confirmed',
        properties: {
          address: accountAddress,
          txHash,
          chainId,
          duration: 100,
        },
      });
    });
  });
});
