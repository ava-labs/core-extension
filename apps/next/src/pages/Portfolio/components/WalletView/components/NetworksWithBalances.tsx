import { NetworkAvatar } from '@/pages/Settings/components/NetworkManagement/components/NetworkAvatar/NetworkAvatar';
import { Avatar, Box, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { Network, NetworkWithCaipId } from '@core/types';
import { FC } from 'react';
import { isPchainNetwork, isXchainNetwork } from '@core/common';
import { NetworkVMType } from '@avalabs/vm-module-types';

import DarkP from '@/images/chain-logos/p_chain_dark.svg';
import LightP from '@/images/chain-logos/p_chain_light.svg';
import DarkX from '@/images/chain-logos/x_chain_dark.svg';
import LightX from '@/images/chain-logos/x_chain_light.svg';

interface Props {
  networksWithBalance: NetworkWithCaipId[];
}

const MAX_VISIBLE_NETWORKS = 6;

type XP_VMs = NetworkVMType.AVM | NetworkVMType.PVM;

const XP_LOGOS: Record<'dark' | 'light', Record<XP_VMs, string>> = {
  dark: {
    [NetworkVMType.AVM]: DarkX,
    [NetworkVMType.PVM]: DarkP,
  },
  light: {
    [NetworkVMType.AVM]: LightX,
    [NetworkVMType.PVM]: LightP,
  },
} as const;

export const NetworksWithBalances: FC<Props> = ({ networksWithBalance }) => {
  const theme = useTheme();

  const visibleNetworks = networksWithBalance.slice(0, MAX_VISIBLE_NETWORKS);
  const remainingCount = networksWithBalance.length - MAX_VISIBLE_NETWORKS;

  const getLogoUri = (network: Network) => {
    if (isPchainNetwork(network) || isXchainNetwork(network)) {
      return XP_LOGOS[theme.palette.mode][network.vmName];
    }
    return network.logoUri;
  };

  const hasNextIcon = (index: number) => index < visibleNetworks.length - 1;

  return (
    <Stack direction="row" alignItems="center">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <mask id="crescent-mask">
            <circle cx="10" cy="10" r="10" fill="white" />
            <circle cx="25" cy="10" r="10" fill="black" />
          </mask>
        </defs>
      </svg>
      {visibleNetworks.map((network, index) => {
        const isXPChain = isPchainNetwork(network) || isXchainNetwork(network);
        const logoUri = getLogoUri(network);
        const shouldClip = hasNextIcon(index);

        return (
          <Box
            key={network.chainId}
            sx={{
              marginLeft: index > 0 ? '-5px' : 0,
              position: 'relative',
              zIndex: index + 1,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(shouldClip && {
                  mask: 'url(#crescent-mask)',
                  WebkitMask: 'url(#crescent-mask)',
                }),
              }}
            >
              {isXPChain ? (
                <Avatar
                  src={logoUri}
                  alt={network.chainName}
                  sx={{ width: 16, height: 16 }}
                />
              ) : (
                <NetworkAvatar
                  network={network}
                  sx={{ width: 16, height: 16 }}
                />
              )}
            </Box>
          </Box>
        );
      })}
      {remainingCount > 0 && (
        <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">
          +{remainingCount} more
        </Typography>
      )}
    </Stack>
  );
};
