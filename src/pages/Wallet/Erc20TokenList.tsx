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
  isAvaxToken,
  isERC20Token,
  useTokensWithBalances,
} from '@src/hooks/useTokensWithBalances';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';

export function Erc20TokenList() {
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
        <GridContainerItems>
          <HorizontalFlex width="100%">
            <AvaxTokenIcon />
            <Typography margin={'0 8px'}>{AVAX_TOKEN.name}</Typography>
            <Typography>({AVAX_TOKEN.symbol})</Typography>
          </HorizontalFlex>
          <HorizontalFlex width="100%">
            <Typography>{AVAX_TOKEN.balanceDisplayValue}</Typography>
          </HorizontalFlex>
          <HorizontalFlex padding={'0 0 0 20px'}>
            <FavStarIcon />
          </HorizontalFlex>
          <HorizontalFlex></HorizontalFlex>
          <GridLineSeparator columns={4} />
        </GridContainerItems>
      ) : (
        ''
      )}
      {tokensWithBalances
        ?.filter((token) => !isAvaxToken(token))
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
            <HorizontalFlex width="100%">
              <TokenImg src={token.logoURI} />
              <Typography margin={'0 8px'}>{token.name}</Typography>
              <Typography>({token.symbol})</Typography>
            </HorizontalFlex>
            <HorizontalFlex width="100%">
              <Typography>{token.balanceDisplayValue}</Typography>
            </HorizontalFlex>
            <HorizontalFlex padding={'0 0 0 20px'}>
              <FavStarIcon />
            </HorizontalFlex>
            <HorizontalFlex></HorizontalFlex>
            <GridLineSeparator columns={4} />
          </GridContainerItems>
        ))}
    </GridContainer>
  );
}
