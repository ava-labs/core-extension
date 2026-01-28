import { utils } from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { getMaxUtxoSet } from './getMaxUtxos';
import {
  AVALANCHE_P_DEV_NETWORK,
  NetworkVMType,
} from '@avalabs/core-chains-sdk';
import { ethErrors } from 'eth-rpc-errors';
import { CommonError, LEDGER_TX_SIZE_LIMIT_BYTES } from '@core/types';

// X-chain network for testing (not exported from core-chains-sdk)
const AVALANCHE_X_DEV_NETWORK = {
  ...AVALANCHE_P_DEV_NETWORK,
  chainId: 9999,
  vmName: NetworkVMType.AVM,
};

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('@avalabs/avalanchejs', () => ({
  utils: {
    getUtxoInfo: jest.fn(),
    UtxoSet: jest.fn().mockImplementation((utxos) => ({
      getUTXOs: () => utxos,
    })),
  },
}));

describe('src/pages/Send/utils/getMaxUtxos', () => {
  const getUTXOs = jest.fn();

  const mockedWallet = {
    getUTXOs,
  } as any;

  const mockProvider = {
    isEtnaEnabled: jest.fn().mockReturnValue(true),
    getAvaxID: () => 'avax-id',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Avalanche, 'getMaximumUtxoSet').mockReturnValue([]);
    jest
      .spyOn(Avalanche, 'sortUTXOsByAmount')
      .mockImplementation((utxos) => utxos);
    jest.spyOn(Avalanche, 'getAssetBalance').mockReturnValue({
      available: 100n,
      locked: 0n,
      staked: 0n,
      atomicMemoryUnlocked: 0n,
      atomicMemoryLocked: 0n,
    } as any);

    getUTXOs.mockResolvedValue({
      getUTXOs: () => [],
    });
  });

  describe('P-chain transactions', () => {
    it('requires feeState for post-Etna transactions', async () => {
      const provider = {
        isEtnaEnabled: jest.fn().mockReturnValue(true),
      } as any;

      try {
        await getMaxUtxoSet({
          isLedgerWallet: false,
          provider,
          wallet: mockedWallet,
          network: AVALANCHE_P_DEV_NETWORK,
          filterSmallUtxos: false,
        });
        fail('The call above should have failed');
      } catch (err) {
        expect(err).toEqual(
          ethErrors.rpc.internal({
            data: { reason: CommonError.UnknownNetworkFee },
          }),
        );
      }
    });

    it('passes feeState to the SDK call', async () => {
      const feeState = { price: 2n } as any;

      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_P_DEV_NETWORK,
        filterSmallUtxos: false,
        feeState,
      });

      expect(Avalanche.getMaximumUtxoSet).toHaveBeenCalledWith({
        wallet: mockedWallet,
        utxos: [],
        sizeSupportedTx: Avalanche.SizeSupportedTx.BaseP,
        limit: undefined,
        feeState,
      });
    });

    it('passes size limit for Ledger wallets on P-chain', async () => {
      const feeState = { price: 2n } as any;

      await getMaxUtxoSet({
        isLedgerWallet: true,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_P_DEV_NETWORK,
        filterSmallUtxos: false,
        feeState,
      });

      expect(Avalanche.getMaximumUtxoSet).toHaveBeenCalledWith({
        wallet: mockedWallet,
        utxos: [],
        sizeSupportedTx: Avalanche.SizeSupportedTx.BaseP,
        limit: LEDGER_TX_SIZE_LIMIT_BYTES,
        feeState,
      });
    });

    it('handles getMaximumUtxoSet errors gracefully', async () => {
      const feeState = { price: 2n } as any;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(Avalanche, 'getMaximumUtxoSet').mockImplementation(() => {
        throw new Error('SDK error');
      });

      const result = await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_P_DEV_NETWORK,
        filterSmallUtxos: false,
        feeState,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error calculating maximum utxo set',
        expect.objectContaining({
          e: expect.any(Error),
          txType: Avalanche.SizeSupportedTx.BaseP,
        }),
      );
      expect(result).toBeDefined();
      consoleSpy.mockRestore();
    });
  });

  describe('X-chain transactions', () => {
    it('fetches UTXOs with X chain alias', async () => {
      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: false,
      });

      expect(getUTXOs).toHaveBeenCalledWith('X');
    });

    it('does not call getMaximumUtxoSet for X-chain', async () => {
      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: false,
      });

      expect(Avalanche.getMaximumUtxoSet).not.toHaveBeenCalled();
    });
  });

  describe('filterSmallUtxos', () => {
    const createMockUtxo = (amount: bigint) => ({ id: `utxo-${amount}` });

    beforeEach(() => {
      jest.mocked(utils.getUtxoInfo).mockImplementation(
        (utxo: any) =>
          ({
            amount: BigInt(utxo.id.split('-')[1] ?? 0),
          }) as any,
      );
    });

    it('filters UTXOs below dust threshold when filterSmallUtxos is true', async () => {
      const smallUtxo = createMockUtxo(1_000_000n); // Below 2_000_000n threshold
      const largeUtxo = createMockUtxo(5_000_000n); // Above threshold

      getUTXOs.mockResolvedValue({
        getUTXOs: () => [smallUtxo, largeUtxo],
      });
      jest
        .spyOn(Avalanche, 'sortUTXOsByAmount')
        .mockReturnValue([smallUtxo, largeUtxo] as any);

      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: true,
      });

      expect(utils.UtxoSet).toHaveBeenCalledWith([largeUtxo]);
    });

    it('keeps UTXOs at exactly dust threshold when filterSmallUtxos is true', async () => {
      const exactThresholdUtxo = createMockUtxo(2_000_000n); // Exactly at threshold

      getUTXOs.mockResolvedValue({
        getUTXOs: () => [exactThresholdUtxo],
      });
      jest
        .spyOn(Avalanche, 'sortUTXOsByAmount')
        .mockReturnValue([exactThresholdUtxo] as any);

      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: true,
      });

      expect(utils.UtxoSet).toHaveBeenCalledWith([exactThresholdUtxo]);
    });

    it('does not filter UTXOs when filterSmallUtxos is false', async () => {
      const smallUtxo = createMockUtxo(1_000_000n);
      const largeUtxo = createMockUtxo(5_000_000n);

      getUTXOs.mockResolvedValue({
        getUTXOs: () => [smallUtxo, largeUtxo],
      });
      jest
        .spyOn(Avalanche, 'sortUTXOsByAmount')
        .mockReturnValue([smallUtxo, largeUtxo] as any);

      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: false,
      });

      expect(utils.UtxoSet).toHaveBeenCalledWith([smallUtxo, largeUtxo]);
    });
  });

  describe('Ledger wallet UTXO limiting', () => {
    it('limits UTXOs to 64 for Ledger wallets', async () => {
      const manyUtxos = Array.from({ length: 100 }, (_, i) => ({ id: i }));

      getUTXOs.mockResolvedValue({
        getUTXOs: () => manyUtxos,
      });
      jest
        .spyOn(Avalanche, 'sortUTXOsByAmount')
        .mockReturnValue(manyUtxos as any);

      await getMaxUtxoSet({
        isLedgerWallet: true,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: false,
      });

      expect(utils.UtxoSet).toHaveBeenCalledWith(manyUtxos.slice(0, 64));
    });

    it('does not limit UTXOs for non-Ledger wallets', async () => {
      const manyUtxos = Array.from({ length: 100 }, (_, i) => ({ id: i }));

      getUTXOs.mockResolvedValue({
        getUTXOs: () => manyUtxos,
      });
      jest
        .spyOn(Avalanche, 'sortUTXOsByAmount')
        .mockReturnValue(manyUtxos as any);

      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: false,
      });

      expect(utils.UtxoSet).toHaveBeenCalledWith(manyUtxos);
    });
  });

  describe('preloadedUtxoSet', () => {
    it('uses preloaded UTXOs when provided', async () => {
      const preloadedUtxos = [{ id: 'preloaded' }];
      const preloadedUtxoSet = {
        getUTXOs: () => preloadedUtxos,
      } as any;

      jest
        .spyOn(Avalanche, 'sortUTXOsByAmount')
        .mockReturnValue(preloadedUtxos as any);

      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: false,
        preloadedUtxoSet,
      });

      expect(getUTXOs).not.toHaveBeenCalled();
      expect(Avalanche.sortUTXOsByAmount).toHaveBeenCalledWith(
        preloadedUtxos,
        true,
      );
    });

    it('fetches UTXOs when preloadedUtxoSet is not provided', async () => {
      await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: false,
      });

      expect(getUTXOs).toHaveBeenCalledWith('X');
    });
  });

  describe('return value', () => {
    it('returns utxos and balance', async () => {
      const result = await getMaxUtxoSet({
        isLedgerWallet: false,
        provider: mockProvider,
        wallet: mockedWallet,
        network: AVALANCHE_X_DEV_NETWORK,
        filterSmallUtxos: false,
      });

      expect(result).toHaveProperty('utxos');
      expect(result).toHaveProperty('balance');
      expect(Avalanche.getAssetBalance).toHaveBeenCalledWith(
        expect.anything(),
        'avax-id',
      );
    });
  });
});
