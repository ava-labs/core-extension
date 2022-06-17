import {
  Asset,
  BridgeSDKProvider,
  Environment,
  setBridgeEnvironment,
  useBridgeSDK,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  bridgeTransactionsUpdatedEventListener,
  isBridgeTransferEventListener,
} from '@src/background/services/bridge/events/listeners';
import {
  BridgeState,
  DefaultBridgeState,
  PartialBridgeTransaction,
  TransferEventType,
} from '@src/background/services/bridge/models';
import {
  deserializeBridgeState,
  filterBridgeStateToNetwork,
} from '@src/background/services/bridge/utils';
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

interface BridgeContext {
  createBridgeTransaction(tx: PartialBridgeTransaction): Promise<void>;
  removeBridgeTransaction(txHash: string): Promise<void>;
  bridgeTransactions: BridgeState['bridgeTransactions'];
  transferAsset: (
    amount: Big,
    asset: Asset,
    onStatusChange: (status: WrapStatus) => void,
    onTxHashChange: (txHash: string) => void
  ) => Promise<TransactionResponse>;
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
  useEffect(() => {
    if (!events) {
      return;
    }

    request({
      method: ExtensionRequest.BRIDGE_TRANSACTIONS_GET,
    }).then((txs) => {
      setBridgeState(deserializeBridgeState(txs));
    });

    const subscription = events()
      .pipe(
        filter(bridgeTransactionsUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((txs) => {
        setBridgeState(deserializeBridgeState(txs));
      });

    return () => subscription.unsubscribe();
  }, [events, request]);

  useEffect(() => {
    if (!network) return;
    const filteredState = filterBridgeStateToNetwork(bridgeState, network);
    setBridgeTransactions(filteredState.bridgeTransactions);
  }, [bridgeState, network]);

  const createBridgeTransaction = useCallback<
    BridgeContext['createBridgeTransaction']
  >(
    async (params) => {
      await request({
        method: ExtensionRequest.BRIDGE_TRANSACTION_CREATE,
        params: [params],
      });
    },
    [request]
  );

  const removeBridgeTransaction = useCallback<
    BridgeContext['removeBridgeTransaction']
  >(
    async (txHash) => {
      await request({
        method: ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
        params: [txHash],
      });
    },
    [request]
  );

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
    <bridgeContext.Provider
      value={{
        bridgeTransactions,
        transferAsset,
        removeBridgeTransaction,
        createBridgeTransaction,
      }}
    >
      {children}
    </bridgeContext.Provider>
  );
}
