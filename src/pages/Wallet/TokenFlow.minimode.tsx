import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  SubTextTypography,
  LoadingIcon,
  SecondaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import {
  ERC20WithBalance,
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { PageTitleMiniMode } from '@src/components/common/PageTitle';
import { TokenIcon } from '@src/components/common/TokenImage';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Activity } from '../Activity/Activity';

export function TokenFlowMiniMode() {
  const history = useHistory();
  const { currencyFormatter } = useSettingsContext();
  const token = useTokenFromParams();
  const tokensWithBalances = useTokensWithBalances();
  const [showSend, setShowSend] = useState<boolean>();
  const setSendDataInParams = useSetSendDataInParams();

  useEffect(() => {
    setShowSend(!!tokensWithBalances.length);
  }, [tokensWithBalances]);

  if (showSend === undefined) {
    return <LoadingIcon />;
  }

  const balanceCurrencyValue = token.balanceUsdDisplayValue ?? token.balanceUSD;

  return (
    <VerticalFlex width={'100%'} position="relative">
      <PageTitleMiniMode>Token Details</PageTitleMiniMode>
      <HorizontalFlex width={'100%'} padding="8px 16px" justify={'center'}>
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
        <VerticalFlex flex={1} margin={'0 0 0 16px'}>
          <Typography size={18} weight={'bold'} height="22px">
            {token.name}
          </Typography>
          <SubTextTypography size={14} height="17px" margin={'4px 0 0'}>
            {token.balanceDisplayValue} {token.symbol}
          </SubTextTypography>
        </VerticalFlex>
        <Typography size={14} height="24px">
          {balanceCurrencyValue &&
            currencyFormatter(Number(balanceCurrencyValue))}
        </Typography>
      </HorizontalFlex>
      <HorizontalFlex justify="center" margin="24px 16px">
        <SecondaryButton
          size={ComponentSize.LARGE}
          onClick={() => history.push('/receive')}
        >
          Receive
        </SecondaryButton>
        <SecondaryButton
          size={ComponentSize.LARGE}
          margin="0 0 0 16px"
          onClick={() =>
            setSendDataInParams({ token, options: { path: '/send' } })
          }
        >
          Send
        </SecondaryButton>
      </HorizontalFlex>
      <VerticalFlex grow="1" padding="0 16px">
        <Activity tokenSymbolFilter={token.symbol} isEmbedded />
      </VerticalFlex>
    </VerticalFlex>
  );
}
