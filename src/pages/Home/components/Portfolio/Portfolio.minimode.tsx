import { VerticalFlex } from '@avalabs/react-components';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SendReceiveToggle } from '../SendReceive/SendReceiveToggle';
import { TokenListMiniMode } from './TokenList.minimode';
import { TokenSearch } from './TokenSearch';
import { WalletBalancesMiniMode } from './WalletBalances.minimode';

const BalanceWithButtons = styled(VerticalFlex)`
  backface-visibility: hidden;
  width: 100%;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

const TokenSearchWithAnimation = styled(TokenSearch)`
  backface-visibility: hidden;

  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
`;

const Flipper = styled(VerticalFlex)`
  transition: 0.6s;
  transform-style: preserve-3d;

  position: relative;
`;

const FlipContainer = styled(VerticalFlex)<{
  showSearch: boolean;
}>`
  perspective: 1000;

  ${Flipper} {
    ${({ showSearch }) => showSearch && `transform: rotateY(180deg);`}
  }
`;

export function PortfolioMiniMode() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const showTokenList = !showSearch || (showSearch && !!searchQuery);

  return (
    <>
      <FlipContainer
        height={showSearch ? '145px' : '188px'}
        showSearch={showSearch}
      >
        <Flipper>
          <TokenSearchWithAnimation
            query={searchQuery}
            onBack={() => {
              setSearchQuery('');
              setShowSearch(false);
            }}
            onSearch={(term) => setSearchQuery(term)}
          />
          <BalanceWithButtons>
            <WalletBalancesMiniMode />
            <SendReceiveToggle onShowSend={() => setShowSearch(true)} />
          </BalanceWithButtons>
        </Flipper>
      </FlipContainer>
      {showTokenList && <TokenListMiniMode searchQuery={searchQuery} />}
    </>
  );
}
