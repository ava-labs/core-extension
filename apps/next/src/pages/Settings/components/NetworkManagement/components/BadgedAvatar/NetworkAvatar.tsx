import { Avatar, type SxProps } from '@avalabs/k2-alpine';
import { isPchainNetwork, isXchainNetwork } from '@core/common';
import { NetworkWithCaipId } from '@core/types';
import { memo, useMemo } from 'react';
import { NetworkBadgedAvatar } from './NetworkBadgedAvatar';

type ChainAvatarProps = {
  network: NetworkWithCaipId;
  sx?: SxProps;
  avatarSx?: SxProps;
  badgeSx?: SxProps;
};

/**
 * ChainAvatar renders an avatar for a blockchain network/chain.
 *
 * For X-Chain and P-Chain networks, it displays a badged avatar showing both the
 * network token logo and the chain logo. For other chains, it displays a simple
 * avatar with the chain's logo.
 *
 * @param chain - The chain information object containing logos and metadata
 * @param sx - Optional styling props to customize the avatar appearance
 * @returns JSX element or null if no chain is provided
 */
export const NetworkAvatar = memo(function NetworkAvatar({
  avatarSx,
  badgeSx,
  network,
  sx,
}: ChainAvatarProps) {
  const isX = useMemo(() => isXchainNetwork(network), [network]);
  const isP = useMemo(() => isPchainNetwork(network), [network]);

  if (!network) {
    return null;
  }

  if (isX || isP) {
    return (
      <NetworkBadgedAvatar
        network={network}
        badge={{ src: network.logoUri, alt: network.chainName, sx: badgeSx }}
        avatar={{
          src: network.networkToken.logoUri,
          alt: network.networkToken.symbol,
          sx: avatarSx,
        }}
        sx={{
          ...sx,
        }}
      />
    );
  }

  return (
    <Avatar
      src={network.logoUri}
      alt={network.chainName}
      sx={{
        ...sx,
      }}
    />
  );
});
