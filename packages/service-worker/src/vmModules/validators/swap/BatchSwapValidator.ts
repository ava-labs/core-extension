import { RpcMethod } from '@avalabs/vm-module-types';
import browser from 'webextension-polyfill';
import { MultiTxAction } from '@core/types';
import {
  BatchRequestValidator,
  MultiApprovalParamsWithContext,
  ValidationResult,
  ValidatorType,
} from '../../models';
import { validateSwapAmounts } from './validation';

/**
 * Validator for batch swap transactions (approval + swap).
 * Implements BatchRequestValidator to provide auto-approval logic for Markr batch swaps.
 */
export class BatchSwapValidator implements BatchRequestValidator {
  readonly type = ValidatorType.BATCH_SWAP;

  /**
   * Check if this validator should handle the batch request.
   */
  canHandle(params: MultiApprovalParamsWithContext): boolean {
    const context = params.request.context;

    // Only handle if explicitly requested for auto-approval
    if (!context?.autoApprove) {
      return false;
    }

    // Verify all transactions in batch are EVM transactions
    const allEvmTx = params.signingRequests.every(
      (req) => req.signingData.type === RpcMethod.ETH_SEND_TRANSACTION,
    );
    if (!allEvmTx) {
      return false;
    }

    // Only allow internal requests
    const isInternalRequest =
      !params.request.dappInfo ||
      params.request.dappInfo.url === browser.runtime.getURL('') ||
      params.request.dappInfo.url.startsWith(browser.runtime.getURL(''));

    if (!isInternalRequest) {
      return false;
    }

    return true;
  }

  /**
   * Validate the batch action before auto-approval.
   * For batch swaps, the displayData contains the net balance change for the entire batch,
   * which includes both the approval and swap transactions combined.
   */
  validateAction(
    action: MultiTxAction,
    params: MultiApprovalParamsWithContext,
  ): ValidationResult {
    const context = params.request.context;

    // Validate using the same logic as single swaps
    // The action.displayData contains scan results for the entire batch
    // showing the net effect of approval + swap transactions
    return validateSwapAmounts(action, context);
  }
}

// Export singleton instance
export const batchSwapValidator = new BatchSwapValidator();
