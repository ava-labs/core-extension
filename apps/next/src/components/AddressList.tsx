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
  withThemeInvert,
} from '@avalabs/k2-alpine';
import { AddressItem } from '@/components/Address/AddressItem';
import { Account } from '@core/types';
import { UniqueIdIcon } from '@/components/UniqueIdIcon';
import { StyledDivider } from '@/components/styled';

interface AddressListContainerProps {
  top?: number | string;
  left?: number | string;
}

const easeOutQuart = 'cubic-bezier(0.25, 1, 0.5, 1)';

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
  opacity: 0,
  transform: 'scale(0.95)',
  transformOrigin: 'top left',
  transition: `transform 200ms ${easeOutQuart}, opacity 150ms ease-out`,
  transitionDelay: '500ms',
  visibility: 'hidden',
  color: theme.palette.text.primary,
}));

//UniqueIdIcon is needed to avoid logo id conflicts which cause the logo to not be displayed
export const AddressList = withThemeInvert(
  <
    T extends {
      activeAccount?: Account;
      top?: number | string;
      className?: string;
      left?: number | string;
    },
  >({
    activeAccount,
    top,
    className,
    left,
  }: T) => {
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
        />
      </AddressListContainer>
    );
  },
);
