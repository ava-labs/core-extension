import { useTranslation } from 'react-i18next';

import { AUTO_QUOTE_ID } from '../../../fusion-config';
import { FC, useMemo } from 'react';
import { Box, getHexAlpha, useTheme } from '@avalabs/k2-alpine';
import { HiOutlineSparkles } from 'react-icons/hi2';

export const useAutomaticQuote = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    return {
      id: AUTO_QUOTE_ID,
      aggregatorName: t('Auto'),
      amountOut: t('Best price available'),
      aggregatorLogo: <AutomaticQuoteLogo />,
    };
  }, [t]);
};

const AutomaticQuoteLogo: FC = () => {
  const theme = useTheme();

  return (
    <Box
      width={32}
      height={32}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: getHexAlpha(theme.palette.primary.main, 10),
        borderRadius: '50%',
      }}
    >
      <HiOutlineSparkles size={24} />
    </Box>
  );
};
