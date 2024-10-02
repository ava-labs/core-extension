import { singleton } from 'tsyringe';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId } from '../network/models';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { AccountsService } from '../accounts/AccountsService';
import { TxHistoryItem } from './models';
import { HistoryServiceBridgeHelper } from './HistoryServiceBridgeHelper';
import { Transaction } from '@avalabs/vm-module-types';
import { ETHEREUM_ADDRESS } from '@src/utils/bridgeTransactionUtils';
import { UnifiedBridgeService } from '../unifiedBridge/UnifiedBridgeService';
import { resolve } from '@src/utils/promiseResolver';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

@singleton()
export class HistoryService {
  constructor(
    private moduleManager: ModuleManager,
    private accountsService: AccountsService,
    private bridgeHistoryHelperService: HistoryServiceBridgeHelper,
    private unifiedBridgeService: UnifiedBridgeService
  ) {}

  async getTxHistory(
    network: NetworkWithCaipId,
    otherAddress?: string
  ): Promise<TxHistoryItem[]> {
    const address = otherAddress ?? this.#getAddress(network);

    if (!address) {
      return [];
    }

    const [module] = await resolve(
      this.moduleManager.loadModuleByNetwork(network)
    );

    if (!module) {
      sentryCaptureException(
        new Error(
          `Fetching history failed. Module not found for ${network.caipId}`
        ),
        SentryExceptionTypes.VM_MODULES
      );
      return [];
    }
    const { transactions } = await module.getTransactionHistory({
      address,
      network,
      offset: 25,
    });

    const txHistoryItem = transactions.map((transaction) => {
      const isBridge = this.#getIsBirdge(network, transaction);
      const vmType = network.vmName;
      return { ...transaction, vmType, isBridge };
    }) as TxHistoryItem[];

    return txHistoryItem;
  }

  #getIsBirdge(network: NetworkWithCaipId, transaction: Transaction) {
    if (network.vmName === NetworkVMType.BITCOIN) {
      return this.bridgeHistoryHelperService.isBridgeTransactionBTC([
        transaction.from,
        transaction.to,
      ]);
    }
    return (
      this.#isBridgeAddress(transaction.from) ||
      this.#isBridgeAddress(transaction.to) ||
      this.unifiedBridgeService.isBridgeTx(transaction)
    );
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

  #isBridgeAddress(address?: string) {
    if (!address) {
      return false;
    }

    return ETHEREUM_ADDRESS === address.toLowerCase();
  }
}
