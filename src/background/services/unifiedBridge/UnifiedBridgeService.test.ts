import {
  Environment,
  createUnifiedBridgeService,
} from '@avalabs/bridge-unified';
import { UnifiedBridgeService } from './UnifiedBridgeService';
import { FeatureGates } from '../featureFlags/models';
import { chainIdToCaip } from '@src/utils/caipConversion';
import { ethErrors } from 'eth-rpc-errors';
import { CommonError } from '@src/utils/errors';

jest.mock('@avalabs/bridge-unified');

describe('src/background/services/unifiedBridge/UnifiedBridgeService', () => {
  let service: UnifiedBridgeService;
  let core: ReturnType<typeof createUnifiedBridgeService>;

  const trackTransfer = jest.fn();
  const transferAsset = jest.fn();
  const getFees = jest.fn();
  const estimateGas = jest.fn();

  const networkService = {
    activeNetwork: { chainId: 43113 },
    developerModeChanged: {
      add: jest.fn(),
    },
    isMainnet: jest.fn(),
    getNetwork: jest.fn(),
    getProviderForNetwork: jest.fn(),
    sendTransaction: jest.fn(),
  } as any;

  const accountsService = {
    activeAccount: {
      addressC: 'addressC',
    },
  } as any;

  const walletService = {
    sign: jest.fn(),
  } as any;

  const feeService = {
    getNetworkFee: jest.fn(),
    estimateGasLimit: jest.fn(),
  } as any;

  const storageService = {
    load: jest.fn(),
    save: jest.fn(),
  } as any;

  const flagsService = {
    featureFlags: {
      [FeatureGates.IMPORT_FIREBLOCKS]: true,
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
    },
    addListener: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();

    core = {
      bridges: new Map(),
      estimateGas,
      getFees,
      getAssets: jest.fn().mockResolvedValue({}),
      trackTransfer,
      transferAsset,
      init: jest.fn().mockResolvedValue(undefined),
    } as any;

    jest.mocked(createUnifiedBridgeService).mockReturnValue(core);

    networkService.isMainnet.mockReturnValue(false);
    networkService.getNetwork.mockImplementation(async (chainId) => ({
      chainId,
    }));

    service = new UnifiedBridgeService(
      networkService,
      accountsService,
      walletService,
      feeService,
      storageService,
      flagsService
    );
  });

  it('creates core instance with proper environment', () => {
    networkService.isMainnet.mockReturnValue(true);

    new UnifiedBridgeService(
      networkService,
      accountsService,
      walletService,
      feeService,
      storageService,
      flagsService
    );

    expect(createUnifiedBridgeService).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.PROD,
      })
    );

    networkService.isMainnet.mockReturnValue(false);

    new UnifiedBridgeService(
      networkService,
      accountsService,
      walletService,
      feeService,
      storageService,
      flagsService
    );

    expect(createUnifiedBridgeService).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: Environment.TEST,
      })
    );
  });

  it('recreates the core instance on testnet mode switch', () => {
    const mockTestnetModeChange = (
      networkService.developerModeChanged.add as jest.Mock
    ).mock.lastCall[0];

    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);
    mockTestnetModeChange();
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(2);
  });

  it('recreates the core instance when certain feature flags are toggled', () => {
    const mockFeatureFlagChanges = (flagsService.addListener as jest.Mock).mock
      .lastCall[1];

    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);

    // Toggle an irrelevant flag off
    mockFeatureFlagChanges({
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
      [FeatureGates.IMPORT_FIREBLOCKS]: false,
    });
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(1);

    // Toggle a relevant flag off
    mockFeatureFlagChanges({
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: false,
      [FeatureGates.IMPORT_FIREBLOCKS]: false,
    });
    expect(createUnifiedBridgeService).toHaveBeenCalledTimes(2);
  });

  it('starts tracking incomplete transfers after instantiation', async () => {
    storageService.load.mockResolvedValue({
      pendingTransfers: {
        '0x1234': { sourceTxHash: '0x1234', completedAt: Date.now() },
        '0x2345': { sourceTxHash: '0x2345' },
      },
    });

    const bridgeService = new UnifiedBridgeService(
      networkService,
      accountsService,
      walletService,
      feeService,
      storageService,
      flagsService
    );

    await bridgeService.onStorageReady();

    expect(trackTransfer).toHaveBeenCalledTimes(1);
    expect(trackTransfer).toHaveBeenCalledWith(
      expect.objectContaining({ bridgeTransfer: { sourceTxHash: '0x2345' } })
    );
  });

  describe('.transfer()', () => {
    beforeEach(() => {
      networkService.sendTransaction
        .mockResolvedValueOnce('approveTxHash')
        .mockResolvedValueOnce('transferTxHash');

      trackTransfer.mockReturnValue({
        result: Promise.resolve({ sourceTxHash: 'transferTxHash' }),
      });

      transferAsset.mockImplementation(
        async ({ fromAddress, onStepChange, sign }) => {
          onStepChange({ currentSignature: 1, requiredSignatures: 2 });
          await sign({
            from: fromAddress,
            to: 'toAddress',
            data: 'approval-data',
          });

          onStepChange({ currentSignature: 2, requiredSignatures: 2 });
          await sign({
            from: fromAddress,
            to: 'toAddress',
            data: 'transfer-data',
          });

          return {
            sourceTxHash: 'transferTxHash',
          };
        }
      );
    });

    const asset = { address: 'adderss' } as any;

    describe('when custom gas settings are passed', () => {
      const highMarketFee = {
        maxFee: 1000n,
        maxTip: 10n,
      };

      const estimatedGasLimits = [55_000n, 165_000n];

      beforeEach(() => {
        feeService.getNetworkFee.mockResolvedValue({
          high: highMarketFee,
        });

        feeService.estimateGasLimit
          .mockResolvedValueOnce(estimatedGasLimits[0])
          .mockResolvedValueOnce(estimatedGasLimits[1]);

        networkService.getProviderForNetwork.mockResolvedValue({
          getTransactionCount: jest
            .fn()
            .mockResolvedValueOnce(5)
            .mockResolvedValueOnce(6),
        });

        walletService.sign
          .mockResolvedValueOnce({ signedTx: 'approval-tx-hex' })
          .mockResolvedValueOnce({ signedTx: 'transfer-tx-hex' });
      });

      it('applies the user-provided maxFeePerGas and maxPriorityFeePerGas', async () => {
        const maxFeePerGas = BigInt(50e9);
        const maxPriorityFeePerGas = BigInt(5e9);

        await service.transfer({
          asset,
          amount: 1000000n,
          targetChainId: 5,
          tabId: 1234,
          customGasSettings: {
            maxFeePerGas,
            maxPriorityFeePerGas,
          },
        });

        expect(walletService.sign).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            maxFeePerGas,
            maxPriorityFeePerGas,
          }),
          1234
        );

        expect(walletService.sign).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            maxFeePerGas,
            maxPriorityFeePerGas,
          }),
          1234
        );
      });

      it('ignores the user-provided gasLimit', async () => {
        const maxFeePerGas = BigInt(50e9);
        const maxPriorityFeePerGas = BigInt(5e9);
        const gasLimit = 50_000n;

        await service.transfer({
          asset,
          amount: 1000000n,
          targetChainId: 5,
          tabId: 1234,
          customGasSettings: {
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit,
          },
        });

        expect(walletService.sign).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit: estimatedGasLimits[0],
          }),
          1234
        );

        expect(walletService.sign).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit: estimatedGasLimits[1],
          }),
          1234
        );
      });
    });

    describe('when network fee is unknown', () => {
      beforeEach(() => {
        feeService.getNetworkFee.mockResolvedValue(null);
      });

      it('raises UnknownNetworkFee error', async () => {
        await expect(
          service.transfer({
            asset,
            amount: 1000000n,
            targetChainId: 5,
            tabId: 1234,
          })
        ).rejects.toThrow(
          ethErrors.rpc.internal({
            data: { reason: CommonError.UnknownNetworkFee },
          })
        );
      });
    });

    describe('during happy path', () => {
      beforeEach(() => {
        feeService.getNetworkFee.mockResolvedValue({
          high: {
            maxFee: 1000n,
            maxTip: 10n,
          },
        });
        feeService.estimateGasLimit.mockResolvedValue(2000);
      });

      it('calls .transferAsset() with proper params', async () => {
        networkService.getProviderForNetwork.mockResolvedValue({
          getTransactionCount: jest
            .fn()
            .mockResolvedValueOnce(5)
            .mockResolvedValueOnce(6),
        });

        walletService.sign
          .mockResolvedValueOnce({ signedTx: 'approval-tx-hex' })
          .mockResolvedValueOnce({ signedTx: 'transfer-tx-hex' });

        await service.transfer({
          asset,
          amount: 1000000n,
          targetChainId: 5,
          tabId: 1234,
        });

        expect(core.transferAsset).toHaveBeenCalledWith({
          asset,
          fromAddress: accountsService.activeAccount.addressC,
          amount: 1000000n,
          sourceChain: expect.objectContaining({
            chainId: chainIdToCaip(networkService.activeNetwork.chainId),
          }),
          targetChain: expect.objectContaining({ chainId: chainIdToCaip(5) }),
          onStepChange: expect.any(Function),
          sign: expect.any(Function),
        });

        expect(walletService.sign).toHaveBeenCalledTimes(2);
        expect(walletService.sign).toHaveBeenNthCalledWith(
          1,
          {
            from: accountsService.activeAccount.addressC,
            to: 'toAddress',
            data: 'approval-data',
            chainId: networkService.activeNetwork.chainId,
            gasLimit: 2000,
            maxFeePerGas: 1000n,
            maxPriorityFeePerGas: 10n,
            nonce: 5,
          },
          1234
        );
        expect(walletService.sign).toHaveBeenNthCalledWith(
          2,
          {
            from: accountsService.activeAccount.addressC,
            to: 'toAddress',
            data: 'transfer-data',
            chainId: networkService.activeNetwork.chainId,
            gasLimit: 2000,
            maxFeePerGas: 1000n,
            maxPriorityFeePerGas: 10n,
            nonce: 6,
          },
          1234
        );

        expect(networkService.sendTransaction).toHaveBeenCalledTimes(2);
        expect(networkService.sendTransaction).toHaveBeenNthCalledWith(1, {
          signedTx: 'approval-tx-hex',
        });
        expect(networkService.sendTransaction).toHaveBeenNthCalledWith(2, {
          signedTx: 'transfer-tx-hex',
        });
      });
    });
  });

  describe('.getFee()', () => {
    const asset = {
      address: 'address',
    };
    const fee = 2000000n;

    beforeEach(() => {
      getFees.mockResolvedValue({
        [asset.address]: fee,
      });
    });

    it(`properly calls SDK's getFees() and returns the same value`, async () => {
      const result = await service.getFee({
        asset,
        amount: 100n,
        sourceChainId: 43113,
        targetChainId: 5,
      });

      expect(result).toEqual(fee);
      expect(core.getFees).toHaveBeenCalledWith({
        asset,
        amount: 100n,
        sourceChain: expect.objectContaining({ chainId: chainIdToCaip(43113) }),
        targetChain: expect.objectContaining({ chainId: chainIdToCaip(5) }),
      });
    });
  });

  describe('.estimateGas()', () => {
    const asset = {
      address: 'address',
    } as any;

    beforeEach(() => {
      estimateGas.mockResolvedValue(12345n);
    });

    it(`properly calls SDK's estimateGas() and returns the same value`, async () => {
      const result = await service.estimateGas({
        asset,
        amount: 100n,
        targetChainId: 5,
      });

      expect(result).toEqual(12345n);
      expect(core.estimateGas).toHaveBeenCalledWith({
        asset,
        amount: 100n,
        fromAddress: accountsService.activeAccount.addressC,
        sourceChain: expect.objectContaining({ chainId: chainIdToCaip(43113) }),
        targetChain: expect.objectContaining({ chainId: chainIdToCaip(5) }),
      });
    });
  });
});
