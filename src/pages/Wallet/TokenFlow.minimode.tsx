import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  CloseIcon,
  SubTextTypography,
  LoadingIcon,
  TextButton,
  SecondaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import {
  ERC20WithBalance,
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useSetTokenInParams } from '@src/hooks/useSetTokenInParams';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useTheme } from 'styled-components';
import { ActivityMiniMode } from '../Activity/Activity.minimode';

export function TokenFlowMiniMode() {
  const history = useHistory();
  const { currency, currencyFormatter } = useSettingsContext();
  const theme = useTheme();
  const token = useTokenFromParams();
  const tokensWithBalances = useTokensWithBalances();
  const [showSend, setShowSend] = useState<boolean>();
  const setTokenInParams = useSetTokenInParams();

  useEffect(() => {
    setShowSend(!!tokensWithBalances.length);
  }, [tokensWithBalances]);

  if (showSend === undefined) {
    return <LoadingIcon />;
  }

  const balanceCurrencyValue = token.balanceUsdDisplayValue ?? token.balanceUSD;

  return (
    <VerticalFlex width={'100%'} padding="16px" position="relative">
      <HorizontalFlex width={'100%'} justify={'center'}>
        <VerticalFlex justify={'center'}>
          {isAvaxToken(token) ? (
            <AvaxTokenIcon height={'40px'} />
          ) : (
            <TokenIcon
              height={'40px'}
              width={'40px'}
              src={(token as ERC20WithBalance).logoURI}
              name={(token as TokenWithBalance).name}
            />
          )}
        </VerticalFlex>
        <VerticalFlex flex={1} margin={'0 0 0 16px'}>
          <Typography size={16} weight={600} height="24px">
            {token.name}
          </Typography>
          <Typography size={24} margin={'4px 0 8px'} weight={700} height="29px">
            {token.balanceDisplayValue} {token.symbol}
          </Typography>
          <SubTextTypography>
            {balanceCurrencyValue &&
              `${currencyFormatter(Number(balanceCurrencyValue))} ${currency}`}
          </SubTextTypography>
        </VerticalFlex>
        <VerticalFlex>
          <TextButton onClick={() => history.goBack()}>
            <CloseIcon color={theme.colors.icon1} />
          </TextButton>
        </VerticalFlex>
      </HorizontalFlex>
      <HorizontalFlex justify="center" margin="24px 0">
        <SecondaryButton
          size={ComponentSize.MEDIUM}
          onClick={() => history.push('/receive')}
        >
          Receive
        </SecondaryButton>
        <SecondaryButton
          size={ComponentSize.MEDIUM}
          margin="0 0 0 16px"
          onClick={() => setTokenInParams(token, { path: '/send' })}
        >
          Send
        </SecondaryButton>
      </HorizontalFlex>
      <VerticalFlex grow="1">
        <ActivityMiniMode tokenSymbolFilter={token.symbol} isEmbedded />
      </VerticalFlex>
    </VerticalFlex>
  );
}
