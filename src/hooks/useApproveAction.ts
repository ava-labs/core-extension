import { ExtensionRequest } from '@src/background/connections/models';
import { Action, ActionUpdate } from '@src/background/services/actions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useState } from 'react';

export function useApproveAction(actionId: string) {
  const { request } = useConnectionContext();
  const [action, setAction] = useState<Action>();
  const [error] = useState<string>('');

  useEffect(() => {
    request({
      method: ExtensionRequest.ACTION_GET,
      params: [actionId],
    }).then(setAction);
  }, [actionId, request]);

  function updateAction(params: ActionUpdate) {
    request({
      method: ExtensionRequest.ACTION_UPDATE,
      params: [params],
    }).then(() => globalThis.close());
  }

  return { action, updateAction, error };
}
