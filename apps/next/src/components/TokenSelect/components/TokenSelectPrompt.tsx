import { useTranslation } from 'react-i18next';
import { Box, ArrowRightIcon, Typography, useTheme } from '@avalabs/k2-alpine';

export const TokenSelectPrompt = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Typography variant="subtitle3">{t('Select token')}</Typography>
      <Box width={20} height={20} display="flex" flexShrink={0}>
        <ArrowRightIcon size={20} color={theme.palette.text.secondary} />
      </Box>
    </>
  );
};
