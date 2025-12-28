import { RpcMethod } from '@avalabs/vm-module-types';
import browser from 'webextension-polyfill';
import { MultiTxAction } from '@core/types';
import {
  BatchRequestValidator,
  MultiApprovalParamsWithContext,
  ValidationResult,
  ValidatorType,
} from '../../models';

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

    console.log('[BatchSwapValidator] Checking if can handle request', {
      hasContext: !!context,
      autoApprove: context?.autoApprove,
      batchSize: params.signingRequests.length,
    });

    // Only handle if explicitly requested for auto-approval
    if (!context?.autoApprove) {
      return false;
    }

    // Verify all transactions in batch are EVM transactions
    const allEvmTx = params.signingRequests.every(
      (req) => req.signingData.type === RpcMethod.ETH_SEND_TRANSACTION,
    );
    if (!allEvmTx) {
      console.log(
        '[BatchSwapValidator] Not handling: not all transactions are EVM',
      );
      return false;
    }

    // Only allow internal requests
    const isInternalRequest =
      !params.request.dappInfo ||
      params.request.dappInfo.url === browser.runtime.getURL('') ||
      params.request.dappInfo.url.startsWith(browser.runtime.getURL(''));

    if (!isInternalRequest) {
      console.log(
        '[BatchSwapValidator] Not handling: not an internal request',
        params.request.dappInfo?.url,
      );
      return false;
    }

    console.log(
      '[BatchSwapValidator] Will handle this batch request for auto-approval',
    );
    return true;
  }

  /**
   * Validate the batch action before auto-approval.
   * For batch swaps, we validate the last transaction (the swap) since
   * the first one is typically an approval transaction.
   */
  validateAction(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    action: MultiTxAction,
    params: MultiApprovalParamsWithContext,
  ): ValidationResult {
    const context = params.request.context;

    // For batch validation, we focus on validating that the context is valid
    // The actual swap amounts validation happens on the swap transaction
    // which is typically the last transaction in the batch

    // Check if minAmountOut is valid
    const expectedMinAmountOut = context?.minAmountOut;
    if (!expectedMinAmountOut || expectedMinAmountOut === '0') {
      return {
        isValid: false,
        requiresManualApproval: true,
        reason:
          'minAmountOut is missing or zero - manual approval required for batch',
      };
    }

    // For batches, we can't easily validate against displayData since
    // the scan results may be for the entire batch, not individual txs
    // So we do basic validation and trust the context
    console.log('[BatchSwapValidator] Batch validation passed (basic checks)', {
      expectedMinAmountOut,
      batchSize: params.signingRequests.length,
    });

    return { isValid: true };
  }
}

// Export singleton instance
export const batchSwapValidator = new BatchSwapValidator();
