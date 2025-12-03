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
import { UniqueIdIcon } from '@/components/UniqueIdIcon';

//UniqueIdIcon is needed to avoid logo id conflicts which cause the logo to not be displayed

export const AddressList = ({
  isAddressAppear,
  activeAccount,
  onMouseEnter,
  onMouseLeave,
  top,
}: {
  isAddressAppear: boolean;
  activeAccount?: Account;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  top?: number | string;
}) => {
  const theme = useTheme();
  const listBackground =
    theme.palette.mode === 'dark'
      ? theme.palette.neutral['850_90']
      : theme.palette.common['white_60'];
  return (
    <Grow in={isAddressAppear}>
      <Stack
        zIndex={theme.zIndex.tooltip}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{
          position: 'absolute',
          backdropFilter: 'blur(15px)',
          top: top ?? theme.spacing(4.5),
          left: theme.spacing(0.5),
          width: '260px',
          background: listBackground,
          border: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
          borderRadius: '10px',
          isolation: 'isolate',
        }}
      >
        <AddressItem
          label="Avalanche C-Chain"
          Icon={<UniqueIdIcon icon={<CChainIcon />} />}
          address={activeAccount?.addressC}
        />
        <Divider variant="inset" />
        <AddressItem
          label="Avalanche X/P-Chain"
          Icon={<UniqueIdIcon icon={<XPChainIcon />} />}
          address={activeAccount?.addressAVM}
        />
        <Divider variant="inset" />
        <AddressItem
          label="Bitcoin"
          Icon={<UniqueIdIcon icon={<BitcoinColorIcon />} />}
          address={activeAccount?.addressBTC}
        />
        <Divider variant="inset" />
        <AddressItem
          label="Ethereum"
          Icon={<UniqueIdIcon icon={<EthereumColorIcon />} />}
          address={activeAccount?.addressC}
        />
        <Divider variant="inset" />
        <AddressItem
          label="Solana"
          Icon={<UniqueIdIcon icon={<SolanaColorIcon />} />}
          address={activeAccount?.addressSVM}
        />
      </Stack>
    </Grow>
  );
};
