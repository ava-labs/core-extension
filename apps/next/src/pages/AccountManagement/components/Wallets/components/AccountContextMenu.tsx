import { SolanaAddressEnabler } from '@/components/Address';
import {
  BitcoinColorIcon,
  CChainIcon,
  EthereumColorIcon,
  Menu,
  MenuProps,
  PopoverPosition,
  SolanaColorIcon,
  XPChainIcon,
  getHexAlpha,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC } from 'react';
import { AddressItem } from '../../../../../components/Address/AddressItem';
import * as Styled from '../../Styled';

type Props = {
  position: PopoverPosition | undefined;
  onClose: VoidFunction;
  account: Account;
};

const menuSlots: Pick<MenuProps, 'slots' | 'slotProps'> = {
  slotProps: {
    backdrop: {
      sx: {
        backgroundColor: 'transparent',
        backdropFilter: 'none',
      },
    },
    paper: {
      sx: (theme) => ({
        color: theme.palette.text.primary,
        backgroundColor: getHexAlpha(theme.palette.background.default, 60),
        borderRadius: '10px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: getHexAlpha(theme.palette.primary.main, 10),
      }),
    },
  },
};

export const AccountContextMenu: FC<Props> = ({
  position,
  onClose,
  account,
}) => {
  return (
    <Menu
      open={position !== undefined}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={position}
      {...menuSlots}
    >
      <AddressItem
        label="Avalanche C-Chain"
        Icon={CChainIcon}
        address={account.addressC}
        onClick={onClose}
      />
      <Styled.Divider variant="inset" component="li" />
      <AddressItem
        label="Avalanche X/P-Chain"
        Icon={XPChainIcon}
        address={account.addressAVM}
        onClick={onClose}
      />
      <Styled.Divider variant="inset" component="li" />
      <AddressItem
        label="Bitcoin"
        Icon={BitcoinColorIcon}
        address={account.addressBTC}
        onClick={onClose}
      />
      <Styled.Divider variant="inset" component="li" />
      <AddressItem
        label="Ethereum"
        Icon={EthereumColorIcon}
        address={account.addressC}
        onClick={onClose}
      />
      <Styled.Divider variant="inset" component="li" />
      <AddressItem
        label="Solana"
        Icon={SolanaColorIcon}
        address={account.addressSVM}
        onClick={onClose}
        AddressEnabler={SolanaAddressEnabler}
      />
    </Menu>
  );
};
