import { AvatarProps, Theme } from '@avalabs/k2-alpine';
import { isPchainNetwork, isXchainNetwork } from '@core/common';
import { Network } from '@core/types';
import pChainLightMode from '../assets/pChainLight.svg';
import pChainDarkMode from '../assets/pChainDark.svg';
import xChainLightMode from '../assets/xChainLight.svg';
import xChainDarkMode from '../assets/xChainDark.svg';
import { i18n } from 'webextension-polyfill';

type GetBadgeProps = {
  badge?: AvatarProps;
  override?: {
    network?: Network;
  };
  theme: Theme;
};
export const getBadgeProps = ({
  badge = {},
  override,
  theme,
}: GetBadgeProps) => {
  const { network } = override || {};
  const isLightMode = theme.palette.mode === 'light';

  if (!network) {
    return {
      ...badge,
    };
  }

  if (isPchainNetwork(network)) {
    return {
      ...badge,
      src: isLightMode ? pChainLightMode : pChainDarkMode,
      alt: i18n.getMessage('Avalanche P-Chain'),
    };
  }
  if (isXchainNetwork(network)) {
    return {
      ...badge,
      src: isLightMode ? xChainLightMode : xChainDarkMode,
      alt: i18n.getMessage('Avalanche X-Chain'),
    };
  }

  return {
    ...badge,
  };
};
