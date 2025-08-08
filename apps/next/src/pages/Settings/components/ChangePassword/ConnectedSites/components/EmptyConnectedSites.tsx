import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyConnectedSitesProps {
  hasSearchQuery: boolean;
}

export const EmptyConnectedSites: FC<EmptyConnectedSitesProps> = ({
  hasSearchQuery,
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      py={6}
      px={2}
      textAlign="center"
    >
      <Typography variant="h6" color="text.secondary" mb={1}>
        {hasSearchQuery
          ? t('No matching sites found')
          : t('No connected sites')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {hasSearchQuery
          ? t('Try adjusting your search terms')
          : t('Connect to dApps to see them listed here')}
      </Typography>
    </Stack>
  );
};
