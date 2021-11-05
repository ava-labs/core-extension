import { VerticalFlex } from '@avalabs/react-components';
import { BottomNav } from '@src/components/common/BottomNav.minimode';
import React from 'react';
import { PortfolioFlow } from './components/portfolio/PortfolioFlow';

export function HomeMiniMode() {
  return (
    <VerticalFlex width={'100%'}>
      <VerticalFlex flex={1}>
        <PortfolioFlow />
      </VerticalFlex>
      <BottomNav />
    </VerticalFlex>
  );
}
