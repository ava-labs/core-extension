import { useTranslation } from 'react-i18next';
import { Box } from '@avalabs/k2-alpine';
import { useMemo } from 'react';
import { HighlightBannerConfig } from './types';
import stakingIcon from './assets/staking.svg';
import bridgeIcon from './assets/bridge.svg';
import swapIcon from './assets/swap.svg';
import earnIcon from './assets/earn.svg';

const BannerIcon = ({
  src,
  glowColor,
  iconWidth = 48,
  glowSize = 80,
}: {
  src: string;
  glowColor: string;
  iconWidth?: number;
  glowSize?: number;
}) => (
  <Box
    sx={{
      width: 60,
      height: 48,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        width: glowSize,
        height: glowSize,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor} 0%, ${glowColor}50 15%, ${glowColor}20 35%, ${glowColor}08 50%, transparent 70%)`,
        filter: 'blur(8px)',
      }}
    />
    <Box
      component="img"
      src={src}
      alt=""
      sx={{
        position: 'relative',
        width: iconWidth,
        height: 'auto',
        objectFit: 'contain',
      }}
    />
  </Box>
);

export const useHighlightBanners = (): HighlightBannerConfig[] => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        id: 'staking',
        title: t('Earn rewards by staking AVAX.'),
        description: t('Delegate in seconds.'),
        icon: (
          <BannerIcon src={stakingIcon} glowColor="#FCC118" iconWidth={54} />
        ),
        action: {
          type: 'external' as const,
          url: 'https://core.app/stake/',
        },
      },
      {
        id: 'bridge',
        title: t('Move assets to Avalanche.'),
        description: t('Fast. Secure. Free gas.'),
        icon: (
          <BannerIcon
            src={bridgeIcon}
            glowColor="#8BFB5A"
            iconWidth={38}
            glowSize={95}
          />
        ),
        action: {
          type: 'external' as const,
          url: 'https://core.app/bridge/',
        },
      },
      {
        id: 'swap',
        title: t('Swap anything. Anywhere.'),
        description: t('Every token in one place.'),
        icon: <BannerIcon src={swapIcon} glowColor="#4DA8FF" iconWidth={54} />,
        action: {
          type: 'external' as const,
          url: 'https://core.app/swap/',
        },
      },
      {
        id: 'yield',
        title: t('Earn real yield in seconds.'),
        description: t('Put your crypto to work.'),
        icon: <BannerIcon src={earnIcon} glowColor="#AEF319" iconWidth={62} />,
        action: {
          type: 'external' as const,
          url: 'https://core.app/earn/',
        },
      },
    ],
    [t],
  );
};
