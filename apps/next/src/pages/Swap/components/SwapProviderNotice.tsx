import {
  AvalancheHorizontalIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { SwapProviders } from '@core/ui';

import JupiterLogoLight from '@/images/swap-providers/jupiter-logo-light.svg';
import JupiterLogoDark from '@/images/swap-providers/jupiter-logo-dark.svg';
import VeloraLogoLight from '@/images/swap-providers/velora-logo-light.svg';
import VeloraLogoDark from '@/images/swap-providers/velora-logo-dark.svg';

import { useSwapState } from '../contexts';

export const SwapProviderNotice = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLightTheme = theme.palette.mode === 'light';

  const { provider } = useSwapState();

  // Depending on the logo, we align the text differently to best match the logo's design.
  const needsPadding =
    provider !== SwapProviders.PARASWAP && provider !== SwapProviders.JUPITER;
  const paddingTop = needsPadding ? 0.5 : 0;

  const imgLogoSrc = getLogoSrc(provider, isLightTheme);

  return (
    <Stack
      direction="row"
      alignItems="center"
      textAlign="center"
      color="text.secondary"
      justifyContent="center"
      gap={0.5}
    >
      <Typography variant="caption" pt={paddingTop}>
        {t('Powered by')}
      </Typography>
      {imgLogoSrc ? (
        <img style={{ opacity: 0.75 }} src={imgLogoSrc} alt={provider} />
      ) : (
        <AvalancheHorizontalIcon size={80} />
      )}
    </Stack>
  );
};

const getLogoSrc = (
  provider: SwapProviders | undefined,
  isLightTheme: boolean,
) => {
  if (provider === SwapProviders.PARASWAP) {
    return isLightTheme ? VeloraLogoLight : VeloraLogoDark;
  }
  if (provider === SwapProviders.JUPITER) {
    return isLightTheme ? JupiterLogoLight : JupiterLogoDark;
  }
  return '';
};
