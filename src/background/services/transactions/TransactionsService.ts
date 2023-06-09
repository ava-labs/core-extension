import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { contractParserMap } from '@src/contracts/contractParsers/contractParserMap';
import {
  ContractParserHandler,
  DisplayValueParserProps,
} from '@src/contracts/contractParsers/models';
import { parseBasicDisplayValues } from '@src/contracts/contractParsers/utils/parseBasicDisplayValues';
import { BigNumber, ethers } from 'ethers';
import { TransactionTypes } from 'ethers/lib/utils';
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
    const txParams = (params || [])[0];
    const network = await getTargetNetworkForTx(
      txParams,
      this.networkService,
      this.featureFlagService
    );

    if (!network) {
      throw Error('no network selected');
    }

    const provider = this.networkService.getProviderForNetwork(network, true);
    const toAddress = txParams.to?.toLocaleLowerCase() || '';

    let decodedData: ethers.utils.Result | undefined;
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
              txParams.data,
              txParams.value,
              network
            );
          } catch (err) {
            console.error(err);
            txDescription = { error: 'error while parsing ABI' };
          }
        } else {
          txDescription = { error: 'not a contract' };
        }

        decodedData = (txDescription as ethers.utils.TransactionDescription)
          .args;

        parser = contractParserMap.get(
          (txDescription as ethers.utils.TransactionDescription).name
        );
      }
    }

    const fees = await this.networkFeeService.getNetworkFee(network);

    if (txParams && isTxParams(txParams)) {
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
      const maxFeePerGas = fees?.low.maxFee ?? BigNumber.from(0);
      const maxPriorityFeePerGas = fees?.low.maxTip
        ? BigNumber.from(fees?.low.maxTip)
        : undefined;
      const suggestedMaxFeePerGas = txParams.maxFeePerGas ?? txParams.gasPrice;

      // If dApp suggests maxFeePerGas, but not maxPriorityFeePerGas, we set the tip to 0.
      const suggestedMaxPriorityFeePerGas = txParams.maxPriorityFeePerGas
        ? BigNumber.from(txParams.maxPriorityFeePerGas)
        : suggestedMaxFeePerGas
        ? BigNumber.from(0)
        : undefined;
      const displayValueProps: DisplayValueParserProps = {
        maxFeePerGas,
        maxPriorityFeePerGas,
        suggestedMaxFeePerGas: suggestedMaxFeePerGas
          ? BigNumber.from(suggestedMaxFeePerGas)
          : undefined,
        suggestedMaxPriorityFeePerGas,
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
              txParams.value,
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
        gasLimit ? { ...txParams, gas: gasLimit } : txParams
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
      type: Math.max(typeFromPayload, TransactionTypes.eip1559),
    };
  }
}
