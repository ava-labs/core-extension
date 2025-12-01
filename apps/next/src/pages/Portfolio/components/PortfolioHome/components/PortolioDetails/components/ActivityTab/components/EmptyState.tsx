import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const EmptyState: FC = () => {
  const { t } = useTranslation();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      pt={10}
      px={4}
      textAlign="center"
    >
      <Box mx="auto" fontSize={32} lineHeight="21px" pb={2.25}>
        😒
      </Box>
      <Typography variant="subtitle3" color="text.primary">
        {t('No recent transactions')}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t('Interact with this token onchain and see your activity here')}
      </Typography>
    </Stack>
  );
};
