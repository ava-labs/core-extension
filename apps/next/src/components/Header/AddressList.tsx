import {
  Stack,
  useTheme,
  getHexAlpha,
  CChainIcon,
  XPChainIcon,
  SolanaColorIcon,
  EthereumColorIcon,
  BitcoinColorIcon,
  Grow,
} from '@avalabs/k2-alpine';
import { AddressItem } from '@/components/Address/AddressItem';
import { Divider } from '@/pages/AccountManagement/components/Styled';
import { Account } from '@core/types';

export const AddressList = ({
  isAddressAppear,
  activeAccount,
  onMouseEnter,
  onMouseLeave,
}: {
  isAddressAppear: boolean;
  activeAccount?: Account;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  const theme = useTheme();
  const listBackground =
    theme.palette.mode === 'dark'
      ? theme.palette.neutral['850_90']
      : theme.palette.common['white_60'];
  return (
    <Grow in={isAddressAppear}>
      <Stack
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{
          position: 'absolute',
          backdropFilter: 'blur(15px)',
          top: theme.spacing(4.5),
          left: theme.spacing(0.5),
          width: '260px',
          background: listBackground,
          border: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
          borderRadius: '10px',
        }}
      >
        <AddressItem
          label="Avalanche C-Chain"
          Icon={CChainIcon}
          address={activeAccount?.addressC}
        />
        <Divider variant="inset" />
        <AddressItem
          label="Avalanche X/P-Chain"
          Icon={XPChainIcon}
          address={activeAccount?.addressAVM}
        />
        <Divider variant="inset" />
        <AddressItem
          label="Bitcoin"
          Icon={BitcoinColorIcon}
          address={activeAccount?.addressBTC}
        />
        <Divider variant="inset" />
        <AddressItem
          label="Ethereum"
          Icon={EthereumColorIcon}
          address={activeAccount?.addressC}
        />
        <Divider variant="inset" />
        <AddressItem
          label="Solana"
          Icon={SolanaColorIcon}
          address={activeAccount?.addressSVM}
        />
      </Stack>
    </Grow>
  );
};
