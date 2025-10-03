import { container } from 'tsyringe';
import { ModuleManager } from '~/vmModules/ModuleManager';
import { AccountsService } from '../AccountsService';
import { NetworkService } from '~/services/network/NetworkService';
import { AccountType } from '@core/types';

interface CheckAccountsHistoryParams {
  walletId: string;
  addFirstAccount?: boolean;
}

export const addAllAccountsWithHistory = async ({
  walletId,
  addFirstAccount,
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

      if (!history || !history.transactions.length) {
        accountsWithoutActivity++;
        continue;
      }
      lastIndexToAdd = lastIndexChecked;
      accountsWithoutActivity = 0;
    } catch (e) {
      console.error(e);
    }
  }

  const accountIds: string[] = [];
  if (lastIndexToAdd === 0 && addFirstAccount) {
    accountIds.push(await accountsService.addPrimaryAccount({ walletId }));
  }

  for (let i = 0; i < lastIndexToAdd; i++) {
    accountIds.push(await accountsService.addPrimaryAccount({ walletId }));
  }
  return accountIds;
};
