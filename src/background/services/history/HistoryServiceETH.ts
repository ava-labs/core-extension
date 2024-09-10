import { isEthereumChainId } from '@src/background/services/network/utils/isEthereumNetwork';

import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';

import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { NetworkWithCaipId } from '../network/models';

@singleton()
export class HistoryServiceETH {
  constructor(
    private accountsService: AccountsService,
    private moduleManager: ModuleManager
  ) {}

  async getHistory(network: NetworkWithCaipId) {
    if (!network?.chainId || !isEthereumChainId(network.chainId)) {
      return [];
    }

    const account = this.accountsService.activeAccount?.addressC;

    if (!account) {
      return [];
    }

    const module = await this.moduleManager.loadModuleByNetwork(network);
    const { transactions } = await module.getTransactionHistory({
      address: account,
      network,
    });
    return transactions;
  }
}
