import { VerticalFlex } from '@avalabs/react-components';
import React from 'react';
import SendFlow from '../Send/SendFlow';
import { WalletSendToken } from './components/WalletSendToken';

export function WalletHomeSend() {
  return (
    <VerticalFlex>
      <br />
      <WalletSendToken />
      <SendFlow />
    </VerticalFlex>
  );
}
