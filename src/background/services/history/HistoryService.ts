import { singleton } from 'tsyringe';
import { NetworkVMType } from '@avalabs/core-chains-sdk';

import { NetworkWithCaipId } from '../network/models';
import { GlacierService } from '../glacier/GlacierService';
import { isPchainNetwork } from '../network/utils/isAvalanchePchainNetwork';
import { isXchainNetwork } from '../network/utils/isAvalancheXchainNetwork';

import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { AccountsService } from '../accounts/AccountsService';
import { TxHistoryItem } from './models';
import { HistoryServiceBridgeHelper } from './HistoryServiceBridgeHelper';
import { Transaction } from '@avalabs/vm-module-types';
import { ETHEREUM_ADDRESS } from '@src/utils/bridgeTransactionUtils';
import { UnifiedBridgeService } from '../unifiedBridge/UnifiedBridgeService';

@singleton()
export class HistoryService {
  constructor(
    private glacierService: GlacierService,
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

    const module = await this.moduleManager.loadModuleByNetwork(network);
    const { transactions } = await module.getTransactionHistory({
      address,
      network,
      offset: 25,
    });

    const txHistoryItem = transactions.map((transaction) => {
      const isBridge = this.#getIsBirdge(network, transaction);
      const vmType = this.#getVmType(network);
      return { ...transaction, vmType, isBridge };
    }) as TxHistoryItem[];

    return txHistoryItem;
  }

  #getVmType(network: NetworkWithCaipId) {
    if (isPchainNetwork(network)) {
      return 'PVM';
    }
    if (isXchainNetwork(network)) {
      return 'AVM';
    }
    return undefined;
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
      this.#isBridgeAddress(transaction.to)
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

    return [
      ETHEREUM_ADDRESS,
      ...this.unifiedBridgeService.state.addresses,
    ].includes(address.toLowerCase());
  }
}
