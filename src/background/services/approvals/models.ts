import { Action } from '../actions/models';

export type ApprovalRequest = {
  action: Action;
  url: string;
};

export enum ApprovalEvent {
  ApprovalRequested = 'approval-requested',
}
