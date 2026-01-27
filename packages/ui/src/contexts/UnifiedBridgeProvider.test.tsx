import { matchingPayload, render, waitFor } from '@shared/tests/test-utils';
import { createRef, forwardRef, useImperativeHandle } from 'react';
import {
  BridgeSignatureReason,
  BridgeStepDetails,
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
import { FeatureGates } from '@core/types';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { chainIdToCaip } from '@core/common';
import { CommonError } from '@core/types';
import { UnifiedBridgeError } from '@core/types';
import { RpcMethod } from '@avalabs/vm-module-types';
import { ExtensionRequest } from '@core/types';

const ACTIVE_ACCOUNT_ADDRESS = 'addressC';

const getBridgeProvider = () => {
  const ref = createRef<UnifiedBridgeContext>();

  render(
    <UnifiedBridgeProvider>
      <TestConsumerComponent ref={ref} />
    </UnifiedBridgeProvider>,
  );

  return ref;
};

const TestConsumerComponent = forwardRef((_props, ref) => {
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
    bitcoinProvider: {},
  } as any;

  const featureFlagsContext = {
    featureFlags: {
      [FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
      [FeatureGates.UNIFIED_BRIDGE_ICTT]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: true,
      [FeatureGates.UNIFIED_BRIDGE_AB_EVM]: true,
      [FeatureGates.UNIFIED_BRIDGE_LOMBARD_BTC_TO_AVA]: true,
      [FeatureGates.UNIFIED_BRIDGE_LOMBARD_AVA_TO_BTC]: true,
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
      getAssets: () => ({
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
    requestFn.mockResolvedValue({
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
      expect(provider.current?.transferableAssets).toEqual([avaxUSDC]),
    );
  });

  it('does not initialize with dev environment when not in testnet mode', async () => {
    jest.mocked(useNetworkContext).mockReturnValue({
      ...networkContext,
      network: {
        ...avalanche,
        isTestnet: false,
      },
    });

    requestFn.mockImplementation(async (params) => {
      if (params.method === ExtensionRequest.BRIDGE_GET_STATE) {
        return { isDevEnv: true };
      }
    });

    getBridgeProvider();

    await waitFor(() =>
      expect(createUnifiedBridgeService).toHaveBeenCalledWith(
        matchingPayload({ environment: Environment.PROD }),
      ),
    );
  });

  it('initializes with dev environment when needed', async () => {
    jest.mocked(useNetworkContext).mockReturnValue({
      ...networkContext,
      network: {
        ...avalanche,
        isTestnet: true,
      },
    });

    requestFn.mockImplementation(async (params) => {
      if (params.method === ExtensionRequest.BRIDGE_GET_STATE) {
        return { isDevEnv: true };
      }
    });

    getBridgeProvider();

    await waitFor(() =>
      expect(createUnifiedBridgeService).toHaveBeenCalledWith(
        matchingPayload({ environment: Environment.DEV }),
      ),
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
        matchingPayload({ environment: Environment.TEST }),
      ),
    );
  });

  it('initializes with prod environment when not in testnet mode', async () => {
    getBridgeProvider();

    await waitFor(() =>
      expect(createUnifiedBridgeService).toHaveBeenCalledWith(
        matchingPayload({ environment: Environment.PROD }),
      ),
    );
  });

  it('uses proper signers for different bridge types', async () => {
    getBridgeProvider();

    await waitFor(async () => {
      expect(getEnabledBridgeServices).toHaveBeenCalledWith(
        Environment.PROD,
        expect.any(Array),
      );
      const initializers = jest.mocked(getEnabledBridgeServices).mock
        .lastCall?.[1];

      expect(initializers?.length).toEqual(5);
    });

    await waitFor(async () => {
      const initializers = jest.mocked(getEnabledBridgeServices).mock
        .lastCall![1];

      const step: BridgeStepDetails = {
        currentSignature: 1,
        requiredSignatures: 2,
        currentSignatureReason: BridgeSignatureReason.AllowanceApproval,
      };

      for (const initializer of initializers) {
        const { type } = initializer;
        const isLombard =
          type === BridgeType.LOMBARD_BTC_TO_BTCB ||
          type === BridgeType.LOMBARD_BTCB_TO_BTC;

        // Lombard initializers have evmSigner/btcSigner, others have signer
        const signer = isLombard
          ? initializer.evmSigner
          : (initializer as any).signer;

        const tx = {
          from: `0x${type}`,
          to: `0x${type}`,
          data: `0x${type}`,
          value: 1500n,
        } as any;

        await signer.sign(tx, async () => '0x' as const, step);

        expect(requestFn).toHaveBeenLastCalledWith(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [{ ...tx, value: '0x5dc' }],
          },
          {
            context: {
              alert: {
                notice: 'You will be prompted {{remaining}} more time(s).',
                title: 'This operation requires {{total}} approvals.',
                type: 'info',
              },
              customApprovalScreenTitle: 'Confirm Bridge',
              isBridge: true,
            },
          },
        );
      }
    });
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
            'eip155:1',
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
            'eip155:1',
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
          await provider.current?.estimateTransferGas(
            'USDC',
            1000n,
            'eip155:1',
          ),
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
        'eip155:1': {
          [avaxUSDC.address]: 300n,
        },
      });
      const provider = getBridgeProvider();

      await waitFor(async () => {
        expect(
          await provider.current?.getFee('USDC', 1000n, 'eip155:1'),
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
