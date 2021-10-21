import React from 'react';
import {
  HorizontalFlex,
  SubTextTypography,
  Card,
  Typography,
} from '@avalabs/react-components';
import { TokenImg } from '@src/components/common/TokenImage';
import {
  AntWithBalance,
  isAntToken,
  isAvaxToken,
  isERC20Token,
} from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletTokenListItemMiniMode } from './components/WalletTokenListItem.minimode';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

function TokenListItem({
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
  const { currencyFormatter } = useWalletContext();
  const { currency } = useSettingsContext();
  return (
    <Card margin={'8px 0 0 0'}>
      <HorizontalFlex width={'100%'} justify={'space-between'}>
        <WalletTokenListItemMiniMode
          name={name}
          symbol={symbol}
          balance={balanceDisplayValue}
        >
          {children}
        </WalletTokenListItemMiniMode>
        <HorizontalFlex width="100%" justify={'flex-end'} align={'center'}>
          {balanceUSD ? (
            <Typography>
              {currencyFormatter(Number(balanceUSD))} {currency}
            </Typography>
          ) : (
            ''
          )}
        </HorizontalFlex>
      </HorizontalFlex>
    </Card>
  );
}

export function TokenListMiniMode() {
  const tokensWithBalances = useTokensWithBalances();
  const AVAX_TOKEN = tokensWithBalances.find((token) => isAvaxToken(token));

  return (
    <>
      {AVAX_TOKEN ? (
        <TokenListItem
          name={AVAX_TOKEN.name}
          symbol={AVAX_TOKEN.symbol}
          balanceDisplayValue={AVAX_TOKEN.balanceDisplayValue}
          balanceUSD={AVAX_TOKEN.balanceUSD?.toString()}
        >
          <AvaxTokenIcon />
        </TokenListItem>
      ) : (
        ''
      )}

      {tokensWithBalances
        ?.filter((token) => !isAvaxToken(token) && !isAntToken(token))
        .map((token) => (
          <TokenListItem
            key={isERC20Token(token) ? token.address : (token as any).symbol}
            name={token.name}
            symbol={token.symbol}
            balanceDisplayValue={token.balanceDisplayValue}
            balanceUSD={token.balanceUSD?.toString()}
          >
            <TokenImg src={token.logoURI} />
          </TokenListItem>
        ))}

      {tokensWithBalances
        ?.filter((token) => !isAvaxToken(token) && !isERC20Token(token))
        .map((token) => (
          <TokenListItem
            key={
              isERC20Token(token)
                ? token.address
                : (token as AntWithBalance).symbol
            }
            name={token.name}
            symbol={token.symbol}
            balanceDisplayValue={token.balanceDisplayValue}
            balanceUSD={token.balanceUSD?.toString()}
          >
            <TokenImg src={token.logoURI} />
          </TokenListItem>
        ))}
    </>
  );
}
