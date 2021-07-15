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

function component() {
  const { walletStore, networkStore } = useStore();
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
              {addressC} ({networkStore.network})
            </Typography>
            <CaretIcon height="16px" />
          </HorizontalFlex>
        </Card>
      }
    >
      <DropDownMenuItem onClick={() => networkStore.changeToFujiNetwork()}>
        Testnet
      </DropDownMenuItem>
      <DropDownMenuItem onClick={() => networkStore.changeToMainNetwork()}>
        Mainnet
      </DropDownMenuItem>
    </DropDownMenu>
  );
}

export const WalletConnection = observer(component);
