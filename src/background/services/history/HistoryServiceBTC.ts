import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { HistoryServiceBridgeHelper } from './HistoryServiceBridgeHelper';
import { TxHistoryItem } from './models';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { NetworkWithCaipId } from '../network/models';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { TransactionType } from '@avalabs/vm-module-types';

@singleton()
export class HistoryServiceBTC {
  constructor(
    private accountsService: AccountsService,
    private bridgeHistoryHelperService: HistoryServiceBridgeHelper,
    private moduleManager: ModuleManager
  ) {}

  async getHistory(network: NetworkWithCaipId): Promise<TxHistoryItem[]> {
    if (network?.vmName !== NetworkVMType.BITCOIN) {
      return [];
    }
    const address = this.accountsService.activeAccount?.addressBTC;

    if (!address) {
      return [];
    }

    try {
      const module = await this.moduleManager.loadModuleByNetwork(network);
      const { transactions } = await module.getTransactionHistory({
        address,
        network,
      });

      return transactions.map((tx) => {
        const isBridge = this.bridgeHistoryHelperService.isBridgeTransactionBTC(
          [tx.from, tx.to]
        );

        return {
          ...tx,
          // BitcoinModule is not able to recognize bridge txs at the moment, so we need to do it here.
          isBridge,
          txType: isBridge
            ? TransactionType.BRIDGE
            : tx.isSender
            ? TransactionType.SEND
            : TransactionType.RECEIVE,
        };
      });
    } catch (error: any) {
      sentryCaptureException(error, SentryExceptionTypes.INTERNAL_ERROR);
      return [];
    }
  }
}
