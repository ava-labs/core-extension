import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import {
  BridgeAsset,
  BridgeType,
  Chain,
  ChainAssetMap,
  Environment,
  ErrorCode as UnifiedBridgeErrorCode,
  TokenType,
  createUnifiedBridgeService,
  BridgeTransfer,
  getEnabledBridgeServices,
  BridgeServicesMap,
  AnalyzeTxParams,
  AnalyzeTxResult,
} from '@avalabs/bridge-unified';
import { ethErrors } from 'eth-rpc-errors';
import { filter, map } from 'rxjs';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  UNIFIED_BRIDGE_DEFAULT_STATE,
  UnifiedBridgeError,
  UnifiedBridgeState,
} from '@src/background/services/unifiedBridge/models';
import { UnifiedBridgeGetState } from '@src/background/services/unifiedBridge/handlers';
import { isUnifiedBridgeStateUpdate } from '@src/background/services/unifiedBridge/events/eventFilters';

import { useNetworkContext } from './NetworkProvider';
import { useConnectionContext } from './ConnectionProvider';
import { CommonError, ErrorCode } from '@src/utils/errors';
import { useTranslation } from 'react-i18next';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useAccountsContext } from './AccountsProvider';
import { JsonRpcApiProvider } from 'ethers';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { UnifiedBridgeTrackTransfer } from '@src/background/services/unifiedBridge/handlers/unifiedBridgeTrackTransfer';
import { lowerCaseKeys } from '@src/utils/lowerCaseKeys';
import { RpcMethod } from '@avalabs/vm-module-types';

export interface UnifiedBridgeContext {
  estimateTransferGas(
    symbol: string,
    amount: bigint,
    targetChainId: string
  ): Promise<bigint>;
  getAssetIdentifierOnTargetChain(
    symbol?: string,
    chainId?: string
  ): string | undefined;
  getFee(
    symbol: string,
    amount: bigint,
    targetChainId: string
  ): Promise<bigint>;
  analyzeTx(txInfo: AnalyzeTxParams): AnalyzeTxResult;
  supportsAsset(address: string, targetChainId: string): boolean;
  transferAsset(
    symbol: string,
    amount: bigint,
    targetChainId: string
  ): Promise<any>;
  getErrorMessage(errorCode: UnifiedBridgeErrorCode): string;
  transferableAssets: BridgeAsset[];
  state: UnifiedBridgeState;
}

const DEFAULT_STATE = {
  state: UNIFIED_BRIDGE_DEFAULT_STATE,
  estimateTransferGas() {
    throw new Error('Bridge not ready');
  },
  getAssetIdentifierOnTargetChain() {
    return undefined;
  },
  getErrorMessage() {
    return '';
  },
  supportsAsset() {
    return false;
  },
  analyzeTx(): AnalyzeTxResult {
    return { isBridgeTx: false };
  },
  transferAsset() {
    throw new Error('Bridge not ready');
  },
  getFee() {
    throw new Error('Bridge not ready');
  },
  transferableAssets: [],
};

const UnifiedBridgeContext = createContext<UnifiedBridgeContext>(DEFAULT_STATE);

function assert(
  value: unknown,
  reason?: ErrorCode
): asserts value is NonNullable<unknown> {
  if (!value) {
    throw ethErrors.rpc.internal({
      data: { reason: reason ?? CommonError.Unknown },
    });
  }
}

export function UnifiedBridgeProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  const { t } = useTranslation();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network: activeNetwork, getNetwork } = useNetworkContext();
  const { events, request } = useConnectionContext();
  const [assets, setAssets] = useState<ChainAssetMap>({});
  const [state, setState] = useState<UnifiedBridgeState>(
    UNIFIED_BRIDGE_DEFAULT_STATE
  );
  const { featureFlags } = useFeatureFlagContext();
  const isCCTPDisabled = !featureFlags[FeatureGates.UNIFIED_BRIDGE_CCTP];
  const disabledBridgeTypes = useMemo(
    () =>
      isCCTPDisabled
        ? [
            BridgeType.CCTP,
            BridgeType.ICTT_ERC20_ERC20,
            BridgeType.AVALANCHE_EVM,
          ]
        : [BridgeType.AVALANCHE_EVM, BridgeType.ICTT_ERC20_ERC20],
    [isCCTPDisabled]
  );

  const environment = useMemo(() => {
    if (typeof activeNetwork?.isTestnet !== 'boolean') {
      return null;
    }

    return activeNetwork.isTestnet ? Environment.TEST : Environment.PROD;
  }, [activeNetwork?.isTestnet]);

  const [enabledBridgeServices, setEnabledBridgeServices] =
    useState<BridgeServicesMap>();

  useEffect(() => {
    if (!environment) {
      return;
    }

    let isMounted = true;

    getEnabledBridgeServices(environment, disabledBridgeTypes)
      .then((bridges) => {
        if (isMounted) setEnabledBridgeServices(bridges);
      })
      .catch((err) => {
        console.log('Unable to initialize bridge services', err);
        if (isMounted) setEnabledBridgeServices(undefined);
      });

    return () => {
      isMounted = false;
    };
  }, [environment, disabledBridgeTypes]);

  // Memoize the core instance of Unified Bridge based on the current
  // network environment & feature flags configuration
  const core = useMemo(() => {
    if (!environment || !enabledBridgeServices) {
      return null;
    }

    return createUnifiedBridgeService({
      environment,
      enabledBridgeServices,
    });
  }, [environment, enabledBridgeServices]);

  // Whenever core instance is re-created, initialize it and update assets
  useEffect(() => {
    if (!core) {
      return;
    }

    let isMounted = true;

    core.getAssets().then((chainAssetsMap) => {
      if (!isMounted) {
        return;
      }

      setAssets(chainAssetsMap);
    });

    return () => {
      isMounted = false;
    };
  }, [core]);

  const buildChain = useCallback(
    (chainId: string): Chain => {
      const network = getNetwork(chainId);

      assert(network, CommonError.UnknownNetwork);

      return {
        chainId,
        chainName: network.chainName,
        rpcUrl: network.rpcUrl,
        networkToken: {
          ...network.networkToken,
          type: TokenType.NATIVE,
        },
        utilityAddresses: {
          multicall: network.utilityAddresses?.multicall as `0x${string}`,
        },
      };
    },
    [getNetwork]
  );

  const transferableAssets = useMemo(() => {
    if (!activeNetwork) {
      return [];
    }

    // UnifiedBridge SDK returns the chain IDs in CAIP2 format.
    // This is good, but we need to translate it to numeric chain ids
    // until we make the switch in extension:
    return assets[activeNetwork.caipId] ?? [];
  }, [activeNetwork, assets]);

  useEffect(() => {
    request<UnifiedBridgeGetState>({
      method: ExtensionRequest.UNIFIED_BRIDGE_GET_STATE,
    }).then((currState) => {
      setState(currState);
    });

    const stateUpdateSubscription = events()
      .pipe(
        filter(isUnifiedBridgeStateUpdate),
        map((evt) => evt.value)
      )
      .subscribe((currState) => {
        setState(currState);
      });

    return () => {
      stateUpdateSubscription.unsubscribe();
    };
  }, [events, request]);

  const supportsAsset = useCallback(
    (lookupAddressOrSymbol: string, targetChainId: string) => {
      if (!activeNetwork) {
        return false;
      }

      const sourceAssets = assets[activeNetwork.caipId] ?? [];
      const asset = sourceAssets.find((token) => {
        return token.type === TokenType.NATIVE
          ? token.symbol === lookupAddressOrSymbol
          : token.address === lookupAddressOrSymbol;
      });

      if (!asset) {
        return false;
      }

      return targetChainId in asset.destinations;
    },
    [assets, activeNetwork]
  );

  const getAsset = useCallback(
    (symbol: string, chainId: string) => {
      const chainAssets = assets[chainId] ?? [];

      const asset = chainAssets.find(
        ({ symbol: assetSymbol }) => assetSymbol === symbol
      );

      return asset;
    },
    [assets]
  );

  const buildParams = useCallback(
    async (
      targetChainId: string
    ): Promise<{
      sourceChain: Chain;
      sourceChainId: string;
      targetChain: Chain;
      provider: JsonRpcApiProvider;
      fromAddress: `0x${string}`;
    }> => {
      assert(activeAccount, CommonError.NoActiveAccount);
      assert(activeNetwork, CommonError.NoActiveNetwork);
      assert(
        activeNetwork.vmName === NetworkVMType.EVM,
        UnifiedBridgeError.UnsupportedNetwork
      );

      const sourceChain = buildChain(activeNetwork.caipId);
      const targetChain = buildChain(targetChainId);

      const provider = (await getProviderForNetwork(
        activeNetwork
      )) as JsonRpcBatchInternal;

      const fromAddress = activeAccount.addressC as `0x${string}`;

      return {
        sourceChain,
        sourceChainId: activeNetwork.caipId,
        targetChain,
        provider,
        fromAddress,
      };
    },
    [activeAccount, activeNetwork, buildChain]
  );

  const getFee = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: string
    ): Promise<bigint> => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.caipId);
      assert(asset, UnifiedBridgeError.UnknownAsset);

      const feeMap = lowerCaseKeys(
        await core.getFees({
          asset,
          amount,
          targetChain: buildChain(targetChainId),
          sourceChain: buildChain(activeNetwork.caipId),
        })
      );

      const identifier =
        asset.type === TokenType.NATIVE ? asset.symbol : asset.address;

      return feeMap[identifier.toLowerCase()] ?? 0n;
    },
    [activeNetwork, core, buildChain, getAsset]
  );

  const estimateTransferGas = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: string
    ): Promise<bigint> => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.caipId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, sourceChain, targetChain } = await buildParams(
        targetChainId
      );

      const gasLimit = await core.estimateGas({
        asset,
        fromAddress,
        amount,
        sourceChain,
        targetChain,
      });

      return gasLimit;
    },
    [activeNetwork, core, buildParams, getAsset]
  );

  const getAssetIdentifierOnTargetChain = useCallback(
    (symbol?: string, targetChainId?: string) => {
      if (!symbol || !targetChainId) {
        return;
      }

      const asset = getAsset(symbol, targetChainId);

      if (!asset) {
        return;
      }

      return asset.type === TokenType.NATIVE ? asset.symbol : asset.address;
    },
    [getAsset]
  );

  const trackBridgeTransfer = useCallback(
    async (bridgeTransfer: BridgeTransfer) => {
      return request<UnifiedBridgeTrackTransfer>({
        method: ExtensionRequest.UNIFIED_BRIDGE_TRACK_TRANSFER,
        params: [bridgeTransfer],
      });
    },
    [request]
  );

  const transferAsset = useCallback(
    async (symbol: string, amount: bigint, targetChainId: string) => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.caipId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, sourceChain, targetChain } = await buildParams(
        targetChainId
      );

      let requiredSignatures = 1;
      let currentSignature = 1;

      const bridgeTransfer = await core.transferAsset({
        asset,
        fromAddress,
        amount,
        sourceChain,
        targetChain,
        onStepChange: (step) => {
          requiredSignatures = step.requiredSignatures;
          currentSignature = step.currentSignature;
        },
        sign: async ({ from, to, data }) => {
          assert(to, UnifiedBridgeError.InvalidTxPayload);
          assert(data, UnifiedBridgeError.InvalidTxPayload);

          return request(
            {
              method: RpcMethod.ETH_SEND_TRANSACTION,
              params: [
                {
                  from,
                  to,
                  data,
                },
              ],
            },
            {
              customApprovalScreenTitle: t('Confirm Bridge'),
              alert:
                requiredSignatures > currentSignature
                  ? {
                      type: 'info',
                      title: t('This operation requires {{total}} approvals.', {
                        total: requiredSignatures,
                      }),
                      notice: t(
                        'You will be prompted {{remaining}} more time(s).',
                        {
                          remaining: requiredSignatures - currentSignature,
                        }
                      ),
                    }
                  : undefined,
            }
          );
        },
      });

      await trackBridgeTransfer(bridgeTransfer);

      return bridgeTransfer.sourceTxHash;
    },
    [
      getAsset,
      request,
      activeNetwork,
      buildParams,
      core,
      t,
      trackBridgeTransfer,
    ]
  );

  const getErrorMessage = useCallback(
    (errorCode: UnifiedBridgeErrorCode) => {
      switch (errorCode) {
        case UnifiedBridgeErrorCode.BRIDGE_NOT_AVAILABLE:
          return t('Bridge not available');

        case UnifiedBridgeErrorCode.INITIALIZATION_FAILED:
          return t('Bridge initialization failed');

        case UnifiedBridgeErrorCode.INVALID_PARAMS:
          return t('Invalid transfer parameters');

        case UnifiedBridgeErrorCode.TIMEOUT:
          return t('The transaction timed out');

        case UnifiedBridgeErrorCode.TRANSACTION_REVERTED:
          return t('The transaction has been reverted');
      }
    },
    [t]
  );

  const analyzeTx = useCallback(
    (txInfo: AnalyzeTxParams) => {
      assert(core, CommonError.Unknown);

      return core.analyzeTx(txInfo);
    },
    [core]
  );

  return (
    <UnifiedBridgeContext.Provider
      value={{
        estimateTransferGas,
        getErrorMessage,
        state,
        analyzeTx,
        getAssetIdentifierOnTargetChain,
        getFee,
        supportsAsset,
        transferAsset,
        transferableAssets,
      }}
    >
      {children}
    </UnifiedBridgeContext.Provider>
  );
}

export function useUnifiedBridgeContext() {
  return useContext(UnifiedBridgeContext);
}
