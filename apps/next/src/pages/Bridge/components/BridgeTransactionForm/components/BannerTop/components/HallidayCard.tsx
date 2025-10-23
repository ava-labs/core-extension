import { Card } from '@/components/Card';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const HallidayCard: FC = () => {
  const { t } = useTranslation();
  return (
    <Card noPadding>
      <Stack height={50} direction="row" gap={2} alignItems="center" mx={2}>
        <img
          width={32}
          height={32}
          style={{ objectFit: 'contain' }}
          src="/images/bridge-providers/halliday-icon.png"
          alt="Halliday"
        />
        <Stack>
          <Typography variant="subtitle4">
            {t('Bridge using Halliday')}
          </Typography>
          <Typography variant="caption2" color="text.secondary">
            {t(
              'Buy and bridge USD and other currencies directly to L1s using Halliday',
            )}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
