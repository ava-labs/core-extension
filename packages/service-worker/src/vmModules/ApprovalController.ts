import {
  ApprovalParams,
  ApprovalResponse,
  BatchApprovalController,
  BatchApprovalParams,
  BatchApprovalResponse,
  BtcTxUpdateFn,
  DisplayData,
  EvmTxBatchUpdateFn,
  EvmTxUpdateFn,
  RequestPublicKeyParams,
  RpcMethod,
  RpcRequest,
  SigningData,
  SigningData_EthSendTx,
  SigningRequest,
} from '@avalabs/vm-module-types';
import { providerErrors, rpcErrors } from '@metamask/rpc-errors';
import { singleton } from 'tsyringe';

import {
  ACTION_HANDLED_BY_MODULE,
  Action,
  ActionStatus,
  ActionType,
  MultiTxAction,
  NetworkWithCaipId,
  isBatchApprovalAction,
} from '@core/types';
import { openApprovalWindow } from '../runtime/openApprovalWindow';
import { NetworkService } from '../services/network/NetworkService';
import { WalletService } from '../services/wallet/WalletService';

import { SecretsService } from '../services/secrets/SecretsService';
import {
  ApprovalParamsWithContext,
  MultiApprovalParamsWithContext,
  ValidatorRegistry,
} from './models';
import { batchSwapValidator, swapValidator } from './validators';
import { TransactionStatusEvents } from '../services/transactions/events/transactionStatusEvents';
import { caipToChainId } from '@core/common';

// Create and populate the validator registry
const validatorRegistry = new ValidatorRegistry();
validatorRegistry.register(swapValidator);
validatorRegistry.registerBatch(batchSwapValidator);

type CachedRequest = {
  params: ApprovalParams;
  network: NetworkWithCaipId;
  resolve: (response: ApprovalResponse) => void;
};
type CachedBatchRequest = {
  params: BatchApprovalParams;
  network: NetworkWithCaipId;
  resolve: (response: BatchApprovalResponse) => void;
};

type ActionToRequest = {
  [ActionType.Single]: CachedRequest;
  [ActionType.Batch]: CachedBatchRequest;
};

@singleton()
export class ApprovalController implements BatchApprovalController {
  #walletService: WalletService;
  #networkService: NetworkService;
  #secretsService: SecretsService;
  #transactionStatusEvents: TransactionStatusEvents;

  #requests = new Map<string, ActionToRequest[keyof ActionToRequest]>();

  constructor(
    secretsService: SecretsService,
    walletService: WalletService,
    networkService: NetworkService,
    transactionStatusEvents: TransactionStatusEvents,
  ) {
    this.#secretsService = secretsService;
    this.#walletService = walletService;
    this.#networkService = networkService;
    this.#transactionStatusEvents = transactionStatusEvents;
  }

  onTransactionPending = async ({
    txHash,
    request,
  }: {
    txHash: string;
    request: RpcRequest;
  }) => {
    const chainId = caipToChainId(request.chainId);
    this.#transactionStatusEvents.emitPending(txHash, chainId, {
      requestId: request.chainId,
      ...request.context,
    });
  };

  onTransactionConfirmed = async ({
    txHash,
    explorerLink,
    request,
  }: {
    txHash: string;
    explorerLink: string;
    request: RpcRequest;
  }) => {
    const chainId = caipToChainId(request.chainId);
    this.#transactionStatusEvents.emitConfirmed(txHash, chainId, {
      explorerLink,
      requestId: request.chainId,
      ...request.context,
    });
  };

  onTransactionReverted = async ({
    txHash,
    request,
  }: {
    txHash: string;
    request: RpcRequest;
  }) => {
    const chainId = caipToChainId(request.chainId);
    this.#transactionStatusEvents.emitReverted(txHash, chainId, {
      requestId: request.chainId,
      ...request.context,
    });
  };

  async requestPublicKey({
    curve,
    derivationPath,
    secretId,
  }: RequestPublicKeyParams): Promise<string> {
    return this.#secretsService.derivePublicKey(
      secretId,
      curve,
      derivationPath,
    );
  }

  onRejected = async <A extends Action | MultiTxAction>(action: A) => {
    if (!action.actionId) {
      return;
    }

    const request = this.#getRequest(action);

    if (!request) {
      return;
    }

    const { resolve } = request;

    resolve({
      error: providerErrors.userRejectedRequest(),
    });
    this.#requests.delete(action.actionId);
  };

  #getRequest<
    A extends Action | MultiTxAction,
    R extends ActionToRequest[A['type']],
  >(action: A): R | undefined {
    if (!action.actionId) {
      return;
    }

    return this.#requests.get(action.actionId) as R;
  }

  onApproved = async (action: Action | MultiTxAction) => {
    if (!action.actionId) {
      return;
    }

    if (isBatchApprovalAction(action)) {
      const request = this.#getRequest(action);

      if (!request) {
        return;
      }

      const { resolve, network } = request;

      try {
        const result = await this.#handleBatchApproval(action, network);

        resolve({
          result: result.map((r) => ({ signedData: r.signedTx })),
        });
      } catch (err) {
        resolve({
          error: rpcErrors.internal({
            message: 'Unable to sign the batch of transactions',
            data: {
              originalError: err,
            },
          }),
        });
      } finally {
        this.#requests.delete(action.actionId);
      }
    } else {
      const request = this.#getRequest(action);

      if (!request) {
        return;
      }

      const { params, resolve, network } = request;

      try {
        const approvalResult = await this.#handleApproval(
          params,
          action,
          network,
        );

        if (typeof approvalResult === 'string') {
          resolve({ signedData: approvalResult });
        } else if (approvalResult.signedTx) {
          resolve({ signedData: approvalResult.signedTx });
        } else if (approvalResult.txHash) {
          resolve({ txHash: approvalResult.txHash });
        } else {
          resolve({
            error: rpcErrors.internal({
              message: 'Unsupported signing result type',
            }),
          });
        }
      } catch (err) {
        resolve({
          error: rpcErrors.internal({
            message: 'Unable to sign the message',
            data: {
              originalError: err instanceof Error ? err.message : err,
            },
          }),
        });
      } finally {
        this.#requests.delete(action.actionId);
      }
    }
  };

  /**
   * This method should never throw. Instead, return an { error } object.
   * @param params - The approval parameters
   */
  requestApproval = async (
    params: ApprovalParamsWithContext,
  ): Promise<ApprovalResponse> => {
    const context = params.request.context;
    const requestId = crypto.randomUUID().slice(0, 8);

    console.log(
      `[ApprovalController:${requestId}] ━━━ REQUEST APPROVAL START ━━━`,
      {
        method: params.request.method,
        chainId: params.request.chainId,
        hasContext: !!context,
        validatorType: context?.validatorType,
        autoApprove: context?.autoApprove,
        source: context?.source,
      },
    );

    const network = await this.#networkService.getNetwork(
      params.request.chainId,
    );
    if (!network) {
      console.error(
        `[ApprovalController:${requestId}] Network not found:`,
        params.request.chainId,
      );
      return {
        error: rpcErrors.invalidRequest({
          message: 'Unsupported network',
          data: params.request.chainId,
        }),
      };
    }

    console.log(
      `[ApprovalController:${requestId}] Network resolved:`,
      network.chainName,
    );

    const actionId = crypto.randomUUID();
    const action = this.#buildAction(params, actionId);
    console.log('action', action);

    // Try to get validator - first by type from context, then by finding
    let validator = context?.validatorType
      ? validatorRegistry.getValidator(context.validatorType)
      : undefined;

    if (context?.validatorType && !validator) {
      console.warn(
        `[ApprovalController:${requestId}] Validator type "${context.validatorType}" not found in registry`,
        validatorRegistry.getRegisteredTypes(),
      );
    }

    // Fallback to finding validator if not specified or not found
    if (!validator) {
      validator = validatorRegistry.findValidator(params);
      if (validator) {
        console.log(
          `[ApprovalController:${requestId}] Found validator by canHandle():`,
          validator.type,
        );
      }
    } else {
      console.log(
        `[ApprovalController:${requestId}] Using validator from context:`,
        validator.type,
      );
    }

    if (validator) {
      console.log(
        `[ApprovalController:${requestId}] ▶ Checking if validator can handle...`,
      );

      // Verify the validator can actually handle this request
      if (!validator.canHandle(params)) {
        console.log(
          `[ApprovalController:${requestId}] ✗ Validator "${validator.type}" cannot handle this request, falling back to manual approval`,
        );
        validator = undefined;
      } else {
        console.log(
          `[ApprovalController:${requestId}] ✓ Validator "${validator.type}" can handle this request`,
        );
      }
    }

    if (validator) {
      console.log(`[ApprovalController:${requestId}] ▶ Running validation...`);
      const validation = validator.validateAction(action, params);

      console.log(`[ApprovalController:${requestId}] Validation result:`, {
        isValid: validation.isValid,
        requiresManualApproval: validation.requiresManualApproval,
        reason: validation.reason,
      });

      if (validation.isValid) {
        console.log(
          `[ApprovalController:${requestId}] ✓ Validation passed, executing auto-approval...`,
        );
        const result = await this.#executeAutoApproval(
          params,
          action,
          network,
          requestId,
        );
        console.log(
          `[ApprovalController:${requestId}] ━━━ REQUEST APPROVAL END (auto-approved) ━━━`,
        );
        return result;
      } else if (validation.requiresManualApproval) {
        console.log(
          `[ApprovalController:${requestId}] ⚠ Validation requires manual approval:`,
          validation.reason,
        );
        // Add the validation warning to displayData so it shows in the approval UI
        if (validation.reason) {
          (action.displayData as any).validationWarning = validation.reason;
        }
        // Fall through to normal approval flow
      } else {
        console.error(
          `[ApprovalController:${requestId}] ✗ Validation failed (hard reject):`,
          validation.reason,
        );
        console.log(
          `[ApprovalController:${requestId}] ━━━ REQUEST APPROVAL END (rejected) ━━━`,
        );
        return {
          error: rpcErrors.invalidRequest({
            message: validation.reason || 'Auto-approval validation failed',
          }),
        };
      }
    } else {
      console.log(
        `[ApprovalController:${requestId}] No validator found, using manual approval flow`,
      );
    }

    // Normal flow: open approval window
    console.log(
      `[ApprovalController:${requestId}] ▶ Opening approval window...`,
    );
    openApprovalWindow(action, 'approve/generic');
    console.log(
      `[ApprovalController:${requestId}] ━━━ REQUEST APPROVAL END (awaiting user) ━━━`,
    );

    return new Promise((resolve) => {
      this.#requests.set(actionId, {
        params,
        network,
        resolve,
      });
    });
  };

  #executeAutoApproval = async (
    params: ApprovalParamsWithContext,
    action: Action,
    network: NetworkWithCaipId,
    requestId: string,
  ): Promise<ApprovalResponse> => {
    try {
      console.log(
        `[ApprovalController:${requestId}] ▶ Signing transaction...`,
      );
      const startTime = Date.now();
      const approvalResult = await this.#handleApproval(
        params,
        action,
        network,
      );
      const duration = Date.now() - startTime;

      console.log(
        `[ApprovalController:${requestId}] ✓ Transaction signed in ${duration}ms`,
        {
          resultType: typeof approvalResult,
          hasSignedTx:
            typeof approvalResult === 'object' && 'signedTx' in approvalResult,
          hasTxHash:
            typeof approvalResult === 'object' && 'txHash' in approvalResult,
        },
      );

      // Default handling
      if (typeof approvalResult === 'string') {
        console.log(
          `[ApprovalController:${requestId}] Returning signedData (string)`,
        );
        return { signedData: approvalResult };
      } else if (approvalResult.signedTx) {
        console.log(
          `[ApprovalController:${requestId}] Returning signedData (object.signedTx)`,
        );
        return { signedData: approvalResult.signedTx };
      } else if (approvalResult.txHash) {
        console.log(
          `[ApprovalController:${requestId}] Returning txHash:`,
          approvalResult.txHash,
        );
        return { txHash: approvalResult.txHash };
      } else {
        console.error(
          `[ApprovalController:${requestId}] Unsupported signing result type`,
        );
        return {
          error: rpcErrors.internal({
            message: 'Unsupported signing result type',
          }),
        };
      }
    } catch (err) {
      console.error(
        `[ApprovalController:${requestId}] ✗ Auto-approval error:`,
        err,
      );
      return {
        error: rpcErrors.internal({
          message: 'Unable to sign the transaction',
          data: { originalError: err instanceof Error ? err.message : err },
        }),
      };
    }
  };

  /**
   * This method should never throw. Instead, return an { error } object.
   * @param params - The batch approval parameters
   */
  requestBatchApproval = async (
    params: MultiApprovalParamsWithContext,
  ): Promise<BatchApprovalResponse> => {
    const context = params.request.context;
    const requestId = crypto.randomUUID().slice(0, 8);

    console.log(
      `[ApprovalController:${requestId}] ━━━ BATCH APPROVAL START ━━━`,
      {
        method: params.request.method,
        chainId: params.request.chainId,
        batchSize: params.signingRequests.length,
        hasContext: !!context,
        validatorType: context?.validatorType,
        autoApprove: context?.autoApprove,
        source: context?.source,
      },
    );

    const network = await this.#networkService.getNetwork(
      params.request.chainId,
    );

    if (!network) {
      console.error(
        `[ApprovalController:${requestId}] Network not found:`,
        params.request.chainId,
      );
      return {
        error: rpcErrors.invalidRequest({
          message: 'Unsupported network',
          data: params.request.chainId,
        }),
      };
    }

    console.log(
      `[ApprovalController:${requestId}] Network resolved:`,
      network.chainName,
    );

    const actionId = crypto.randomUUID();
    const action = this.#buildMultiApprovalAction(params, actionId);

    // Try to get validator - first by type from context, then by finding
    let validator = context?.validatorType
      ? validatorRegistry.getBatchValidator(context.validatorType)
      : undefined;

    if (context?.validatorType && !validator) {
      console.warn(
        `[ApprovalController:${requestId}] Batch validator type "${context.validatorType}" not found in registry`,
        validatorRegistry.getRegisteredTypes(),
      );
    }

    // Fallback to finding validator if not specified or not found
    if (!validator) {
      validator = validatorRegistry.findBatchValidator(params);
      if (validator) {
        console.log(
          `[ApprovalController:${requestId}] Found batch validator by canHandle():`,
          validator.type,
        );
      }
    } else {
      console.log(
        `[ApprovalController:${requestId}] Using batch validator from context:`,
        validator.type,
      );
    }

    if (validator) {
      console.log(
        `[ApprovalController:${requestId}] ▶ Checking if batch validator can handle...`,
      );

      if (!validator.canHandle(params)) {
        console.log(
          `[ApprovalController:${requestId}] ✗ Batch validator "${validator.type}" cannot handle, falling back to manual approval`,
        );
        validator = undefined;
      } else {
        console.log(
          `[ApprovalController:${requestId}] ✓ Batch validator "${validator.type}" can handle this request`,
        );
      }
    }

    if (validator) {
      console.log(
        `[ApprovalController:${requestId}] ▶ Running batch validation...`,
      );
      const validation = validator.validateAction(action, params);

      console.log(
        `[ApprovalController:${requestId}] Batch validation result:`,
        {
          isValid: validation.isValid,
          requiresManualApproval: validation.requiresManualApproval,
          reason: validation.reason,
        },
      );

      if (validation.isValid) {
        console.log(
          `[ApprovalController:${requestId}] ✓ Batch validation passed, executing auto-approval...`,
        );
        const result = await this.#executeBatchAutoApproval(
          action,
          network,
          requestId,
        );
        console.log(
          `[ApprovalController:${requestId}] ━━━ BATCH APPROVAL END (auto-approved) ━━━`,
        );
        return result;
      } else if (validation.requiresManualApproval) {
        console.log(
          `[ApprovalController:${requestId}] ⚠ Batch validation requires manual approval:`,
          validation.reason,
        );
        // Add the validation warning to displayData so it shows in the approval UI
        if (validation.reason) {
          (action.displayData as any).validationWarning = validation.reason;
        }
      } else {
        console.error(
          `[ApprovalController:${requestId}] ✗ Batch validation failed (hard reject):`,
          validation.reason,
        );
        console.log(
          `[ApprovalController:${requestId}] ━━━ BATCH APPROVAL END (rejected) ━━━`,
        );
        return {
          error: rpcErrors.invalidRequest({
            message: validation.reason || 'Auto-approval validation failed',
          }),
        };
      }
    } else {
      console.log(
        `[ApprovalController:${requestId}] No batch validator found, using manual approval flow`,
      );
    }

    // Normal flow: open approval window
    console.log(
      `[ApprovalController:${requestId}] ▶ Opening batch approval window...`,
    );
    openApprovalWindow(action, 'approve/tx-batch');
    console.log(
      `[ApprovalController:${requestId}] ━━━ BATCH APPROVAL END (awaiting user) ━━━`,
    );

    return new Promise((resolve) => {
      this.#requests.set(actionId, {
        params,
        network,
        resolve,
      });
    });
  };

  #executeBatchAutoApproval = async (
    action: MultiTxAction,
    network: NetworkWithCaipId,
    requestId: string,
  ): Promise<BatchApprovalResponse> => {
    try {
      console.log(
        `[ApprovalController:${requestId}] ▶ Signing batch transactions...`,
      );
      const startTime = Date.now();
      const results = await this.#handleBatchApproval(action, network);
      const duration = Date.now() - startTime;

      console.log(
        `[ApprovalController:${requestId}] ✓ Batch signed in ${duration}ms`,
        {
          resultCount: results.length,
        },
      );

      return {
        result: results.map((r) => ({ signedData: r.signedTx })),
      };
    } catch (err) {
      console.error(
        `[ApprovalController:${requestId}] ✗ Batch auto-approval error:`,
        err,
      );
      return {
        error: rpcErrors.internal({
          message: 'Unable to sign the batch of transactions',
          data: { originalError: err instanceof Error ? err.message : err },
        }),
      };
    }
  };

  updateTxInBatch = (
    action: MultiTxAction,
    newData: Parameters<EvmTxBatchUpdateFn>[0],
    txIndex: number,
  ): {
    displayData: DisplayData;
    signingRequests: SigningRequest<SigningData_EthSendTx>[];
  } => {
    const request = this.#getRequest(action);

    if (!request) {
      throw new Error(`No request found with id: ${action.actionId}`);
    }

    const { updateTx } = request.params;

    if (typeof updateTx !== 'function') {
      throw new Error(`No tx batch fee updater provided`);
    }

    return updateTx(newData, txIndex);
  };

  updateTx = (
    action: Action,
    newData: Parameters<EvmTxUpdateFn>[0] | Parameters<BtcTxUpdateFn>[0],
  ): { signingData: SigningData; displayData: DisplayData } => {
    const request = this.#getRequest(action);

    if (!request) {
      throw new Error(`No request found with id: ${action.actionId}`);
    }

    const { updateTx } = request.params;

    if (typeof updateTx !== 'function') {
      throw new Error(`No fee updater provided`);
    }

    return updateTx(newData);
  };

  #handleBatchApproval = async (
    action: MultiTxAction,
    network: NetworkWithCaipId,
  ) => {
    const hasUnsupportedRequests = action.signingRequests.some(
      ({ signingData }) => signingData.type !== RpcMethod.ETH_SEND_TRANSACTION,
    );

    // We only support batch signing of EVM transactions
    if (hasUnsupportedRequests) {
      throw new Error('Multiple signing request types detected');
    }

    const batch = action.signingRequests.map(
      ({ signingData }) => signingData.data,
    );

    return this.#walletService.signTransactionBatch(
      batch,
      network,
      action.tabId,
    );
  };

  #handleApproval = async (
    params: ApprovalParams,
    action: Action,
    network: NetworkWithCaipId,
  ) => {
    const { signingData } = action;

    if (!signingData) {
      throw new Error('No signing data provided');
    }

    switch (signingData.type) {
      case RpcMethod.BITCOIN_SEND_TRANSACTION:
      case RpcMethod.BITCOIN_SIGN_TRANSACTION:
      case RpcMethod.ETH_SEND_TRANSACTION:
      case RpcMethod.HVM_SIGN_TRANSACTION:
        return await this.#walletService.sign(
          signingData.data,
          network,
          action.tabId,
        );

      case RpcMethod.AVALANCHE_SIGN_TRANSACTION:
      case RpcMethod.AVALANCHE_SEND_TRANSACTION:
        return await this.#walletService.sign(
          signingData,
          network,
          action.tabId,
        );

      case RpcMethod.SIGN_TYPED_DATA:
      case RpcMethod.SIGN_TYPED_DATA_V1:
      case RpcMethod.SIGN_TYPED_DATA_V3:
      case RpcMethod.SIGN_TYPED_DATA_V4:
      case RpcMethod.ETH_SIGN:
      case RpcMethod.PERSONAL_SIGN:
      case RpcMethod.AVALANCHE_SIGN_MESSAGE:
        return await this.#walletService.signGenericMessage(
          signingData,
          network,
          action.tabId,
        );
      case RpcMethod.SOLANA_SIGN_TRANSACTION:
      case RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION:
      case RpcMethod.SOLANA_SIGN_MESSAGE:
        return await this.#walletService.sign(
          signingData,
          network,
          action.tabId,
        );

      default:
        throw new Error('Unrecognized method: ' + params.request.method);
    }
  };

  #buildAction = (
    params: ApprovalParamsWithContext,
    actionId?: string,
  ): Action => {
    return {
      [ACTION_HANDLED_BY_MODULE]: true,
      actionId,
      type: ActionType.Single,
      caipId: params.request.chainId,
      dappInfo: params.request.dappInfo,
      signingData: params.signingData,
      context: params.request.context,
      status: ActionStatus.PENDING,
      tabId: params.request.context?.tabId,
      params: params.request.params,
      displayData: params.displayData,
      scope: params.request.chainId,
      id: params.request.requestId,
      method: params.request.method,
    };
  };

  #buildMultiApprovalAction = (
    params: MultiApprovalParamsWithContext,
    actionId?: string,
  ): MultiTxAction => {
    return {
      [ACTION_HANDLED_BY_MODULE]: true,
      actionId,
      type: ActionType.Batch,
      caipId: params.request.chainId,
      signingRequests: params.signingRequests,
      displayData: params.displayData,
      dappInfo: params.request.dappInfo,
      context: params.request.context,
      status: ActionStatus.PENDING,
      tabId: params.request.context?.tabId,
      params: params.request.params,
      scope: params.request.chainId,
      id: params.request.requestId,
      method: params.request.method,
    };
  };
}
