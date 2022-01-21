import { useMemo } from 'react';
import { TokenCard, VerticalFlex } from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import {
  isAntToken,
  isAvaxToken,
  isERC20Token,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import Scrollbars from 'react-custom-scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { NoTokenFound } from '../../Home/components/Portfolio/NoTokenFound';

interface TokenListProps {
  searchQuery?: string;
  onClick: any;
  onClose: any;
  tokenList: any;
}

export function TokenList({
  tokenList,
  searchQuery,
  onClick,
  onClose,
}: TokenListProps) {
  const AVAX_TOKEN = tokenList.find((token) => isAvaxToken(token));
  const { currency, currencyFormatter } = useSettingsContext();
  const { tokens, showAvax } = useMemo(() => {
    const tokens = searchQuery
      ? tokenList.filter(
          (i) =>
            i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tokenList;

    const showAvax =
      searchQuery &&
      ((AVAX_TOKEN as TokenWithBalance).name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        (AVAX_TOKEN as TokenWithBalance).symbol
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return { tokens, showAvax };
  }, [tokenList, searchQuery, AVAX_TOKEN]);

  if (!tokens.length && !showAvax) {
    return <NoTokenFound />;
  }

  return (
    <VerticalFlex grow="1" padding="16px 0 0 0">
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <VerticalFlex padding="0px 16px 73px">
          {AVAX_TOKEN && (!searchQuery || showAvax) && (
            <TokenCard
              name={AVAX_TOKEN.name}
              symbol={AVAX_TOKEN.symbol}
              onClick={() => {
                onClick(AVAX_TOKEN);
                onClose();
              }}
              currency={currency}
              balanceDisplayValue={AVAX_TOKEN.balanceDisplayValue}
              balanceUSD={AVAX_TOKEN.balanceUsdDisplayValue?.toString()}
              currencyFormatter={currencyFormatter}
            >
              <AvaxTokenIcon height="32px" />
            </TokenCard>
          )}

          {tokens
            ?.filter((token) => !isAvaxToken(token) && !isAntToken(token))
            .map((token, index) => {
              return (
                <TokenCard
                  name={token.name}
                  symbol={token.symbol}
                  onClick={() => {
                    onClick(token);
                    onClose();
                  }}
                  currency={currency}
                  balanceDisplayValue={token.balanceDisplayValue}
                  balanceUSD={token.balanceUSD?.toString()}
                  currencyFormatter={currencyFormatter}
                  key={`${token.name}-${token.symbol}-${index}`}
                >
                  <TokenIcon
                    width="32px"
                    height="32px"
                    src={token.logoURI}
                    name={token.name}
                  />
                </TokenCard>
              );
            })}

          {tokens
            ?.filter((token) => !isAvaxToken(token) && !isERC20Token(token))
            .map((token, index) => (
              <TokenCard
                name={token.name}
                symbol={token.symbol}
                onClick={() => {
                  onClick(token);
                  onClose();
                }}
                currency={currency}
                balanceDisplayValue={token.balanceDisplayValue}
                balanceUSD={token.balanceUSD?.toString()}
                currencyFormatter={currencyFormatter}
                key={`${token.name}-${token.symbol}-${index}`}
              >
                <TokenIcon
                  width="32px"
                  height="32px"
                  src={token.logoURI}
                  name={token.name}
                />
              </TokenCard>
            ))}
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
