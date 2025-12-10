import { Avatar, useTheme, type SxProps } from '@avalabs/k2-alpine';
import { Network } from '@core/types';
import { memo } from 'react';
import brokenNetworkLogoLight from './assets/brokenNetworkLogoLight.svg';
import brokenNetworkLogoDark from './assets/brokenNetworkLogoDark.svg';
import { useTranslation } from 'react-i18next';

type ChainAvatarProps = {
  network: Network;
  sx?: SxProps;
};

/**
 * ChainAvatar renders an avatar for a blockchain network/chain.
 * This has the fallback logo for the network in case the network logo is not available.
 *
 * @param chain - The chain information object containing logos and metadata
 * @param sx - Optional styling props to customize the avatar appearance
 * @returns JSX element or null if no chain is provided
 */
export const NetworkAvatar = memo(function NetworkAvatar({
  network,
  sx,
}: ChainAvatarProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const isLightMode = theme.palette.mode === 'light';

  return (
    <Avatar
      src={network.logoUri}
      alt={network.chainName}
      sx={{
        ...sx,
        backgroundColor: theme.palette.datePicker.hover,
      }}
    >
      <img
        src={isLightMode ? brokenNetworkLogoLight : brokenNetworkLogoDark}
        alt={t('Broken Network Logo')}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Avatar>
  );
});
