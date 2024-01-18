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
  BridgeStepDetails,
  ChainAssetMap,
  ErrorCode,
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
import {
  UnifiedBridgeTransferAsset,
  UnifiedBridgeGetFee,
  UnifiedBridgeGetState,
} from '@src/background/services/unifiedBridge/handlers';
import {
  isUnifiedBridgeAssetsUpdatedEvent,
  isUnifiedBridgeStateUpdate,
  isUnifiedBridgeTransferStepChanged,
} from '@src/background/services/unifiedBridge/events/eventFilters';

import { useNetworkContext } from './NetworkProvider';
import { useConnectionContext } from './ConnectionProvider';
import { CommonError } from '@src/utils/errors';
import { UnifiedBridgeGetAssets } from '@src/background/services/unifiedBridge/handlers/unifiedBridgeGetAssets';
import { useTranslation } from 'react-i18next';

interface UnifiedBridgeContext {
  getFee(
    symbol: string,
    amount: bigint,
    targetChainId: number
  ): Promise<bigint>;
  supportsAsset(address: string, targetChainId: number): boolean;
  transferAsset(
    symbol: string,
    amount: bigint,
    targetChainId: number,
    onStepChange: (stepDetails: BridgeStepDetails) => void
  ): Promise<any>;
  getErrorMessage(errorCode: ErrorCode): string;
  transferableAssets: BridgeAsset[];
  state: UnifiedBridgeState;
}

const DEFAULT_STATE = {
  state: UNIFIED_BRIDGE_DEFAULT_STATE,
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

export function UnifiedBridgeProvider({
  children,
}: {
  children: React.ReactChild;
}) {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const { events, request } = useConnectionContext();
  const [assets, setAssets] = useState<ChainAssetMap>({});
  const [state, setState] = useState<UnifiedBridgeState>(
    UNIFIED_BRIDGE_DEFAULT_STATE
  );

  const transferableAssets = useMemo(() => {
    if (!network?.chainId) {
      return [];
    }

    // UnifiedBridge SDK returns the chain IDs in CAIP2 format.
    // This is good, but we need to translate it to numeric chain ids
    // until we make the switch in extension:
    return assets[chainIdToCaip(network.chainId)] ?? [];
  }, [network, assets]);

  useEffect(() => {
    request<UnifiedBridgeGetState>({
      method: ExtensionRequest.UNIFIED_BRIDGE_GET_STATE,
    }).then((currState) => {
      setState(currState);
    });

    request<UnifiedBridgeGetAssets>({
      method: ExtensionRequest.UNIFIED_BRIDGE_GET_ASSETS,
    }).then((newAssets) => {
      setAssets(newAssets);
    });

    const stateUpdateSubscription = events()
      .pipe(
        filter(isUnifiedBridgeStateUpdate),
        map((evt) => evt.value)
      )
      .subscribe((currState) => {
        setState(currState);
      });

    const assetListSubscription = events()
      .pipe(
        filter(isUnifiedBridgeAssetsUpdatedEvent),
        map((evt) => evt.value)
      )
      .subscribe((newAssets) => {
        setAssets(newAssets);
      });

    return () => {
      stateUpdateSubscription.unsubscribe();
      assetListSubscription.unsubscribe();
    };
  }, [events, request]);

  const supportsAsset = useCallback(
    (lookupAddress: string, targetChainId: number) => {
      if (!network) {
        return false;
      }

      const sourceAssets = assets[chainIdToCaip(network.chainId)] ?? [];
      const asset = sourceAssets.find(({ address }) => {
        return lookupAddress === address;
      });

      if (!asset) {
        return false;
      }

      return chainIdToCaip(targetChainId) in asset.destinations;
    },
    [assets, network]
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

  const getFee = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: number
    ): Promise<bigint> => {
      if (!network) {
        throw ethErrors.rpc.internal({
          data: { reason: CommonError.UnknownNetwork },
        });
      }

      const asset = getAsset(symbol, network.chainId);

      if (!asset) {
        throw ethErrors.rpc.invalidParams({
          data: { reason: UnifiedBridgeError.UnknownAsset },
        });
      }

      return request<UnifiedBridgeGetFee>({
        method: ExtensionRequest.UNIFIED_BRIDGE_GET_FEE,
        params: [asset, amount, network.chainId, targetChainId],
      });
    },
    [getAsset, network, request]
  );

  const transferAsset = useCallback(
    async (
      symbol: string,
      amount: bigint,
      targetChainId: number,
      onStepChange: (stepDetails: BridgeStepDetails) => void
    ) => {
      if (!network) {
        throw ethErrors.rpc.internal({
          data: { reason: CommonError.UnknownNetwork },
        });
      }

      const asset = getAsset(symbol, network.chainId);

      if (!asset) {
        throw ethErrors.rpc.invalidParams({
          data: { reason: UnifiedBridgeError.UnknownAsset },
        });
      }

      const transferEventSubscription = events()
        .pipe(
          filter(isUnifiedBridgeTransferStepChanged),
          map((evt) => evt.value)
        )
        .subscribe((event) => {
          onStepChange(event);
        });

      const txHash = request<UnifiedBridgeTransferAsset>({
        method: ExtensionRequest.UNIFIED_BRIDGE_TRANSFER_ASSET,
        params: [asset, amount, targetChainId],
      }).finally(() => {
        transferEventSubscription.unsubscribe();
      });

      return txHash;
    },
    [getAsset, request, network, events]
  );

  const getErrorMessage = useCallback(
    (errorCode: ErrorCode) => {
      switch (errorCode) {
        case ErrorCode.BRIDGE_NOT_AVAILABLE:
          return t('Bridge not available');

        case ErrorCode.INITIALIZATION_FAILED:
          return t('Bridge initialization failed');

        case ErrorCode.INVALID_PARAMS:
          return t('Invalid transfer parameters');

        case ErrorCode.TIMEOUT:
          return t('The transaction timed out');

        case ErrorCode.TRANSACTION_REVERTED:
          return t('The transaction has been reverted');
      }
    },
    [t]
  );

  return (
    <UnifiedBridgeContext.Provider
      value={{
        getErrorMessage,
        state,
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
