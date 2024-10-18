import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetActionHandler } from '@src/background/services/actions/handlers/getActions';
import { UpdateActionHandler } from '@src/background/services/actions/handlers/updateAction';
import { Action, ActionUpdate } from '@src/background/services/actions/models';
import { ActionStatus } from '@src/background/services/actions/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useWindowGetsClosedOrHidden } from '@src/utils/useWindowGetsClosedOrHidden';
import { useCallback, useEffect, useState } from 'react';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from './useIsSpecificContextContainer';
import { useApprovalsContext } from '@src/contexts/ApprovalsProvider';
import { getUpdatedSigningData } from '@src/utils/actions/getUpdatedActionData';

export function useApproveAction<DisplayData = any>(actionId: string) {
  const { request } = useConnectionContext();
  const isConfirmPopup = useIsSpecificContextContainer(
    ContextContainer.CONFIRM
  );
  const { approval } = useApprovalsContext();
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
          signingData: getUpdatedSigningData(
            prevActionData.signingData,
            params.signingData
          ),
        };
      });

      const shouldCloseAfterUpdate =
        isConfirmPopup && params.status !== ActionStatus.PENDING;

      return request<UpdateActionHandler>({
        method: ExtensionRequest.ACTION_UPDATE,
        params: [params, shouldWaitForResponse],
      }).finally(() => {
        if (shouldCloseAfterUpdate) {
          globalThis.close();
        }
      });
    },
    [request, isConfirmPopup]
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
    if (isConfirmPopup) {
      request<GetActionHandler>({
        method: ExtensionRequest.ACTION_GET,
        params: [actionId],
      }).then(setAction);
    } else if (approval?.action.actionId === actionId) {
      setAction(approval.action);
    }
  }, [actionId, request, approval, isConfirmPopup]);

  // useWindowGetsClosedOrHidden(cancelHandler);

  return { action, updateAction, error, cancelHandler };
}
