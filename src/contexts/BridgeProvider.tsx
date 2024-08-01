import {
  Asset,
  BridgeSDKProvider,
  Environment,
  setBridgeEnvironment,
  useBridgeSDK,
  WrapStatus,
} from '@avalabs/core-bridge-sdk';
import { ChainId } from '@avalabs/core-chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  isBridgeStateUpdateEventListener,
  isBridgeTransferEventListener,
} from '@src/background/services/bridge/events/listeners';
import { BridgeCreateTransactionHandler } from '@src/background/services/bridge/handlers/createBridgeTransaction';
import { BridgeGetStateHandler } from '@src/background/services/bridge/handlers/getBridgeState';
import { BridgeRemoveTransactionHandler } from '@src/background/services/bridge/handlers/removeBridgeTransaction';
import { BridgeSetIsDevEnvHandler } from '@src/background/services/bridge/handlers/setIsDevEnv';
import { BridgeTransferAssetHandler } from '@src/background/services/bridge/handlers/transferAsset';
import {
  CustomGasSettings,
  BridgeState,
  DefaultBridgeState,
  PartialBridgeTransaction,
  TransferEventType,
} from '@src/background/services/bridge/models';
import { filterBridgeStateToNetwork } from '@src/background/services/bridge/utils';
import Big from 'big.js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { useNetworkContext } from './NetworkProvider';
import { EstimateGasForBridgeTxHandler } from '@src/background/services/bridge/handlers/estimateGasForBridgeTx';

interface BridgeContext {
  createBridgeTransaction(tx: PartialBridgeTransaction): Promise<void>;
  removeBridgeTransaction(txHash: string): Promise<void>;
  bridgeTransactions: BridgeState['bridgeTransactions'];
  estimateGas: (amount: Big, asset: Asset) => Promise<bigint | undefined>;
  transferAsset: (
    amount: Big,
    asset: Asset,
    customGasSettings: CustomGasSettings,
    onStatusChange: (status: WrapStatus) => void,
    onTxHashChange: (txHash: string) => void
  ) => Promise<{ hash: string }>;
  isBridgeDevEnv: boolean;
  setIsBridgeDevEnv: (enabled: boolean) => void;
  bridgeState: BridgeState;
}

const bridgeContext = createContext<BridgeContext>({} as any);

export function BridgeProvider({ children }: { children: any }) {
  const { network } = useNetworkContext();

  useEffect(() => {
    setBridgeEnvironment(
      network?.chainId === ChainId.AVALANCHE_MAINNET_ID
        ? Environment.PROD
        : Environment.TEST
    );
  }, [network]);

  return (
    <BridgeSDKProvider>
      <InnerBridgeProvider>{children}</InnerBridgeProvider>
    </BridgeSDKProvider>
  );
}

export function useBridgeContext() {
  return useContext(bridgeContext);
}

// This component is separate so it has access to useBridgeSDK
function InnerBridgeProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { currentBlockchain } = useBridgeSDK();
  const { network } = useNetworkContext();
  const [bridgeState, setBridgeState] =
    useState<BridgeState>(DefaultBridgeState);
  // Separate from bridgeState so they can be filtered to the current network
  const [bridgeTransactions, setBridgeTransactions] = useState<
    BridgeState['bridgeTransactions']
  >({});
  const [isBridgeDevEnv, setIsDevEnvInternal] = useState<boolean>(false);

  useEffect(() => {
    if (!events) {
      return;
    }

    request<BridgeGetStateHandler>({
      method: ExtensionRequest.BRIDGE_GET_STATE,
    }).then((txs) => {
      setBridgeState(txs);
    });

    const subscription = events()
      .pipe(
        filter(isBridgeStateUpdateEventListener),
        map((evt) => evt.value)
      )
      .subscribe((txs) => {
        setBridgeState(txs);
      });

    return () => subscription.unsubscribe();
  }, [events, request]);

  useEffect(() => {
    if (!network) return;
    const filteredState = filterBridgeStateToNetwork(bridgeState, network);

    setBridgeTransactions(filteredState.bridgeTransactions);
    setIsDevEnvInternal(filteredState.isDevEnv);
  }, [bridgeState, network]);

  const createBridgeTransaction = useCallback<
    BridgeContext['createBridgeTransaction']
  >(
    async (bridgeTransaction) => {
      await request<BridgeCreateTransactionHandler>({
        method: ExtensionRequest.BRIDGE_TRANSACTION_CREATE,
        params: bridgeTransaction,
      });
    },
    [request]
  );

  const removeBridgeTransaction = useCallback<
    BridgeContext['removeBridgeTransaction']
  >(
    async (txHash) => {
      await request<BridgeRemoveTransactionHandler>({
        method: ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
        params: [txHash],
      });
    },
    [request]
  );

  function setIsBridgeDevEnv(enabled: boolean) {
    request<BridgeSetIsDevEnvHandler>({
      method: ExtensionRequest.BRIDGE_SET_IS_DEV_ENV,
      params: [enabled],
    });
  }

  const estimateGas = useCallback(
    (amount: Big, asset: Asset) => {
      return request<EstimateGasForBridgeTxHandler>({
        method: ExtensionRequest.BRIDGE_ESTIMATE_GAS,
        params: [currentBlockchain, amount, asset],
      });
    },
    [currentBlockchain, request]
  );

  async function transferAsset(
    amount: Big,
    asset: Asset,
    customGasSettings: CustomGasSettings,
    onStatusChange: (status: WrapStatus) => void,
    onTxHashChange: (txHash: string) => void
  ) {
    const transferEventSubscription = events()
      .pipe(
        filter(isBridgeTransferEventListener),
        map((evt) => evt.value)
      )
      .subscribe((event) => {
        event.type === TransferEventType.WRAP_STATUS
          ? onStatusChange(event.status)
          : onTxHashChange(event.txHash);
      });

    const result = await request<BridgeTransferAssetHandler>({
      method: ExtensionRequest.BRIDGE_TRANSFER_ASSET,
      params: [currentBlockchain, amount, asset, customGasSettings],
    });

    transferEventSubscription.unsubscribe();
    return result;
  }

  return (
    <bridgeContext.Provider
      value={{
        bridgeTransactions,
        estimateGas,
        transferAsset,
        removeBridgeTransaction,
        createBridgeTransaction,
        isBridgeDevEnv,
        setIsBridgeDevEnv,
        bridgeState,
      }}
    >
      {children}
    </bridgeContext.Provider>
  );
}
