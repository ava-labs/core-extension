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
} from './models';
import { TransactionStatusEvents } from '../services/transactions/events/transactionStatusEvents';
import { isUserRejectionError } from '@core/common';
import { KEYSTONE_NOT_IN_HOMEPAGE_ERROR } from '~/services/keystone/constants/error';

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
    this.#transactionStatusEvents.emitPending(txHash, request.chainId, {
      requestId: request.requestId,
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
    this.#transactionStatusEvents.emitConfirmed(txHash, request.chainId, {
      explorerLink,
      requestId: request.requestId,
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
    this.#transactionStatusEvents.emitReverted(txHash, request.chainId, {
      requestId: request.requestId,
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
        const errorMessage = (err as Error).message;
        if (errorMessage.includes(KEYSTONE_NOT_IN_HOMEPAGE_ERROR)) {
          this.#requests.delete(action.actionId);
          throw err;
        }

        this.#requests.delete(action.actionId);

        if (isUserRejectionError(err)) {
          resolve({
            error: providerErrors.userRejectedRequest(),
          });
        } else {
          resolve({
            error: rpcErrors.internal({
              message: 'Unable to sign the message',
              data: {
                originalError: err instanceof Error ? err.message : err,
              },
            }),
          });
        }
      }
    }
  };

  /**
   * This method should never throw. Instead, return an { error } object.
   */
  requestApproval = async (
    params: ApprovalParamsWithContext,
  ): Promise<ApprovalResponse> => {
    const network = await this.#networkService.getNetwork(
      params.request.chainId,
    );
    if (!network) {
      return {
        error: rpcErrors.invalidRequest({
          message: 'Unsupported network',
          data: params.request.chainId,
        }),
      };
    }

    const actionId = crypto.randomUUID();

    openApprovalWindow(this.#buildAction(params, actionId), 'approve/generic');

    return new Promise((resolve) => {
      this.#requests.set(actionId, {
        params,
        network,
        resolve,
      });
    });
  };

  /**
   * This method should never throw. Instead, return an { error } object.
   */
  requestBatchApproval = async (
    params: MultiApprovalParamsWithContext,
  ): Promise<BatchApprovalResponse> => {
    const network = await this.#networkService.getNetwork(
      params.request.chainId,
    );

    if (!network) {
      return {
        error: rpcErrors.invalidRequest({
          message: 'Unsupported network',
          data: params.request.chainId,
        }),
      };
    }

    const actionId = crypto.randomUUID();

    openApprovalWindow(
      this.#buildMultiApprovalAction(params, actionId),
      'approve/tx-batch',
    );

    return new Promise((resolve) => {
      this.#requests.set(actionId, {
        params,
        network,
        resolve,
      });
    });
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
