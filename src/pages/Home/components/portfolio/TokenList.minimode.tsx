import React, { useMemo } from 'react';
import {
  SubTextTypography,
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
import { TransactionSendType } from '../../../Send/models';
import { useSetTokenInParams } from '@src/hooks/useSetTokenInParams';
import { TokenListItemMiniMode } from './TokenListItem.minimode';
import Scrollbars from 'react-custom-scrollbars';
import { IllustrationPlaceholder } from '@src/components/common/IllustrationPlaceholder';

interface TokenListMiniModeProps {
  searchQuery?: string;
}

export function TokenListMiniMode({ searchQuery }: TokenListMiniModeProps) {
  const tokensWithBalances = useTokensWithBalances();
  const AVAX_TOKEN = tokensWithBalances.find((token) => isAvaxToken(token));
  const setTokenInParams = useSetTokenInParams();
  const { tokens, showAvax } = useMemo(() => {
    const tokens = searchQuery
      ? tokensWithBalances.filter(
          (i) =>
            i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tokensWithBalances;

    const showAvax =
      searchQuery &&
      ((AVAX_TOKEN as TokenWithBalance).name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        (AVAX_TOKEN as TokenWithBalance).symbol
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return { tokens, showAvax };
  }, [tokensWithBalances, searchQuery]);

  if (!tokens.length && !showAvax) {
    return (
      <VerticalFlex
        grow="1"
        align="center"
        justify="center"
        padding="0px 16px 73px"
      >
        <IllustrationPlaceholder size={120}>
          <Typography>Illustration</Typography>
        </IllustrationPlaceholder>
        <SubTextTypography margin="16px 0 0 0">
          No results found
        </SubTextTypography>
      </VerticalFlex>
    );
  }

  return (
    <VerticalFlex grow="1">
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <VerticalFlex padding="0px 16px 73px">
          {AVAX_TOKEN && (!searchQuery || showAvax) && (
            <TokenListItemMiniMode
              onClick={() =>
                setTokenInParams(
                  AVAX_TOKEN.symbol,
                  TransactionSendType.AVAX,
                  'token'
                )
              }
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
            .map((token) => (
              <TokenListItemMiniMode
                onClick={() =>
                  setTokenInParams(
                    token.symbol,
                    TransactionSendType.ERC20,
                    'token'
                  )
                }
                key={
                  isERC20Token(token) ? token.address : (token as any).symbol
                }
                name={token.name}
                symbol={token.symbol}
                balanceDisplayValue={token.balanceDisplayValue}
                balanceUSD={token.balanceUSD?.toString()}
              >
                <TokenIcon width="32px" height="32px" src={token.logoURI} />
              </TokenListItemMiniMode>
            ))}

          {tokens
            ?.filter((token) => !isAvaxToken(token) && !isERC20Token(token))
            .map((token) => (
              <TokenListItemMiniMode
                key={
                  isERC20Token(token)
                    ? token.address
                    : (token as AntWithBalance).symbol
                }
                onClick={() =>
                  setTokenInParams(
                    token.symbol,
                    TransactionSendType.ANT,
                    'token'
                  )
                }
                name={token.name}
                symbol={token.symbol}
                balanceDisplayValue={token.balanceDisplayValue}
                balanceUSD={token.balanceUSD?.toString()}
              >
                <TokenIcon width="32px" height="32px" src={token.logoURI} />
              </TokenListItemMiniMode>
            ))}
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
