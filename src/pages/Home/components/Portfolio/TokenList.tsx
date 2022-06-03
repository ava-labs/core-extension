import { useMemo } from 'react';
import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { TokenListItem } from './TokenListItem';
import Scrollbars from 'react-custom-scrollbars-2';
import { WalletIsEmpty } from './WalletIsEmpty';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import styled, { useTheme } from 'styled-components';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getNetworkBalance } from './NetworkWidget/NetworksWidget';

const LogoContainer = styled.div`
  margin: 0 16px;
`;

interface TokenListProps {
  searchQuery?: string;
}

export function TokenList({ searchQuery }: TokenListProps) {
  const { getTokenVisibility, currencyFormatter } = useSettingsContext();
  const tokensWithBalances = useTokensWithBalances();
  const history = useHistory();
  const setSendDataInParams = useSetSendDataInParams();
  const { capture } = useAnalyticsContext();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();
  const theme = useTheme();
  const { network } = useNetworkContext();
  const activeNetworkAssetList = useTokensWithBalances();

  const activeNetworkBalance = getNetworkBalance(activeNetworkAssetList);

  const tokens = useMemo(
    () =>
      (searchQuery
        ? tokensWithBalances.filter(
            (token) =>
              getTokenVisibility(token) &&
              (token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : tokensWithBalances
      ).filter((token) => getTokenVisibility(token)),
    [searchQuery, tokensWithBalances, getTokenVisibility]
  );

  const toggleManageTokensPage = () => {
    if (history.location.pathname.startsWith('/manage-tokens')) {
      history.push('/');
      return;
    }
    history.push('/manage-tokens');
  };

  return (
    <VerticalFlex grow="1" margin="8px 0 0">
      <HorizontalFlex
        width="100%"
        marginTop="16px"
        padding="12px 16px"
        align="center"
        justify="flex-start"
      >
        <HorizontalFlex align="center">
          <TextButton onClick={() => history.push('/home')} margin="0 12px 0 0">
            <CaretIcon
              height="18px"
              direction={IconDirection.LEFT}
              color={theme.colors.icon1}
            />
          </TextButton>
          <LogoContainer>
            <TokenIcon
              width="40px"
              height="40px"
              src={network?.logoUri}
              name={network?.chainName}
            />
          </LogoContainer>
          <VerticalFlex>
            <Typography size={20} weight={600} height="29px">
              {network?.chainName}
            </Typography>
            <Typography size={20} weight={600} height="29px">
              {currencyFormatter(activeNetworkBalance)}
            </Typography>
          </VerticalFlex>
        </HorizontalFlex>
      </HorizontalFlex>
      <HorizontalFlex
        align="center"
        justify="flex-end"
        margin="0 16px 8px 16px"
      >
        {checkIsFunctionAvailable('ManageTokens') && tokens.length && (
          <TextButton onClick={toggleManageTokensPage}>
            <Typography color="inherit" size={12} weight={500}>
              Manage
            </Typography>
          </TextButton>
        )}
      </HorizontalFlex>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <VerticalFlex padding="0px 16px 68px">
          {tokens?.map((token) => {
            return (
              <TokenListItem
                onClick={() => {
                  setSendDataInParams({
                    token: token,
                    options: { path: '/token' },
                  });
                  capture('TokenListTokenSelected', {
                    selectedToken: token.isERC20 ? token.address : token.symbol,
                  });
                }}
                key={token.isERC20 ? token.address : token.symbol}
                name={token.name}
                symbol={token.symbol}
                balanceDisplayValue={token.balanceDisplayValue}
                balanceUSD={token.balanceUSD?.toString()}
              >
                <TokenIcon
                  width="32px"
                  height="32px"
                  src={token.logoUri}
                  name={token.name}
                />
              </TokenListItem>
            );
          })}

          {tokens.length === 0 && <WalletIsEmpty />}
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
