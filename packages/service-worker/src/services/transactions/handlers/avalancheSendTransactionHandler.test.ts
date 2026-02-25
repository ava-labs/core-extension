import { TransactionStatusEvents, TransactionStatusInfo } from '@core/types';
import { getAvalancheSendTransactionHandlers } from './avalancheSendTransactionHandler';

const mockMeasureDuration = {
  start: jest.fn(),
  end: jest.fn().mockReturnValue(100),
};

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  measureDuration: jest.fn(() => mockMeasureDuration),
  getAddressForChain: jest.fn(),
}));

const { getAddressForChain } = jest.requireMock('@core/common');

describe('getAvalancheSendTransactionHandlers', () => {
  const caipChainId = 'avax:Sj7NVE3jXTbJvwFAiu7OEUo_8g8ctXMG';
  const numericChainId = 43113;
  const txHash = '0xabc123';
  const addressC = '0xaddress';

  const mockAccountsService = {
    getAccountList: jest.fn().mockResolvedValue([{ addressC }]),
    getActiveAccount: jest.fn().mockResolvedValue({ addressC }),
  };

  const mockNetworkService = {
    getNetwork: jest.fn().mockResolvedValue({ chainId: numericChainId }),
  };

  const handlers = getAvalancheSendTransactionHandlers(
    mockAccountsService as any,
    mockNetworkService as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockMeasureDuration.end.mockReturnValue(100);
    mockAccountsService.getAccountList.mockResolvedValue([{ addressC }]);
    mockAccountsService.getActiveAccount.mockResolvedValue({ addressC });
    mockNetworkService.getNetwork.mockResolvedValue({
      chainId: numericChainId,
    });
    getAddressForChain.mockReturnValue(addressC);
  });

  const makeEvent = (name: string, value: Partial<TransactionStatusInfo>) => ({
    name,
    value: {
      txHash,
      request: {
        chainId: caipChainId,
        method: 'avalanche_sendTransaction',
        context: { account: { evmAddress: addressC } },
      },
      ...value,
    },
  });

  describe('PENDING handler', () => {
    it('resolves network chainId and returns success event', async () => {
      const handler = handlers[TransactionStatusEvents.PENDING]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.PENDING, {}) as any,
      );

      expect(mockNetworkService.getNetwork).toHaveBeenCalledWith(caipChainId);
      expect(mockMeasureDuration.start).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_success',
        properties: {
          address: addressC,
          txHash,
          chainId: numericChainId,
        },
      });
    });
  });

  describe('REVERTED handler', () => {
    it('resolves network chainId and returns failed event', async () => {
      const handler = handlers[TransactionStatusEvents.REVERTED]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.REVERTED, {}) as any,
      );

      expect(mockNetworkService.getNetwork).toHaveBeenCalledWith(caipChainId);
      expect(mockMeasureDuration.end).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_failed',
        properties: {
          address: addressC,
          txHash,
          chainId: numericChainId,
        },
      });
    });
  });

  describe('CONFIRMED handler', () => {
    it('resolves network chainId and returns confirmed event with duration', async () => {
      const handler = handlers[TransactionStatusEvents.CONFIRMED]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.CONFIRMED, {}) as any,
      );

      expect(mockNetworkService.getNetwork).toHaveBeenCalledWith(caipChainId);
      expect(mockMeasureDuration.end).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'avalanche_sendTransaction_confirmed',
        properties: {
          address: addressC,
          txHash,
          chainId: numericChainId,
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
      getAddressForChain.mockReturnValue('');

      const handler = handlers[TransactionStatusEvents.PENDING]!;
      const event = makeEvent(TransactionStatusEvents.PENDING, {});
      (event.value as any).request.context = {};

      const result = await handler(event as any);

      expect(result?.properties.address).toBe('');
    });
  });
});
