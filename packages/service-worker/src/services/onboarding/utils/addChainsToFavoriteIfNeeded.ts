import { BalanceAggregatorService } from '../../balances/BalanceAggregatorService';
import { NetworkService } from '../../network/NetworkService';
import { ChainId } from '@avalabs/core-chains-sdk';
import { Balances, PrimaryAccount, NetworkWithCaipId } from '@core/types';
import { isString } from 'lodash';
import { container } from 'tsyringe';
import { HistoryService } from '../../history/HistoryService';
import {
  TokenType,
  TokenWithBalanceAVM,
  TokenWithBalancePVM,
  TokenWithBalanceSVM,
} from '@avalabs/vm-module-types';

export const addChainsToFavoriteIfNeeded = async (
  accounts: PrimaryAccount[],
) => {
  const balanceService = container.resolve(BalanceAggregatorService);
  const networkService = container.resolve(NetworkService);
  const historyService = container.resolve(HistoryService);
  const balances = await balanceService.getBalancesForNetworks({
    chainIds: [
      ChainId.AVALANCHE_P,
      ChainId.AVALANCHE_X,
      ChainId.SOLANA_MAINNET_ID,
    ],
    accounts,
    tokenTypes: [TokenType.NATIVE],
  });

  if (hasBalance(balances.tokens, accounts, ChainId.AVALANCHE_P)) {
    await networkService.addFavoriteNetwork(ChainId.AVALANCHE_P);
  } else {
    const pChain = await networkService.getNetwork(ChainId.AVALANCHE_P);

    if (pChain) {
      const hasPActivity = await hasChainActivity(
        historyService,
        accounts.map(({ addressPVM }) => addressPVM).filter(isString),
        pChain,
      );

      if (hasPActivity) {
        await networkService.addFavoriteNetwork(ChainId.AVALANCHE_P);
      }
    }
  }

  if (hasBalance(balances.tokens, accounts, ChainId.AVALANCHE_X)) {
    await networkService.addFavoriteNetwork(ChainId.AVALANCHE_X);
  } else {
    const xChain = await networkService.getNetwork(ChainId.AVALANCHE_X);

    if (xChain) {
      const hasXActivity = await hasChainActivity(
        historyService,
        accounts.map(({ addressAVM }) => addressAVM).filter(isString),
        xChain,
      );

      if (hasXActivity) {
        await networkService.addFavoriteNetwork(ChainId.AVALANCHE_X);
      }
    }
  }

  if (hasBalance(balances.tokens, accounts, ChainId.SOLANA_MAINNET_ID)) {
    await networkService.addFavoriteNetwork(ChainId.SOLANA_MAINNET_ID);
  }
};

async function hasChainActivity(
  historyService: HistoryService,
  addresses: string[],
  network: NetworkWithCaipId,
) {
  try {
    const results = await Promise.allSettled(
      addresses.map((address) => historyService.getTxHistory(network, address)),
    );
    const histories = results.map((result) =>
      result.status === 'fulfilled' ? result.value : [],
    );

    return histories.some((history) => history.length > 0);
  } catch {
    return false;
  }
}

function hasBalance(
  balances: Balances,
  activeAccounts: PrimaryAccount[],
  chainId: ChainId,
) {
  return activeAccounts.some((account) => {
    const address =
      chainId === ChainId.AVALANCHE_P
        ? account.addressPVM
        : chainId === ChainId.AVALANCHE_X
          ? account.addressAVM
          : account.addressSVM;

    if (!address) {
      return false;
    }
    const balance = balances[chainId]?.[address];

    if (!balance) {
      return false;
    }

    const nativeBalance = (balance['AVAX'] ?? balance['SOL']) as
      | TokenWithBalanceAVM
      | TokenWithBalancePVM
      | TokenWithBalanceSVM;

    return nativeBalance && nativeBalance.balance > 0n;
  });
}
