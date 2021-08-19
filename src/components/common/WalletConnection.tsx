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
import { truncateAddress } from '@src/utils/truncateAddress';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function WalletConnection() {
  const { addresses } = useWalletContext();
  const { network, setNetwork, networks } = useNetworkContext();
  const [hasBeenCopied, setHasBeenCopied] = useState(false);

  useEffect(() => {
    if (hasBeenCopied) {
      setTimeout(() => {
        setHasBeenCopied(false);
      }, 2000);
    }
  }, [hasBeenCopied]);

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
                navigator.clipboard.writeText(addresses.addrC ?? '');
                setHasBeenCopied(true);
              }}
            >
              {hasBeenCopied ? 'copied' : 'copy'}
            </TextButton>
            <Typography margin="0 auto 0 5px">
              {truncateAddress(addresses.addrC)} ({network?.name})
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
