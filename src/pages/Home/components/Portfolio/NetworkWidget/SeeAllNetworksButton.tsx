import { useHistory } from 'react-router-dom';
import { NetworkCard } from './common/NetworkCard';
import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/core-k2-components';

import { NetworkTab } from '@src/pages/Networks';

interface SeeAllNetworksButtonProps {
  isFullWidth: boolean;
}

export function SeeAllNetworksButton({
  isFullWidth,
}: SeeAllNetworksButtonProps) {
  const { t } = useTranslation();
  const history = useHistory();

  return isFullWidth ? (
    <Button
      color="secondary"
      size="large"
      data-testid="see-all-networks-button"
      onClick={(e) => {
        e.stopPropagation();
        history.push(`/networks?activeTab=${NetworkTab.All}`);
      }}
      fullWidth
    >
      {t('View All Networks')}
    </Button>
  ) : (
    <NetworkCard
      data-testid="see-all-networks-button"
      sx={{
        width: '164px',
        display: 'inline-block',
        mb: 2,
        p: 2,
      }}
      onClick={() => history.push(`/networks?activeTab=${NetworkTab.All}`)}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold">
          {t('View All Networks')}
        </Typography>
      </Stack>
    </NetworkCard>
  );
}
