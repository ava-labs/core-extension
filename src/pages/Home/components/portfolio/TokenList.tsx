import React from 'react';
import {
  Typography,
  GridContainer,
  GridContainerItems,
  GridLineSeparator,
} from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import { TransactionSendType } from '../../../Send/models';
import {
  AntWithBalance,
  isAntToken,
  isAvaxToken,
  isERC20Token,
} from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useSetTokenInParams } from '@src/hooks/useSetTokenInParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenListItem } from './TokenListItem';

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
