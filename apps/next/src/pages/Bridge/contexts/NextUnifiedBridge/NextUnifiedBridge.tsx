import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';
import { assert, caipToChainId } from '@core/common';
import { CommonError, NetworkWithCaipId } from '@core/types';
import {
  promoteNetworks,
  useAccountsContext,
  useNetworkContext,
} from '@core/ui';
import { memoize } from 'lodash';
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { useBridgeEnvironment } from '@/hooks/useBridgeEnvironment';
import {
  useCoreBridgeService,
  useGetFee,
  useGetMinimumTransferAmount,
  useGetTransferGasEstimate,
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
  mainnet: [AvalancheCaip2ChainId.P, AvalancheCaip2ChainId.X],
  devnet: [AvalancheCaip2ChainId.P_TESTNET, AvalancheCaip2ChainId.X_TESTNET],
} as const;

export function NextUnifiedBridgeProvider({ children }: PropsWithChildren) {
  const { bitcoinProvider, isDeveloperMode } = useNetworkContext();
  const state = useUnifiedBridgeState();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { isBridgeDevEnv, setBridgeDevMode } =
    useBridgeEnvironment(isDeveloperMode);
  const currentEnvironment = getEnvironment(isDeveloperMode, isBridgeDevEnv);
  const core = useCoreBridgeService(
    currentEnvironment,
    bitcoinProvider,
    isDeveloperMode,
  );

  const filteredState = useMemo(() => {
    if (!currentEnvironment || !activeAccount) {
      return { ...state, pendingTransfers: {} };
    }

    const filteredTransfers = Object.fromEntries(
      Object.entries(state.pendingTransfers).filter(([, transfer]) => {
        if (transfer.environment !== currentEnvironment) {
          return false;
        }

        return (
          transfer.fromAddress === activeAccount.addressC ||
          transfer.fromAddress === activeAccount.addressBTC
        );
      }),
    );

    return {
      ...state,
      pendingTransfers: filteredTransfers,
    };
  }, [state, currentEnvironment, activeAccount]);

  const availableChainIds = useMemo(
    () =>
      [
        ...Object.keys(core?.getAssets() ?? {}),
        ...AVAX_CAIPS[isDeveloperMode ? 'devnet' : 'mainnet'],
      ].sort((one, another) =>
        promoteNetworks(caipToChainId(one), caipToChainId(another)),
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

  const estimateTransferGas = useGetTransferGasEstimate(core);
  const getFee = useGetFee(core);
  const getMinimumTransferAmount = useGetMinimumTransferAmount(core);
  const supportsAsset = useSupportsAsset(core);
  const transferAsset = useTransferAsset(core);

  const context = useMemo<UnifiedBridgeContext>(() => {
    return {
      isReady: !!core,
      devMode: {
        enabled: isBridgeDevEnv,
        set: setBridgeDevMode,
      },
      availableChainIds,
      estimateTransferGas,
      state: filteredState,
      getMinimumTransferAmount,
      getFee,
      supportsAsset,
      transferAsset,
      getTransferableAssets,
      analyzeTx: (txInfo) => {
        assert(core, CommonError.Unknown);
        return core.analyzeTx(txInfo);
      },
    };
  }, [
    core,
    isBridgeDevEnv,
    setBridgeDevMode,
    availableChainIds,
    estimateTransferGas,
    filteredState,
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
