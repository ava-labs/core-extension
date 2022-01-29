import { useMemo } from 'react';
import {
  HorizontalFlex,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import {
  AntWithBalance,
  isAntToken,
  isAvaxToken,
  isERC20Token,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useSetTokenInParams } from '@src/hooks/useSetTokenInParams';
import { TokenListItemMiniMode } from './TokenListItem.minimode';
import Scrollbars from 'react-custom-scrollbars-2';
import { NoTokenFound } from './NoTokenFound';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useHistory } from 'react-router-dom';

interface TokenListMiniModeProps {
  searchQuery?: string;
}

export function TokenListMiniMode({ searchQuery }: TokenListMiniModeProps) {
  const { getTokenVisibility } = useSettingsContext();
  const tokensWithBalances = useTokensWithBalances();
  const history = useHistory();
  const AVAX_TOKEN = tokensWithBalances.find((token) => isAvaxToken(token));
  const setTokenInParams = useSetTokenInParams();
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
      ((AVAX_TOKEN as TokenWithBalance).name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        (AVAX_TOKEN as TokenWithBalance).symbol
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return { tokens, showAvax };
  }, [searchQuery, tokensWithBalances, AVAX_TOKEN, getTokenVisibility]);

  const toggleManageTokensPage = () => {
    if (history.location.pathname.startsWith('/manage-tokens')) {
      history.push('/');
      return;
    }
    history.push('/manage-tokens');
  };

  if (!tokens.length && !showAvax) {
    return <NoTokenFound />;
  }

  return (
    <VerticalFlex grow="1">
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
        <VerticalFlex padding="0px 16px 73px">
          {AVAX_TOKEN && (!searchQuery || showAvax) && (
            <TokenListItemMiniMode
              onClick={() => setTokenInParams(AVAX_TOKEN.symbol, '/token')}
              name={AVAX_TOKEN.name}
              symbol={AVAX_TOKEN.symbol}
              balanceDisplayValue={AVAX_TOKEN.balanceDisplayValue}
              balanceUSD={AVAX_TOKEN.balanceUsdDisplayValue?.toString()}
            >
              <AvaxTokenIcon height="32px" />
            </TokenListItemMiniMode>
          )}

          {tokens
            ?.filter((token) => !isAvaxToken(token) && !isAntToken(token))
            .map((token) => {
              return (
                <TokenListItemMiniMode
                  onClick={() => setTokenInParams(token.symbol, '/token')}
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
                </TokenListItemMiniMode>
              );
            })}

          {tokens
            ?.filter((token) => !isAvaxToken(token) && !isERC20Token(token))
            .map((token) => (
              <TokenListItemMiniMode
                key={
                  isERC20Token(token)
                    ? token.address
                    : (token as AntWithBalance).symbol
                }
                onClick={() => setTokenInParams(token.symbol, '/token')}
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
              </TokenListItemMiniMode>
            ))}
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
