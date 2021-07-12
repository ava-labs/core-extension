import React from 'react';
import { useGetErc20Tokens } from '@src/hooks/useGetErc20Tokens';
import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
  HorizontalSeparator,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { truncateAddress } from '@src/utils/addressUtils';

const Erc20TokenImg = styled.img`
  height: 20px;
  width: 20px;
`;

export function Erc20TokenList() {
  const tokens = useGetErc20Tokens();
  console.log(tokens);
  return (
    <VerticalFlex width={'100%'} align={'center'} margin={'10px 0'}>
      {tokens?.map((token) => (
        <VerticalFlex key={token.address} width={'400px'}>
          <HorizontalFlex width={'100%'} justify={'space-between'}>
            <Erc20TokenImg src={token.logoURI} />
            <Typography>{token.name}</Typography>
            <Typography>{truncateAddress(token.address)}</Typography>
            <Typography>{token.balanceParsed ?? 0}</Typography>
          </HorizontalFlex>
          <HorizontalSeparator margin={'5px 0'} />
        </VerticalFlex>
      ))}
    </VerticalFlex>
  );
}
