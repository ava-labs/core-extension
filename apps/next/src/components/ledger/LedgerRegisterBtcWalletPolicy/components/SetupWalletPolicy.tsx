import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Stack } from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { PolicyRegistrationState } from '../types';
import { DetailRow } from './DetailRow';
import { StatusCard } from './StatusCard';

const POLICY_DESCRIPTOR = 'wpkh(@0/**)';

export const SetupWalletPolicy: FC<PolicyRegistrationState> = ({
  policyName,
  status,
}) => {
  const { t } = useTranslation();

  return (
    <Stack gap={1} width="100%">
      <Card>
        <Stack divider={<Divider />}>
          <DetailRow label={t('Name')} value={policyName ?? ''} />
          <DetailRow label={t('Policy')} value={POLICY_DESCRIPTOR} />
        </Stack>
      </Card>
      <StatusCard status={status} />
    </Stack>
  );
};
