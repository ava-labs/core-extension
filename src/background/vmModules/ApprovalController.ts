import { singleton } from 'tsyringe';
import {
  ApprovalParams,
  ApprovalResponse,
  ApprovalController as IApprovalController,
  RpcError,
  RpcMethod,
} from '@avalabs/vm-module-types';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { rpcErrors, JsonRpcError, providerErrors } from '@metamask/rpc-errors';

import { buildBtcTx } from '@src/utils/send/btcSendUtils';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

import { WalletService } from '../services/wallet/WalletService';
import { Action } from '../services/actions/models';
import { openApprovalWindow } from '../runtime/openApprovalWindow';
import { NetworkService } from '../services/network/NetworkService';
import { NetworkWithCaipId } from '../services/network/models';

import { ApprovalParamsWithContext } from './models';
import { buildBtcSendTransactionAction } from './helpers/buildBtcSendTransactionAction';
import { EnsureDefined } from '../models';

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

    const [preparedAction, actionError] = this.#try(() =>
      this.#buildAction(params)
    );
    if (actionError) return { error: actionError };

    const action = (await openApprovalWindow(
      preparedAction,
      'approve/generic'
    )) as EnsureDefined<Action, 'actionId'>;

    return new Promise((resolve) => {
      this.#requests.set(action.actionId, {
        params,
        network,
        resolve,
      });
    });
  };

  #try<F extends (...args: any) => any>(
    fn: F
  ): [ReturnType<F>, null] | [null, RpcError] {
    try {
      return [fn(), null];
    } catch (err: any) {
      const safeError =
        err instanceof JsonRpcError
          ? err
          : rpcErrors.internal({ message: 'Unknown error', data: err });
      return [null, safeError];
    }
  }

  #handleApproval = async (
    params: ApprovalParams,
    action: Action,
    network: NetworkWithCaipId
  ) => {
    const { signingData } = action;

    if (signingData?.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
      const { inputs, outputs } = await buildBtcTx(
        signingData.account,
        getProviderForNetwork(network) as BitcoinProvider,
        {
          amount: signingData.data.amount,
          address: signingData.data.to,
          feeRate: signingData.data.feeRate,
          token: signingData.data.balance,
        }
      );

      if (!inputs || !outputs) {
        throw new Error('Unable to construct BTC transaction');
      }

      return await this.#walletService.sign({ inputs, outputs }, network);
    }

    throw new Error('Unrecognized method: ' + params.request.method);
  };

  #buildAction = (params: ApprovalParamsWithContext): Action => {
    if (params.signingData.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
      return buildBtcSendTransactionAction(params);
    }

    throw rpcErrors.methodNotSupported({
      data: params.request.method,
    });
  };
}
