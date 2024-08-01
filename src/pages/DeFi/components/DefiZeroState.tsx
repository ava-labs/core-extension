import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  StackProps,
  Typography,
} from '@avalabs/core-k2-components';

import { openNewTab } from '@src/utils/extensionUtils';

export const DefiZeroState = (props: StackProps) => {
  const { t } = useTranslation();

  const handleExploreClick = useCallback(
    () =>
      openNewTab({
        url: 'https://core.app/discover/',
      }),
    []
  );

  return (
    <Stack sx={{ mt: 9, gap: 1, alignItems: 'center' }} {...props}>
      <Typography variant="h5">{t('No DeFi Transactions')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('Discover top dApps on Avalanche now.')}
      </Typography>
      <Button
        color="primary"
        size="large"
        onClick={handleExploreClick}
        sx={{ mt: 1 }}
      >
        {t('Explore Ecosystem')}
      </Button>
    </Stack>
  );
};
