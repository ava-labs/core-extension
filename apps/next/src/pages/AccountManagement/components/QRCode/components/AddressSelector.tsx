import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  ChevronDownIcon,
  Select as K2Select,
  MenuItem,
  SelectChangeEvent,
  SolanaColorIcon,
  Typography,
  XPChainIcon,
  listItemClasses,
  listItemIconClasses,
  selectClasses,
  styled,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { History } from 'history';
import { FC } from 'react';
import { IconBaseProps } from 'react-icons';
import { useHistory } from 'react-router-dom';
import { AddressType, getNavigateToQRCode } from '../utils';

type Props = {
  type: AddressType;
  account: Account;
};

const HidingMenuItem = styled(MenuItem)(({ disabled, theme }) => ({
  display: disabled ? 'none' : undefined,
  gap: theme.spacing(1.25),
}));

const Select = styled(K2Select)(({ theme }) => ({
  [`&.${selectClasses.root}`]: {
    width: 220,
    borderRadius: theme.shape.fullBorderRadius,
    paddingBlock: theme.spacing(0.5),
    paddingInline: theme.spacing(1),
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.surface.primary
        : theme.palette.background.paper,
  },

  [`& .${selectClasses.select}`]: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
  },

  [`& .${listItemClasses.root}`]: {
    padding: theme.spacing(0),
    gap: theme.spacing(1),
  },

  [`& .${listItemIconClasses.root}`]: {
    minWidth: 'unset',
  },
}));

const getOnAddressChange = (history: History, accountId: string) => {
  const navigate = getNavigateToQRCode.bind(null, history.replace, accountId);
  return (e: SelectChangeEvent<unknown>) => {
    navigate(e.target.value as AddressType)();
  };
};

const ICON_SIZE = 20;

const IconComponent: FC = () => <ChevronDownIcon fontSize={20} />;
const FixedXPChainIcon: FC<IconBaseProps> = (props) => (
  <XPChainIcon {...props} viewBox="0 0 24 24" />
);

export const AddressSelector: FC<Props> = ({ type, account }) => {
  const history = useHistory();

  return (
    <Select
      label=""
      fullWidth
      size="small"
      IconComponent={IconComponent}
      value={type}
      onChange={getOnAddressChange(history, account.id)}
    >
      <HidingMenuItem
        value={'C' satisfies AddressType}
        disabled={!account.addressC}
      >
        <AvalancheColorIcon size={ICON_SIZE} />
        <Typography variant="subtitle1">Avalanche C-Chain / EVM</Typography>
      </HidingMenuItem>
      <HidingMenuItem
        value={'AVM' satisfies AddressType}
        disabled={!account.addressAVM}
      >
        <FixedXPChainIcon size={ICON_SIZE} />
        <Typography variant="subtitle1">Avalanche X/P-Chain</Typography>
      </HidingMenuItem>
      <HidingMenuItem
        value={'BTC' satisfies AddressType}
        disabled={!account.addressBTC}
      >
        <BitcoinColorIcon size={ICON_SIZE} />
        <Typography variant="subtitle1">Bitcoin Network</Typography>
      </HidingMenuItem>
      <HidingMenuItem
        value={'SVM' satisfies AddressType}
        disabled={!account.addressSVM}
      >
        <SolanaColorIcon size={ICON_SIZE} />
        <Typography variant="subtitle1">Solana Network</Typography>
      </HidingMenuItem>
    </Select>
  );
};
