import { matchingPayload, render, waitFor } from '@src/tests/test-utils';
import { createRef, forwardRef, useImperativeHandle } from 'react';
import {
  BridgeService,
  BridgeSignatureReason,
  BridgeType,
  Environment,
  TokenType,
  createUnifiedBridgeService,
  getEnabledBridgeServices,
} from '@avalabs/bridge-unified';

import { useConnectionContext } from './ConnectionProvider';
import { useAccountsContext } from './AccountsProvider';
import { useNetworkContext } from './NetworkProvider';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import {
  UnifiedBridgeContext,
  UnifiedBridgeProvider,
  useUnifiedBridgeContext,
} from './UnifiedBridgeProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { chainIdToCaip } from '@src/utils/caipConversion';
import { CommonError } from '@src/utils/errors';
import { UnifiedBridgeError } from '@src/background/services/unifiedBridge/models';
import { RpcMethod } from '@avalabs/vm-module-types';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';

const ACTIVE_ACCOUNT_ADDRESS = 'addressC';

const getBridgeProvider = () => {
  const ref = createRef<UnifiedBridgeContext>();

  render(
    <UnifiedBridgeProvider>
      <TestConsumerComponent ref={ref} />
    </UnifiedBridgeProvider>
  );

  return ref;
};

const TestConsumerComponent = forwardRef((props: unknown, ref) => {
  const context = useUnifiedBridgeContext();

  useImperativeHandle(ref, () => context);

  return <div />;
});
TestConsumerComponent.displayName = 'TestComponent';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
  }),
}));
jest.mock('@avalabs/bridge-unified');
jest.mock('./NetworkProvider');
jest.mock('./AccountsProvider');
jest.mock('./ConnectionProvider');
jest.mock('./FeatureFlagsProvider');

describe('contexts/UnifiedBridgeProvider', () => {
  const requestFn = jest.fn();
  const eventsFn = jest.fn();

  const connectionContext = {
    request: requestFn,
    events: eventsFn,
  } as any;

  const accountsContext = {
    accounts: {
      active: {
        addressC: ACTIVE_ACCOUNT_ADDRESS,
      },
    },
  } as any;

  const avalanche = {
    vmName: NetworkVMType.EVM,
    isTestnet: false,
    chainId: 43114,
    caipId: 'eip155:43114',
  };

  const ethereum = {
    vmName: NetworkVMType.EVM,
    isTestnet: false,
    chainId: 1,
    caipId: 'eip155:1',
  };

  const networkContext = {
    network: avalanche,
    getNetwork(chainId) {
      return chainId === 43114 || chainId === 'eip155:43114'
        ? avalanche
        : ethereum;
    },
    avalancheProvider: {
      waitForTransaction: jest.fn(),
    },
    ethereumProvider: {
      waitForTransaction: jest.fn(),
    },
  } as any;

  const featureFlagsContext = {
    featureFlags: {
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
    },
  } as any;

  let core: ReturnType<typeof createUnifiedBridgeService>;

  const ethUSDC = {
    destinations: {
      [chainIdToCaip(avalanche.chainId)]: [BridgeType.CCTP],
    },
    address: '0xUsdcEthAddress',
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
    type: TokenType.ERC20,
  };
  const avaxUSDC = {
    destinations: {
      [chainIdToCaip(ethereum.chainId)]: [BridgeType.CCTP],
    },
    address: '0xUsdcAvaxAddress',
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
    type: TokenType.ERC20,
  };

  beforeEach(() => {
    jest.resetAllMocks();

    core = {
      getAssets: async () => ({
        [chainIdToCaip(ethereum.chainId)]: [ethUSDC],
        [chainIdToCaip(avalanche.chainId)]: [avaxUSDC],
      }),
      getFees: jest.fn(),
      transferAsset: jest.fn(),
      estimateGas: jest.fn(),
    } as unknown as ReturnType<typeof createUnifiedBridgeService>;

    jest.mocked(createUnifiedBridgeService).mockReturnValue(core);
    jest.mocked(getEnabledBridgeServices).mockResolvedValue({} as any);
    // Mock events flow
    eventsFn.mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockReturnValue({ unsubscribe: jest.fn() }),
      }),
    });

    // Mock state initialization response
    requestFn.mockResolvedValueOnce({
      pendingTransfers: {},
      addresses: [],
    });

    jest.mocked(useConnectionContext).mockReturnValue(connectionContext);
    jest.mocked(useAccountsContext).mockReturnValue(accountsContext);
    jest.mocked(useNetworkContext).mockReturnValue(networkContext);
    jest.mocked(useFeatureFlagContext).mockReturnValue(featureFlagsContext);
  });

  it('exposes transferrable assets', async () => {
    const provider = getBridgeProvider();

    await waitFor(() =>
      expect(provider.current?.transferableAssets).toEqual([avaxUSDC])
    );
  });

  it('initializes with test environment when in testnet mode', async () => {
    jest.mocked(useNetworkContext).mockReturnValue({
      ...networkContext,
      network: {
        ...avalanche,
        isTestnet: true,
      },
    });

    getBridgeProvider();

    await waitFor(() =>
      expect(createUnifiedBridgeService).toHaveBeenCalledWith(
        matchingPayload({ environment: Environment.TEST })
      )
    );
  });

  it('initializes with prod environment when not in testnet mode', async () => {
    getBridgeProvider();

    await waitFor(() =>
      expect(createUnifiedBridgeService).toHaveBeenCalledWith(
        matchingPayload({ environment: Environment.PROD })
      )
    );
  });

  it('initializes without AvalancheBridge and ICTT', async () => {
    const serviceMap = new Map([[BridgeType.CCTP, {} as BridgeService]]);
    jest.mocked(getEnabledBridgeServices).mockResolvedValueOnce(serviceMap);

    getBridgeProvider();

    await waitFor(() =>
      expect(getEnabledBridgeServices).toHaveBeenCalledWith(Environment.PROD, [
        BridgeType.AVALANCHE_EVM,
        BridgeType.ICTT_ERC20_ERC20,
      ])
    );
    await waitFor(() =>
      expect(createUnifiedBridgeService).toHaveBeenCalledWith(
        matchingPayload({ enabledBridgeServices: serviceMap })
      )
    );
  });

  describe('transferAsset()', () => {
    it('throws error if bridge is not initialized yet', async () => {
      jest.mocked(useNetworkContext).mockReturnValueOnce({
        ...networkContext,
        network: undefined,
      });

      const provider = getBridgeProvider();

      await waitFor(async () => {
        try {
          await provider.current?.transferAsset('USDC', 1000n, 'eip155:1');
        } catch (err: any) {
          expect(err.data.reason).toEqual(CommonError.Unknown);
        }
      });
    });

    it('throws error if requested asset is not found', async () => {
      const provider = getBridgeProvider();

      await waitFor(async () => {
        try {
          await provider.current?.transferAsset('USDCC', 1000n, 'eip155:1');
        } catch (err: any) {
          expect(err.data?.reason).toEqual(UnifiedBridgeError.UnknownAsset);
        }
      });
    });

    it('uses the SDK to transfer assets and sends eth_sendTransaction requests to the wallet', async () => {
      const transfer = { sourceTxHash: '0xTransferTxHash' } as any;
      const allowanceTx = {
        from: ACTIVE_ACCOUNT_ADDRESS,
        to: '0xUsdcAllowanceContract',
        data: '0x1234',
      } as any;
      const transferTx = {
        from: ACTIVE_ACCOUNT_ADDRESS,
        to: '0xUsdcTransferContract',
        data: '0x1234',
      } as any;

      jest
        .mocked(core.transferAsset)
        .mockImplementation(async ({ onStepChange, sign }) => {
          // Simulate double-approval flow for complete test

          onStepChange?.({
            currentSignature: 1,
            requiredSignatures: 2,
            currentSignatureReason: BridgeSignatureReason.AllowanceApproval,
          });

          await sign?.(allowanceTx, async () => '0xApprovalTxHash');

          onStepChange?.({
            currentSignature: 2,
            requiredSignatures: 2,
            currentSignatureReason: BridgeSignatureReason.TokensTransfer,
          });

          await sign?.(transferTx, async () => transfer.sourceTxHash);

          return transfer;
        });

      const provider = getBridgeProvider();

      await waitFor(async () => {
        expect(
          await provider.current?.transferAsset('USDC', 1000n, 'eip155:1')
        ).toEqual(transfer.sourceTxHash);

        expect(core.transferAsset).toHaveBeenCalledWith({
          asset: expect.objectContaining({ symbol: 'USDC' }),
          fromAddress: accountsContext.accounts.active.addressC,
          amount: 1000n,
          targetChain: expect.objectContaining({
            chainId: chainIdToCaip(ethereum.chainId),
          }),
          sourceChain: expect.objectContaining({
            chainId: chainIdToCaip(avalanche.chainId),
          }),
          onStepChange: expect.any(Function),
          sign: expect.any(Function),
        });

        expect(requestFn).toHaveBeenCalledWith(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [{ ...allowanceTx }],
          },
          {
            customApprovalScreenTitle: 'Confirm Bridge',
            alert: {
              type: 'info',
              title: 'This operation requires {{total}} approvals.',
              notice: 'You will be prompted {{remaining}} more time(s).',
            },
          }
        );
        expect(requestFn).toHaveBeenCalledWith(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [{ ...transferTx }],
          },
          {
            customApprovalScreenTitle: 'Confirm Bridge',
          }
        );
        expect(requestFn).toHaveBeenCalledWith({
          method: ExtensionRequest.UNIFIED_BRIDGE_TRACK_TRANSFER,
          params: [transfer],
        });
      });
    });
  });

  describe('estimateTransferGas()', () => {
    it('throws error if bridge is not initialized yet', async () => {
      jest.mocked(useNetworkContext).mockReturnValueOnce({
        ...networkContext,
        network: undefined,
      });

      const provider = getBridgeProvider();

      await waitFor(async () => {
        try {
          await provider.current?.estimateTransferGas(
            'USDC',
            1000n,
            'eip155:1'
          );
        } catch (err: any) {
          expect(err.data.reason).toEqual(CommonError.Unknown);
        }
      });
    });

    it('throws error if requested asset is not found', async () => {
      const provider = getBridgeProvider();

      await waitFor(async () => {
        try {
          await provider.current?.estimateTransferGas(
            'USDC',
            1000n,
            'eip155:1'
          );
        } catch (err: any) {
          expect(err.data.reason).toEqual(UnifiedBridgeError.UnknownAsset);
        }
      });
    });

    it('uses the SDK to estimate gas', async () => {
      jest.mocked(core.estimateGas).mockResolvedValue(555n);

      const provider = getBridgeProvider();

      await waitFor(async () => {
        expect(
          await provider.current?.estimateTransferGas('USDC', 1000n, 'eip155:1')
        ).toEqual(555n);

        expect(core.estimateGas).toHaveBeenCalledWith({
          asset: expect.objectContaining({ symbol: 'USDC' }),
          fromAddress: accountsContext.accounts.active.addressC,
          amount: 1000n,
          targetChain: expect.objectContaining({
            chainId: chainIdToCaip(ethereum.chainId),
          }),
          sourceChain: expect.objectContaining({
            chainId: chainIdToCaip(avalanche.chainId),
          }),
        });
      });
    });
  });

  describe('getFee()', () => {
    it('throws error if bridge is not initialized yet', async () => {
      jest.mocked(useNetworkContext).mockReturnValueOnce({
        ...networkContext,
        network: undefined,
      });

      const provider = getBridgeProvider();

      await waitFor(async () => {
        try {
          await provider.current?.getFee('USDC', 1000n, 'eip155:1');
        } catch (err: any) {
          expect(err.data.reason).toEqual(CommonError.Unknown);
        }
      });
    });

    it('throws error if requested asset is not found', async () => {
      const provider = getBridgeProvider();

      await waitFor(async () => {
        try {
          await provider.current?.getFee('USDCc', 1000n, 'eip155:1');
        } catch (err: any) {
          expect(err.data.reason).toEqual(UnifiedBridgeError.UnknownAsset);
        }
      });
    });

    it('uses the SDK to calculate fees', async () => {
      jest.mocked(core.getFees).mockResolvedValue({
        [avaxUSDC.address]: 300n,
      });
      const provider = getBridgeProvider();

      await waitFor(async () => {
        expect(
          await provider.current?.getFee('USDC', 1000n, 'eip155:1')
        ).toEqual(300n);

        expect(core.getFees).toHaveBeenCalledWith({
          asset: expect.objectContaining({ symbol: 'USDC' }),
          amount: 1000n,
          targetChain: expect.objectContaining({
            chainId: chainIdToCaip(ethereum.chainId),
          }),
          sourceChain: expect.objectContaining({
            chainId: chainIdToCaip(avalanche.chainId),
          }),
        });
      });
    });
  });
});
