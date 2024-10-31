import { singleton } from 'tsyringe';
import {
  ApprovalParams,
  ApprovalResponse,
  BtcTxUpdateFn,
  DisplayData,
  EvmTxUpdateFn,
  ApprovalController as IApprovalController,
  RpcMethod,
  SigningData,
} from '@avalabs/vm-module-types';
import { rpcErrors, providerErrors } from '@metamask/rpc-errors';

import { WalletService } from '../services/wallet/WalletService';
import { Action, ActionStatus } from '../services/actions/models';
import { openApprovalWindow } from '../runtime/openApprovalWindow';
import { NetworkService } from '../services/network/NetworkService';
import { NetworkWithCaipId } from '../services/network/models';

import { ApprovalParamsWithContext } from './models';
import { ACTION_HANDLED_BY_MODULE } from '../models';
import { EVM, EVMUnsignedTx, UnsignedTx } from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/core-wallets-sdk';

@singleton()
export class ApprovalController implements IApprovalController {
  #walletService: WalletService;
  #networkService: NetworkService;

  #requests = new Map<
    string,
    {
      params: ApprovalParams;
      network: NetworkWithCaipId;
      resolve: (response: ApprovalResponse) => void;
    }
  >();

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

  onRejected = async (action: Action) => {
    if (!action.actionId) {
      return;
    }

    const request = this.#requests.get(action.actionId);

    if (!request) {
      return;
    }

    const { resolve } = request;

    resolve({
      error: providerErrors.userRejectedRequest(),
    });
    this.#requests.delete(action.actionId);
  };

  onApproved = async (action: Action) => {
    if (!action.actionId) {
      return;
    }

    const request = this.#requests.get(action.actionId);

    if (!request) {
      return;
    }

    const { params, network, resolve } = request;

    try {
      const { signedTx: signedData, txHash } = await this.#handleApproval(
        params,
        action,
        network
      );

      if (signedData) {
        resolve({ signedData });
      } else if (txHash) {
        resolve({ txHash });
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
  };

  /**
   * This method should never throw. Instead, return an { error } object.
   */
  requestApproval = async (
    params: ApprovalParamsWithContext
  ): Promise<ApprovalResponse> => {
    const network = await this.#networkService.getNetwork(
      params.request.chainId
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
      'approve/generic'
    );

    return new Promise((resolve) => {
      this.#requests.set(action.actionId as string, {
        params,
        network,
        resolve,
      });
    });
  };

  updateTx = (
    id: string,
    newData: Parameters<EvmTxUpdateFn>[0] | Parameters<BtcTxUpdateFn>[0]
  ): { signingData: SigningData; displayData: DisplayData } => {
    const request = this.#requests.get(id);

    if (!request) {
      throw new Error(`No request found with id: ${id}`);
    }

    if (!request.params.updateTx) {
      throw new Error(`No fee updater provided`);
    }

    return request.params.updateTx(newData);
  };

  #handleApproval = async (
    params: ApprovalParams,
    action: Action,
    network: NetworkWithCaipId
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
          action.tabId
        );
      case RpcMethod.AVALANCHE_SEND_TRANSACTION: {
        const result = await this.#walletService.sign(
          {
            tx:
              signingData.vm === EVM
                ? EVMUnsignedTx.fromJSON(signingData.unsignedTxJson)
                : UnsignedTx.fromJSON(signingData.unsignedTxJson),
            internalIndices: signingData.internalIndices,
            externalIndices: signingData.externalIndices,
          },
          network,
          action.tabId
        );

        if ('txHash' in result) {
          return result;
        }

        const signedTransaction =
          signingData.vm === EVM
            ? EVMUnsignedTx.fromJSON(result.signedTx)
            : UnsignedTx.fromJSON(result.signedTx);

        if (!signedTransaction.hasAllSignatures()) {
          throw new Error('Signing error, missing signatures.');
        }

        return {
          signedTx: Avalanche.signedTxToHex(signedTransaction.getSignedTx()),
        };
      }

      default:
        throw new Error('Unrecognized method: ' + params.request.method);
    }
  };

  #buildAction = (params: ApprovalParamsWithContext): Action => {
    return {
      [ACTION_HANDLED_BY_MODULE]: true,
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
}
