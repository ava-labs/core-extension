import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/Card';

import { PolicyRegistrationState } from '../types';
import { DetailRow } from './DetailRow';
import { StatusCard } from './StatusCard';

export const ConfirmPublicKey: FC<PolicyRegistrationState> = ({
  policyDerivationPath,
  status,
}) => {
  const { t } = useTranslation();

  return (
    <Stack gap={1} width="100%">
      <Card>
        <DetailRow label={t('Path')} value={policyDerivationPath ?? ''} />
      </Card>
      <StatusCard status={status} />
    </Stack>
  );
};
