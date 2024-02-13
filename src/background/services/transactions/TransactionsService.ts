import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import { NetworkService } from '../network/NetworkService';
import { NetworkFeeService } from '../networkFee/NetworkFeeService';
import { StorageService } from '../storage/StorageService';
import {
  EthSendTransactionParamsWithGas,
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
import getTargetNetworkForTx from './utils/getTargetNetworkForTx';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { JsonRpcApiProvider, Result, TransactionDescription } from 'ethers';
import { EthSendTransactionParams } from './handlers/eth_sendTransaction';
import { DebankService } from '../debank';
import { Network } from '@avalabs/chains-sdk';
import { TokenManagerService } from '../tokens/TokenManagerService';
import { parseWithERC20Abi } from './contracts/contractParsers/parseWithERC20Abi';
import { getTxDescription } from './utils/getTxDescription';
import { ContractParserHandler } from './contracts/contractParsers/models';
import { contractParserMap } from './contracts/contractParsers/contractParserMap';
import { parseBasicDisplayValues } from './contracts/contractParsers/utils/parseBasicDisplayValues';
import { AnalyticsServicePosthog } from '../analytics/AnalyticsServicePosthog';

@singleton()
export class TransactionsService {
  private eventEmitter = new EventEmitter();
  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private networkFeeService: NetworkFeeService,
    private balancesService: BalanceAggregatorService,
    private accountsService: AccountsService,
    private featureFlagService: FeatureFlagService,
    private debankService: DebankService,
    private tokenManagerService: TokenManagerService,
    private analyticsServicePosthog: AnalyticsServicePosthog
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

  async addTransaction(tx: ExtensionConnectionMessage): Promise<string> {
    const { params, site } = tx;
    const now = new Date().getTime();
    const trxParams = (params || [])[0] as EthSendTransactionParams;
    const network = await getTargetNetworkForTx(
      trxParams,
      this.networkService,
      this.featureFlagService
    );

    if (!network) {
      throw Error('no network selected');
    }

    const provider = this.networkService.getProviderForNetwork(network, true);
    if (!provider || !(provider instanceof JsonRpcApiProvider)) {
      throw Error('provider not available');
    }

    if (!trxParams || !isTxParams(trxParams)) {
      throw new Error('invalid transaction data');
    }

    const txPayload = await this.#addGasInformation(network, trxParams);

    // update balances if we are not on the current network
    if (
      !this.networkService.isActiveNetwork(network.chainId) &&
      this.accountsService.activeAccount
    ) {
      await this.balancesService.updateBalancesForNetworks(
        [network.chainId],
        [this.accountsService.activeAccount]
      );
    }

    let displayValues: TransactionDisplayValues | undefined = undefined;
    // order of parsing a transaction:
    // 1. use TX pre execution if available
    // 2. if not, check if toAddress is a known ERC20 token
    // 3. if not, use default basic approval data
    try {
      displayValues = await this.debankService.parseTransaction(
        network,
        txPayload
      );
    } catch (e) {
      // Debank parsing failed, try ERC20 parsing next
    }

    // if debank parsing failed check if toAddress is a known ERC20
    if (!displayValues && txPayload.to) {
      const erc20Tokens = await this.tokenManagerService.getTokensByChainId(
        network.chainId
      );
      const lowerCaseAddress = txPayload.to.toLowerCase();
      const erc20Token = erc20Tokens.find(
        (t) => t.address.toLowerCase() === lowerCaseAddress
      );
      if (erc20Token) {
        try {
          displayValues = parseWithERC20Abi(txPayload, erc20Token);
        } catch (e) {
          // ERC20 parsing failed fall back to local ABI parsers
        }
      }
    }

    // if debank and ERC20 parsing failed attempt to use ABI parsing
    if (!displayValues) {
      // the toAddress is empty for contract deployments
      const txDescription: TransactionDescription | null =
        await getTxDescription(network, provider, trxParams);

      const decodedData: Result | undefined = txDescription?.args;
      const parser: ContractParserHandler | undefined = contractParserMap.get(
        txDescription?.name ?? ''
      );

      try {
        displayValues = parser
          ? await parser(network, txPayload, decodedData, txDescription)
          : await parseBasicDisplayValues(network, txPayload, txDescription);
      } catch (err) {
        displayValues = await parseBasicDisplayValues(
          network,
          txPayload,
          txDescription
        );
      }
    }

    const currentPendingTxs = await this.getTransactions();

    const transactionId = crypto.randomUUID();
    this.saveTransactions({
      ...currentPendingTxs,
      [transactionId]: {
        id: transactionId,
        requestId: tx.id,
        method: tx.method,
        time: now,
        status: TxStatus.PENDING,
        chainId: network.chainId.toString(),
        txParams: txPayload,
        displayValues,
        tabId: site?.tabId,
        site: tx.site,
      },
    });
    return transactionId;
  }

  async updateTransaction(update: txParamsUpdate | txStatusUpdate) {
    const currentPendingTxs = await this.getTransactions();
    const tx = currentPendingTxs[update.id];

    if (!tx) {
      return;
    }

    if (isTxParamsUpdate(update)) {
      await this.saveTransactions({
        ...currentPendingTxs,
        ...updatePendingTxParams(update, tx),
      });
    } else if (
      isTxStatusUpdate(update) &&
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

      let activeAddress = this.accountsService.activeAccount?.addressC;
      if (
        this.networkService.activeNetwork &&
        isBitcoinNetwork(this.networkService.activeNetwork)
      ) {
        activeAddress = this.accountsService.activeAccount?.addressBTC;
      }

      const isFailedTx = [
        TxStatus.ERROR,
        TxStatus.ERROR_USER_CANCELED,
      ].includes((update as txStatusUpdate).status);

      // No need to await the request here.
      this.analyticsServicePosthog.captureEncryptedEvent({
        name: isFailedTx ? 'transactionFailed' : 'transactionSuccessful',
        windowId: crypto.randomUUID(),
        properties: {
          address: activeAddress,
          txHash: isFailedTx ? undefined : update.result,
          method: tx.method,
          chainId: this.networkService.activeNetwork?.chainId,
        },
      });
    }
  }

  addListener(event: TransactionEvent, callback: (data: any) => void) {
    this.eventEmitter.on(event, callback);
  }

  async #addGasInformation(
    network: Network,
    tx: EthSendTransactionParams
  ): Promise<EthSendTransactionParamsWithGas> {
    const fees = await this.networkFeeService.getNetworkFee(network);
    const maxFeePerGas = fees?.low.maxFee ?? 0n;
    const maxPriorityFeePerGas = fees?.low.maxTip
      ? BigInt(fees?.low.maxTip)
      : undefined;
    const typeFromPayload = tx.maxFeePerGas ? 2 : 0;

    let gasLimit: string;

    if (!tx.gasLimit) {
      try {
        const gasLimitEstimation = await (tx.gas
          ? BigInt(tx.gas)
          : this.networkFeeService.estimateGasLimit(
              tx.from,
              tx.to ?? '',
              tx.data as string,
              tx.value ? BigInt(tx.value) : undefined,
              network
            ));

        // we should always be able to calculate gas limit. If we don't have the limit the TX would fail anyways
        if (!gasLimitEstimation) {
          throw new Error('Unable to calculate gas limit');
        }

        gasLimit = `0x${gasLimitEstimation.toString(16)}`;
      } catch (e: any) {
        // handle gas estimation erros with the correct error message
        if (e.error?.error) {
          throw e.error.error;
        }
        throw e;
      }
    } else {
      gasLimit = tx.gasLimit;
    }

    return {
      ...tx,
      /**
       * We use EIP-1559 market fees (maxFeePerGas/maxPriorityFeePerGas),
       * and they require `type` to be set accordingly (to a value of 2).
       *
       * If the transaction payload explicitly sets a higher `type`,
       * we won't change it hoping it's still backwards-compatible.
       *
       * At the moment of writing this comment, "2" is the highest tx type available.
       */
      type: Math.max(typeFromPayload, 2),
      maxFeePerGas: tx.maxFeePerGas
        ? tx.maxFeePerGas
        : `0x${maxFeePerGas.toString(16)}`,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas
        ? tx.maxPriorityFeePerGas
        : `0x${maxPriorityFeePerGas?.toString(16)}`,
      gasLimit,
    };
  }
}
