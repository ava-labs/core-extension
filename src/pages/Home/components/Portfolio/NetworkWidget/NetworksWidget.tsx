import { Stack } from '@avalabs/core-k2-components';

import {
  TokenWithBalance,
  getBalanceInCurrency,
  getUnconfirmedBalanceInCurrency,
} from '@src/background/services/balances/models';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

import { ActiveNetworkWidget } from './ActiveNetworkWidget';
import { NetworkList } from './NetworkList';

export const tokensWithBalances = (tokenList?: TokenWithBalance[]) => {
  if (!tokenList) {
    return;
  }

  return tokenList.filter((token) =>
    typeof token.balance === 'bigint'
      ? token.balance > 0
      : !token.balance.isZero()
  );
};

export const getNetworkBalance = (assetList: TokenWithBalance[]) => {
  const sum = assetList.reduce((prevAssetUSD, currentAsset) => {
    return (
      prevAssetUSD +
      (getUnconfirmedBalanceInCurrency(currentAsset) ?? 0) +
      (getBalanceInCurrency(currentAsset) ?? 0)
    );
  }, 0);
  return sum;
};

export const getNetworkTokensPriceChanges = (assetList: TokenWithBalance[]) => {
  const changes = assetList.reduce(
    (changesSum: { value: number; percentage: number[] }, currentAsset) => {
      if (!currentAsset.priceChanges) {
        return changesSum;
      }
      const { percentage, value } = currentAsset.priceChanges;
      if (!percentage) {
        return changesSum;
      }

      return {
        value: changesSum.value + (value || 0),
        percentage: [...changesSum.percentage, percentage],
      };
    },
    {
      percentage: [],
      value: 0,
    }
  );
  return changes;
};

export function NetworksWidget() {
  const activeNetworkAssetList = useTokensWithBalances();

  const activeNetworkBalance = getNetworkBalance(activeNetworkAssetList);
  const activeNetworkPriceChanges = getNetworkTokensPriceChanges(
    activeNetworkAssetList
  );

  return (
    <Stack sx={{ m: 2 }}>
      <ActiveNetworkWidget
        assetList={activeNetworkAssetList}
        activeNetworkBalance={activeNetworkBalance}
        activeNetworkPriceChanges={activeNetworkPriceChanges}
      />
      <NetworkList />
    </Stack>
  );
}
