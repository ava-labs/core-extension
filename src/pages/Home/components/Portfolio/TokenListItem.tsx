import { TokenCardWithBalance } from '@src/components/common/TokenCardWithBalance';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

interface TokenListItemProps {
  name: string;
  symbol: string;
  balanceDisplayValue?: string;
  children: any;
  balanceInCurrency?: string;
  onClick(): void;
  priceChanges?: {
    percentage?: number | undefined;
    value?: number | undefined;
  };
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
