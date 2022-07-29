import {
  HorizontalFlex,
  Card,
  SubTextTypography,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

export function TokenCard({
  token,
  margin,
  displayValue,
  amount,
}: {
  token: TokenWithBalance;
  margin?: string;
  displayValue?: string;
  amount?: string;
}) {
  const { currencyFormatter, currency } = useSettingsContext();

  return (
    <Card padding="8px 16px" margin={margin}>
      <HorizontalFlex align={'center'} justify={'space-between'} width={'100%'}>
        <HorizontalFlex align={'center'} height="100%">
          <TokenIcon
            height="32px"
            width="32px"
            src={(token as TokenWithBalance).logoUri}
            name={(token as TokenWithBalance).name}
          />
          <Typography margin="0 0 0 16px" size={16} height="24px" weight={500}>
            {token.symbol}
          </Typography>
        </HorizontalFlex>
        <VerticalFlex height="100%" minHeight="41px" align="flex-end">
          <Typography size={14} height="24px" margin="0 0 2px 0">
            {displayValue}
          </Typography>
          <SubTextTypography size={12} height="15px">
            {isNaN(Number(amount))
              ? ''
              : `${currencyFormatter(Number(amount)).replace(
                  currency,
                  ''
                )} ${currency}`}
          </SubTextTypography>
        </VerticalFlex>
      </HorizontalFlex>
    </Card>
  );
}
