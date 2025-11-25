import { NetworkVMType } from '@avalabs/vm-module-types';
import { PaletteMode, styled, useTheme } from '@avalabs/k2-alpine';

import { useNetworkContext } from '@core/ui';
import { isPchainNetwork, isXchainNetwork } from '@core/common';

import DarkP from '@/images/chain-logos/p_chain_dark.svg';
import LightP from '@/images/chain-logos/p_chain_light.svg';
import DarkX from '@/images/chain-logos/x_chain_dark.svg';
import LightX from '@/images/chain-logos/x_chain_light.svg';

import { SizedAvatar, SizedAvatarProps } from './SizedAvatar';

type ChainAvatarProps = {
  coreChainId: number;
} & SizedAvatarProps;

type XP_VMs = NetworkVMType.AVM | NetworkVMType.PVM;

const XP_LOGOS: Record<PaletteMode, Record<XP_VMs, string>> = {
  dark: {
    [NetworkVMType.AVM]: DarkX,
    [NetworkVMType.PVM]: DarkP,
  },
  light: {
    [NetworkVMType.AVM]: LightX,
    [NetworkVMType.PVM]: LightP,
  },
} as const;

const ChainAvatar = ({ coreChainId, ...props }: ChainAvatarProps) => {
  const theme = useTheme();
  const { getNetwork } = useNetworkContext();

  const network = getNetwork(coreChainId);

  const logoUri =
    isPchainNetwork(network) || isXchainNetwork(network)
      ? XP_LOGOS[theme.palette.mode][network.vmName]
      : network?.logoUri;

  return <SizedAvatar src={logoUri} alt={network?.chainName} {...props} />;
};

export const ChainBadge = styled(ChainAvatar)(({ theme }) => ({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.palette.background.paper,
  backgroundColor: 'transparent',
}));
