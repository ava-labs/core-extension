import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetActionHandler } from '@src/background/services/actions/handlers/getActions';
import { UpdateActionHandler } from '@src/background/services/actions/handlers/updateAction';
import { Action, ActionUpdate } from '@src/background/services/actions/models';
import { ActionStatus } from '@src/background/services/actions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useCallback, useEffect, useState } from 'react';

export function useApproveAction(actionId: string) {
  const { request } = useConnectionContext();
  const [action, setAction] = useState<Action>();
  const [error] = useState<string>('');

  const updateAction = useCallback(
    (params: ActionUpdate) => {
      request<UpdateActionHandler>({
        method: ExtensionRequest.ACTION_UPDATE,
        params: [params],
      }).then(() => globalThis.close());
    },
    [request]
  );

  const cancelHandler = useCallback(() => {
    updateAction({
      status: ActionStatus.ERROR_USER_CANCELED,
      id: actionId,
    });
  }, [actionId, updateAction]);

  useEffect(() => {
    request<GetActionHandler>({
      method: ExtensionRequest.ACTION_GET,
      params: [actionId],
    }).then(setAction);
  }, [actionId, request]);

  useEffect(() => {
    window.addEventListener('unload', cancelHandler);
    // If window is no longer focused, we will cancel the action
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        cancelHandler();
      }
    });

    return () => {
      window.removeEventListener('unload', cancelHandler);
      window.removeEventListener('visibilitychange', cancelHandler);
    };
  }, [cancelHandler]);

  return { action, updateAction, error, cancelHandler };
}
