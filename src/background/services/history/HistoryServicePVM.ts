import { singleton } from 'tsyringe';

import { isPchainNetwork } from '../network/utils/isAvalanchePchainNetwork';
import { AccountsService } from '../accounts/AccountsService';

import ModuleManager from '@src/background/vmModules/ModuleManager';
import { NetworkWithCaipId } from '../network/models';

@singleton()
export class HistoryServicePVM {
  constructor(private accountsService: AccountsService) {}

  async getHistory(network: NetworkWithCaipId, otherAddress?: string) {
    if (!network?.chainId || !isPchainNetwork(network)) {
      return [];
    }

    const address =
      otherAddress ?? this.accountsService.activeAccount?.addressPVM;

    if (!address) {
      return [];
    }

    const module = await ModuleManager.loadModuleByNetwork(network);
    const { transactions } = await module.getTransactionHistory({
      address,
      network,
    });
    return transactions.map((transaction) => {
      return { ...transaction, vmType: 'PVM' };
    });
  }
}
