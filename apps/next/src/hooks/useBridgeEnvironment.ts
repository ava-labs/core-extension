import { isBridgeStateUpdateEventListener } from '@core/common';
import {
  BridgeGetStateHandler,
  BridgeSetIsDevEnvHandler,
} from '@core/service-worker';
import { BridgeState, ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useCallback, useEffect, useState } from 'react';
import { filter, map } from 'rxjs';

export function useBridgeEnvironment(isTestnet: boolean) {
  const { events, request } = useConnectionContext();
  const [isBridgeDevEnv, setIsBridgeDevEnv] = useState(false);

  useEffect(() => {
    if (!events || !request) {
      return;
    }

    if (!isTestnet) {
      setIsBridgeDevEnv(false);
      return;
    }

    const saveState = (state: BridgeState) => setIsBridgeDevEnv(state.isDevEnv);

    request<BridgeGetStateHandler>({
      method: ExtensionRequest.BRIDGE_GET_STATE,
    }).then(saveState);

    const subscription = events()
      .pipe(
        filter(isBridgeStateUpdateEventListener),
        map((evt) => evt.value),
      )
      .subscribe(saveState);

    return () => subscription.unsubscribe();
  }, [events, request, isTestnet]);

  const setBridgeDevMode = useCallback(
    async (enabled: boolean) => {
      request<BridgeSetIsDevEnvHandler>({
        method: ExtensionRequest.BRIDGE_SET_IS_DEV_ENV,
        params: [enabled],
      });
    },
    [request],
  );

  return {
    isBridgeDevEnv,
    setBridgeDevMode,
  };
}
