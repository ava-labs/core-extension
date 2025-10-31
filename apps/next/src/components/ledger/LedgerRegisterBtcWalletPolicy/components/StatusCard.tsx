import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Stack, Typography } from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { PhaseStatus, PolicyRegistrationState, Status } from '../types';
import { DetailRow } from './DetailRow';

export const StatusCard: FC<Pick<PolicyRegistrationState, 'status'>> = ({
  status,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <DetailRow
        label={t('Status')}
        value={<PhaseStatusIndicator phaseStatus={getPhaseStatus(status)} />}
      />
    </Card>
  );
};

const PhaseStatusIndicator: FC<{ phaseStatus: PhaseStatus }> = ({
  phaseStatus,
}) => {
  const { t } = useTranslation();

  if (phaseStatus === 'error') {
    return (
      <Typography variant="body3" color="error.main">
        {t('An error occurred, please try again later')}
      </Typography>
    );
  }
  if (phaseStatus === 'incorrect-device') {
    return (
      <Typography variant="body3" color="error.main">
        {t('This Ledger was not used to create this wallet')}
      </Typography>
    );
  }

  if (phaseStatus === 'pending') {
    return (
      <Stack direction="row" alignItems="end">
        <CircularProgress size={16} />
      </Stack>
    );
  }

  return (
    <Typography variant="body3" color="success">
      {t('Success!')}
    </Typography>
  );
};

const getPhaseStatus = (status: Status): PhaseStatus =>
  status.split(':')[1] as PhaseStatus;
