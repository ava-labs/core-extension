import {
  Stack,
  useTheme,
  getHexAlpha,
  CChainIcon,
  XPChainIcon,
  SolanaColorIcon,
  EthereumColorIcon,
  BitcoinColorIcon,
  styled,
} from '@avalabs/k2-alpine';
import { AddressItem } from '@/components/Address/AddressItem';
import { Divider } from '@/pages/AccountManagement/components/Styled';
import { Account } from '@core/types';
import { UniqueIdIcon } from '@/components/UniqueIdIcon';

interface AddressListContainerProps {
  listBackground: string;
  top?: number | string;
}

const AddressListContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'listBackground' && prop !== 'top',
})<AddressListContainerProps>(({ theme, listBackground, top }) => ({
  position: 'absolute',
  backdropFilter: 'blur(15px)',
  top: top ?? theme.spacing(4.5),
  left: theme.spacing(0.5),
  width: '260px',
  background: listBackground,
  border: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
  borderRadius: '10px',
  isolation: 'isolate',
  opacity: 0,
  transform: 'scale(0.75)',
  transformOrigin: 'top left',
  transition:
    'opacity 0.2s ease-in-out, transform 0.2s ease-in-out, visibility 0.2s',
  visibility: 'hidden',
}));

//UniqueIdIcon is needed to avoid logo id conflicts which cause the logo to not be displayed
export const AddressList = ({
  activeAccount,
  top,
  className,
}: {
  activeAccount?: Account;
  top?: number | string;
  className?: string;
}) => {
  const theme = useTheme();
  const listBackground =
    theme.palette.mode === 'dark'
      ? theme.palette.neutral['850_90']
      : theme.palette.common['white_60'];
  return (
    <AddressListContainer
      className={className}
      zIndex={theme.zIndex.tooltip}
      listBackground={listBackground}
      top={top}
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
    </AddressListContainer>
  );
};
