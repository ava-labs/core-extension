import { container } from 'tsyringe';
import {
  ApprovalParams,
  ApprovalResponse,
  ApprovalController as IApprovalController,
  RpcMethod,
} from '@avalabs/vm-module-types';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { ethErrors } from 'eth-rpc-errors';

import { buildBtcTx } from '@src/utils/send/btcSendUtils';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

import type { WalletService } from '../services/wallet/WalletService';
import { Action, ActionStatus, ActionsEvent } from '../services/actions/models';
import { openApprovalWindow } from '../runtime/openApprovalWindow';
import { ActionsService } from '../services/actions/ActionsService';
import { NetworkService } from '../services/network/NetworkService';
import { NetworkWithCaipId } from '../services/network/models';

import { ApprovalParamsWithContext, VIA_MODULE_SYMBOL } from './models';
import { measureDuration } from '@src/utils/measureDuration';
import { AnalyticsServicePosthog } from '../services/analytics/AnalyticsServicePosthog';

class ApprovalController implements IApprovalController {
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

  requestApproval = async (
    params: ApprovalParamsWithContext
  ): Promise<ApprovalResponse> => {
    const networkService = container.resolve(NetworkService);
    const network = await networkService.getNetwork(params.request.chainId);

    if (!network) {
      throw new Error('Unsupported network: ' + params.request.chainId);
    }

    const url = this.#getPopupUrl(params.request.method);
    const action = await openApprovalWindow(this.#buildAction(params), url);

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
        error: unknown;
      }) => {
        if (updatedAction.id !== actionId) {
          return;
        }

        if (error || newStatus === ActionStatus.ERROR) {
          cleanup();
          resolve({ error: error ?? (updatedAction.error as any) }); // TODO: fix any
          return;
        }

        if (newStatus === ActionStatus.ERROR_USER_CANCELED) {
          cleanup();
          resolve({ error: ethErrors.provider.userRejectedRequest() as any }); // TODO: fix any
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
                error: ethErrors.rpc.internal({
                  message: 'Unsupported signing result type',
                }) as any,
              }); // TODO: fix any
            }
          } catch (err) {
            resolve({ error: err as any }); // TODO: fix any
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

    throw new Error('Unrecognized method: ' + method);
  };

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
      return {
        // ActionService needs to know it should not look for the handler in the DI registry,
        // but rather just emit the events for the ApprovalController to listen for
        [VIA_MODULE_SYMBOL]: true,
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
    }

    throw new Error('Unrecognized method ' + params.request.method);
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
