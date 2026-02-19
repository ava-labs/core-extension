import { TransactionStatusEvents, TransactionStatusInfo } from '@core/types';
import { getAvalancheSendTransactionHandlers } from './avalancheSendTransactionHandler';

const mockMeasureDuration = {
  start: jest.fn(),
  end: jest.fn().mockReturnValue(100),
};

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  measureDuration: jest.fn(() => mockMeasureDuration),
}));

describe('getAvalancheSendTransactionHandlers', () => {
  const chainId = 'eip155:43114';
  const txHash = '0xabc123';
  const addressC = '0xaddress';

  const mockAccountsService = {
    getAccountList: jest.fn().mockResolvedValue([{ addressC }]),
    getActiveAccount: jest.fn().mockResolvedValue({ addressC }),
  };

  const handlers = getAvalancheSendTransactionHandlers(
    mockAccountsService as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockMeasureDuration.end.mockReturnValue(100);
    mockAccountsService.getAccountList.mockResolvedValue([{ addressC }]);
    mockAccountsService.getActiveAccount.mockResolvedValue({ addressC });
  });

  const makeEvent = (name: string, value: Partial<TransactionStatusInfo>) => ({
    name,
    value: {
      txHash,
      request: {
        chainId,
        method: 'avalanche_sendTransaction',
        context: { account: { evmAddress: addressC } },
      },
      ...value,
    },
  });

  describe('PENDING handler', () => {
    it('starts duration measurement and returns success event', async () => {
      const handler = handlers[TransactionStatusEvents.PENDING]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.PENDING, {}) as any,
      );

      expect(mockMeasureDuration.start).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_success',
        properties: { address: addressC, txHash, chainId },
      });
    });
  });

  describe('REVERTED handler', () => {
    it('ends duration measurement and returns failed event', async () => {
      const handler = handlers[TransactionStatusEvents.REVERTED]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.REVERTED, {}) as any,
      );

      expect(mockMeasureDuration.end).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_failed',
        properties: { address: addressC, txHash, chainId },
      });
    });
  });

  describe('CONFIRMED handler', () => {
    it('ends duration measurement and returns confirmed event with duration', async () => {
      const handler = handlers[TransactionStatusEvents.CONFIRMED]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.CONFIRMED, {}) as any,
      );

      expect(mockMeasureDuration.end).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_confirmed',
        properties: {
          address: addressC,
          txHash,
          chainId,
          duration: 100,
        },
      });
    });
  });

  describe('account resolution', () => {
    it('uses active account as fallback when evmAddress matches but account not in list', async () => {
      mockAccountsService.getAccountList.mockResolvedValue([]);

      const handler = handlers[TransactionStatusEvents.PENDING]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.PENDING, {}) as any,
      );

      expect(mockAccountsService.getActiveAccount).toHaveBeenCalled();
      expect(result?.properties.address).toBe(addressC);
    });

    it('returns empty address when no account is found', async () => {
      mockAccountsService.getAccountList.mockResolvedValue([]);
      mockAccountsService.getActiveAccount.mockResolvedValue(undefined);

      const handler = handlers[TransactionStatusEvents.PENDING]!;
      const event = makeEvent(TransactionStatusEvents.PENDING, {});
      (event.value as any).request.context = {};

      const result = await handler(event as any);

      expect(result?.properties.address).toBe('');
    });
  });
});
