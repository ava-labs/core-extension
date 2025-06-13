import { AddressItem } from '@/pages/AccountManagement/components/AddressItem';
import {
  BitcoinColorIcon,
  CChainIcon,
  EthereumColorIcon,
  List,
  SolanaColorIcon,
  XPChainIcon,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC } from 'react';
import * as Styled from './Styled';

type Props = {
  account: Account;
};

export const AddressesCard: FC<Props> = ({ account }) => {
  return (
    <Styled.Card>
      <Styled.CardContent>
        <List>
          <AddressItem
            label="Avalanche C-Chain"
            Icon={CChainIcon}
            address={account.addressC}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Avalanche X-Chain"
            Icon={XPChainIcon}
            address={account.addressAVM}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Bitcoin"
            Icon={BitcoinColorIcon}
            address={account.addressBTC}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Ethereum"
            Icon={EthereumColorIcon}
            address={account.addressC}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Solana"
            Icon={SolanaColorIcon}
            address={account.addressSVM}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
        </List>
      </Styled.CardContent>
    </Styled.Card>
  );
};
