import {
  AnalyzeTxParams,
  AnalyzeTxResult,
  BitcoinFunctions,
  BridgeAsset,
  BridgeInitializer,
  BridgeServicesMap,
  BridgeTransfer,
  BridgeType,
  BtcSigner,
  Chain,
  Environment,
  EvmSigner,
  GasSettings,
  TokenType,
  ErrorCode as UnifiedBridgeErrorCode,
  createUnifiedBridgeService,
  getEnabledBridgeServices,
} from '@avalabs/bridge-unified';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { filter, map } from 'rxjs';

import {
  ExtensionRequest,
  UNIFIED_BRIDGE_DEFAULT_STATE,
  UnifiedBridgeError,
  UnifiedBridgeState,
  Account,
  CommonError,
} from '@core/types';

import { RpcMethod } from '@avalabs/vm-module-types';
import {
  UnifiedBridgeGetState,
  BridgeGetStateHandler,
  UnifiedBridgeTrackTransfer,
} from '@core/service-worker';
import {
  assert,
  SupportedProvider,
  getEnabledBridgeTypes,
  getProviderForNetwork,
  isBitcoinCaipId,
  lowerCaseKeys,
  isBridgeStateUpdateEventListener,
  isUnifiedBridgeStateUpdate,
} from '@core/common';
import { useTranslation } from 'react-i18next';
import { useAccountsContext } from './AccountsProvider';
import { useConnectionContext } from './ConnectionProvider';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { useNetworkContext } from './NetworkProvider';

export interface UnifiedBridgeContext {
  estimateTransferGas(
    symbol: string,
    amount: bigint,
    targetChainId: string,
  ): Promise<bigint>;
  getAssetIdentifierOnTargetChain(
    symbol?: string,
    chainId?: string,
  ): string | undefined;
  getFee(
    symbol: string,
    amount: bigint,
    targetChainId: string,
  ): Promise<bigint>;
  analyzeTx(txInfo: AnalyzeTxParams): AnalyzeTxResult;
  supportsAsset(address: string, targetChainId: string): boolean;
  transferAsset(
    symbol: string,
    amount: bigint,
    targetChainId: string,
    gasSettings?: GasSettings,
  ): Promise<any>;
  getErrorMessage(errorCode: UnifiedBridgeErrorCode): string;
  getMinimumTransferAmount(
    asset: BridgeAsset,
    amount: bigint,
    targetChainId: string,
  ): Promise<bigint>;
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
  getMinimumTransferAmount() {
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
  children: React.ReactNode;
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
    UNIFIED_BRIDGE_DEFAULT_STATE,
  );
  const [isBridgeDevEnv, setIsBridgeDevEnv] = useState(false);
  const { featureFlags } = useFeatureFlagContext();
  const enabledBridgeTypes = useMemo(
    () => getEnabledBridgeTypes(featureFlags),
    [featureFlags],
  );

  const environment = useMemo(() => {
    if (typeof activeNetwork?.isTestnet !== 'boolean') {
      return null;
    }

    return isBridgeDevEnv
      ? Environment.DEV
      : activeNetwork.isTestnet
        ? Environment.TEST
        : Environment.PROD;
  }, [activeNetwork?.isTestnet, isBridgeDevEnv]);

  const [activeBridgeTypes, setActiveBridgeTypes] =
    useState<BridgeServicesMap>();

  const evmSigner: EvmSigner = useMemo(
    () => ({
      signMessage: async (
        data: { message: string; account: string; chainId: number },
        _,
        { currentSignature, requiredSignatures },
      ) => {
        const { message, account, chainId } = data;

        assert(message, UnifiedBridgeError.InvalidTxPayload);
        assert(account, UnifiedBridgeError.InvalidTxPayload);

        try {
          const result = await request(
            {
              method: RpcMethod.PERSONAL_SIGN,
              params: [message, account],
            },
            {
              scope: `eip155:${chainId}`,
              context: {
                customApprovalScreenTitle: t('Confirm Bridge'),
                alert:
                  requiredSignatures > currentSignature
                    ? {
                        type: 'info',
                        title: t(
                          'This operation requires {{total}} approvals.',
                          {
                            total: requiredSignatures,
                          },
                        ),
                        notice: t(
                          'You will be prompted {{remaining}} more time(s).',
                          {
                            remaining: requiredSignatures - currentSignature,
                          },
                        ),
                      }
                    : undefined,
              },
            },
          );

          return result as `0x${string}`;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
      sign: async (
        { from, data, to, value },
        _,
        { currentSignature, requiredSignatures },
      ) => {
        assert(to, UnifiedBridgeError.InvalidTxPayload);
        assert(from, UnifiedBridgeError.InvalidTxPayload);
        assert(data, UnifiedBridgeError.InvalidTxPayload);

        try {
          const result = await request(
            {
              method: RpcMethod.ETH_SEND_TRANSACTION,
              params: [
                {
                  from,
                  to,
                  data,
                  value:
                    typeof value === 'bigint'
                      ? `0x${value.toString(16)}`
                      : undefined,
                },
              ],
            },
            {
              context: {
                customApprovalScreenTitle: t('Confirm Bridge'),
                alert:
                  requiredSignatures > currentSignature
                    ? {
                        type: 'info',
                        title: t(
                          'This operation requires {{total}} approvals.',
                          {
                            total: requiredSignatures,
                          },
                        ),
                        notice: t(
                          'You will be prompted {{remaining}} more time(s).',
                          {
                            remaining: requiredSignatures - currentSignature,
                          },
                        ),
                      }
                    : undefined,
              },
            },
          );

          return result as `0x${string}`;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    }),
    [request, t],
  );

  const btcSigner: BtcSigner = useMemo(
    () => ({
      sign: async (
        { inputs, outputs },
        _,
        { requiredSignatures, currentSignature },
      ) => {
        try {
          const result = await request(
            {
              method: RpcMethod.BITCOIN_SIGN_TRANSACTION,
              params: {
                inputs,
                outputs,
              },
            },
            {
              context: {
                customApprovalScreenTitle: t('Confirm Bridge'),
                alert:
                  requiredSignatures > currentSignature
                    ? {
                        type: 'info',
                        title: t(
                          'This operation requires {{total}} approvals.',
                          {
                            total: requiredSignatures,
                          },
                        ),
                        notice: t(
                          'You will be prompted {{remaining}} more time(s).',
                          {
                            remaining: requiredSignatures - currentSignature,
                          },
                        ),
                      }
                    : undefined,
              },
            },
          );

          return result as `0x${string}`;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    }),
    [request, t],
  );

  useEffect(() => {
    if (!events || !request) {
      return;
    }

    if (!activeNetwork?.isTestnet) {
      setIsBridgeDevEnv(false);
      return;
    }

    request<BridgeGetStateHandler>({
      method: ExtensionRequest.BRIDGE_GET_STATE,
    }).then((bridgeState) => {
      setIsBridgeDevEnv(bridgeState.isDevEnv);
    });

    const subscription = events()
      .pipe(
        filter(isBridgeStateUpdateEventListener),
        map((evt) => evt.value),
      )
      .subscribe((bridgeState) => {
        setIsBridgeDevEnv(bridgeState.isDevEnv);
      });

    return () => subscription.unsubscribe();
  }, [events, request, activeNetwork?.isTestnet]);

  const getInitializerForBridgeType = useCallback(
    (
      type: BridgeType,
      bitcoinFunctions: BitcoinFunctions,
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

        case BridgeType.LOMBARD_BTC_TO_BTCB:
          return {
            type,
            evmSigner,
            btcSigner,
            bitcoinFunctions,
          };

        case BridgeType.LOMBARD_BTCB_TO_BTC:
          return {
            type,
            evmSigner,
            btcSigner,
            bitcoinFunctions,
          };
      }
    },
    [evmSigner, btcSigner],
  );

  const bridgeInitializers = useMemo(() => {
    if (!bitcoinProvider) {
      return null;
    }

    return enabledBridgeTypes.map((type) =>
      getInitializerForBridgeType(type, bitcoinProvider),
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
    [core],
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
    [getNetwork],
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
        map((evt) => evt.value),
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
    [core, activeNetwork],
  );

  const getAsset = useCallback(
    (symbol: string, chainId: string) => {
      const chainAssets = core?.getAssets()[chainId] ?? [];

      const asset = chainAssets.find(
        ({ symbol: assetSymbol }) => assetSymbol === symbol,
      );

      return asset;
    },
    [core],
  );

  const getAddresses = useCallback(
    (
      account: Account,
      sourceChain: Chain,
      targetChain: Chain,
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
    [],
  );

  const buildParams = useCallback(
    async (
      targetChainId: string,
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
        targetChain,
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
    [activeAccount, activeNetwork, buildChain, getAddresses],
  );

  const getFee = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: string,
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
        }),
      );

      // We currently operate on the assumption that the fee is paid in the
      // same token as is bridged.
      // Although sometimes it may be paid on the source chain (as is the case for CCTP),
      // and sometimes it may be paid on the target chain (i.e. Avalanche Bridge), the
      // result for the end users is that the received amount on the target chain is lowered
      // by the fee amount.
      const feeChainId = Object.keys(feeMap)[0]; // ID of the chain where the fee is paid
      assert(feeChainId, UnifiedBridgeError.InvalidFee);
      const feeChain = feeMap[feeChainId];
      assert(feeChain, UnifiedBridgeError.InvalidFee);
      const feeAssetId = Object.keys(feeChain)[0]; // address or "NATIVE"
      assert(feeAssetId, UnifiedBridgeError.InvalidFee);

      return feeChain[feeAssetId] ?? 0n;
    },
    [activeNetwork, core, buildChain, getAsset],
  );

  const estimateTransferGas = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: string,
    ): Promise<bigint> => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.caipId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, sourceChain, targetChain } =
        await buildParams(targetChainId);

      const gasLimit = await core.estimateGas({
        asset,
        fromAddress,
        amount,
        sourceChain,
        targetChain,
      });

      return gasLimit;
    },
    [activeNetwork, core, buildParams, getAsset],
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
    [getAsset],
  );

  const trackBridgeTransfer = useCallback(
    async (bridgeTransfer: BridgeTransfer) => {
      return request<UnifiedBridgeTrackTransfer>({
        method: ExtensionRequest.UNIFIED_BRIDGE_TRACK_TRANSFER,
        params: [bridgeTransfer],
      });
    },
    [request],
  );

  const transferAsset = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: string,
      gasSettings?: GasSettings,
    ) => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      const asset = getAsset(symbol, activeNetwork.caipId);

      assert(asset, UnifiedBridgeError.UnknownAsset);

      const { fromAddress, toAddress, sourceChain, targetChain } =
        await buildParams(targetChainId);

      try {
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
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    [getAsset, activeNetwork, buildParams, core, trackBridgeTransfer],
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
    [t],
  );

  const analyzeTx = useCallback(
    (txInfo: AnalyzeTxParams) => {
      assert(core, CommonError.Unknown);

      return core.analyzeTx(txInfo);
    },
    [core],
  );

  const getMinimumTransferAmount = useCallback(
    async (asset: BridgeAsset, amount: bigint, targetChainId: string) => {
      assert(core, CommonError.Unknown);
      assert(activeNetwork, CommonError.NoActiveNetwork);

      return core.getMinimumTransferAmount({
        asset,
        amount,
        sourceChain: buildChain(activeNetwork.caipId),
        targetChain: buildChain(targetChainId),
      });
    },
    [core, buildChain, activeNetwork],
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
        getMinimumTransferAmount,
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
