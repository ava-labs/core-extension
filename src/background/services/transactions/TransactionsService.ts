import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { contractParserMap } from '@src/contracts/contractParsers/contractParserMap';
import { DisplayValueParserProps } from '@src/contracts/contractParsers/models';
import { parseBasicDisplayValues } from '@src/contracts/contractParsers/utils/parseBasicDisplayValues';
import { BigNumber, ethers } from 'ethers';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { StorageService } from '../storage/StorageService';
import { WalletService } from '../wallet/WalletService';
import { getTxInfo, isTxDescriptionError } from './getTxInfo';
import {
  isTxFinalizedUpdate,
  isTxParams,
  isTxParamsUpdate,
  isTxStatusUpdate,
  PendingTransactions,
  TransactionDisplayValues,
  TransactionEvent,
  TRANSACTIONS_STORAGE_KEY,
  txParamsUpdate,
  TxStatus,
  txStatusUpdate,
} from './models';
import { updatePendingTxParams } from './utils/updatePendingTxParams';
import {
  updateTxStatus,
  updateTxStatusFinalized,
} from './utils/updateTxStatus';

@singleton()
export class TransactionsService {
  private eventEmitter = new EventEmitter();
  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private networkFeeService: NetworkFeeService,
    private walletService: WalletService
  ) {}

  async getTransactions(): Promise<PendingTransactions> {
    return (
      (await this.storageService.load<PendingTransactions>(
        TRANSACTIONS_STORAGE_KEY
      )) ?? {}
    );
  }

  async saveTransactions(transations: PendingTransactions) {
    await this.storageService.save<PendingTransactions>(
      TRANSACTIONS_STORAGE_KEY,
      transations
    );
    this.eventEmitter.emit(TransactionEvent.TRANSACTIONS_UPDATED, transations);
  }

  async addTransaction(tx: ExtensionConnectionMessage) {
    const { params, site } = tx;

    const now = new Date().getTime();
    const txParams = (params || [])[0];

    const txDescription = await getTxInfo(
      txParams.to.toLocaleLowerCase(),
      txParams.data,
      txParams.value,
      this.networkService.isMainnet
    );

    const decodedData = (txDescription as ethers.utils.TransactionDescription)
      .args;

    const parser = contractParserMap.get(
      (txDescription as ethers.utils.TransactionDescription).name
    );

    const gasPrice = await this.networkFeeService.getNetworkFee();

    if (txParams && isTxParams(txParams)) {
      const displayValueProps = {
        gasPrice: gasPrice?.low || BigNumber.from(0),
        erc20Tokens: this.walletService.walletState?.erc20Tokens,
        avaxPrice: this.walletService.walletState?.avaxPrice,
        avaxToken: this.walletService.walletState?.avaxToken,
        site,
      } as DisplayValueParserProps;

      /**
       * Some requests, revoke approval, dont have gasLimit on it so we make sure its there
       */
      const gasLimit: any = await (txParams.gas
        ? BigNumber.from(txParams.gas).toNumber()
        : this.networkFeeService.estimateGasLimit(
            txParams.from,
            txParams.to,
            txParams.data as string
          ));

      const txParamsWithGasLimit = gasLimit
        ? { ...txParams, gas: gasLimit }
        : txParams;

      const description = isTxDescriptionError(txDescription)
        ? txDescription
        : undefined;

      const displayValues: TransactionDisplayValues = parser
        ? await parser(
            txParamsWithGasLimit,
            decodedData,
            displayValueProps,
            description
          )
        : (parseBasicDisplayValues(
            txParamsWithGasLimit,
            displayValueProps,
            description
          ) as any);

      const networkMetaData = this.networkService.activeNetwork
        ? {
            metamaskNetworkId:
              this.networkService.activeNetwork.config.networkID.toString(),
            chainId: this.networkService.activeNetwork.chainId,
          }
        : { metamaskNetworkId: '', chainId: '' };

      const currentPendingTxs = await this.getTransactions();

      this.saveTransactions({
        ...currentPendingTxs,
        [`${tx.id}`]: {
          id: tx.id,
          time: now,
          status: TxStatus.PENDING,
          ...networkMetaData,
          txParams: txParamsWithGasLimit,
          displayValues,
          type: 'standard',
          transactionCategory: 'transfer',
          tabId: site?.tabId,
        },
      });
    }
  }

  async updateTransaction(update: txParamsUpdate | txStatusUpdate) {
    const currentPendingTxs = await this.getTransactions();
    const tx = currentPendingTxs[update.id];

    if (isTxParamsUpdate(update)) {
      await this.saveTransactions({
        ...currentPendingTxs,
        ...updatePendingTxParams(update, tx),
      });
    } else if (
      isTxStatusUpdate(tx) &&
      update.status !== TxStatus.SIGNED &&
      update.status !== TxStatus.ERROR &&
      update.status !== TxStatus.ERROR_USER_CANCELED
    ) {
      await this.saveTransactions({
        ...currentPendingTxs,
        ...updateTxStatus(update, tx),
      });
    } else if (isTxFinalizedUpdate({ ...tx, ...update })) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [`${update.id}`]: _removed, ...txs } = currentPendingTxs;
      await this.saveTransactions(txs);
      this.eventEmitter.emit(
        TransactionEvent.TRANSACTION_FINALIZED,
        updateTxStatusFinalized(update, tx)
      );
    }
  }

  addListener(event: TransactionEvent, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }
}
