import { container } from 'tsyringe';
import { ModuleManager } from '~/vmModules/ModuleManager';
import { AccountsService } from '../AccountsService';
import { NetworkService } from '~/services/network/NetworkService';
import { AccountType } from '@core/types';

interface CheckAccountsHistoryParams {
  walletId: string;
}

export const addAllAccountsWithHistory = async ({
  walletId,
}: CheckAccountsHistoryParams) => {
  const moduleManager = container.resolve(ModuleManager);
  const accountsService = container.resolve(AccountsService);

  const networkService = container.resolve(NetworkService);

  const avalancheNetwork = await networkService.getAvalancheNetwork();

  const module = await moduleManager.loadModule(avalancheNetwork.caipId);

  let lastIndexChecked = 0;
  let accountsWithoutActivity = 0;
  let lastIndexToAdd = 0;

  while (accountsWithoutActivity < 2) {
    const nextAccount = {
      id: `${lastIndexChecked}`,
      index: lastIndexChecked,
      name: `Dummy Account`,
      type: AccountType.PRIMARY as const,
      walletId: walletId,
    };
    lastIndexChecked++;

    try {
      const nextAccountAddresses =
        await accountsService.getAddressesForAccount(nextAccount);

      const history = await module.getTransactionHistory({
        address: nextAccountAddresses.addressC,
        network: { ...avalancheNetwork, tokens: [] },
      });

      if (!history.transactions.length) {
        accountsWithoutActivity++;
        continue;
      }
      lastIndexToAdd = lastIndexChecked;
      accountsWithoutActivity = 0;
    } catch (e) {
      console.error(e);
    }
  }

  const addedAccounts = await accountsService.getAccounts();
  console.log('addedAccounts: ', addedAccounts);
  if (lastIndexToAdd === 0 && !addedAccounts.active) {
    await accountsService.addPrimaryAccount({ walletId });
  }

  for (let i = 0; i < lastIndexToAdd; i++) {
    await accountsService.addPrimaryAccount({ walletId });
  }
};
