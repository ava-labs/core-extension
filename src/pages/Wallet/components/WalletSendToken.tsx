import React from 'react';
import {
  DropDownMenu,
  DropDownMenuItem,
  HorizontalFlex,
  SecondaryCard,
} from '@avalabs/react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { TokenImg } from '@src/components/common/TokenImage';
import { TransactionSendType } from '@src/pages/Send/models';
import {
  AVAX_TOKEN,
  isAntToken,
  isERC20Token,
  useTokensWithBalances,
} from '@src/hooks/useTokensWithBalances';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { WalletTokenListItem } from './WalletTokenListItem';
import { useSetTokenInParams } from '@src/hooks/useSetTokenInParams';

export function WalletSendToken() {
  const setTokenInParams = useSetTokenInParams();
  const tokensWBalances = useTokensWithBalances();
  const selectedToken = useTokenFromParams(tokensWBalances);

  return (
    <DropDownMenu
      coords={{
        left: '0px',
        top: '56px',
        right: '0px',
      }}
      icon={
        <SecondaryCard padding="10px" width="100%">
          <HorizontalFlex align={'center'} padding={'0 0 0 20px'}>
            <WalletTokenListItem
              name={selectedToken.name}
              symbol={selectedToken.symbol}
            >
              {isERC20Token(selectedToken) ? (
                <TokenImg src={selectedToken.logoURI} />
              ) : isAntToken(selectedToken as any) ? (
                <TokenImg src={(selectedToken as any).logoURI} />
              ) : (
                <AvaxTokenIcon />
              )}
            </WalletTokenListItem>
          </HorizontalFlex>
        </SecondaryCard>
      }
    >
      <DropDownMenuItem
        onClick={() =>
          setTokenInParams(AVAX_TOKEN.symbol, TransactionSendType.AVAX)
        }
      >
        <WalletTokenListItem name={AVAX_TOKEN.name} symbol={AVAX_TOKEN.symbol}>
          <AvaxTokenIcon />
        </WalletTokenListItem>
      </DropDownMenuItem>

      {tokensWBalances
        ?.filter((token) => isERC20Token(token))
        .map((token) => {
          return (
            <DropDownMenuItem
              key={token.name}
              onClick={() =>
                setTokenInParams(token.symbol, TransactionSendType.ERC20)
              }
            >
              <WalletTokenListItem name={token.name} symbol={token.symbol}>
                <TokenImg src={token.logoURI} />
              </WalletTokenListItem>
            </DropDownMenuItem>
          );
        })}

      {tokensWBalances
        ?.filter((token) => isAntToken(token))
        .map((token) => {
          return (
            <DropDownMenuItem
              key={token.name}
              onClick={() =>
                setTokenInParams(token.symbol, TransactionSendType.ANT)
              }
            >
              <WalletTokenListItem name={token.name} symbol={token.symbol}>
                <TokenImg src={token.logoURI} />
              </WalletTokenListItem>
            </DropDownMenuItem>
          );
        })}
    </DropDownMenu>
  );
}
