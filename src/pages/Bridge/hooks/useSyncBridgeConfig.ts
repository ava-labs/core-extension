import { useBridgeConfigUpdater, useBridgeSDK } from '@avalabs/core-bridge-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { isBridgeStateUpdateEventListener } from '@src/background/services/bridge/events/listeners';
import type { BridgeGetConfigHandler } from '@src/background/services/bridge/handlers/getBridgeConfig';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useEffect } from 'react';
import { filter } from 'rxjs';

/**
 * Periodically update the bridge config and keep it in sync with the background.
 */
export function useSyncBridgeConfig() {
  const { setBridgeConfig } = useBridgeSDK();
  const { events, request } = useConnectionContext();

  const fetchConfig = useCallback(
    () =>
      request<BridgeGetConfigHandler>({
        method: ExtensionRequest.BRIDGE_GET_CONFIG,
      }),
    [request],
  );

  // Periodically update the bridge config
  useBridgeConfigUpdater(fetchConfig);

  // Update the bridge config when either the network or bridge state changes
  useEffect(() => {
    const subscription = events()
      .pipe(
        filter(
          (event) =>
            networkUpdatedEventListener(event) ||
            isBridgeStateUpdateEventListener(event),
        ),
      )
      .subscribe(async () => {
        const newConfig = await fetchConfig();
        setBridgeConfig(newConfig);
      });
    return () => subscription.unsubscribe();
  }, [events, fetchConfig, setBridgeConfig]);
}
