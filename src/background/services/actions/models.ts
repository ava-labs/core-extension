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
  site: DomainMetadata;
}

export interface ActionUpdate {
  id: any;
  status: ActionStatus;
  result?: any;
  error?: string;
}
