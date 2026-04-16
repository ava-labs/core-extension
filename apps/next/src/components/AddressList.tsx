import { AddressItem, SolanaAddressEnabler } from '@/components/Address';
import { UniqueIdIcon } from '@/components/UniqueIdIcon';
import { StyledDivider } from '@/components/styled';
import {
  BitcoinColorIcon,
  CChainIcon,
  EthereumColorIcon,
  getHexAlpha,
  SolanaColorIcon,
  Stack,
  styled,
  useTheme,
  withThemeInvert,
  XPChainIcon,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { XPChainAddressEnablerInverted } from './Address';

interface AddressListContainerProps {
  top?: number | string;
  left?: number | string;
}

const AddressListContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'listBackground' && prop !== 'top',
})<AddressListContainerProps>(({ theme, top, left }) => ({
  position: 'absolute',
  backdropFilter: 'blur(15px)',
  top: top ?? theme.spacing(4.5),
  left: left ?? theme.spacing(0.5),
  width: '260px',
  background: theme.palette.background.default,
  border: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
  borderRadius: '10px',
  isolation: 'isolate',
  zIndex: theme.zIndex.tooltip + 1,
  opacity: 0,
  transition: `opacity 150ms ease-out`,
  transitionDelay: '200ms',
  visibility: 'hidden',
  color: theme.palette.text.primary,
}));

type Props = {
  activeAccount?: Account;
  top?: number | string;
  className?: string;
  left?: number | string;
};

//UniqueIdIcon is needed to avoid logo id conflicts which cause the logo to not be displayed
export const AddressList = withThemeInvert<Props>(
  ({ activeAccount, top, className, left }) => {
    const theme = useTheme();
    return (
      <AddressListContainer
        className={className}
        zIndex={theme.zIndex.tooltip}
        top={top}
        left={left}
      >
        <AddressItem
          label="Avalanche C-Chain"
          Icon={<UniqueIdIcon icon={<CChainIcon />} />}
          address={activeAccount?.addressC}
        />
        <StyledDivider variant="inset" />
        <AddressItem
          label="Avalanche X/P-Chain"
          Icon={<UniqueIdIcon icon={<XPChainIcon />} />}
          address={activeAccount?.addressAVM}
          AddressEnabler={XPChainAddressEnablerInverted}
        />
        <StyledDivider variant="inset" />
        <AddressItem
          label="Bitcoin"
          Icon={<UniqueIdIcon icon={<BitcoinColorIcon />} />}
          address={activeAccount?.addressBTC}
        />
        <StyledDivider variant="inset" />
        <AddressItem
          label="Ethereum"
          Icon={<UniqueIdIcon icon={<EthereumColorIcon />} />}
          address={activeAccount?.addressC}
        />
        <StyledDivider variant="inset" />
        <AddressItem
          label="Solana"
          Icon={<UniqueIdIcon icon={<SolanaColorIcon />} />}
          address={activeAccount?.addressSVM}
          AddressEnabler={SolanaAddressEnabler}
        />
      </AddressListContainer>
    );
  },
);
