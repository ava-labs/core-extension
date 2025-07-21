import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { ChainLogoList } from '@/components/ChainLogoList';

export const CChainDisclaimer = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={0.75} px={2.5}>
      <ChainLogoList size={20} />
      <Typography variant="caption" color="text.secondary" align="center">
        {t(
          'This address supports receiving tokens and NFTs on Avalanche C-Chain, Ethereum, Base, Arbitrum, Optimism and Avalanche L1s',
        )}
      </Typography>
    </Stack>
  );
};
