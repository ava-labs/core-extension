import { useMemo } from 'react';
import {
  HorizontalFlex,
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

interface TokenListProps {
  searchQuery?: string;
}

export function TokenList({ searchQuery }: TokenListProps) {
  const { getTokenVisibility } = useSettingsContext();
  const tokensWithBalances = useTokensWithBalances();
  const history = useHistory();
  const setSendDataInParams = useSetSendDataInParams();
  const { capture } = useAnalyticsContext();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();

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
        align="center"
        justify="space-between"
        margin="0 16px 8px 16px"
      >
        <Typography size={14} weight={500} height="24px">
          Tokens
        </Typography>

        {checkIsFunctionAvailable('ManageTokens') && (
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
