import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { StateComponentProps } from '../types';
import { ErrorState } from './ErrorState';

export const IncorrectApp: FC<StateComponentProps> = ({ state }) => {
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
    />
  );
};
