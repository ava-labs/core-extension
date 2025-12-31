import {
  ApprovalParams,
  BatchApprovalParams,
  RpcRequest,
} from '@avalabs/vm-module-types';
import { Action, MultiTxAction, ValidatorType } from '@core/types';

// Re-export ValidatorType for convenience
export { ValidatorType };

type RpcRequestWithExtensionContext = RpcRequest & {
  context?: RpcRequest['context'] & {
    tabId?: number;
    /** The validator type to use for auto-approval */
    validatorType?: ValidatorType;
  };
};
export interface MultiApprovalParamsWithContext extends BatchApprovalParams {
  request: RpcRequestWithExtensionContext;
}
export interface ApprovalParamsWithContext extends ApprovalParams {
  request: RpcRequestWithExtensionContext;
}

export const isBatchApprovalParams = (
  params: ApprovalParams | BatchApprovalParams,
): params is BatchApprovalParams => {
  return 'signingRequests' in params;
};

/**
 * Result of a validation check.
 * - isValid: Whether validation passed
 * - requiresManualApproval: If true, show manual approval UI instead of rejecting
 * - reason: Human-readable reason for the decision
 */
export interface ValidationResult {
  isValid: boolean;
  requiresManualApproval?: boolean;
  reason?: string;
}

/**
 * Generic interface for request validators.
 * Any request type (swap, bridge, etc.) can implement this interface
 * to provide custom auto-approval logic.
 */
export interface RequestValidator {
  /**
   * Unique identifier for this validator type
   */
  readonly type: ValidatorType;

  /**
   * Check if this validator should handle the given request.
   * Returns true if the request is eligible for auto-approval by this validator.
   */
  canHandle(params: ApprovalParamsWithContext): boolean;

  /**
   * Validate the action before auto-approval.
   * Called after the action is built (with displayData/scan results available).
   * @returns ValidationResult indicating if auto-approval should proceed
   */
  validateAction(
    action: Action,
    params: ApprovalParamsWithContext,
  ): ValidationResult;
}

/**
 * Generic interface for batch request validators.
 */
export interface BatchRequestValidator {
  readonly type: ValidatorType;

  canHandle(params: MultiApprovalParamsWithContext): boolean;

  validateAction(
    action: MultiTxAction,
    params: MultiApprovalParamsWithContext,
  ): ValidationResult;
}

/**
 * Registry for request validators.
 * Allows registering validators by type and retrieving them directly.
 */
export class ValidatorRegistry {
  private validators = new Map<ValidatorType, RequestValidator>();
  private batchValidators = new Map<ValidatorType, BatchRequestValidator>();

  register(validator: RequestValidator): void {
    console.log(`[ValidatorRegistry] Registering validator: ${validator.type}`);
    this.validators.set(validator.type, validator);
  }

  registerBatch(validator: BatchRequestValidator): void {
    console.log(
      `[ValidatorRegistry] Registering batch validator: ${validator.type}`,
    );
    this.batchValidators.set(validator.type, validator);
  }

  /**
   * Get a validator by type (from context.validatorType)
   */
  getValidator(type: ValidatorType): RequestValidator | undefined {
    return this.validators.get(type);
  }

  /**
   * Get a batch validator by type (from context.validatorType)
   */
  getBatchValidator(type: ValidatorType): BatchRequestValidator | undefined {
    return this.batchValidators.get(type);
  }

  /**
   * List all registered validator types (for debugging)
   */
  getRegisteredTypes(): {
    validators: ValidatorType[];
    batchValidators: ValidatorType[];
  } {
    return {
      validators: Array.from(this.validators.keys()),
      batchValidators: Array.from(this.batchValidators.keys()),
    };
  }
}
