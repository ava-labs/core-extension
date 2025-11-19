import { isUnifiedBridgeStateUpdate } from '@core/common';
import { UnifiedBridgeGetState } from '@core/service-worker';
import {
  ExtensionRequest,
  UNIFIED_BRIDGE_DEFAULT_STATE,
  UnifiedBridgeState,
} from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useEffect, useState } from 'react';
import { filter, map } from 'rxjs';

export function useUnifiedBridgeState() {
  const { events, request } = useConnectionContext();
  const [state, setState] = useState<UnifiedBridgeState>(
    UNIFIED_BRIDGE_DEFAULT_STATE,
  );

  useEffect(() => {
    request<UnifiedBridgeGetState>({
      method: ExtensionRequest.UNIFIED_BRIDGE_GET_STATE,
    }).then(setState);

    const stateUpdateSubscription = events()
      .pipe(
        filter(isUnifiedBridgeStateUpdate),
        map((evt) => evt.value),
      )
      .subscribe(setState);

    return () => {
      stateUpdateSubscription.unsubscribe();
    };
  }, [events, request]);

  return state;
}
