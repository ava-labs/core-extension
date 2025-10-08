import { TokenCardWithBalance } from '@/components/common/TokenCardWithBalance';
import { useSettingsContext } from '@core/ui';
import { TokenPriceChanges } from '@core/types';

interface TokenListItemProps {
  name: string;
  symbol: string;
  balanceDisplayValue?: string;
  children: any;
  balanceInCurrency?: string;
  onClick(): void;
  priceChanges?: TokenPriceChanges;
  isMalicious?: boolean;
}

export function TokenListItem({
  name,
  symbol,
  balanceDisplayValue,
  children,
  balanceInCurrency,
  onClick,
  priceChanges,
  isMalicious,
}: TokenListItemProps) {
  const { currencyFormatter } = useSettingsContext();
  return (
    <TokenCardWithBalance
      name={name}
      symbol={symbol}
      onClick={onClick}
      balanceDisplayValue={balanceDisplayValue}
      balanceInCurrency={balanceInCurrency}
      currencyFormatter={currencyFormatter}
      priceChanges={priceChanges}
      isMalicious={isMalicious}
    >
      {children}
    </TokenCardWithBalance>
  );
}
