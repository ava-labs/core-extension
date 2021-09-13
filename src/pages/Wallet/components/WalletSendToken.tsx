import React, { useState } from 'react';
import {
  DropDownMenu,
  DropDownMenuItem,
  HorizontalFlex,
  SecondaryCard,
  Typography,
} from '@avalabs/react-components';
import { AvaxTokenIcon } from '@src/components/icons/AvaxTokenIcon';
import { TokenImg } from '@src/components/common/TokenImage';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { useEffect } from 'react';
import { ERC20 } from '@avalabs/wallet-react-components';
import { useHistory, useLocation } from 'react-router-dom';
import { TransactionSendType } from '@src/pages/Send/models';

const bnZero = new BN(0);

const AVAX_TOKEN = {
  name: 'Avalanche',
  symbol: 'AVAX',
  isAvax: true,
};

interface SendTokenItem {
  name: string;
  symbol: string;
  logoURI?: string;
  isErc20?: boolean;
  isAvax?: boolean;
}

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
  const { erc20Tokens } = useWalletContext();
  const [tokensWBalances, setTokensWBalances] = useState<SendTokenItem[]>([]);
  const [selectedToken, setSelectedToken] = useState<SendTokenItem>(AVAX_TOKEN);

  useEffect(() => {
    const erc20TokensWithBalances = erc20Tokens
      ?.filter((token) => token.balance.gt(bnZero))
      .map((token) => {
        return {
          ...token,
          isErc20: true,
        };
      });

    setTokensWBalances([...tokensWBalances, ...erc20TokensWithBalances]);
  }, [erc20Tokens]);

  useEffect(() => {
    // need to update ts target version so support this feature, browser supports it
    const { token } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );
    const targetToken = [AVAX_TOKEN, ...tokensWBalances]?.find(
      (availToken) => availToken.symbol === token
    );
    targetToken && setSelectedToken(targetToken);
  }, [search, tokensWBalances]);

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
            {selectedToken.isAvax ? (
              <AvaxTokenItem />
            ) : (
              <Erc20TokenItem token={selectedToken as ERC20} />
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
            <Erc20TokenItem token={token as ERC20} />
          </DropDownMenuItem>
        );
      })}
    </DropDownMenu>
  );
}
