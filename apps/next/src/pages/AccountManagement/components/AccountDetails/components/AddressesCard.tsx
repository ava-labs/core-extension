import { AddressItem } from '@/pages/AccountManagement/components/AddressItem/AddressItem';
import {
  BitcoinColorIcon,
  CChainIcon,
  EthereumColorIcon,
  List,
  SolanaColorIcon,
  XPChainIcon,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { History } from 'history';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { QRCodeIconButton } from '../../QRCodeIconButton';
import * as Styled from '../../Styled';

type Props = {
  account: Account;
};

const getNavigateToQRCode =
  (history: History, accountId: string, chain: string) => () =>
    history.push({
      pathname: '/account-management/qr-code',
      search: new URLSearchParams({ accountId, chain }).toString(),
    });

export const AddressesCard: FC<Props> = ({ account }) => {
  const history = useHistory();
  return (
    <Styled.Card>
      <Styled.CardContent>
        <List>
          <AddressItem
            label="Avalanche C-Chain"
            Icon={
              <QRCodeIconButton
                onClick={getNavigateToQRCode(history, account.id, 'CChain')}
              >
                <CChainIcon />
              </QRCodeIconButton>
            }
            address={account.addressC}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Avalanche X-Chain"
            Icon={
              <QRCodeIconButton
                onClick={getNavigateToQRCode(history, account.id, 'XChain')}
              >
                <XPChainIcon />
              </QRCodeIconButton>
            }
            address={account.addressAVM}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Bitcoin"
            Icon={
              <QRCodeIconButton
                onClick={getNavigateToQRCode(history, account.id, 'BTC')}
              >
                <BitcoinColorIcon />
              </QRCodeIconButton>
            }
            address={account.addressBTC}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Ethereum"
            Icon={
              <QRCodeIconButton
                onClick={getNavigateToQRCode(history, account.id, 'ETH')}
              >
                <EthereumColorIcon />
              </QRCodeIconButton>
            }
            address={account.addressC}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
          <Styled.Divider variant="inset" component="li" />
          <AddressItem
            label="Solana"
            Icon={
              <QRCodeIconButton
                onClick={getNavigateToQRCode(history, account.id, 'SOL')}
              >
                <SolanaColorIcon />
              </QRCodeIconButton>
            }
            address={account.addressAVM}
            copyActionVisibility="always"
            labelVariant="titleBold"
          />
        </List>
      </Styled.CardContent>
    </Styled.Card>
  );
};
