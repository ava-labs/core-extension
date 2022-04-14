import { useMemo } from 'react';
import {
  HorizontalFlex,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import {
  ERC20WithBalance,
  isAntToken,
  isAvaxToken,
  isERC20Token,
} from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { TokenListItem } from './TokenListItem';
import Scrollbars from 'react-custom-scrollbars-2';
import { WalletIsEmpty } from './WalletIsEmpty';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useHistory } from 'react-router-dom';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

interface TokenListProps {
  searchQuery?: string;
}

export function TokenList({ searchQuery }: TokenListProps) {
  const { getTokenVisibility } = useSettingsContext();
  const tokensWithBalances = useTokensWithBalances();
  const history = useHistory();
  const { avaxToken } = useWalletContext();
  const setSendDataInParams = useSetSendDataInParams();
  const { capture } = useAnalyticsContext();

  const { tokens, showAvax } = useMemo(() => {
    const tokens = (
      searchQuery
        ? tokensWithBalances.filter(
            (token) =>
              getTokenVisibility(token) &&
              (token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : tokensWithBalances
    ).filter((token) => getTokenVisibility(token));

    const showAvax =
      searchQuery &&
      (avaxToken.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        avaxToken.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

    return { tokens, showAvax };
  }, [searchQuery, tokensWithBalances, avaxToken, getTokenVisibility]);

  const toggleManageTokensPage = () => {
    if (history.location.pathname.startsWith('/manage-tokens')) {
      history.push('/');
      return;
    }
    history.push('/manage-tokens');
  };

  const ERC20Tokens = tokens?.filter(
    (token) => !isAvaxToken(token) && !isAntToken(token)
  );

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
        <TextButton onClick={toggleManageTokensPage}>
          <Typography color="inherit" size={12} weight={500}>
            Manage
          </Typography>
        </TextButton>
      </HorizontalFlex>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <VerticalFlex padding="0px 16px 68px">
          {avaxToken && (!searchQuery || showAvax) && (
            <TokenListItem
              onClick={() => {
                capture('TokenListTokenSelected', { selectedToken: 'AVAX' });
                setSendDataInParams({
                  token: avaxToken,
                  options: { path: '/token' },
                });
              }}
              name={avaxToken.name}
              symbol={avaxToken.symbol}
              balanceDisplayValue={avaxToken.balanceDisplayValue}
              balanceUSD={avaxToken.balanceUsdDisplayValue?.toString()}
            >
              <AvaxTokenIcon height="32px" />
            </TokenListItem>
          )}

          {ERC20Tokens?.map((token) => {
            return (
              <TokenListItem
                onClick={() => {
                  setSendDataInParams({
                    token: token,
                    options: { path: '/token' },
                  });
                  capture('TokenListTokenSelected', {
                    selectedToken: (token as ERC20WithBalance).address,
                  });
                }}
                key={
                  isERC20Token(token) ? token.address : (token as any).symbol
                }
                name={token.name}
                symbol={token.symbol}
                balanceDisplayValue={token.balanceDisplayValue}
                balanceUSD={token.balanceUSD?.toString()}
              >
                <TokenIcon
                  width="32px"
                  height="32px"
                  src={token.logoURI}
                  name={token.name}
                />
              </TokenListItem>
            );
          })}

          {ERC20Tokens.length === 0 &&
            avaxToken?.balanceDisplayValue === '0' && <WalletIsEmpty />}
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
