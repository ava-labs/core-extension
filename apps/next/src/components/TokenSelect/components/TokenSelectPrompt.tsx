import { useTranslation } from 'react-i18next';
import { Box, ChevronRightIcon, Typography } from '@avalabs/k2-alpine';

export const TokenSelectPrompt = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="subtitle3">{t('Select token')}</Typography>
      <Box width={16} height={16} display="flex" flexShrink={0}>
        <ChevronRightIcon size={16} />
      </Box>
    </>
  );
};
