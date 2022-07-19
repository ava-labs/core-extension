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
      const network = await this.networkService.activeNetwork.promisify();
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
            return {
              ...request,
              error: err,
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
