import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  HorizontalFlex,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { FavStarIcon } from '@src/components/icons/FavStarIcon';

interface TokenListItemProps {
  name: string;
  symbol: string;
  balanceDisplayValue?: string;
  children: any;
  balanceUSD?: string;
}

export function TokenListItem({
  name,
  symbol,
  balanceDisplayValue,
  children,
  balanceUSD,
}: TokenListItemProps) {
  const { currencyFormatter } = useSettingsContext();
  return (
    <>
      <HorizontalFlex width="100%" align={'center'}>
        {children}
        <Typography margin={'0 8px'}>{name}</Typography>
        <Typography>({symbol})</Typography>
      </HorizontalFlex>
      <VerticalFlex width="100%">
        <Typography>{balanceDisplayValue}</Typography>
        {balanceUSD ? (
          <SubTextTypography>
            {currencyFormatter(Number(balanceUSD))}
          </SubTextTypography>
        ) : (
          ''
        )}
      </VerticalFlex>
      <HorizontalFlex padding={'0 0 0 20px'}>
        <FavStarIcon />
      </HorizontalFlex>
      <HorizontalFlex></HorizontalFlex>
    </>
  );
}
