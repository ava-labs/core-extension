import {
  AnalyzeTxParams,
  AnalyzeTxResult,
  BridgeAsset,
  GasSettings,
  ErrorCode as UnifiedBridgeErrorCode,
} from '@avalabs/bridge-unified';
import { ChainId } from '@avalabs/core-chains-sdk';
import { assert, caipToChainId, chainIdToCaip } from '@core/common';
import {
  CommonError,
  NetworkWithCaipId,
  UnifiedBridgeState,
} from '@core/types';
import { useNetworkContext } from '@core/ui';
import { promoteAvalancheNetworks } from '@core/ui/src/contexts/NetworkProvider/networkSortingFn';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAssetIdentifier,
  useBridgeEnvironment,
  useCoreBridgeService,
  useEstimateTransferGas,
  useFee,
  useMinimumTransferAmount,
  useSupportsAsset,
  useTransferAsset,
  useUnifiedBridgeState,
} from './hooks';
import { getChainAssets, getEnvironment, getErrorMessage } from './utils';

export interface UnifiedBridgeContext {
  sourceNetwork: NetworkWithCaipId | undefined;
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
  availableChainIds: NetworkWithCaipId['caipId'][];
  isReady: boolean;
}

const NextUnifiedBridgeContext = createContext<
  UnifiedBridgeContext | undefined
>(undefined);

type Props = PropsWithChildren<{
  sourceNetworkId: NetworkWithCaipId['caipId'];
}>;

const AVAX_CAIPS = {
  mainnet: [ChainId.AVALANCHE_P, ChainId.AVALANCHE_X].map(chainIdToCaip),
  devnet: [ChainId.AVALANCHE_TEST_P, ChainId.AVALANCHE_TEST_X].map(
    chainIdToCaip,
  ),
} as const;

export function NextUnifiedBridgeProvider({
  children,
  sourceNetworkId,
}: Props) {
  const { t } = useTranslation();
  const { getNetwork, bitcoinProvider, isDeveloperMode } = useNetworkContext();
  const state = useUnifiedBridgeState();
  const sourceNetwork = getNetwork(sourceNetworkId);

  const { isBridgeDevEnv } = useBridgeEnvironment(isDeveloperMode);
  const core = useCoreBridgeService(
    getEnvironment(isDeveloperMode, isBridgeDevEnv),
    bitcoinProvider,
  );

  const availableChainIds = useMemo(
    () =>
      [
        ...Object.keys(core?.getAssets() ?? {}),
        ...AVAX_CAIPS[isDeveloperMode ? 'devnet' : 'mainnet'],
      ].sort((one, another) =>
        promoteAvalancheNetworks(caipToChainId(one), caipToChainId(another)),
      ),
    [core, isDeveloperMode],
  );

  const transferableAssets = useMemo(() => {
    return getChainAssets(core, sourceNetworkId);
  }, [core, sourceNetworkId]);

  const analyzeTx = useCallback(
    (txInfo: AnalyzeTxParams) => {
      assert(core, CommonError.Unknown);
      return core.analyzeTx(txInfo);
    },
    [core],
  );
  const estimateTransferGas = useEstimateTransferGas(core, sourceNetwork);
  const getAssetIdentifierOnTargetChain = useAssetIdentifier(core);
  const getFee = useFee(core, sourceNetwork);
  const getMinimumTransferAmount = useMinimumTransferAmount(
    core,
    sourceNetwork,
  );
  const supportsAsset = useSupportsAsset(core, sourceNetwork);
  const transferAsset = useTransferAsset(core, sourceNetwork);

  const context = useMemo<UnifiedBridgeContext>(() => {
    return {
      isReady: !!core,
      availableChainIds,
      estimateTransferGas,
      getErrorMessage: getErrorMessage(t),
      state,
      analyzeTx,
      getAssetIdentifierOnTargetChain,
      getMinimumTransferAmount,
      getFee,
      supportsAsset,
      transferAsset,
      transferableAssets,
      sourceNetwork,
    };
  }, [
    core,
    availableChainIds,
    estimateTransferGas,
    t,
    state,
    analyzeTx,
    getAssetIdentifierOnTargetChain,
    getMinimumTransferAmount,
    getFee,
    supportsAsset,
    transferAsset,
    transferableAssets,
    sourceNetwork,
  ]);

  return (
    <NextUnifiedBridgeContext value={context}>
      {children}
    </NextUnifiedBridgeContext>
  );
}

export function useNextUnifiedBridgeContext() {
  const context = useContext(NextUnifiedBridgeContext);
  if (!context) {
    throw new Error(
      'useNextUnifiedBridgeContext must be used within a NextUnifiedBridgeContextProvider',
    );
  }

  return context;
}
