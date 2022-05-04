import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { defer, firstValueFrom, map, merge, tap } from 'rxjs';
import {
  PendingTransactions,
  Transaction,
  TransactionEvent,
  TxStatus,
} from '../models';
import { txToCustomEvmTx } from '../utils/txToCustomEvmTx';
import { TransactionsService } from '../TransactionsService';
import { NetworkFeeService } from '../../networkFee/NetworkFeeService';
import { WalletService } from '../../wallet/WalletService';
import { injectable } from 'tsyringe';

@injectable()
export class EthSendTransactionHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.ETH_SEND_TX];

  constructor(
    private transactionsService: TransactionsService,
    private networkFeeService: NetworkFeeService,
    private walletService: WalletService
  ) {}

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  handleAuthenticated = async (request) => {
    await this.transactionsService.addTransaction(request);

    const window = await openExtensionNewWindow(
      `sign/transaction?id=${request.id}`,
      '',
      request.meta?.coords
    );

    const windowClosed$ = window.removed.pipe(
      map(() => ({
        ...request,
        error: 'Window closed before approved',
      })),
      tap(() => {
        this.transactionsService.updateTransaction({
          status: TxStatus.ERROR_USER_CANCELED,
          id: request.id,
          error: 'Window closed before approved',
        });
      })
    );

    const signTx$ = defer(async () => {
      const pendingTx = await new Promise<Transaction>((resolve) => {
        this.transactionsService.addListener(
          TransactionEvent.TRANSACTIONS_UPDATED,
          (transactions: PendingTransactions) => {
            if (
              transactions[request.id] &&
              transactions[request.id].status === TxStatus.SUBMITTING
            ) {
              resolve(transactions[request.id]);
            }
          }
        );
      });

      const gasPrice = await this.networkFeeService.getNetworkFee();

      return txToCustomEvmTx(pendingTx, gasPrice).then((params) => {
        return this.walletService
          .sendCustomTx(
            params.gasPrice,
            params.gasLimit,
            params.data,
            params.to,
            params.value
          )
          .then((result) => {
            this.transactionsService.updateTransaction({
              status: TxStatus.SIGNED,
              id: request.id,
              result,
            });
            return { ...request, result };
          })
          .catch((err) => {
            console.error(err);
            this.transactionsService.updateTransaction({
              status: TxStatus.ERROR,
              id: request.id,
              error: err?.message ?? err,
            });
            return { ...request, error: err };
          });
      });
    });

    return firstValueFrom(merge(windowClosed$, signTx$));
  };
}
