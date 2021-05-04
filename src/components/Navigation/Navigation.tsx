import React from 'react';
import styled from 'styled-components';

import { truncateAddress } from '@src/utils/addressUtils';
export interface NavigationProps {}

export const Navigation = (props: NavigationProps) => {
  const {} = props;

  const exampleAddr: string = '0x860bf60f22563b473E2EAE475BbE655995023740';

  const truncatedAddress = truncateAddress(exampleAddr);

  return (
    <Container>
      <div>a</div>
      <div className='centered'>Account 1 ({truncatedAddress})</div>
      <div>dropdown</div>
    </Container>
  );
};

export const Container = styled.div`
  padding: 1rem;
  flex-basis: 100%;
  max-width: 100%;
  display: grid;
  align-items: center;
  border-bottom: 1px solid grey;
  grid-template-columns: 4rem 1fr 4rem;

  .centered {
    text-align: center;
  }
`;
