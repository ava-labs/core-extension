import { container, singleton } from 'tsyringe';
import {
  ApprovalParams,
  ApprovalResponse,
  ApprovalController as IApprovalController,
  RpcError,
  RpcMethod,
} from '@avalabs/vm-module-types';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { rpcErrors, providerErrors, JsonRpcError } from '@metamask/rpc-errors';

import { buildBtcTx } from '@src/utils/send/btcSendUtils';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

import { WalletService } from '../services/wallet/WalletService';
import { Action, ActionStatus, ActionsEvent } from '../services/actions/models';
import { openApprovalWindow } from '../runtime/openApprovalWindow';
import { ActionsService } from '../services/actions/ActionsService';
import { NetworkService } from '../services/network/NetworkService';
import { NetworkWithCaipId } from '../services/network/models';

import { ApprovalParamsWithContext } from './models';
import { measureDuration } from '@src/utils/measureDuration';
import { AnalyticsServicePosthog } from '../services/analytics/AnalyticsServicePosthog';
import { buildBtcSendTransactionAction } from './helpers/buildBtcSendTransactionAction';

@singleton()
export class ApprovalController implements IApprovalController {
  #walletService: WalletService;
  #requestsMetadata = new Map<
    string,
    { txType: string; chainId: number; site: string; rpcUrl: string }
  >();

  constructor(walletService: WalletService) {
    this.#walletService = walletService;
  }

  onTransactionConfirmed = (txHash: `0x${string}`, requestId: string) => {
    // Transaction Confirmed. Show a toast? Trigger browser notification?',
    const confirmationTime = measureDuration(requestId).end();
    const analyticsService = container.resolve(AnalyticsServicePosthog);
    const metadata = this.#requestsMetadata.get(requestId);

    if (metadata) {
      analyticsService.captureEncryptedEvent({
        name: 'TransactionTimeToConfirmation',
        windowId: crypto.randomUUID(),
        properties: {
          ...metadata,
          duration: confirmationTime,
        },
      });
      this.#requestsMetadata.delete(requestId);
    }
  };

  onTransactionReverted = () => {
    // Transaction Reverted. Show a toast? Trigger browser notification?',
  };

  /**
   * This method should never throw. Instead, return an { error } object.
   */
  requestApproval = async (
    params: ApprovalParamsWithContext
  ): Promise<ApprovalResponse> => {
    const networkService = container.resolve(NetworkService);
    const network = await networkService.getNetwork(params.request.chainId);
    if (!network) {
      return {
        error: rpcErrors.invalidRequest({
          message: 'Unsupported network',
          data: params.request.chainId,
        }),
      };
    }

    const [url, urlError] = this.#try(() =>
      this.#getPopupUrl(params.request.method)
    );
    if (urlError) return { error: urlError };

    const [preparedAction, actionError] = this.#try(() =>
      this.#buildAction(params)
    );
    if (actionError) return { error: actionError };

    const action = await openApprovalWindow(preparedAction, url);

    return new Promise((resolve) => {
      const actionsService = container.resolve(ActionsService);
      const actionId = action.id;

      const cleanup = () => {
        if (action.actionId) {
          actionsService.removeAction(action.actionId);
        }

        actionsService.removeListener(
          ActionsEvent.MODULE_ACTION_UPDATED,
          onUpdated
        );
      };

      const onUpdated = async ({
        action: updatedAction,
        newStatus,
        error,
      }: {
        action: Action;
        newStatus: ActionStatus;
        error?: string;
      }) => {
        if (updatedAction.id !== actionId) {
          return;
        }

        if (error || newStatus === ActionStatus.ERROR) {
          cleanup();
          resolve({ error: rpcErrors.internal(error) });
          return;
        }

        if (newStatus === ActionStatus.ERROR_USER_CANCELED) {
          cleanup();
          resolve({ error: providerErrors.userRejectedRequest() });
          return;
        }

        if (newStatus === ActionStatus.SUBMITTING) {
          try {
            const { signedTx: signedData, txHash } = await this.#handleApproval(
              params,
              updatedAction,
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
            cleanup();
          }

          return;
        }
      };

      actionsService.addListener(ActionsEvent.MODULE_ACTION_UPDATED, onUpdated);
    });
  };

  #getPopupUrl = (method: RpcMethod) => {
    if (method === RpcMethod.BITCOIN_SEND_TRANSACTION) {
      return 'approve/bitcoinSignTx';
    }

    throw rpcErrors.methodNotSupported({
      data: method,
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
      this.#requestsMetadata.set(params.request.requestId, {
        txType: 'send',
        chainId: network.chainId,
        rpcUrl: network.rpcUrl,
        site: new URL(params.request.dappInfo.url).hostname,
      });

      measureDuration(params.request.requestId).start();

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

let instance: ApprovalController;

function getController(walletService: WalletService) {
  if (!instance) {
    instance = new ApprovalController(walletService);
  }

  return instance;
}

export default getController;
