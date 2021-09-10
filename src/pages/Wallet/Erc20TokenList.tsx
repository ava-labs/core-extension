import React from 'react';
import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
  HorizontalSeparator,
  SecondaryButton,
  GridContainer,
  GridContainerItems,
  GridLineSeparator,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import { Link } from 'react-router-dom';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { TransactionSendType } from '../Send/models';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';

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
            <HorizontalFlex></HorizontalFlex>
            <HorizontalFlex></HorizontalFlex>
            <GridLineSeparator columns={4} />
          </GridContainerItems>
        ))}
    </GridContainer>
  );
  // return (
  //   <VerticalFlex width={'100%'} align={'center'} margin={'10px 0'}>
  //     {erc20Tokens?.map((token) => (
  //       <VerticalFlex key={token.address} width={'400px'}>
  //         <HorizontalFlex width={'100%'} justify={'space-between'}>
  //           <Erc20TokenImg src={token.logoURI} />
  //           <Typography>{token.name}</Typography>
  //           <Typography>{truncateAddress(token.address)}</Typography>
  //           <Link
  //             to={{
  //               pathname: '/send',
  //               state: { ...token, type: TransactionSendType.ERC20 },
  //             }}
  //           >
  //             <SecondaryButton>Send</SecondaryButton>
  //           </Link>
  //           <Typography>
  //             {token.balanceParsed ? Number(token.balanceParsed).toFixed(4) : 0}
  //           </Typography>
  //         </HorizontalFlex>
  //         <HorizontalSeparator margin={'5px 0'} />
  //       </VerticalFlex>
  //     ))}
  //   </VerticalFlex>
  // );
}
