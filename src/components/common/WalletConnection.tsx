import React, { useEffect, useState } from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import { useStore } from '@src/store/store';
import { observer } from 'mobx-react-lite';
import { truncateAddress } from '@src/utils/addressUtils';

function component() {
  const { walletStore } = useStore();
  const [addressC, setAddressC] = useState(truncateAddress(walletStore.addrC));

  useEffect(() => {
    setAddressC(truncateAddress(walletStore.addrC));
  }, [walletStore.addrC]);
  return <VerticalFlex>{addressC}</VerticalFlex>;
}

export const WalletConnection = observer(component);
