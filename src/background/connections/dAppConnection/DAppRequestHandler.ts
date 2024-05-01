/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { Action } from '@src/background/services/actions/models';
import { container } from 'tsyringe';
import { DAppProviderRequest, JsonRpcRequest, JsonRpcResponse } from './models';
import { ApprovalService } from '@src/background/services/approvals/ApprovalService';

export interface DAppRequestHandler {
  /**
   * Optional: Only used when the action needs user approval
   * IS ONLY called when `actionsService.addAction` and a `DEFERRED_RESPONSE` is used by the handler.
   * Called by the ActionsService after the user confirms the request on the approval popup.
   */
  onActionApproved?: (
    pendingAction: Action,
    result: any,
    onSuccess: (result: unknown) => Promise<void>,
    onError: (error: Error) => Promise<void>,
    tabId?: number
  ) => Promise<void>;
}

export abstract class DAppRequestHandler<
  RequestParams = unknown[],
  ResponseParams = any
> {
  abstract methods: DAppProviderRequest[];

  abstract handleAuthenticated: (
    request: JsonRpcRequest<RequestParams>
  ) => Promise<JsonRpcResponse<ResponseParams>>;

  abstract handleUnauthenticated: (
    request: JsonRpcRequest<RequestParams>
  ) => Promise<JsonRpcResponse<ResponseParams>>;

  /**
   * Opens approval window with the specified url and saves the action info to the Actions service
   * When singleton is true, it makes sure there is only one approval window at a time for the given domain with the requested method
   * @param action The action requiring approval
   * @param url The url of the approval window. Withouth a leading `/`
   */
  async openApprovalWindow(action: Action, url: string) {
    const actionId = crypto.randomUUID();
    // using direct injection instead of the constructor to prevent circular dependencies
    const approvalService = container.resolve(ApprovalService);

    approvalService.requestApproval(
      {
        ...action,
        actionId,
      },
      url
    );
  }
}
