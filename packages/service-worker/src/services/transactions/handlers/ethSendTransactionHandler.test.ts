import { TransactionStatusEvents, TransactionStatusInfo } from '@core/types';
import { RpcMethod } from '@avalabs/vm-module-types';
import { EercOperation } from '@avalabs/evm-module';

import { getEthSendTransactionHandlers } from './ethSendTransactionHandler';

const mockMeasureDuration = {
  start: jest.fn(),
  end: jest.fn().mockReturnValue(100),
};

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  measureDuration: jest.fn(() => mockMeasureDuration),
}));

jest.mock('@avalabs/evm-module', () => ({
  ...jest.requireActual('@avalabs/evm-module'),
  parseEercTransaction: jest.fn(),
}));

const { parseEercTransaction } = jest.requireMock('@avalabs/evm-module');

describe('getEthSendTransactionHandlers', () => {
  const caipChainId = 'eip155:43114';
  const txHash = '0xabc123';
  const from = '0xaddress';
  const dAppUrl = 'https://encryptederc.com';

  const handlers = getEthSendTransactionHandlers();

  beforeEach(() => {
    jest.clearAllMocks();
    mockMeasureDuration.end.mockReturnValue(100);
    parseEercTransaction.mockReturnValue(undefined);
  });

  const makeEvent = (
    name: string,
    value: Partial<TransactionStatusInfo> = {},
  ) =>
    ({
      name,
      value: {
        txHash,
        request: {
          method: RpcMethod.ETH_SEND_TRANSACTION,
          chainId: caipChainId,
          dappInfo: { url: dAppUrl },
          params: [{ from, data: '0x', value: '0x0' }],
        },
        ...value,
      },
    }) as any;

  describe('PENDING handler', () => {
    it('starts the timer and returns success event', async () => {
      const handler = handlers[TransactionStatusEvents.PENDING]!;
      const result = await handler(makeEvent(TransactionStatusEvents.PENDING));

      expect(mockMeasureDuration.start).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'eth_sendTransaction_success',
        properties: {
          dAppUrl,
          address: from,
          txHash,
          chainId: caipChainId,
          privacy: undefined,
        },
      });
    });
  });

  describe('REVERTED handler', () => {
    it('stops the timer and returns failed event', async () => {
      const handler = handlers[TransactionStatusEvents.REVERTED]!;
      const result = await handler(makeEvent(TransactionStatusEvents.REVERTED));

      expect(mockMeasureDuration.end).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'eth_sendTransaction_failed',
        properties: {
          dAppUrl,
          address: from,
          txHash,
          chainId: caipChainId,
          privacy: undefined,
        },
      });
    });
  });

  describe('CONFIRMED handler', () => {
    it('returns confirmed event with duration', async () => {
      const handler = handlers[TransactionStatusEvents.CONFIRMED]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.CONFIRMED),
      );

      expect(mockMeasureDuration.end).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'eth_sendTransaction_confirmed',
        properties: {
          dAppUrl,
          address: from,
          txHash,
          chainId: caipChainId,
          duration: 100,
          privacy: undefined,
        },
      });
    });
  });

  describe('privacy data', () => {
    it('includes eerc20 privacy data when the transaction is an eERC operation', async () => {
      parseEercTransaction.mockReturnValue({
        operation: EercOperation.TRANSFER,
      });

      const handler = handlers[TransactionStatusEvents.PENDING]!;
      const result = await handler(makeEvent(TransactionStatusEvents.PENDING));

      expect(result?.properties.privacy).toEqual({
        type: 'eerc20',
        operation: EercOperation.TRANSFER,
      });
    });

    it('omits privacy data for non-eERC transactions', async () => {
      parseEercTransaction.mockReturnValue(undefined);

      const handler = handlers[TransactionStatusEvents.CONFIRMED]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.CONFIRMED),
      );

      expect(result?.properties.privacy).toBeUndefined();
    });
  });

  describe('non-eth_sendTransaction requests', () => {
    it('returns null when the request is not eth_sendTransaction', async () => {
      const handler = handlers[TransactionStatusEvents.PENDING]!;
      const result = await handler(
        makeEvent(TransactionStatusEvents.PENDING, {
          request: {
            method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
            chainId: caipChainId,
            params: [],
          },
        } as any),
      );

      expect(result).toBeNull();
    });
  });
});
