import React from 'react';
import {
  DropDownMenu,
  DropDownMenuItem,
  HorizontalFlex,
  SecondaryCard,
  Typography,
} from '@avalabs/react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { TokenImg } from '@src/components/common/TokenImage';
import { ERC20 } from '@avalabs/wallet-react-components';
import { useHistory, useLocation } from 'react-router-dom';
import { TransactionSendType } from '@src/pages/Send/models';
import {
  AVAX_TOKEN,
  isERC20Token,
  useTokensWithBalances,
} from '@src/hooks/useTokensWithBalances';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';

function AvaxTokenItem() {
  return (
    <HorizontalFlex align={'center'}>
      <AvaxTokenIcon />
      <Typography margin={'0 0 0 5px'}>Avalanche (AVAX)</Typography>
    </HorizontalFlex>
  );
}

function Erc20TokenItem({ token }: { token: ERC20 }) {
  return (
    <HorizontalFlex align={'center'}>
      <TokenImg src={token.logoURI} />
      <Typography margin={'0 0 0 5px'}>
        {token.name} ({token.symbol})
      </Typography>
    </HorizontalFlex>
  );
}

export function WalletSendToken() {
  const { search, pathname } = useLocation();
  const history = useHistory();
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
            {isERC20Token(selectedToken) ? (
              <Erc20TokenItem token={selectedToken} />
            ) : (
              <AvaxTokenItem />
            )}
          </HorizontalFlex>
        </SecondaryCard>
      }
    >
      <DropDownMenuItem
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
        <AvaxTokenItem />
      </DropDownMenuItem>

      {tokensWBalances?.map((token) => {
        return (
          <DropDownMenuItem
            key={token.name}
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
            {isERC20Token(token) ? <Erc20TokenItem token={token} /> : ''}
          </DropDownMenuItem>
        );
      })}
    </DropDownMenu>
  );
}
