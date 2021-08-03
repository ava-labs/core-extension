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
import { observer } from 'mobx-react-lite';
import { truncateAddress } from '@src/utils/addressUtils';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';

function component() {
  const { wallet } = useWalletContext();
  const { network, setNetwork, networks } = useNetworkContext();
  const [addressC, setAddressC] = useState<string>();
  const [hasBeenCopied, setHasBeenCopied] = useState(false);

  useEffect(() => {
    if (hasBeenCopied) {
      setTimeout(() => {
        setHasBeenCopied(false);
      }, 2000);
    }
  }, [hasBeenCopied]);

  useEffect(() => {
    wallet && setAddressC(truncateAddress(wallet.getAddressC()));
  }, [wallet]);

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
                navigator.clipboard.writeText(wallet?.getAddressC() ?? '');
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
