import { Avatar, useTheme, type SxProps } from '@avalabs/k2-alpine';
import { Network } from '@core/types';
import { memo, useMemo } from 'react';
import brokenNetworkLogoLight from './assets/brokenNetworkLogoLight.svg';
import brokenNetworkLogoDark from './assets/brokenNetworkLogoDark.svg';
import { useTranslation } from 'react-i18next';

type ChainAvatarProps = {
  network: Network;
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
  network,
  sx,
}: ChainAvatarProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const fallbackLogo = useMemo(() => {
    const isLightMode = theme.palette.mode === 'light';

    if (isLightMode) {
      return (
        <img
          src={brokenNetworkLogoLight}
          alt={t('Broken Network Logo')}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      );
    }
    return (
      <img
        src={brokenNetworkLogoDark}
        alt={t('Broken Network Logo')}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    );
  }, [theme, t]);

  if (!network) {
    return fallbackLogo;
  }

  // Check if we have a valid logo URL

  return (
    <Avatar
      src={network.logoUri}
      alt={network.chainName}
      sx={{
        ...sx,
        backgroundColor: theme.palette.datePicker.hover,
      }}
    >
      {fallbackLogo}
    </Avatar>
  );
});
