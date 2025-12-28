import { Action, MultiTxAction } from './actions';

export type ApprovalRequest = {
  action: Action | MultiTxAction;
  url: string;
};

export enum ApprovalEvent {
  ApprovalRequested = 'approval-requested',
}

/**
 * Enum of supported validator types for auto-approval.
 * Used to identify which validator should handle a request.
 */
export enum ValidatorType {
  /** Single transaction swap validator */
  SWAP = 'swap',
  /** Batch transaction swap validator (approval + swap) */
  BATCH_SWAP = 'batch-swap',
}
