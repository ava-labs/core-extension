import {
  Asset,
  BridgeSDKProvider,
  Environment,
  setBridgeEnvironment,
  TrackerViewProps,
  useBridgeConfigUpdater,
  useBridgeSDK,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ExtensionRequest } from '@src/background/connections/models';
import { isBridgeTransferEventListener } from '@src/background/services/bridge/events/bridgeTransferEvents';
import {
  BridgeState,
  TransferEventType,
} from '@src/background/services/bridge/models';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { MAINNET_NETWORK } from '@src/background/services/network/models';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { useNetworkContext } from './NetworkProvider';
import { bridgeTransactionsUpdatedEventListener } from '@src/background/services/bridge/events/listeners';

const BridgeContext = createContext<{
  createBridgeTransaction(tx: TrackerViewProps): Promise<void>;
  removeBridgeTransaction(tx: TrackerViewProps): Promise<void>;
  bridgeTransactions: BridgeState['bridgeTransactions'];
  transferAsset: (
    amount: Big,
    asset: Asset,
    onStatusChange: (status: WrapStatus) => void,
    onTxHashChange: (txHash: string) => void
  ) => Promise<TransactionResponse>;
}>({} as any);

export function BridgeProvider({ children }: { children: any }) {
  return (
    <BridgeSDKProvider>
      <InnerBridgeProvider>{children}</InnerBridgeProvider>
    </BridgeSDKProvider>
  );
}

export function useBridgeContext() {
  return useContext(BridgeContext);
}

// This component is separate so it has access to useBridgeSDK
function InnerBridgeProvider({ children }: { children: any }) {
  useSyncConfig();

  const { request, events } = useConnectionContext();
  const { currentBlockchain } = useBridgeSDK();
  const [bridgeTransactions, setBridgeTransactions] = useState<BridgeState>({
    bridgeTransactions: {},
  });

  useEffect(() => {
    if (!events) {
      return;
    }

    request({
      method: ExtensionRequest.BRIDGE_TRANSACTIONS_GET,
    }).then((res) => {
      setBridgeTransactions(res);
      return res;
    });

    const subscription = events()
      .pipe(
        filter(bridgeTransactionsUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((val) => setBridgeTransactions(val));

    return () => subscription.unsubscribe();
  }, [events, request]);

  async function createBridgeTransaction(bridgeTransaction) {
    await request({
      method: ExtensionRequest.BRIDGE_TRANSACTION_CREATE,
      params: [bridgeTransaction],
    });
  }

  async function removeBridgeTransaction(bridgeTransaction) {
    await request({
      method: ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
      params: [bridgeTransaction],
    });
  }

  async function transferAsset(
    amount: Big,
    asset: Asset,
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

    const result = await request({
      method: ExtensionRequest.BRIDGE_TRANSFER_ASSET,
      params: [currentBlockchain, amount, asset],
    });

    transferEventSubscription.unsubscribe();
    return result;
  }

  return (
    <BridgeContext.Provider
      value={{
        ...bridgeTransactions,
        transferAsset,
        removeBridgeTransaction,
        createBridgeTransaction,
      }}
    >
      {children}
    </BridgeContext.Provider>
  );
}

/**
 * Periodically update the bridge config and keep it in sync with the background.
 */
function useSyncConfig() {
  const { setBridgeConfig } = useBridgeSDK();
  const { events, request } = useConnectionContext();
  const { network } = useNetworkContext();

  const fetchConfig = useCallback(
    () => request({ method: ExtensionRequest.BRIDGE_GET_CONFIG }),
    [request]
  );

  // periodically update the bridge config
  useBridgeConfigUpdater(fetchConfig);

  useEffect(() => {
    setBridgeEnvironment(
      network?.chainId === MAINNET_NETWORK.chainId
        ? Environment.PROD
        : Environment.TEST
    );
  }, [network]);

  // update the bridge config when the network changes
  useEffect(() => {
    if (!events) return;

    const subscription = events()
      .pipe(filter(networkUpdatedEventListener))
      .subscribe(async () => {
        const newConfig = await fetchConfig();
        setBridgeConfig(newConfig);
      });
    return () => subscription.unsubscribe();
  }, [events, fetchConfig, setBridgeConfig]);
}
