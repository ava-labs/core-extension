import { Action, MultiTxAction } from './actions';

export type ApprovalRequest = {
  action: Action | MultiTxAction;
  url: string;
};

export enum ApprovalEvent {
  ApprovalRequested = 'approval-requested',
}
