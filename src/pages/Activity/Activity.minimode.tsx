import {
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { BottomNav } from '@src/components/common/BottomNav.minimode';
import React from 'react';
import { WalletRecentTxs } from '../Wallet/WalletRecentTxs';

export function ActivityMiniMode() {
  return (
    <VerticalFlex width={'100%'} padding={'0 20px'} align={'center'}>
      <HorizontalFlex width={'100%'}>
        <Typography size={29} weight={600} as="h1">
          Activity
        </Typography>
      </HorizontalFlex>
      <br />
      <br />
      <WalletRecentTxs />
      <BottomNav />
    </VerticalFlex>
  );
}
