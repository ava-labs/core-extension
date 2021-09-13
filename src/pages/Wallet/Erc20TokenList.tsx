import React from 'react';
import {
  HorizontalFlex,
  Typography,
  GridContainer,
  GridContainerItems,
  GridLineSeparator,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { FavStarIcon } from '@src/components/icons/FavStarIcon';
import { TokenImg } from '@src/components/common/TokenImage';
import { useHistory, useLocation } from 'react-router-dom';
import { TransactionSendType } from '../Send/models';

const bnZero = new BN(0);

export function Erc20TokenList() {
  const { erc20Tokens } = useWalletContext();
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <GridContainer columnGap={0} columns={4} rowGap={0}>
      <GridContainerItems>
        <Typography size={14}>Name</Typography>
        <Typography size={14}>Balance</Typography>
        <Typography size={14}>Favorite</Typography>
        <Typography size={14}>24h. Change</Typography>
      </GridContainerItems>
      <GridLineSeparator columns={4} />
      {erc20Tokens
        ?.filter((token) => token.balance.gt(bnZero))
        .map((token) => (
          <GridContainerItems
            key={token.address}
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
            </HorizontalFlex>
            <HorizontalFlex width="100%">
              <Typography>
                {parseFloat(token.balanceParsed).toFixed(3)}
              </Typography>
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
