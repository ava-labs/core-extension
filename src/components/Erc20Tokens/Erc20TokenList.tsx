import React from 'react';
import { useGetErc20Tokens } from '@src/hooks/useGetErc20Tokens';
import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
  HorizontalSeparator,
  SecondaryButton,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { truncateAddress } from '@src/utils/addressUtils';
import { Link } from 'react-router-dom';
import { TransactionSendType } from '@src/store/wallet/types';

const Erc20TokenImg = styled.img`
  height: 20px;
  width: 20px;
`;

export function Erc20TokenList() {
  const tokens = useGetErc20Tokens();
  return (
    <VerticalFlex width={'100%'} align={'center'} margin={'10px 0'}>
      {tokens?.map((token) => (
        <VerticalFlex key={token.address} width={'400px'}>
          <HorizontalFlex width={'100%'} justify={'space-between'}>
            <Erc20TokenImg src={token.logoURI} />
            <Typography>{token.name}</Typography>
            <Typography>{truncateAddress(token.address)}</Typography>
            <Link
              to={{
                pathname: '/send',
                state: { ...token, type: TransactionSendType.ERC20 },
              }}
            >
              <SecondaryButton>Send</SecondaryButton>
            </Link>
            <Typography>
              {token.balanceParsed ? Number(token.balanceParsed).toFixed(4) : 0}
            </Typography>
          </HorizontalFlex>
          <HorizontalSeparator margin={'5px 0'} />
        </VerticalFlex>
      ))}
    </VerticalFlex>
  );
}
