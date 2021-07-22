import React, { useEffect, useState } from 'react';
import {
  TextButton,
  DropDownMenu,
  DropDownMenuItem,
  Card,
  HorizontalFlex,
  Typography,
  CaretIcon,
} from '@avalabs/react-components';
import { useStore } from '@src/store/store';
import { observer } from 'mobx-react-lite';
import { truncateAddress } from '@src/utils/addressUtils';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

function component() {
  const { walletStore } = useStore();
  const { network, setNetwork, networks } = useNetworkContext();
  const [addressC, setAddressC] = useState(truncateAddress(walletStore.addrC));
  const [hasBeenCopied, setHasBeenCopied] = useState(false);

  useEffect(() => {
    if (hasBeenCopied) {
      setTimeout(() => {
        setHasBeenCopied(false);
      }, 2000);
    }
  }, [hasBeenCopied]);

  useEffect(() => {
    setAddressC(truncateAddress(walletStore.addrC));
  }, [walletStore.addrC]);

  return (
    <DropDownMenu
      coords={{
        left: '0px',
        top: '42px',
      }}
      icon={
        <Card padding="10px" width="188px">
          <HorizontalFlex align="center">
            <TextButton
              onClick={(evt) => {
                evt.stopPropagation();
                navigator.clipboard.writeText(walletStore.addrC);
                setHasBeenCopied(true);
              }}
            >
              {hasBeenCopied ? 'copied' : 'copy'}
            </TextButton>
            <Typography margin="0 auto 0 5px">
              {addressC} ({network?.name})
            </Typography>
            <CaretIcon height="16px" />
          </HorizontalFlex>
        </Card>
      }
    >
      {networks.map((network) => (
        <DropDownMenuItem
          key={network.name}
          onClick={() => setNetwork(network)}
        >
          {network.name}
        </DropDownMenuItem>
      ))}
    </DropDownMenu>
  );
}

export const WalletConnection = observer(component);
