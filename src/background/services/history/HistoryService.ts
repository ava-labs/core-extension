import { singleton } from 'tsyringe';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId } from '../network/models';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { AccountsService } from '../accounts/AccountsService';
import { TxHistoryItem } from './models';
import { Transaction } from '@avalabs/vm-module-types';
import { UnifiedBridgeService } from '../unifiedBridge/UnifiedBridgeService';
import { resolve } from '@src/utils/promiseResolver';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { AnalyzeTxParams } from '@avalabs/bridge-unified';

@singleton()
export class HistoryService {
  constructor(
    private moduleManager: ModuleManager,
    private accountsService: AccountsService,
    private unifiedBridgeService: UnifiedBridgeService,
  ) {}

  async getTxHistory(
    network: NetworkWithCaipId,
    otherAddress?: string,
  ): Promise<TxHistoryItem[]> {
    const address = otherAddress ?? this.#getAddress(network);

    if (!address) {
      return [];
    }

    const [module] = await resolve(
      this.moduleManager.loadModuleByNetwork(network),
    );

    if (!module) {
      sentryCaptureException(
        new Error(
          `Fetching history failed. Module not found for ${network.caipId}`,
        ),
        SentryExceptionTypes.VM_MODULES,
      );
      return [];
    }
    const { transactions } = await module.getTransactionHistory({
      address,
      network,
      offset: 25,
    });

    const txHistoryItem = transactions.map((transaction) => {
      const result = this.#analyze(network, transaction);
      const vmType = network.vmName;
      return {
        ...transaction,
        vmType,
        bridgeAnalysis: result,
      };
    }) as TxHistoryItem[];

    return txHistoryItem;
  }

  #analyze(network: NetworkWithCaipId, transaction: Transaction) {
    const params: AnalyzeTxParams = {
      from: transaction.from as `0x${string}`,
      to: transaction.to as `0x${string}`,
      chainId: network.caipId,
      tokenTransfers: transaction.tokens.map((transfer) => ({
        symbol: transfer.symbol,
        from: (transfer.from?.address ?? transaction.from) as `0x${string}`,
        to: (transfer.to?.address ?? transaction.to) as `0x${string}`,
      })),
    };

    return this.unifiedBridgeService.analyzeTx(params);
  }

  #getAddress(network: NetworkWithCaipId) {
    switch (network.vmName) {
      case NetworkVMType.EVM:
        return this.accountsService.activeAccount?.addressC;
      case NetworkVMType.BITCOIN:
        return this.accountsService.activeAccount?.addressBTC;
      case NetworkVMType.AVM:
        return this.accountsService.activeAccount?.addressAVM;
      case NetworkVMType.PVM:
        return this.accountsService.activeAccount?.addressPVM;
      case NetworkVMType.CoreEth:
        return this.accountsService.activeAccount?.addressCoreEth;
      default:
        return undefined;
    }
  }
}
