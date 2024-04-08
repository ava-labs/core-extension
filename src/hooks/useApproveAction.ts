import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetActionHandler } from '@src/background/services/actions/handlers/getActions';
import { UpdateActionHandler } from '@src/background/services/actions/handlers/updateAction';
import { Action, ActionUpdate } from '@src/background/services/actions/models';
import { ActionStatus } from '@src/background/services/actions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';
import { useCallback, useEffect, useState } from 'react';

export function useApproveAction<DisplayData = any>(actionId: string) {
  const { request } = useConnectionContext();
  const [action, setAction] = useState<Action<DisplayData>>();
  const [error] = useState<string>('');

  const updateAction = useCallback(
    async (
      params: ActionUpdate<Partial<DisplayData>>,
      shouldWaitForResponse?: boolean
    ) => {
      // We need to update the status a bit faster for smoother UX.
      // use function to avoid `action` as a dependency and thus infinite loops
      setAction((prevActionData) => {
        if (!prevActionData) {
          return;
        }
        return {
          ...prevActionData,
          status: params.status,
          displayData: {
            ...prevActionData.displayData,
            ...params.displayData,
          },
        };
      });

      const shouldCloseAfterUpdate = params.status !== ActionStatus.PENDING;

      return request<UpdateActionHandler>({
        method: ExtensionRequest.ACTION_UPDATE,
        params: [params, shouldWaitForResponse],
      }).finally(() => {
        if (shouldCloseAfterUpdate) {
          globalThis.close();
        }
      });
    },
    [request]
  );

  const cancelHandler = useCallback(
    async () =>
      updateAction({
        status: ActionStatus.ERROR_USER_CANCELED,
        id: actionId,
      }),
    [actionId, updateAction]
  );

  useEffect(() => {
    request<GetActionHandler>({
      method: ExtensionRequest.ACTION_GET,
      params: [actionId],
    }).then(setAction);
  }, [actionId, request]);

  useWindowGetsClosedOrHidden(cancelHandler);

  return { action, updateAction, error, cancelHandler };
}
