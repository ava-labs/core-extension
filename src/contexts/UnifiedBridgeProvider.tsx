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
  Environment,
  ErrorCode as UnifiedBridgeErrorCode,
  TokenType,
  createUnifiedBridgeService,
  BridgeTransfer,
  getEnabledBridgeServices,
  BridgeServicesMap,
  AnalyzeTxParams,
  AnalyzeTxResult,
  EvmSigner,
  BtcSigner,
  BitcoinFunctions,
  BridgeInitializer,
  GasSettings,
} from '@avalabs/bridge-unified';
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
import { CommonError } from '@src/utils/errors';
import { useTranslation } from 'react-i18next';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { useAccountsContext } from './AccountsProvider';
import { UnifiedBridgeTrackTransfer } from '@src/background/services/unifiedBridge/handlers/unifiedBridgeTrackTransfer';
import { lowerCaseKeys } from '@src/utils/lowerCaseKeys';
import { RpcMethod } from '@avalabs/vm-module-types';
import { isBitcoinCaipId } from '@src/utils/caipConversion';
import { Account } from '@src/background/services/accounts/models';
import { getEnabledBridgeTypes } from '@src/utils/getEnabledBridgeTypes';
import {
  SupportedProvider,
  getProviderForNetwork,
} from '@src/utils/network/getProviderForNetwork';
import { assert } from '@src/utils/assertions';

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
    targetChainId: string,
    gasSettings?: GasSettings
  ): Promise<any>;
  getErrorMessage(errorCode: UnifiedBridgeErrorCode): string;
  transferableAssets: BridgeAsset[];
  state: UnifiedBridgeState;
  availableChainIds: string[];
  isReady: boolean;
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
  availableChainIds: [],
  isReady: false,
};

const UnifiedBridgeContext = createContext<UnifiedBridgeContext>(DEFAULT_STATE);

export function UnifiedBridgeProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  const { t } = useTranslation();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const {
    network: activeNetwork,
    getNetwork,
    bitcoinProvider,
  } = useNetworkContext();
  const { events, request } = useConnectionContext();
  const [state, setState] = useState<UnifiedBridgeState>(
    UNIFIED_BRIDGE_DEFAULT_STATE
  );
  const { featureFlags } = useFeatureFlagContext();
  const enabledBridgeTypes = useMemo(
    () => getEnabledBridgeTypes(featureFlags),
    [featureFlags]
  );

  const environment = useMemo(() => {
    if (typeof activeNetwork?.isTestnet !== 'boolean') {
      return null;
    }

    return activeNetwork.isTestnet ? Environment.TEST : Environment.PROD;
  }, [activeNetwork?.isTestnet]);

  const [activeBridgeTypes, setActiveBridgeTypes] =
    useState<BridgeServicesMap>();

  const evmSigner: EvmSigner = useMemo(
    () => ({
      sign: async (
        { from, data, to },
        _,
        { currentSignature, requiredSignatures }
      ) => {
        assert(to, UnifiedBridgeError.InvalidTxPayload);
        assert(from, UnifiedBridgeError.InvalidTxPayload);
        assert(data, UnifiedBridgeError.InvalidTxPayload);

        const result = await request(
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

        return result as `0x${string}`;
      },
    }),
    [request, t]
  );

  const btcSigner: BtcSigner = useMemo(
    () => ({
      sign: async (
        { inputs, outputs },
        _,
        { requiredSignatures, currentSignature }
      ) => {
        const result = await request(
          {
            method: RpcMethod.BITCOIN_SIGN_TRANSACTION,
            params: {
              inputs,
              outputs,
            },
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

        return result as `0x${string}`;
      },
    }),
    [request, t]
  );

  const getInitializerForBridgeType = useCallback(
    (
      type: BridgeType,
      bitcoinFunctions: BitcoinFunctions
    ): BridgeInitializer => {
      switch (type) {
        case BridgeType.CCTP:
        case BridgeType.ICTT_ERC20_ERC20:
        case BridgeType.AVALANCHE_EVM:
          return {
            type,
            signer: evmSigner,
          };

        case BridgeType.AVALANCHE_AVA_BTC:
          return {
            type,
            signer: evmSigner,
            bitcoinFunctions,
          };

        case BridgeType.AVALANCHE_BTC_AVA:
          return {
            type,
            signer: btcSigner,
            bitcoinFunctions,
          };
      }
    },
    [evmSigner, btcSigner]
  );

  const bridgeInitializers = useMemo(() => {
    if (!bitcoinProvider) {
      return null;
    }

    return enabledBridgeTypes.map((type) =>
      getInitializerForBridgeType(type, bitcoinProvider)
    );
  }, [enabledBridgeTypes, getInitializerForBridgeType, bitcoinProvider]);

  useEffect(() => {
    if (!environment || !bridgeInitializers) {
      return;
    }

    let isMounted = true;

    getEnabledBridgeServices(environment, bridgeInitializers)
      .then((bridges) => {
        if (isMounted) setActiveBridgeTypes(bridges);
      })
      .catch((err) => {
        console.log('Unable to initialize bridge services', err);
        if (isMounted) setActiveBridgeTypes(undefined);
      });

    return () => {
      isMounted = false;
    };
  }, [environment, bridgeInitializers]);

  // Memoize the core instance of Unified Bridge based on the current
  // network environment & feature flags configuration
  const core = useMemo(() => {
    if (!environment || !activeBridgeTypes) {
      return null;
    }

    return createUnifiedBridgeService({
      environment,
      enabledBridgeServices: activeBridgeTypes,
    });
  }, [environment, activeBridgeTypes]);

  const availableChainIds = useMemo(
    () => Object.keys(core?.getAssets() ?? {}),
    [core]
  );

  const buildChain = useCallback(
    (chainId: string): Chain => {
      const network = getNetwork(chainId);

      assert(network, CommonError.UnknownNetwork);

      return {
        chainId: network.caipId,
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
    if (!activeNetwork || !core) {
      return [];
    }

    return core.getAssets()[activeNetwork.caipId] ?? [];
  }, [activeNetwork, core]);

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
      if (!activeNetwork || !core) {
        return false;
      }

      const sourceAssets = core?.getAssets()[activeNetwork.caipId] ?? [];
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
    [core, activeNetwork]
  );

  const getAsset = useCallback(
    (symbol: string, chainId: string) => {
      const chainAssets = core?.getAssets()[chainId] ?? [];

      const asset = chainAssets.find(
        ({ symbol: assetSymbol }) => assetSymbol === symbol
      );

      return asset;
    },
    [core]
  );

  const getAddresses = useCallback(
    (
      account: Account,
      sourceChain: Chain,
      targetChain: Chain
    ): { fromAddress: string; toAddress: string } => {
      const isFromBitcoin = isBitcoinCaipId(sourceChain.chainId);
      const isToBitcoin = isBitcoinCaipId(targetChain.chainId);

      if (isFromBitcoin || isToBitcoin) {
        assert(account.addressBTC, UnifiedBridgeError.NonBitcoinAccount);

        return {
          fromAddress: isFromBitcoin ? account.addressBTC : account.addressC,
          toAddress: isFromBitcoin ? account.addressC : account.addressBTC,
        };
      }

      return {
        fromAddress: account.addressC,
        toAddress: account.addressC,
      };
    },
    []
  );

  const buildParams = useCallback(
    async (
      targetChainId: string
    ): Promise<{
      sourceChain: Chain;
      sourceChainId: string;
      targetChain: Chain;
      provider: SupportedProvider;
      fromAddress: string;
      toAddress: string;
    }> => {
      assert(activeAccount, CommonError.NoActiveAccount);
      assert(activeNetwork, CommonError.NoActiveNetwork);
      assert(activeAccount, CommonError.NoActiveAccount);

      const sourceChain = buildChain(activeNetwork.caipId);
      const targetChain = buildChain(targetChainId);

      const provider = await getProviderForNetwork(activeNetwork);

      const { fromAddress, toAddress } = getAddresses(
        activeAccount,
        sourceChain,
        targetChain
      );

      return {
        sourceChain,
        sourceChainId: activeNetwork.caipId,
        targetChain,
        provider,
        fromAddress,
        toAddress,
      };
    },
    [activeAccount, activeNetwork, buildChain, getAddresses]
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

      assert(identifier, UnifiedBridgeError.InvalidFee);

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
    async (
      symbol: string,
      amount: bigint,
      targetChainId: string,
      gasSettings?: GasSettings
    ) => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.caipId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, toAddress, sourceChain, targetChain } =
        await buildParams(targetChainId);

      const bridgeTransfer = await core.transferAsset({
        asset,
        fromAddress,
        toAddress,
        amount,
        sourceChain,
        targetChain,
        gasSettings,
      });

      await trackBridgeTransfer(bridgeTransfer);

      return bridgeTransfer.sourceTxHash;
    },
    [getAsset, activeNetwork, buildParams, core, trackBridgeTransfer]
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
        availableChainIds,
        estimateTransferGas,
        getErrorMessage,
        isReady: !!core,
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
