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
} from '@avalabs/bridge-unified';
import { ethErrors } from 'eth-rpc-errors';
import { filter, map } from 'rxjs';

import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { chainIdToCaip } from '@src/utils/caipConversion';
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
import { getNetworkCaipId } from '@src/utils/caipConversion';
import { useAccountsContext } from './AccountsProvider';
import { JsonRpcApiProvider } from 'ethers';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { EthSendTransactionHandler } from '@src/background/services/wallet/handlers/eth_sendTransaction';
import { UnifiedBridgeTrackTransfer } from '@src/background/services/unifiedBridge/handlers/unifiedBridgeTrackTransfer';

export interface UnifiedBridgeContext {
  estimateTransferGas(
    symbol: string,
    amount: bigint,
    targetChainId: number
  ): Promise<bigint>;
  getAssetAddressOnTargetChain(
    symbol?: string,
    chainId?: number
  ): string | undefined;
  getFee(
    symbol: string,
    amount: bigint,
    targetChainId: number
  ): Promise<bigint>;
  supportsAsset(address: string, targetChainId: number): boolean;
  transferAsset(
    symbol: string,
    amount: bigint,
    targetChainId: number
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
  getAssetAddressOnTargetChain() {
    return undefined;
  },
  getErrorMessage() {
    return '';
  },
  supportsAsset() {
    return false;
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
  const disabledBridges = useMemo(
    () => (isCCTPDisabled ? [BridgeType.CCTP] : []),
    [isCCTPDisabled]
  );

  // Memoize the core instance of Unified Bridge based on the current
  // network environment & feature flags configuration
  const core = useMemo(
    () =>
      activeNetwork
        ? createUnifiedBridgeService({
            environment: activeNetwork.isTestnet
              ? Environment.TEST
              : Environment.PROD,
            disabledBridgeTypes: disabledBridges,
          })
        : null,
    [activeNetwork, disabledBridges]
  );

  // Whenever core instance is re-created, initialize it and update assets
  useEffect(() => {
    if (!core) {
      return;
    }

    let isMounted = true;

    core.init().then(async () => {
      if (!isMounted) {
        return;
      }

      setAssets(await core.getAssets());
    });

    return () => {
      isMounted = false;
    };
  }, [core]);

  const buildChain = useCallback(
    (chainId: number) => {
      const network = getNetwork(chainId);

      assert(network, CommonError.UnknownNetwork);

      return {
        chainId: chainIdToCaip(network.chainId),
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
    return assets[getNetworkCaipId(activeNetwork)] ?? [];
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
    (lookupAddress: string, targetChainId: number) => {
      if (!activeNetwork) {
        return false;
      }

      const sourceAssets = assets[getNetworkCaipId(activeNetwork)] ?? [];
      const asset = sourceAssets.find(({ address }) => {
        return lookupAddress === address;
      });

      if (!asset) {
        return false;
      }

      return chainIdToCaip(targetChainId) in asset.destinations;
    },
    [assets, activeNetwork]
  );

  const getAsset = useCallback(
    (symbol: string, chainId: number) => {
      const chainAssets = assets[chainIdToCaip(chainId)] ?? [];

      const asset = chainAssets.find(
        ({ symbol: assetSymbol }) => assetSymbol === symbol
      );

      return asset;
    },
    [assets]
  );

  const buildParams = useCallback(
    (
      targetChainId: number
    ): {
      sourceChain: Chain;
      sourceChainId: number;
      targetChain: Chain;
      provider: JsonRpcApiProvider;
      fromAddress: `0x${string}`;
    } => {
      assert(activeAccount, CommonError.NoActiveAccount);
      assert(activeNetwork, CommonError.NoActiveNetwork);
      assert(
        activeNetwork.vmName === NetworkVMType.EVM,
        UnifiedBridgeError.UnsupportedNetwork
      );

      const sourceChain = buildChain(activeNetwork.chainId);
      const targetChain = buildChain(targetChainId);

      const provider = getProviderForNetwork(
        activeNetwork
      ) as JsonRpcBatchInternal;

      const fromAddress = activeAccount.addressC as `0x${string}`;

      return {
        sourceChain,
        sourceChainId: activeNetwork.chainId,
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
      targetChainId: number
    ): Promise<bigint> => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.chainId);

      assert(asset?.address, UnifiedBridgeError.UnknownAsset);

      const feeMap = await core.getFees({
        asset,
        amount,
        targetChain: buildChain(targetChainId),
        sourceChain: buildChain(activeNetwork.chainId),
      });

      const fee = feeMap[asset.address];

      if (typeof fee !== 'bigint') {
        throw ethErrors.rpc.invalidRequest({
          data: {
            reason: UnifiedBridgeError.InvalidFee,
          },
        });
      }

      return fee;
    },
    [activeNetwork, core, buildChain, getAsset]
  );

  const estimateTransferGas = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: number
    ): Promise<bigint> => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.chainId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, sourceChain, targetChain } =
        buildParams(targetChainId);

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

  const getAssetAddressOnTargetChain = useCallback(
    (symbol?: string, targetChainId?: number) => {
      if (!symbol || !targetChainId) {
        return;
      }

      const asset = getAsset(symbol, targetChainId);

      return asset?.address;
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
    async (symbol: string, amount: bigint, targetChainId: number) => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.chainId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, sourceChain, targetChain } =
        buildParams(targetChainId);

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

          return request<EthSendTransactionHandler>({
            method: DAppProviderRequest.ETH_SEND_TX,
            params: [
              {
                from,
                to,
                data,
              },
              {
                customApprovalScreenTitle: t('Confirm Bridge'),
                contextInformation:
                  requiredSignatures > currentSignature
                    ? {
                        title: t(
                          'This operation requires {{total}} approvals.',
                          {
                            total: requiredSignatures,
                          }
                        ),
                        notice: t(
                          'You will be prompted {{remaining}} more time(s).',
                          {
                            remaining: requiredSignatures - currentSignature,
                          }
                        ),
                      }
                    : undefined,
              },
            ],
          });
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

  return (
    <UnifiedBridgeContext.Provider
      value={{
        estimateTransferGas,
        getErrorMessage,
        state,
        getAssetAddressOnTargetChain,
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
