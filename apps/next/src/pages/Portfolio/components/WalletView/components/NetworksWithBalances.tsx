import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { NetworkAvatar } from '@/pages/Settings/components/NetworkManagement/components/NetworkAvatar/NetworkAvatar';
import { Avatar, Box, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { ChainId } from '@avalabs/core-chains-sdk';
import { Account, Network } from '@core/types';
import { useNetworkContext } from '@core/ui';
import { FC, useMemo } from 'react';
import { isPchainNetwork, isXchainNetwork } from '@core/common';
import { NetworkVMType } from '@avalabs/vm-module-types';

import DarkP from '@/images/chain-logos/p_chain_dark.svg';
import LightP from '@/images/chain-logos/p_chain_light.svg';
import DarkX from '@/images/chain-logos/x_chain_dark.svg';
import LightX from '@/images/chain-logos/x_chain_light.svg';

interface Props {
  account: Account;
}

const NETWORK_PRIORITY = [
  ChainId.AVALANCHE_MAINNET_ID, // C-chain mainnet
  ChainId.AVALANCHE_TESTNET_ID, // C-chain testnet (Fuji)
  ChainId.AVALANCHE_P, // P-chain mainnet
  ChainId.AVALANCHE_TEST_P, // P-chain testnet
  ChainId.AVALANCHE_X, // X-chain mainnet
  ChainId.AVALANCHE_TEST_X, // X-chain testnet
  ChainId.BITCOIN, // Bitcoin mainnet
  ChainId.BITCOIN_TESTNET, // Bitcoin testnet
  ChainId.ETHEREUM_HOMESTEAD, // Ethereum mainnet
  ChainId.ETHEREUM_TEST_SEPOLIA, // Ethereum testnet (Sepolia)
  ChainId.SOLANA_MAINNET_ID, // Solana mainnet
  ChainId.SOLANA_DEVNET_ID, // Solana devnet
];

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

export const NetworksWithBalances: FC<Props> = ({ account }) => {
  const theme = useTheme();
  const tokens = useTokensForAccount(account);
  const { getNetwork } = useNetworkContext();

  const networkIds = useMemo(
    () =>
      tokens.reduce((acc, token) => {
        const networkId = token.coreChainId;
        if (!acc.includes(networkId)) {
          acc.push(networkId);
        }
        return acc;
      }, [] as number[]),
    [tokens],
  );

  const sortedNetworks = useMemo(() => {
    const networks = networkIds
      .map((networkId) => getNetwork(networkId))
      .filter((network) => !!network);

    return networks.sort((a, b) => {
      const aIndex = NETWORK_PRIORITY.indexOf(a.chainId);
      const bIndex = NETWORK_PRIORITY.indexOf(b.chainId);

      // If both are in priority list, sort by priority
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only a is in priority list, a comes first
      if (aIndex !== -1) return -1;
      // If only b is in priority list, b comes first
      if (bIndex !== -1) return 1;
      // If neither is in priority list, maintain original order
      return 0;
    });
  }, [networkIds, getNetwork]);

  const visibleNetworks = sortedNetworks.slice(0, MAX_VISIBLE_NETWORKS);
  const remainingCount = sortedNetworks.length - MAX_VISIBLE_NETWORKS;

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
