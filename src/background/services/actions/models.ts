import { BatchApprovalParams, DisplayData } from '@avalabs/vm-module-types';
import { DappInfo, RpcMethod, SigningData } from '@avalabs/vm-module-types';
import {
  DAppProviderRequest,
  JsonRpcRequestPayload,
} from '@src/background/connections/dAppConnection/models';
import { ACTION_HANDLED_BY_MODULE } from '@src/background/models';

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
export type Action<DisplayData = any, Params = any> = JsonRpcRequestPayload<
  DAppProviderRequest | RpcMethod,
  Params
> & {
  caipId?: string;
  scope: string;
  context?: Record<string, unknown>;
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
} & {
  signingData?: SigningData;
  displayData: DisplayData;
};

export type MultiTxAction = Omit<Action, 'signingData' | 'displayData'> & {
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
): action is MultiTxAction =>
  action &&
  'signingRequests' in action &&
  Array.isArray(action.signingRequests);
