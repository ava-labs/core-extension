import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@avalabs/k2-alpine';

import { useLedgerPolicyRegistrationState } from '@/contexts';

import { StateComponentProps } from '../types';
import { ErrorState } from './ErrorState';

export const BtcPolicyNeeded: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();
  const { retry } = useLedgerPolicyRegistrationState();

  if (state.state !== 'btc-policy-needed') {
    return null;
  }

  return (
    <ErrorState
      title={t('Action required')}
      description={t(
        'Ledger requires you to set up a wallet policy in the Bitcoin app. Please open the Bitcoin app on your Ledger device and follow the instructions.',
      )}
      action={
        <Button
          size="extension"
          variant="contained"
          color="primary"
          onClick={retry}
        >
          {t('Retry')}
        </Button>
      }
    />
  );
};
