import { singleton } from 'tsyringe';
import {
  ApprovalParams,
  ApprovalResponse,
  BtcTxUpdateFn,
  DisplayData,
  EvmTxUpdateFn,
  BatchApprovalController,
  RpcMethod,
  SigningData,
  BatchApprovalParams,
  BatchApprovalResponse,
  EvmTxBatchUpdateFn,
  SigningRequest,
  SigningData_EthSendTx,
} from '@avalabs/vm-module-types';
import { rpcErrors, providerErrors } from '@metamask/rpc-errors';

import { WalletService } from '../services/wallet/WalletService';
import {
  Action,
  ActionStatus,
  MultiTxAction,
  isBatchApprovalAction,
} from '../services/actions/models';
import { openApprovalWindow } from '../runtime/openApprovalWindow';
import { NetworkService } from '../services/network/NetworkService';
import { NetworkWithCaipId } from '../services/network/models';

import {
  ApprovalParamsWithContext,
  MultiApprovalParamsWithContext,
} from './models';
import { ACTION_HANDLED_BY_MODULE } from '../models';

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

@singleton()
export class ApprovalController implements BatchApprovalController {
  #walletService: WalletService;
  #networkService: NetworkService;

  #requests = new Map<string, CachedRequest | CachedBatchRequest>();

  constructor(walletService: WalletService, networkService: NetworkService) {
    this.#walletService = walletService;
    this.#networkService = networkService;
  }

  onTransactionConfirmed = () => {
    // Transaction Confirmed. Show a toast? Trigger browser notification?',
  };

  onTransactionReverted = () => {
    // Transaction Reverted. Show a toast? Trigger browser notification?',
  };

  onRejected = async (action: Action | MultiTxAction) => {
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

  #getRequest(action: Action): CachedRequest | undefined;
  #getRequest(action: MultiTxAction): CachedBatchRequest | undefined;
  #getRequest(action) {
    if (!action.actionId) {
      return;
    }

    return this.#requests.get(action.actionId);
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

        if (approvalResult.signedTx) {
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
              originalError: err,
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

    const action = await openApprovalWindow(
      this.#buildAction(params),
      'approve/generic',
    );

    return new Promise((resolve) => {
      this.#requests.set(action.actionId as string, {
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

    const action = await openApprovalWindow(
      this.#buildMultiApprovalAction(params),
      'approve/tx-batch',
    );

    return new Promise((resolve) => {
      this.#requests.set(action.actionId as string, {
        params,
        network,
        resolve,
      });
    });
  };

  updateTxInBatch = (
    action: MultiTxAction,
    newData: Parameters<EvmTxBatchUpdateFn>[0],
    txIndex?: number,
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
        return await this.#walletService.sign(
          signingData.data,
          network,
          action.tabId,
        );

      default:
        throw new Error('Unrecognized method: ' + params.request.method);
    }
  };

  #buildAction = (params: ApprovalParamsWithContext): Action => {
    return {
      [ACTION_HANDLED_BY_MODULE]: true,
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
  ): MultiTxAction => {
    return {
      [ACTION_HANDLED_BY_MODULE]: true,
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
