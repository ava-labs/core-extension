import { BalanceAggregatorService } from '../../balances/BalanceAggregatorService';
import { NetworkService } from '../../network/NetworkService';
import { ChainId } from '@avalabs/core-chains-sdk';
import {
  Balances,
  TokenWithBalanceAVM,
  TokenWithBalancePVM,
} from '../../balances/models';
import { PrimaryAccount } from '../../accounts/models';
import BN from 'bn.js';
import { Network } from '../../network/models';
import { isString } from 'lodash';
import { container } from 'tsyringe';
import { HistoryServicePVM } from '../../history/HistoryServicePVM';
import { HistoryServiceAVM } from '../../history/HistoryServiceAVM';

export const addXPChainToFavoriteIfNeeded = async (
  accounts: PrimaryAccount[]
) => {
  const balanceService = container.resolve(BalanceAggregatorService);
  const networkService = container.resolve(NetworkService);
  const historyServiceP = container.resolve(HistoryServicePVM);
  const historyServiceX = container.resolve(HistoryServiceAVM);
  const balances = await balanceService.getBalancesForNetworks(
    [ChainId.AVALANCHE_P, ChainId.AVALANCHE_X],
    accounts
  );

  if (hasBalance(balances, accounts, ChainId.AVALANCHE_P)) {
    await networkService.addFavoriteNetwork(ChainId.AVALANCHE_P);
  } else {
    const pChain = await networkService.getNetwork(ChainId.AVALANCHE_P);

    if (pChain) {
      const hasPActivity = await hasChainActivity(
        historyServiceP,
        accounts.map(({ addressPVM }) => addressPVM).filter(isString),
        pChain
      );

      if (hasPActivity) {
        await networkService.addFavoriteNetwork(ChainId.AVALANCHE_P);
      }
    }
  }

  if (hasBalance(balances, accounts, ChainId.AVALANCHE_X)) {
    await networkService.addFavoriteNetwork(ChainId.AVALANCHE_X);
  } else {
    const xChain = await networkService.getNetwork(ChainId.AVALANCHE_X);

    if (xChain) {
      const hasXActivity = await hasChainActivity(
        historyServiceX,
        accounts.map(({ addressAVM }) => addressAVM).filter(isString),
        xChain
      );

      if (hasXActivity) {
        await networkService.addFavoriteNetwork(ChainId.AVALANCHE_X);
      }
    }
  }
};

async function hasChainActivity(
  historyService: HistoryServiceAVM | HistoryServicePVM,
  addresses: string[],
  network: Network
) {
  try {
    const results = await Promise.allSettled(
      addresses.map((address) => historyService.getHistory(network, address))
    );
    const histories = results.map((result) =>
      result.status === 'fulfilled' ? result.value : []
    );

    return histories.some((history) => history.length > 0);
  } catch {
    return false;
  }
}

function hasBalance(
  balances: Balances,
  activeAccounts: PrimaryAccount[],
  chainId: ChainId
) {
  return activeAccounts.some((account) => {
    const address =
      chainId === ChainId.AVALANCHE_P ? account.addressPVM : account.addressAVM;

    if (!address) {
      return false;
    }
    const balance = balances[chainId]?.[address];

    if (!balance) {
      return false;
    }

    const avaxBalance = balance['AVAX'] as
      | TokenWithBalanceAVM
      | TokenWithBalancePVM;

    return avaxBalance && avaxBalance.balance.gt(new BN(0));
  });
}
