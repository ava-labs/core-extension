import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useLedgerContext } from '@core/ui';

import { StateComponentProps } from '../types';
import { ErrorState } from './ErrorState';
import { Button } from '@avalabs/k2-alpine';

export const IncorrectApp: FC<StateComponentProps> = ({ state }) => {
  const { refreshActiveApp } = useLedgerContext();
  const { t } = useTranslation();

  if (state.state !== 'incorrect-app') {
    return null;
  }

  return (
    <ErrorState
      title={t('Wrong app')}
      description={t(
        'Please switch to the {{appName}} app on your Ledger device to continue',
        {
          appName: state.requiredApp,
        },
      )}
      action={
        <Button
          size="extension"
          variant="contained"
          color="primary"
          onClick={refreshActiveApp}
        >
          {t('Retry')}
        </Button>
      }
    />
  );
};
