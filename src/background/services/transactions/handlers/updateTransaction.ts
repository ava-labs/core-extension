import { ExtensionRequestHandler } from '@src/background/connections/models';
import { TransactionsService } from '../TransactionsService';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  isTxFinalizedUpdate,
  isTxParamsUpdate,
  isTxStatusUpdate,
  Transaction,
  txParamsUpdate,
  TxStatus,
  txStatusUpdate,
} from '../models';
import { injectable } from 'tsyringe';
import { NetworkFeeService } from '../../networkFee/NetworkFeeService';
import { txToCustomEvmTx } from '../utils/txToCustomEvmTx';
import { WalletService } from '../../wallet/WalletService';
import { NetworkService } from '../../network/NetworkService';
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { BigNumber } from 'ethers';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { browser } from 'webextension-polyfill-ts';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.TRANSACTIONS_UPDATE,
  Transaction | string,
  [update: txParamsUpdate | txStatusUpdate]
>;

@injectable()
export class UpdateTransactionHandler implements HandlerType {
  method = ExtensionRequest.TRANSACTIONS_UPDATE as const;

  constructor(
    private transactionsService: TransactionsService,
    private networkFeeService: NetworkFeeService,
    private walletService: WalletService,
    private networkService: NetworkService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const [update] = request.params;

    const isKnownTxType = [
      isTxStatusUpdate(update),
      isTxFinalizedUpdate(update),
      isTxParamsUpdate(update),
    ].some((isKnown) => isKnown);

    if (!isKnownTxType) {
      return {
        ...request,
        error: 'malformed or unsupported update',
      };
    }

    await this.transactionsService.updateTransaction(update);

    const currentPendingTransactions =
      await this.transactionsService.getTransactions();
    const pendingTx = currentPendingTransactions[update.id];

    if (!pendingTx) {
      return {
        ...request,
        error: 'Cannot find transaction',
      };
    }

    if ('status' in update && update.status === TxStatus.SUBMITTING) {
      const gasPrice = await this.networkFeeService.getNetworkFee();
      const network = this.networkService.activeNetwork;
      if (!network) {
        return {
          ...request,
          error: 'network not found',
        };
      }
      const nonce = await (
        this.networkService.getProviderForNetwork(
          network
        ) as JsonRpcBatchInternal
      ).getTransactionCount(pendingTx.txParams.from);

      return txToCustomEvmTx(pendingTx, gasPrice).then((params) => {
        return this.walletService
          .sign({
            nonce,
            chainId: BigNumber.from(pendingTx.chainId).toNumber(),
            gasPrice: params.gasPrice,
            gasLimit: params.gasLimit,
            data: params.data,
            to: params.to,
            value: params.value,
          })
          .then((signedTx) => {
            return this.networkService.sendTransaction(signedTx);
          })
          .then((result) => {
            this.transactionsService.updateTransaction({
              status: TxStatus.SIGNED,
              id: update.id,
              tabId: pendingTx.tabId,
              result,
            });

            const notificationId = Date.now().toString();
            browser.notifications.create(notificationId, {
              type: 'basic',
              iconUrl: '../../../../images/icon-32.png',
              title: 'Confirmed transaction',
              message: `Transaction confirmed! View on the explorer.`,
              priority: 2,
            });

            const openTab = (id: string) => {
              if (id === notificationId) {
                const explorerUrl = getExplorerAddressByNetwork(
                  network,
                  result
                );
                browser.tabs.create({ url: explorerUrl });
              }
            };
            browser.notifications.onClicked.addListener(openTab);
            browser.notifications.onClosed.addListener((id: string) => {
              if (id === notificationId) {
                browser.notifications.onClicked.removeListener(openTab);
              }
            });

            /*
						notifications.onClosed is only triggered when a user close the notification.
            And the notification is automatically closed 5 secs if user does not close it.
            To mimic onClosed for system, using setTimeout.
             */
            setTimeout(() => {
              browser.notifications.onClicked.removeListener(openTab);
              browser.notifications.clear(notificationId);
            }, 5000);

            return { ...request, result };
          })
          .catch((err) => {
            console.error(err);
            this.transactionsService.updateTransaction({
              status: TxStatus.ERROR,
              id: update.id,
              tabId: pendingTx.tabId,
              error: err?.message ?? err,
            });

            const errorMessage: string =
              err instanceof Error ? err.message : err.toString();

            browser.notifications.create({
              type: 'basic',
              iconUrl: '../../../../images/icon-32.png',
              title: 'Failed transaction',
              message: `Transaction failed! ${errorMessage}`,
              priority: 2,
            });

            return {
              ...request,
              error: errorMessage,
            };
          });
      });
    }

    return {
      ...request,
      result: pendingTx,
    };
  };
}
