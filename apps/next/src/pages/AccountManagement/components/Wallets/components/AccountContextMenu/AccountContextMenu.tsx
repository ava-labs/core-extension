import {
  PopoverPosition,
  CChainIcon,
  XPChainIcon,
  BitcoinColorIcon,
  EthereumColorIcon,
  SolanaColorIcon,
  Menu,
  MenuProps,
  getHexAlpha,
} from '@avalabs/k2-alpine';
import { PrimaryAccount } from '@core/types';
import { FC } from 'react';
import { AddressItem } from './components/AddressItem';

type Props = {
  position: PopoverPosition | undefined;
  onClose: VoidFunction;
  account: PrimaryAccount;
};

const menuSlotProps: MenuProps['slotProps'] = {
  backdrop: {
    sx: {
      backgroundColor: 'transparent',
      backdropFilter: 'none',
    },
  },
  paper: {
    sx: (theme) => ({
      // @ts-expect-error - K2-Alpine types are not up to date
      backgroundColor: theme.palette.surface.primary,
      borderRadius: '10px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: getHexAlpha(theme.palette.primary.main, 10),
    }),
  },
};

export const AccountContextMenu: FC<Props> = ({
  position,
  onClose,
  account,
}: Props) => {
  return (
    <Menu
      open={position !== undefined}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={position}
      slotProps={menuSlotProps}
    >
      <AddressItem
        label="Avalanche C-Chain"
        Icon={CChainIcon}
        address={account.addressC}
        onClose={onClose}
      />
      <AddressItem
        label="Avalanche X-Chain"
        Icon={XPChainIcon}
        address={account.addressAVM}
        onClose={onClose}
      />
      <AddressItem
        label="Bitcoin"
        Icon={BitcoinColorIcon}
        address={account.addressBTC}
        onClose={onClose}
      />
      <AddressItem
        label="Ethereum"
        Icon={EthereumColorIcon}
        address={account.addressC}
        onClose={onClose}
      />
      <AddressItem
        label="Solana"
        Icon={SolanaColorIcon}
        address={account.addressSVM}
        onClose={onClose}
      />
    </Menu>
  );
};
