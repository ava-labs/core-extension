import {
  HorizontalFlex,
  SecondaryCard,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { useTheme } from 'styled-components';

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
  const theme = useTheme();

  return (
    <SecondaryCard padding="16px" margin={margin}>
      <HorizontalFlex align={'center'} justify={'space-between'} width={'100%'}>
        <HorizontalFlex align={'center'} height="100%">
          {isAvaxToken(token) ? (
            <AvaxTokenIcon height="40px" />
          ) : (
            <TokenIcon
              height="40px"
              width="40px"
              src={(token as TokenWithBalance).logoURI}
              name={(token as TokenWithBalance).name}
            />
          )}
          <VerticalFlex height="100%" padding="0 16px" justify="space-between">
            <Typography weight={600} margin="0 0 4px 0">
              {displayValue}
            </Typography>
            <Typography size={14}>{token.symbol}</Typography>
          </VerticalFlex>
        </HorizontalFlex>
        <VerticalFlex height="100%">
          <Typography weight={600}>
            {currencyFormatter(Number(amount))}
            <Typography
              margin="0 0 0 4px"
              weight={600}
              color={theme.colors.text2}
            >
              {currency}
            </Typography>
          </Typography>
        </VerticalFlex>
      </HorizontalFlex>
    </SecondaryCard>
  );
}
