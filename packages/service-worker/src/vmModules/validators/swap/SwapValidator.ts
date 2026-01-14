import { RpcMethod } from '@avalabs/vm-module-types';
import browser from 'webextension-polyfill';
import { Action, ValidatorType } from '@core/types';
import {
  ApprovalParamsWithContext,
  RequestValidator,
  ValidationResult,
} from '../../models';
import { validateSwapAmounts } from './validation';

/**
 * Validator for swap transactions.
 * Implements RequestValidator to provide auto-approval logic for Markr swaps.
 */
export class SwapValidator implements RequestValidator {
  readonly type = ValidatorType.SWAP;

  /**
   * Check if this validator should handle the request.
   * Returns true for Markr swap transactions with autoApprove flag.
   */
  canHandle(params: ApprovalParamsWithContext): boolean {
    const context = params.request.context;

    // Only handle if explicitly requested for auto-approval
    if (!context?.autoApprove) {
      return false;
    }

    // Only handle EVM transactions
    if (params.signingData?.type !== RpcMethod.ETH_SEND_TRANSACTION) {
      return false;
    }

    // Only allow internal requests (from extension itself)
    const isInternalRequest =
      !params.request.dappInfo ||
      params.request.dappInfo.url === browser.runtime.getURL('') ||
      params.request.dappInfo.url.startsWith(browser.runtime.getURL(''));

    if (!isInternalRequest) {
      return false;
    }

    // Additional security check: validate swap destination
    const swapTxData = params.signingData?.data;
    if (swapTxData?.to === '0x0000000000000000000000000000000000000000') {
      return false;
    }

    return true;
  }

  /**
   * Validate the action before auto-approval.
   * Checks scan results and swap amounts.
   */
  validateAction(
    action: Action,
    params: ApprovalParamsWithContext,
  ): ValidationResult {
    const context = params.request.context;
    return validateSwapAmounts(action, context);
  }
}

// Export singleton instance
export const swapValidator = new SwapValidator();
