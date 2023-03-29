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
import browser from 'webextension-polyfill';
import getTargetNetworkForTx from '../utils/getTargetNetworkForTx';
import { FeatureFlagService } from '../../featureFlags/FeatureFlagService';

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
    private networkService: NetworkService,
    private featureFlagService: FeatureFlagService
  ) {}

  handle: HandlerType['handle'] = async (request) => {
    const tabId = request.tabId;
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
      try {
        const network = await getTargetNetworkForTx(
          pendingTx,
          this.networkService,
          this.featureFlagService
        );

        const calculatedGasPrice = await this.networkFeeService.getNetworkFee(
          network
        );

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

        const { gasPrice, gasLimit, data, to, value } = txToCustomEvmTx(
          pendingTx,
          calculatedGasPrice
        );

        const signedTx = await this.walletService.sign(
          {
            nonce,
            chainId: BigNumber.from(pendingTx.chainId).toNumber(),
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            data: data,
            to: to,
            value: value,
          },
          tabId,
          network
        );

        const result = await this.networkService.sendTransaction(
          signedTx,
          network
        );

        await this.transactionsService.updateTransaction({
          status: TxStatus.SIGNED,
          id: update.id,
          tabId: pendingTx.tabId,
          result,
        });

        const notificationId = Date.now().toString();
        await browser.notifications.create(notificationId, {
          type: 'basic',
          iconUrl: '../../../../images/icon-32.png',
          title: 'Confirmed transaction',
          message: `Transaction confirmed! View on the explorer.`,
          priority: 2,
        });

        const openTab = async (id: string) => {
          if (id === notificationId) {
            const explorerUrl = getExplorerAddressByNetwork(network, result);
            await browser.tabs.create({ url: explorerUrl });
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
        setTimeout(async () => {
          browser.notifications.onClicked.removeListener(openTab);
          await browser.notifications.clear(notificationId);
        }, 5000);

        return { ...request, result };
      } catch (err: any) {
        console.error(err);
        await this.transactionsService.updateTransaction({
          status: TxStatus.ERROR,
          id: update.id,
          tabId: pendingTx.tabId,
          error: err?.message ?? err,
        });

        const errorMessage: string =
          err instanceof Error ? err.message : err.toString();

        await browser.notifications.create({
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
      }
    }

    return {
      ...request,
      result: pendingTx,
    };
  };
}
