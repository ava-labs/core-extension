import { Action, MultiTxAction } from './actions';
import { MaxBuyOption } from './settings';

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

/**
 * Context provided for swap validation containing quote and swap details
 */
export interface SwapValidationContext {
  autoApprove: boolean;
  validatorType: ValidatorType;
  /** Minimum amount expected to receive (in token's smallest unit) */
  minAmountOut: string;
  /** Source token contract address */
  srcTokenAddress: string;
  /** Destination token contract address */
  destTokenAddress: string;
  /** Whether source token is the native token (e.g., ETH, AVAX) */
  isSrcTokenNative: boolean;
  /** Whether destination token is the native token */
  isDestTokenNative: boolean;
  /** Slippage tolerance as percentage (e.g., 1 = 1%) */
  slippage: number;
  /** Maximum buy limit setting */
  maxBuy?: MaxBuyOption;
  /** Whether swap fees are enabled for this transaction */
  isSwapFeesEnabled?: boolean;
}
