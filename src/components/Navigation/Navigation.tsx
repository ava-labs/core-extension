import React, { useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import { ToggleDarkMode } from '@src/components/ToggleDarkMode';
import { useStore } from '@src/store/store';

import { truncateAddress } from '@src/utils/addressUtils';
export interface NavigationProps {}

export const Navigation = observer((props: NavigationProps) => {
  const { walletStore } = useStore();
  const {} = props;

  const [addrC] = useState(walletStore.addrC);
  const truncatedAddress = truncateAddress(addrC);

  return (
    <Container>
      <ToggleDarkMode />
      <div className="centered">
        <div
          className="cursor"
          onClick={() => {
            navigator.clipboard.writeText(addrC);
          }}
        >
          ({truncatedAddress})
        </div>
      </div>
      <div>dropdown</div>
    </Container>
  );
});

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
  .cursor {
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
`;
