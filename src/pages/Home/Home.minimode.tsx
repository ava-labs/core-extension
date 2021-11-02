import { VerticalFlex } from '@avalabs/react-components';
import { BottomNav } from '@src/components/common/BottomNav.minimode';
import React from 'react';
import { WalletPortfolio } from '../Wallet/WalletPortfolio';

export function HomeMiniMode() {
  return (
    <VerticalFlex width={'100%'}>
      <VerticalFlex flex={1}>
        <WalletPortfolio />
      </VerticalFlex>

      <BottomNav />
    </VerticalFlex>
  );
}
