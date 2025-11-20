import { isBridgeStateUpdateEventListener } from '@core/common';
import { BridgeGetStateHandler } from '@core/service-worker';
import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useEffect, useState } from 'react';
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

    request<BridgeGetStateHandler>({
      method: ExtensionRequest.BRIDGE_GET_STATE,
    }).then(({ isDevEnv }) => {
      setIsBridgeDevEnv(isDevEnv);
    });

    const subscription = events()
      .pipe(
        filter(isBridgeStateUpdateEventListener),
        map((evt) => evt.value),
      )
      .subscribe(({ isDevEnv }) => {
        setIsBridgeDevEnv(isDevEnv);
      });

    return () => subscription.unsubscribe();
  }, [events, request, isTestnet]);

  return { isBridgeDevEnv };
}
