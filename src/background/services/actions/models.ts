import { DappInfo, RpcMethod, SigningData } from '@avalabs/vm-module-types';
import {
  DAppProviderRequest,
  JsonRpcRequestPayload,
} from '@src/background/connections/dAppConnection/models';
import { VIA_MODULE_SYMBOL } from '@src/background/vmModules/models';

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
export type Action<DisplayData = any> = JsonRpcRequestPayload<
  DAppProviderRequest | RpcMethod
> & {
  scope: string;
  context?: Record<string, unknown>;
  signingData?: SigningData;
  dappInfo?: DappInfo;
  [VIA_MODULE_SYMBOL]?: boolean;
  time?: number;
  status?: ActionStatus;
  result?: any;
  error?: string;
  displayData: DisplayData;
  // we store the window ID of the confirmation popup so
  // that we can clean up stale actions later
  popupWindowId?: number;
  inAppPromptId?: number;
  actionId?: string;
};

export interface Actions {
  [id: string]: Action;
}

export interface ActionUpdate<DisplayData = any> {
  id: any;
  status: ActionStatus;
  displayData?: DisplayData;
  signingData?: SigningData;
  result?: any;
  error?: string;
  tabId?: number;
}
export const ACTIONS_STORAGE_KEY = 'actions';

export enum ActionsEvent {
  ACTION_UPDATED = 'action-updated',
  ACTION_COMPLETED = 'action-completed',
  MODULE_ACTION_UPDATED = 'module-action-updated',
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
