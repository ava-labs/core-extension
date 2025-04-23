import { ExtensionRequest } from '@core/service-worker';
import { GetActionHandler } from '@core/service-worker';
import { UpdateActionHandler } from '@core/service-worker';
import {
  Action,
  ActionUpdate,
  MultiTxAction,
  isBatchApprovalAction,
} from '@core/service-worker';
import { ActionStatus } from '@core/service-worker';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useWindowGetsClosedOrHidden } from '@core/utils';
import { useCallback, useEffect, useState } from 'react';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from './useIsSpecificContextContainer';
import { useApprovalsContext } from '@src/contexts/ApprovalsProvider';
import { getUpdatedSigningData } from '@core/utils';

type ActionType<IsBatchApproval> = IsBatchApproval extends true
  ? MultiTxAction
  : Action;

type ActionUpdater<T extends Action | MultiTxAction | undefined> = (
  params: ActionUpdate<
    Partial<T extends Action | MultiTxAction ? T['displayData'] : never>
  >,
  shouldWaitForResponse?: boolean,
) => Promise<boolean>;

type HookResult<T extends Action | MultiTxAction | undefined> = {
  action: T;
  updateAction: ActionUpdater<T>;
  error: string;
  cancelHandler: () => Promise<boolean>;
};

export function useApproveAction<DisplayData = any>(
  actionId: string,
  isBatchApproval?: false,
): HookResult<Action<DisplayData>>;
export function useApproveAction(
  actionId: string,
  isBatchApproval?: true,
): HookResult<MultiTxAction>;
export function useApproveAction<DisplayData = any>(
  actionId: string,
  isBatchApproval: boolean = false,
): HookResult<Action<DisplayData> | MultiTxAction | undefined> {
  const { request } = useConnectionContext();
  const isConfirmPopup = useIsSpecificContextContainer(
    ContextContainer.CONFIRM,
  );
  const { approval } = useApprovalsContext();
  const [action, setAction] = useState<ActionType<typeof isBatchApproval>>();
  const [error, setError] = useState<string>('');

  const updateAction: ActionUpdater<ActionType<typeof isBatchApproval>> =
    useCallback(
      async (params, shouldWaitForResponse) => {
        // We need to update the status a bit faster for smoother UX.
        // use function to avoid `action` as a dependency and thus infinite loops
        setAction((prevActionData) => {
          if (!prevActionData) {
            return;
          }

          // For MultiTxAction, we don't allow any updates besides the status.
          if (isBatchApprovalAction(prevActionData)) {
            return {
              ...prevActionData,
              status: params.status,
            };
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
              params.signingData,
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
      [request, isConfirmPopup],
    );

  const cancelHandler = useCallback(
    async () =>
      updateAction({
        status: ActionStatus.ERROR_USER_CANCELED,
        id: actionId,
      }),
    [actionId, updateAction],
  );

  useEffect(() => {
    if (isConfirmPopup) {
      request<GetActionHandler>({
        method: ExtensionRequest.ACTION_GET,
        params: [actionId],
      }).then((a) => {
        if (isBatchApproval && !isBatchApprovalAction(a)) {
          setError('Expected a batch approval action');
        } else if (!isBatchApproval && isBatchApprovalAction(a)) {
          setError('Expected a single approval action');
        } else {
          setAction(a as ActionType<typeof isBatchApproval>);
        }
      });
    } else if (approval?.action.actionId === actionId) {
      setAction(approval.action as ActionType<typeof isBatchApproval>);
    }
  }, [actionId, request, approval, isConfirmPopup, isBatchApproval]);

  useWindowGetsClosedOrHidden(cancelHandler);

  return { action, updateAction, error, cancelHandler };
}
