import { Action, MultiTxAction } from '../actions/models';

export type ApprovalRequest = {
  action: Action | MultiTxAction;
  url: string;
};

export enum ApprovalEvent {
  ApprovalRequested = 'approval-requested',
}
