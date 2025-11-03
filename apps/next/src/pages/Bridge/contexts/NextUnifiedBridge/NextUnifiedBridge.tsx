import { ChainId } from '@avalabs/core-chains-sdk';
import { assert, caipToChainId, chainIdToCaip } from '@core/common';
import { CommonError, NetworkWithCaipId } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { promoteAvalancheNetworks } from '@core/ui/src/contexts/NetworkProvider/networkSortingFn';
import { memoize } from 'lodash';
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { isTransactionConfirming } from '../../lib/isTransactionConfirming';
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
import { UnifiedBridgeContext } from './types';
import { getChainAssets, getEnvironment } from './utils';

const NextUnifiedBridgeContext = createContext<
  UnifiedBridgeContext | undefined
>(undefined);

const AVAX_CAIPS = {
  mainnet: [ChainId.AVALANCHE_P, ChainId.AVALANCHE_X].map(chainIdToCaip),
  devnet: [ChainId.AVALANCHE_TEST_P, ChainId.AVALANCHE_TEST_X].map(
    chainIdToCaip,
  ),
} as const;

export function NextUnifiedBridgeProvider({ children }: PropsWithChildren) {
  const { bitcoinProvider, isDeveloperMode } = useNetworkContext();
  const state = useUnifiedBridgeState();

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

  const getTransferableAssets = useMemo(
    () =>
      memoize((caipId: NetworkWithCaipId['caipId']) =>
        getChainAssets(core, caipId),
      ),
    [core],
  );

  const estimateTransferGas = useEstimateTransferGas(core);
  const getAssetIdentifierOnTargetChain = useAssetIdentifier(core);
  const getFee = useFee(core);
  const getMinimumTransferAmount = useMinimumTransferAmount(core);
  const supportsAsset = useSupportsAsset(core);
  const transferAsset = useTransferAsset(core);

  const context = useMemo<UnifiedBridgeContext>(() => {
    return {
      isReady: !!core,
      availableChainIds,
      estimateTransferGas,
      state,
      getAssetIdentifierOnTargetChain,
      getMinimumTransferAmount,
      getFee,
      supportsAsset,
      transferAsset,
      getTransferableAssets,
      isTxConfirming: (txHash) =>
        isTransactionConfirming(txHash, state.pendingTransfers),
      analyzeTx: (txInfo) => {
        assert(core, CommonError.Unknown);
        return core.analyzeTx(txInfo);
      },
    };
  }, [
    core,
    availableChainIds,
    estimateTransferGas,
    state,
    getAssetIdentifierOnTargetChain,
    getMinimumTransferAmount,
    getFee,
    supportsAsset,
    transferAsset,
    getTransferableAssets,
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
