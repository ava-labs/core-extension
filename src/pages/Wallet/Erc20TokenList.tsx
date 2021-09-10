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

const Erc20TokenImg = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
`;

const bnZero = new BN(0);

export function Erc20TokenList() {
  const { erc20Tokens } = useWalletContext();

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
        .map((token, idx) => (
          <GridContainerItems key={token.address}>
            <HorizontalFlex width="100%">
              <Erc20TokenImg src={token.logoURI} />
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
