import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  SelectChangeEvent,
  SolanaColorIcon,
  Typography,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { History } from 'history';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { AddressType, getNavigateToQRCode } from '../../utils';
import { ArrowDownIcon, FixedXPChainIcon } from './components/Icons';
import * as Styled from './components/Styled';

type Props = {
  type: AddressType;
  account: Account;
};

const getOnAddressChange = (replace: History['replace'], accountId: string) => {
  const getNavigate = getNavigateToQRCode(replace, accountId);
  return (e: SelectChangeEvent<unknown>) => {
    getNavigate(e.target.value as AddressType)();
  };
};

const ICON_SIZE = 20;

export const AddressSelector: FC<Props> = ({ type, account }) => {
  const { replace } = useHistory();

  return (
    <Styled.Select
      label=""
      fullWidth
      size="small"
      IconComponent={ArrowDownIcon}
      value={type}
      onChange={getOnAddressChange(replace, account.id)}
    >
      <Styled.HidingMenuItem
        value={'C' satisfies AddressType}
        disabled={!account.addressC}
      >
        <AvalancheColorIcon size={ICON_SIZE} />
        <Typography variant="subtitle1">Avalanche C-Chain / EVM</Typography>
      </Styled.HidingMenuItem>
      <Styled.HidingMenuItem
        value={'AVM' satisfies AddressType}
        disabled={!account.addressAVM}
      >
        <FixedXPChainIcon size={ICON_SIZE} />
        <Typography variant="subtitle1">Avalanche X/P-Chain</Typography>
      </Styled.HidingMenuItem>
      <Styled.HidingMenuItem
        value={'BTC' satisfies AddressType}
        disabled={!account.addressBTC}
      >
        <BitcoinColorIcon size={ICON_SIZE} />
        <Typography variant="subtitle1">Bitcoin Network</Typography>
      </Styled.HidingMenuItem>
      <Styled.HidingMenuItem
        value={'SVM' satisfies AddressType}
        disabled={!account.addressSVM}
      >
        <SolanaColorIcon size={ICON_SIZE} />
        <Typography variant="subtitle1">Solana Network</Typography>
      </Styled.HidingMenuItem>
    </Styled.Select>
  );
};
