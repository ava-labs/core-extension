import React from 'react';
import {
  HorizontalFlex,
  Typography,
  GridContainer,
  GridContainerItems,
  GridLineSeparator,
  VerticalFlex,
  SubTextTypography,
} from '@avalabs/react-components';
import { FavStarIcon } from '@src/components/icons/FavStarIcon';
import { TokenIcon } from '@src/components/common/TokenImage';
import { TransactionSendType } from '../Send/models';
import {
  AntWithBalance,
  isAntToken,
  isAvaxToken,
  isERC20Token,
} from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useSetTokenInParams } from '@src/hooks/useSetTokenInParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { WalletTokenListItem } from './components/WalletTokenListItem';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

export function TokenListItem({
  name,
  symbol,
  balanceDisplayValue,
  children,
  balanceUSD,
}: {
  name: string;
  symbol: string;
  balanceDisplayValue?: string;
  children: any;
  balanceUSD?: string;
}) {
  const { currencyFormatter } = useSettingsContext();
  return (
    <>
      <WalletTokenListItem name={name} symbol={symbol}>
        {children}
      </WalletTokenListItem>
      <VerticalFlex width="100%">
        <Typography>{balanceDisplayValue}</Typography>
        {balanceUSD ? (
          <SubTextTypography>
            {currencyFormatter(Number(balanceUSD))}
          </SubTextTypography>
        ) : (
          ''
        )}
      </VerticalFlex>
      <HorizontalFlex padding={'0 0 0 20px'}>
        <FavStarIcon />
      </HorizontalFlex>
      <HorizontalFlex></HorizontalFlex>
    </>
  );
}

export function TokenList() {
  const tokensWithBalances = useTokensWithBalances();
  const setTokenInParams = useSetTokenInParams();
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
            setTokenInParams(AVAX_TOKEN.symbol, TransactionSendType.AVAX)
          }
        >
          <TokenListItem
            name={AVAX_TOKEN.name}
            symbol={AVAX_TOKEN.symbol}
            balanceDisplayValue={AVAX_TOKEN.balanceDisplayValue}
            balanceUSD={AVAX_TOKEN.balanceUSD?.toString()}
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
            key={isERC20Token(token) ? token.address : (token as any).symbol}
            onClick={() =>
              setTokenInParams(token.symbol, TransactionSendType.ERC20)
            }
          >
            <TokenListItem
              name={token.name}
              symbol={token.symbol}
              balanceDisplayValue={token.balanceDisplayValue}
              balanceUSD={token.balanceUSD?.toString()}
            >
              <TokenIcon src={token.logoURI} />
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
                : (token as AntWithBalance).symbol
            }
            onClick={() =>
              setTokenInParams(token.symbol, TransactionSendType.ANT)
            }
          >
            <TokenListItem
              name={token.name}
              symbol={token.symbol}
              balanceDisplayValue={token.balanceDisplayValue}
              balanceUSD={token.balanceUSD?.toString()}
            >
              <TokenIcon src={token.logoURI} />
            </TokenListItem>
            <GridLineSeparator columns={4} />
          </GridContainerItems>
        ))}
    </GridContainer>
  );
}
