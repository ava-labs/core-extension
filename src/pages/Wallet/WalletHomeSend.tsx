import { VerticalFlex } from '@avalabs/react-components';
import { AVAX_TOKEN } from '@avalabs/wallet-react-components';
import { networkUpdatedEventListener } from '@src/background/services/network/events/networkUpdatedEventListener';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useSetTokenInParams } from '@src/hooks/useSetTokenInParams';
import React, { useEffect } from 'react';
import { filter, map } from 'rxjs';
import { TransactionSendType } from '../Send/models';
import SendFlow from '../Send/SendFlow';
import { WalletSendToken } from './components/WalletSendToken';

export function WalletHomeSend() {
  const { events } = useConnectionContext();
  const setTokenInParams = useSetTokenInParams();

  useEffect(() => {
    if (!events) {
      return;
    }
    /**
     * We need to listen for network to update and when it does reset the token
     * selected back to avax since the previous token may not be on the network
     * but AVAX always is guaranteed
     */
    events()
      .pipe(
        filter(networkUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe(() => {
        setTokenInParams(AVAX_TOKEN.symbol, TransactionSendType.AVAX);
      });
  }, []);

  return (
    <VerticalFlex padding="16px 0 0 0">
      <WalletSendToken />
      <SendFlow />
    </VerticalFlex>
  );
}
