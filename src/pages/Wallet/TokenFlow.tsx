import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  SubTextTypography,
  LoadingIcon,
  SecondaryButton,
  ComponentSize,
  BridgeIcon,
  QRCodeIcon,
  ArrowIcon,
  HorizontalSeparator,
  IconDirection,
} from '@avalabs/react-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Activity } from '../Activity/Activity';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import { ChainId } from '@avalabs/chains-sdk';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

const StyledBridgeIcon = styled(BridgeIcon)`
  height: 22px;
  margin: 0 8px 0 0;
`;

const StyledQRCodeIcon = styled(QRCodeIcon)`
  height: 20px;
  margin: 0 8px 0 0;
`;

const StyledArrowIcon = styled(ArrowIcon)`
  height: 15px;
  margin: 0 8px 0 0;
`;

export function TokenFlow() {
  const { t } = useTranslation();
  const history = useHistory();
  const { currencyFormatter } = useSettingsContext();
  const token = useTokenFromParams();
  const tokensWithBalances = useTokensWithBalances();
  const [showSend, setShowSend] = useState<boolean>();
  const setSendDataInParams = useSetSendDataInParams();
  const { network } = useNetworkContext();
  const theme = useTheme();

  const isBitcoin = network?.chainId === ChainId.BITCOIN;

  useEffect(() => {
    setShowSend(!!tokensWithBalances.length);
  }, [tokensWithBalances]);

  if (!token || showSend === undefined) {
    return <LoadingIcon />;
  }

  const balanceCurrencyValue = token.balanceUsdDisplayValue ?? token.balanceUSD;

  return (
    <VerticalFlex width={'100%'} position="relative">
      <PageTitle>{t('Token Details')}</PageTitle>
      <HorizontalFlex width={'100%'} padding="8px 16px" justify={'center'}>
        <TokenIcon
          height={'40px'}
          width={'40px'}
          src={token.logoUri}
          name={token.name}
        />
        <VerticalFlex flex={1} margin={'0 0 0 16px'}>
          <Typography
            data-testid="token-details-name"
            size={18}
            weight={'bold'}
            height="22px"
          >
            {token.name}
          </Typography>
          <SubTextTypography
            data-testid="token-details-balance"
            size={14}
            height="17px"
            margin={'4px 0 0'}
          >
            {token.balanceDisplayValue} {token.symbol}
          </SubTextTypography>
        </VerticalFlex>
        <Typography
          data-testid="token-details-currency-balance"
          size={14}
          height="24px"
        >
          {balanceCurrencyValue &&
            currencyFormatter(Number(balanceCurrencyValue))}
        </Typography>
      </HorizontalFlex>
      <HorizontalFlex justify="center" margin="24px 16px">
        <SecondaryButton
          data-testid="token-details-send-button"
          size={ComponentSize.LARGE}
          onClick={() =>
            setSendDataInParams({ token, options: { path: '/send' } })
          }
          padding="0 8px"
        >
          <StyledArrowIcon
            color={theme.colors.icon1}
            direction={IconDirection.NORTHEAST}
          />
          {t('Send')}
        </SecondaryButton>
        <SecondaryButton
          data-testid="token-details-receive-button"
          size={ComponentSize.LARGE}
          onClick={() => history.push('/receive')}
          margin={isBitcoin ? '0 8px' : '0 0 0 16px'}
          padding="0 16px"
        >
          <StyledQRCodeIcon color={theme.colors.icon1} />
          {t('Receive')}
        </SecondaryButton>
        {isBitcoin && (
          <SecondaryButton
            data-testid="token-details-bridge-button"
            size={ComponentSize.LARGE}
            onClick={(e) => {
              e.stopPropagation();
              history.push('/bridge');
            }}
            padding="0 8px"
          >
            <StyledBridgeIcon color={theme.colors.icon1} />
            {t('Bridge')}
          </SecondaryButton>
        )}
      </HorizontalFlex>
      <HorizontalSeparator margin="0 0 8px 0" />
      <VerticalFlex grow="1" padding="0 16px">
        <Activity tokenSymbolFilter={token.symbol} isEmbedded />
      </VerticalFlex>
    </VerticalFlex>
  );
}
