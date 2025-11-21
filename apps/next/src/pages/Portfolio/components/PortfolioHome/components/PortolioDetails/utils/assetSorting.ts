import { orderBy } from 'lodash';
import { FungibleTokenBalance } from '@core/types';
import { isAvaxToken } from '@/hooks/useTokensForAccount';

export type AssetSortOption =
  | 'default'
  | 'balance'
  | 'name-asc'
  | 'name-desc'
  | 'balance-quantity'
  | 'token-price';

export const sortAssets = (
  assets: FungibleTokenBalance[],
  sortOption: AssetSortOption | null,
): FungibleTokenBalance[] => {
  if (!sortOption || sortOption === 'default') {
    return orderBy(
      assets,
      [(asset) => isAvaxToken(asset), (asset) => asset.balanceInCurrency ?? 0],
      ['desc', 'desc'],
    );
  }

  switch (sortOption) {
    case 'balance':
      return orderBy(
        assets,
        [(asset) => asset.balanceInCurrency ?? 0],
        ['desc'],
      );
    case 'name-asc':
      return orderBy(assets, ['name'], ['asc']);
    case 'name-desc':
      return orderBy(assets, ['name'], ['desc']);
    case 'balance-quantity':
      return orderBy(
        assets,
        [(asset) => parseFloat(asset.balanceDisplayValue) || 0],
        ['desc'],
      );
    case 'token-price':
      return orderBy(
        assets,
        [
          (asset) =>
            (asset.priceChanges as { currentPrice?: number } | undefined)
              ?.currentPrice ?? 0,
        ],
        ['desc'],
      );
    default:
      return assets;
  }
};
