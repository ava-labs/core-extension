import {
  Asset,
  BridgeSDKProvider,
  Environment,
  setBridgeEnvironment,
  useBridgeConfigUpdater,
  useBridgeSDK,
  WrapStatus,
} from '@avalabs/bridge-sdk';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ExtensionRequest } from '@src/background/connections/models';
import { isBridgeTransferEventListener } from '@src/background/services/bridge/events/bridgeTransferEvents';
import { TransferEventType } from '@src/background/services/bridge/models';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { MAINNET_NETWORK } from '@src/background/services/network/models';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { createContext, useCallback, useContext, useEffect } from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { useNetworkContext } from './NetworkProvider';

const BridgeContext = createContext<{
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
        transferAsset,
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
