import { useHistory } from 'react-router-dom';
import { NetworkCard } from './common/NetworkCard';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-components';

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
    <NetworkCard
      data-testid="see-all-networks-button"
      sx={{
        width: '100%',
        textAlign: 'center',
      }}
      onClick={(e) => {
        e.stopPropagation();
        history.push(`/networks?activeTab=${NetworkTab.All}`);
      }}
    >
      {t('View All Networks')}
    </NetworkCard>
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
