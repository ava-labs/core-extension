import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { isXchainNetwork } from '../network/utils/isAvalancheXchainNetwork';
import { ModuleManager } from '@src/background/vmModules/ModuleManager';
import { NetworkWithCaipId } from '../network/models';

@singleton()
export class HistoryServiceAVM {
  constructor(
    private accountsService: AccountsService,
    private moduleManager: ModuleManager
  ) {}

  async getHistory(network: NetworkWithCaipId, otherAddress?: string) {
    const address =
      otherAddress ?? this.accountsService.activeAccount?.addressAVM;
    if (!network?.chainId || !isXchainNetwork(network) || !address) {
      return [];
    }
    const module = await this.moduleManager.loadModuleByNetwork(network);
    const { transactions } = await module.getTransactionHistory({
      address,
      network,
    });
    return transactions.map((transaction) => {
      return { ...transaction, vmType: 'AVM' };
    });
  }
}
