import { singleton } from 'tsyringe';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId, TxHistoryItem } from '@core/types';
import { ModuleManager } from '../../vmModules/ModuleManager';
import { AccountsService } from '../accounts/AccountsService';
import { Transaction } from '@avalabs/vm-module-types';
import { UnifiedBridgeService } from '../unifiedBridge/UnifiedBridgeService';
import { resolve } from '@core/utils';
import { Monitoring } from '@core/common';
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
      Monitoring.sentryCaptureException(
        new Error(
          `Fetching history failed. Module not found for ${network.caipId}`,
        ),
        Monitoring.SentryExceptionTypes.VM_MODULES,
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
      case NetworkVMType.SVM:
        return this.accountsService.activeAccount?.addressSVM;
      default:
        return undefined;
    }
  }
}
