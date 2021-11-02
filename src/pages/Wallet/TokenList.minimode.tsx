import React, { useMemo, useState } from 'react';
import {
  HorizontalFlex,
  Card,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TokenImg } from '@src/components/common/TokenImage';
import {
  AntWithBalance,
  isAntToken,
  isAvaxToken,
  isERC20Token,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { WalletTokenListItemMiniMode } from './components/WalletTokenListItem.minimode';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { TransactionSendType } from '../Send/models';
import { useSetTokenInParams } from '@src/hooks/useSetTokenInParams';
import { SendReceiveToggle } from './components/SendRecieveToggle.minimode';

function TokenListItem({
  name,
  symbol,
  balanceDisplayValue,
  children,
  balanceUSD,
  onClick,
  margin,
}: {
  name: string;
  symbol: string;
  balanceDisplayValue?: string;
  children: any;
  balanceUSD?: string;
  onClick(): void;
  margin?: string;
}) {
  const { currencyFormatter } = useWalletContext();
  const { currency } = useSettingsContext();
  return (
    <Card
      margin={margin ?? '8px 0 0 0'}
      onClick={() => onClick && onClick()}
      style={{ cursor: 'pointer' }}
    >
      <HorizontalFlex width={'100%'} justify={'space-between'}>
        <WalletTokenListItemMiniMode
          name={name}
          symbol={symbol}
          balance={parseFloat(balanceDisplayValue?.toString() || '').toFixed(4)}
        >
          {children}
        </WalletTokenListItemMiniMode>
        <HorizontalFlex width="50%" justify={'flex-end'} align={'center'}>
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
  const [searchQuery, setSearchQuery] = useState<string>();
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

  return (
    <VerticalFlex>
      <br />
      <br />
      <br />
      <SendReceiveToggle onSearch={(term) => setSearchQuery(term)} />
      <br />
      <br />

      <VerticalFlex
        style={{
          height: '325px',
          width: '100%',
          overflow: 'auto',
          padding: '0px 16px 100px 16px',
        }}
      >
        {AVAX_TOKEN && (!searchQuery || showAvax) ? (
          <TokenListItem
            margin={'0px 0px 0px 0px'}
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
            <AvaxTokenIcon />
          </TokenListItem>
        ) : (
          ''
        )}

        {tokens
          ?.filter((token) => !isAvaxToken(token) && !isAntToken(token))
          .map((token) => (
            <TokenListItem
              onClick={() =>
                setTokenInParams(
                  token.symbol,
                  TransactionSendType.ERC20,
                  'token'
                )
              }
              key={isERC20Token(token) ? token.address : (token as any).symbol}
              name={token.name}
              symbol={token.symbol}
              balanceDisplayValue={token.balanceDisplayValue}
              balanceUSD={token.balanceUSD?.toString()}
            >
              <TokenImg src={token.logoURI} />
            </TokenListItem>
          ))}

        {tokens
          ?.filter((token) => !isAvaxToken(token) && !isERC20Token(token))
          .map((token) => (
            <TokenListItem
              key={
                isERC20Token(token)
                  ? token.address
                  : (token as AntWithBalance).symbol
              }
              onClick={() =>
                setTokenInParams(token.symbol, TransactionSendType.ANT, 'token')
              }
              name={token.name}
              symbol={token.symbol}
              balanceDisplayValue={token.balanceDisplayValue}
              balanceUSD={token.balanceUSD?.toString()}
            >
              <TokenImg src={token.logoURI} />
            </TokenListItem>
          ))}
      </VerticalFlex>
    </VerticalFlex>
  );
}
