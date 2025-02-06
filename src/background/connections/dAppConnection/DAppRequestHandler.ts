/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { Action } from '@src/background/services/actions/models';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
  JsonRpcResponse,
} from './models';

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
    tabId?: number,
  ) => Promise<void>;
}

export abstract class DAppRequestHandler<
  RequestParams = unknown,
  ResponseParams = any,
> {
  abstract methods: DAppProviderRequest[];

  abstract handleAuthenticated: (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, RequestParams>,
  ) => Promise<JsonRpcResponse<ResponseParams>>;

  abstract handleUnauthenticated: (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, RequestParams>,
  ) => Promise<JsonRpcResponse<ResponseParams>>;
}
