import { Box, Stack, Typography } from '@avalabs/k2-alpine';
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
      py={9.75}
      px={8.5}
      textAlign="center"
    >
      <Box mx="auto" fontSize={32} pb={2.5}>
        {hasSearchQuery ? '🕵️‍♂️' : '🚀'}
      </Box>
      <Typography variant="subtitle3" color="text.primary" lineHeight="21px">
        {hasSearchQuery
          ? t('No matching sites found')
          : t('No connected sites')}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {hasSearchQuery
          ? t('Try adjusting your search terms')
          : t('When you connect to a dApp, it will appear here')}
      </Typography>
    </Stack>
  );
};
