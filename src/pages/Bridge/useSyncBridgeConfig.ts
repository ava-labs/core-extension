import {
  Environment,
  setBridgeEnvironment,
  useBridgeConfigUpdater,
  useBridgeSDK,
} from '@avalabs/bridge-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { MAINNET_NETWORK } from '@src/background/services/network/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useCallback, useEffect } from 'react';
import { filter } from 'rxjs';

/**
 * Periodically update the bridge config and keep it in sync with the background.
 */
export function useSyncBridgeConfig() {
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
