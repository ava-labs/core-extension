import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { contractParserMap } from '@src/contracts/contractParsers/contractParserMap';
import { DisplayValueParserProps } from '@src/contracts/contractParsers/models';
import { parseBasicDisplayValues } from '@src/contracts/contractParsers/utils/parseBasicDisplayValues';
import { BigNumber, ethers } from 'ethers';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import {
  TokenWithBalanceERC20,
  NetworkTokenWithBalance,
  TokenWithBalance,
  TokenType,
} from '../balances/models';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import { NetworkService } from '../network/NetworkService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { StorageService } from '../storage/StorageService';
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
    private balancesService: BalanceAggregatorService,
    private accountsService: AccountsService
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
    const activeNetwork = await this.networkService.activeNetwork.promisify();
    const now = new Date().getTime();
    const txParams = (params || [])[0];

    const txDescription = await getTxInfo(
      txParams.to.toLocaleLowerCase(),
      txParams.data,
      txParams.value,
      this.networkService
    );

    const decodedData = (txDescription as ethers.utils.TransactionDescription)
      .args;

    const parser = contractParserMap.get(
      (txDescription as ethers.utils.TransactionDescription).name
    );

    const gasPrice = await this.networkFeeService.getNetworkFee();

    if (txParams && isTxParams(txParams)) {
      if (!activeNetwork) {
        throw Error('no network selected');
      }

      const tokens: TokenWithBalance[] =
        this.balancesService.balances?.[activeNetwork?.chainId || '']?.[
          this.accountsService.activeAccount?.addressC || ''
        ] || [];
      const nativeToken = tokens.filter((t) => t.type === TokenType.NATIVE);
      const displayValueProps: DisplayValueParserProps = {
        gasPrice: gasPrice?.low || BigNumber.from(0),
        erc20Tokens: tokens.filter(
          (t): t is TokenWithBalanceERC20 => t.type === TokenType.ERC20
        ),
        avaxPrice: nativeToken[0]?.priceUSD || 0,
        avaxToken: nativeToken[0] as NetworkTokenWithBalance,
        site: site ?? {
          domain: '',
        },
      };

      /**
       * Some requests, revoke approval, dont have gasLimit on it so we make sure its there
       */
      let gasLimit: number | null;
      try {
        gasLimit = await (txParams.gas
          ? BigNumber.from(txParams.gas).toNumber()
          : this.networkFeeService.estimateGasLimit(
              txParams.from,
              txParams.to,
              txParams.data as string,
              txParams.value
            ));
      } catch (e: any) {
        // handle gas estimation erros with the correct error message
        if (e.error?.error) {
          throw e.error.error;
        }
        throw e;
      }

      const txParamsWithGasLimit = gasLimit
        ? { ...txParams, gas: gasLimit }
        : txParams;

      const description = isTxDescriptionError(txDescription)
        ? txDescription
        : undefined;

      const displayValues: TransactionDisplayValues = parser
        ? await parser(
            activeNetwork,
            txParamsWithGasLimit,
            decodedData,
            displayValueProps,
            description
          )
        : (parseBasicDisplayValues(
            activeNetwork,
            txParamsWithGasLimit,
            displayValueProps,
            description
          ) as any);

      const networkMetaData = this.networkService.activeNetwork
        ? {
            metamaskNetworkId: activeNetwork.chainId.toString(),
            chainId: activeNetwork.chainId.toString(),
          }
        : { metamaskNetworkId: '', chainId: '' };

      const currentPendingTxs = await this.getTransactions();

      this.saveTransactions({
        ...currentPendingTxs,
        [`${tx.id}`]: {
          id: tx.id,
          method: tx.method,
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
      if (tx) {
        await this.saveTransactions({
          ...currentPendingTxs,
          ...updatePendingTxParams(update, tx),
        });
      }
    } else if (
      tx &&
      isTxStatusUpdate(tx) &&
      update.status !== TxStatus.SIGNED &&
      update.status !== TxStatus.ERROR &&
      update.status !== TxStatus.ERROR_USER_CANCELED
    ) {
      await this.saveTransactions({
        ...currentPendingTxs,
        ...updateTxStatus(update, tx),
      });
    } else if (tx && isTxFinalizedUpdate({ ...tx, ...update })) {
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
