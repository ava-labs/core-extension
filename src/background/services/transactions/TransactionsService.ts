import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { contractParserMap } from '@src/contracts/contractParsers/contractParserMap';
import {
  ContractParserHandler,
  DisplayValueParserProps,
} from '@src/contracts/contractParsers/models';
import { parseBasicDisplayValues } from '@src/contracts/contractParsers/utils/parseBasicDisplayValues';
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
  txParams,
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
import { JsonRpcBatchInternal } from '@avalabs/wallets-sdk';
import { resolve } from '@src/utils/promiseResolver';
import { Result, TransactionDescription } from 'ethers';

@singleton()
export class TransactionsService {
  private eventEmitter = new EventEmitter();
  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private networkFeeService: NetworkFeeService,
    private balancesService: BalanceAggregatorService,
    private accountsService: AccountsService,
    private featureFlagService: FeatureFlagService
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
    let txDescription;

    const { params, site } = tx;
    const now = new Date().getTime();
    const trxParams = (params || [])[0];
    const network = await getTargetNetworkForTx(
      trxParams,
      this.networkService,
      this.featureFlagService
    );

    if (!network) {
      throw Error('no network selected');
    }

    const provider = this.networkService.getProviderForNetwork(network, true);
    const toAddress = trxParams.to?.toLocaleLowerCase() || '';

    let decodedData: Result | undefined;
    let parser: ContractParserHandler | undefined;

    // the toAddress is empty for contract deployments
    if (toAddress) {
      const [contractByteCode, error] = await resolve(
        (provider as JsonRpcBatchInternal).getCode(toAddress)
      );

      if (!error) {
        // the response is always `0x` if the address is EOA and it's the contract's source byte code otherwise
        // see https://docs.ethers.org/v5/single-page/#/v5/api/providers/provider/-%23-Provider-getCode
        if (contractByteCode !== '0x') {
          try {
            txDescription = await getTxInfo(
              toAddress,
              trxParams.data,
              trxParams.value,
              network
            );
          } catch (err) {
            console.error(err);
            txDescription = { error: 'error while parsing ABI' };
          }
        } else {
          txDescription = { error: 'not a contract' };
        }

        decodedData = (txDescription as TransactionDescription).args;

        parser = contractParserMap.get(
          (txDescription as TransactionDescription).name
        );
      }
    }

    const fees = await this.networkFeeService.getNetworkFee(network);

    if (trxParams && isTxParams(trxParams)) {
      if (
        !this.networkService.isActiveNetwork(network.chainId) &&
        this.accountsService.activeAccount
      ) {
        await this.balancesService.updateBalancesForNetworks(
          [network.chainId],
          [this.accountsService.activeAccount]
        );
      }

      const tokens: TokenWithBalance[] =
        Object.values(
          this.balancesService.balances?.[network?.chainId || '']?.[
            this.accountsService.activeAccount?.addressC || ''
          ] ?? {}
        ) || [];

      const nativeToken = tokens.filter((t) => t.type === TokenType.NATIVE);
      const maxFeePerGas = fees?.low.maxFee ?? 0n;
      const maxPriorityFeePerGas = fees?.low.maxTip
        ? BigInt(fees?.low.maxTip)
        : undefined;
      const displayValueProps: DisplayValueParserProps = {
        maxFeePerGas,
        maxPriorityFeePerGas,
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
        gasLimit = await (trxParams.gas
          ? trxParams.gas
          : this.networkFeeService.estimateGasLimit(
              trxParams.from,
              trxParams.to,
              trxParams.data as string,
              trxParams.value ? BigInt(trxParams.value) : undefined,
              network
            ));
      } catch (e: any) {
        // handle gas estimation erros with the correct error message
        if (e.error?.error) {
          throw e.error.error;
        }
        throw e;
      }

      const txPayload = this.addTxType(
        gasLimit ? { ...trxParams, gas: gasLimit } : trxParams
      );

      const description = isTxDescriptionError(txDescription)
        ? txDescription
        : undefined;

      let displayValues: TransactionDisplayValues;

      try {
        displayValues = parser
          ? await parser(
              network,
              txPayload,
              decodedData,
              displayValueProps,
              description
            )
          : (parseBasicDisplayValues(
              network,
              txPayload,
              displayValueProps,
              description
            ) as any);
      } catch (err) {
        displayValues = parseBasicDisplayValues(
          network,
          txPayload,
          displayValueProps,
          description
        ) as any;
      }

      const networkMetaData = {
        metamaskNetworkId: network.chainId.toString(),
        chainId: network.chainId.toString(),
      };

      const currentPendingTxs = await this.getTransactions();

      this.saveTransactions({
        ...currentPendingTxs,
        [`${tx.id}`]: {
          id: tx.id,
          method: tx.method,
          time: now,
          status: TxStatus.PENDING,
          ...networkMetaData,
          txParams: txPayload,
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

  private addTxType(payload: txParams): txParams {
    const typeFromPayload = payload.type ?? 0;

    return {
      ...payload,
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
    };
  }
}
