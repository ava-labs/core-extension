import React from 'react';
import {
  HorizontalFlex,
  Typography,
  GridContainer,
  GridContainerItems,
  GridLineSeparator,
} from '@avalabs/react-components';
import { AssetBalanceX } from '@avalabs/avalanche-wallet-sdk';
import { FavStarIcon } from '@src/components/icons/FavStarIcon';
import { TokenImg } from '@src/components/common/TokenImage';
import { useHistory, useLocation } from 'react-router-dom';
import { TransactionSendType } from '../Send/models';
import {
  isAntToken,
  isAvaxToken,
  isERC20Token,
  useTokensWithBalances,
} from '@src/hooks/useTokensWithBalances';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';

export function TokenListItem({
  name,
  symbol,
  balanceDisplayValue,
  children,
}: {
  name: string;
  symbol: string;
  balanceDisplayValue: string;
  children: any;
}) {
  return (
    <>
      <HorizontalFlex width="100%">
        {children}
        <Typography margin={'0 8px'}>{name}</Typography>
        <Typography>({symbol})</Typography>
      </HorizontalFlex>
      <HorizontalFlex width="100%">
        <Typography>{balanceDisplayValue}</Typography>
      </HorizontalFlex>
      <HorizontalFlex padding={'0 0 0 20px'}>
        <FavStarIcon />
      </HorizontalFlex>
      <HorizontalFlex></HorizontalFlex>
    </>
  );
}

export function TokenList() {
  const tokensWithBalances = useTokensWithBalances();
  const { pathname } = useLocation();
  const history = useHistory();
  const AVAX_TOKEN = tokensWithBalances.find((token) => isAvaxToken(token));

  return (
    <GridContainer columnGap={0} columns={4} rowGap={0} padding={'0 15px'}>
      <GridContainerItems>
        <Typography size={14}>Name</Typography>
        <Typography size={14}>Balance</Typography>
        <Typography size={14}>Favorite</Typography>
        <Typography size={14}>24h. Change</Typography>
      </GridContainerItems>
      <GridLineSeparator columns={4} />

      {AVAX_TOKEN ? (
        <GridContainerItems
          onClick={() =>
            history.push({
              pathname: pathname,
              search: `?${new URLSearchParams({
                token: AVAX_TOKEN.symbol,
                type: TransactionSendType.AVAX,
              }).toString()}`,
            })
          }
        >
          <TokenListItem
            name={AVAX_TOKEN.name}
            symbol={AVAX_TOKEN.symbol}
            balanceDisplayValue={AVAX_TOKEN.balanceDisplayValue}
          >
            <AvaxTokenIcon />
          </TokenListItem>
          <GridLineSeparator columns={4} />
        </GridContainerItems>
      ) : (
        ''
      )}

      {tokensWithBalances
        ?.filter((token) => !isAvaxToken(token) && !isAntToken(token))
        .map((token) => (
          <GridContainerItems
            key={
              isERC20Token(token)
                ? token.address
                : (token as AssetBalanceX['meta']).symbol
            }
            onClick={() =>
              history.push({
                pathname: pathname,
                search: `?${new URLSearchParams({
                  token: token.symbol,
                  type: TransactionSendType.ERC20,
                }).toString()}`,
              })
            }
          >
            <TokenListItem
              name={token.name}
              symbol={token.symbol}
              balanceDisplayValue={token.balanceDisplayValue}
            >
              <TokenImg src={token.logoURI} />
            </TokenListItem>
            <GridLineSeparator columns={4} />
          </GridContainerItems>
        ))}

      {tokensWithBalances
        ?.filter((token) => !isAvaxToken(token) && !isERC20Token(token))
        .map((token) => (
          <GridContainerItems
            key={
              isERC20Token(token)
                ? token.address
                : (token as AssetBalanceX['meta']).symbol
            }
            onClick={() =>
              history.push({
                pathname: pathname,
                search: `?${new URLSearchParams({
                  token: token.symbol,
                  type: TransactionSendType.ANT,
                }).toString()}`,
              })
            }
          >
            <TokenListItem
              name={token.name}
              symbol={token.symbol}
              balanceDisplayValue={token.balanceDisplayValue}
            >
              <TokenImg src={token.logoURI} />
            </TokenListItem>
            <GridLineSeparator columns={4} />
          </GridContainerItems>
        ))}
    </GridContainer>
  );
}
