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
}

export function TokenListItem({
  name,
  symbol,
  balanceDisplayValue,
  children,
  balanceInCurrency,
  onClick,
  priceChanges,
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
    >
      {children}
    </TokenCardWithBalance>
  );
}
