import { SolanaAddressEnabler } from '@/components/Address';
import { AddressItem } from '@/components/Address/AddressItem';
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
import { useHistory } from 'react-router-dom';
import { getNavigateToQRCode } from '../../QRCode/utils';
import * as Styled from '../../Styled';
import { QRCodeIconButton } from './QRCodeIconButton';

type Props = {
  account: Account;
};

const TRUNCATE_LENGTH = 16;

export const AddressesCard: FC<Props> = ({ account }) => {
  const history = useHistory();
  const getNavigate = getNavigateToQRCode(history.push, account.id);
  return (
    <Styled.Card>
      <Styled.CardContent>
        <List disablePadding>
          <AddressItem
            label="Avalanche C-Chain"
            Icon={
              <QRCodeIconButton onClick={getNavigate('C')}>
                <CChainIcon />
              </QRCodeIconButton>
            }
            address={account.addressC}
            copyActionVisibility="always"
            truncate={TRUNCATE_LENGTH}
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Avalanche X/P-Chain"
            Icon={
              <QRCodeIconButton onClick={getNavigate('AVM')}>
                <XPChainIcon />
              </QRCodeIconButton>
            }
            address={account.addressAVM}
            copyActionVisibility="always"
            truncate={TRUNCATE_LENGTH}
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Bitcoin"
            Icon={
              <QRCodeIconButton onClick={getNavigate('BTC')}>
                <BitcoinColorIcon />
              </QRCodeIconButton>
            }
            address={account.addressBTC}
            copyActionVisibility="always"
            truncate={TRUNCATE_LENGTH}
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Ethereum"
            Icon={
              <QRCodeIconButton onClick={getNavigate('C')}>
                <EthereumColorIcon />
              </QRCodeIconButton>
            }
            address={account.addressC}
            copyActionVisibility="always"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Solana"
            Icon={
              <QRCodeIconButton onClick={getNavigate('SVM')}>
                <SolanaColorIcon />
              </QRCodeIconButton>
            }
            address={account.addressSVM}
            copyActionVisibility="always"
            truncate={TRUNCATE_LENGTH}
            AddressEnabler={SolanaAddressEnabler}
          />
        </List>
      </Styled.CardContent>
    </Styled.Card>
  );
};
