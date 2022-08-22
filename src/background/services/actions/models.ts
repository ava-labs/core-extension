import { ExtensionMessageMetaData } from '@src/background/connections/models';
import { DomainMetadata } from '@src/background/models';
import { JsonRpcRequest } from 'json-rpc-engine';
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
export interface Action extends JsonRpcRequest<any> {
  time: number;
  status: ActionStatus;
  result?: any;
  error?: string;
  displayData: any;
  method: string;
  site?: DomainMetadata;
  tabId?: number;
  meta?: ExtensionMessageMetaData;
}

export interface Actions {
  [id: string]: Action;
}

export interface ActionUpdate {
  id: any;
  status: ActionStatus;
  result?: any;
  error?: string;
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

export type ActionEvent = {
  type: ActionCompletedEventType;
  action: Action;
  result: string;
};
