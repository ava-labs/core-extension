import { container } from 'tsyringe';
import { ModuleManager } from '~/vmModules/ModuleManager';
import { AccountsService } from '../AccountsService';
import { NetworkService } from '~/services/network/NetworkService';
import { AccountType } from '@core/types';

interface CheckAccountsHistoryParams {
  walletId: string;
  // address: string;
}

export const addAllAccountsWithHistory = async ({
  walletId,
}: CheckAccountsHistoryParams) => {
  const moduleManager = container.resolve(ModuleManager);
  const accountsService = container.resolve(AccountsService);

  const networkService = container.resolve(NetworkService);
  const avalancheNetwork = await networkService.getAvalancheNetwork();

  let lastIndexChecked = 0;
  let accountsWithoutActivity = 0;
  let lastIndexToAdd = 0;

  while (accountsWithoutActivity < 2) {
    lastIndexChecked++;
    const nextAccount = {
      id: `${lastIndexChecked}`,
      index: lastIndexChecked,
      name: `Dummy Account`,
      type: AccountType.PRIMARY as const,
      walletId: walletId,
    };
    const nextAccountAddresses =
      await accountsService.getAddressesForAccount(nextAccount);

    const history = await (
      await moduleManager.loadModule(avalancheNetwork.caipId)
    ).getTransactionHistory({
      address: nextAccountAddresses.addressC,
      network: { ...avalancheNetwork, tokens: [] },
    });

    if (!history.transactions.length) {
      accountsWithoutActivity++;
      continue;
    }
    lastIndexToAdd = lastIndexChecked;
    accountsWithoutActivity = 0;
  }

  for (let i = 0; i < lastIndexToAdd; i++) {
    await accountsService.addPrimaryAccount({ walletId });
  }
  return true;
};
