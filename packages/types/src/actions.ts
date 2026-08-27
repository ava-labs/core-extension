import {
  BatchApprovalParams,
  DisplayData,
  DappInfo,
  RpcMethod,
  SigningData,
} from '@avalabs/vm-module-types';
import {
  DAppProviderRequest,
  JsonRpcRequest,
  JsonRpcRequestPayload,
} from './dapp-connection';
import { ACTION_HANDLED_BY_MODULE } from './util-types';

export enum ActionStatus {
  // user has been shown the UI and we are waiting on approval
  PENDING = 'pending',
  // user has approved and we are waiting on the background to confirm
  SUBMITTING = 'submitting',
  // tx was submitted and returned successful
  COMPLETED = 'completed',
  ERROR = 'error',
  ERROR_USER_CANCELED = 'error-user-canceled',
}

export enum ActionType {
  Single = 'single',
  Batch = 'batch',
}

type ActionBase<DisplayData = any, Params = any> = JsonRpcRequestPayload<
  DAppProviderRequest | RpcMethod,
  Params
> & {
  type: ActionType;
  caipId?: string;
  scope: string;
  context?: JsonRpcRequest['context'];
  dappInfo?: DappInfo;
  [ACTION_HANDLED_BY_MODULE]?: boolean;
  time?: number;
  status?: ActionStatus;
  result?: any;
  error?: string;
  // we store the window ID of the confirmation popup so
  // that we can clean up stale actions later
  popupWindowId?: number;
  inAppPromptId?: number;
  actionId?: string;
  windowId?: number;
  displayData: DisplayData;
};

export type Action<DisplayData = any, Params = any> = ActionBase<
  DisplayData,
  Params
> & {
  type: ActionType.Single;
  signingData?: SigningData;
};

export type MultiTxAction = ActionBase<DisplayData, unknown> & {
  type: ActionType.Batch;
  signingRequests: BatchApprovalParams['signingRequests'];
  displayData: DisplayData;
};

export interface Actions {
  [id: string]: Action | MultiTxAction;
}

export interface ActionUpdate<DisplayData = any> {
  id: any;
  status: ActionStatus;
  displayData?: DisplayData;
  signingData?: never; // Don't allow overriding signingData this way
  result?: any;
  error?: string;
  tabId?: number;
}
export const ACTIONS_STORAGE_KEY = 'actions';

export enum ActionsEvent {
  ACTION_UPDATED = 'action-updated',
  ACTION_COMPLETED = 'action-completed',
}

export enum ActionCompletedEventType {
  COMPLETED = 'completed',
  ERROR = 'error',
}

export type ActionCompletedEvent = {
  type: ActionCompletedEventType;
  action: Action;
  result: string;
};

export const isBatchApprovalAction = (
  action: Action | MultiTxAction,
): action is MultiTxAction => action && action.type === ActionType.Batch;

/**
 * Builds the approval action for a dApp-handled JSON-RPC request.
 *
 * SECURITY: the request payload is fully attacker-controlled - a page can put
 * arbitrary extra keys on the object it passes to the injected provider, and
 * they survive all the way to here. Spreading the request would therefore let a
 * dApp seed privileged action fields it must never control, most importantly:
 *
 *  - `actionId`, which is the storage key actions are saved under. Supplying a
 *    pending action's id overwrites that action, so a benign-looking approval
 *    screen (e.g. a network switch) can be made to submit an entirely different
 *    cached request.
 *  - `signingData` and `ACTION_HANDLED_BY_MODULE`, which together route the
 *    approval into the VM-module signing path with a dApp-supplied payload.
 *  - `status`, `result`, `displayData`, `popupWindowId` and friends, which the
 *    approval lifecycle owns.
 *  - `tabId`, which is what action events are scoped by. A dApp that could set
 *    it to another tab's id would receive that tab's pending approvals. The
 *    trustworthy tab id is `site.tabId`, which `SiteMetadataMiddleware` derives
 *    from `port.sender`, so it is deliberately not copied from the request here
 *    (`getActionTabId` falls back to `site.tabId`).
 *  - `context`, which carries internal-only hints (approval steps, recurring
 *    swaps, agent identity, swap auto-approval). The VM-module path passes dApp
 *    requests through `getKnownOrWhitelistedContext`; this path has no such
 *    filter, so none of it is copied.
 *
 * So copy only the fields the approval flow legitimately needs from the
 * request, and let trusted code own everything else.
 */
export const buildActionForRequest = <
  Params extends { scope: string; displayData: unknown },
>(
  request: JsonRpcRequestPayload<DAppProviderRequest | RpcMethod, unknown>,
  params: Params,
): Action<Params['displayData'], unknown> => {
  return {
    id: request.id,
    method: request.method,
    params: request.params,
    site: request.site,
    type: ActionType.Single,
    scope: params.scope,
    displayData: params.displayData,
  };
};
