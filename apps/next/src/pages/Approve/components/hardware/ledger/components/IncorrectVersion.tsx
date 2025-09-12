import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { StateComponentProps } from '../types';
import { ErrorState } from './ErrorState';

export const IncorrectVersion: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();
  if (state.state !== 'incorrect-version') {
    return null;
  }

  return (
    <ErrorState
      title={t('Update Required')}
      description={t(
        'Please update the {{appName}} app on your Ledger device to {{version}} or higher to be able to continue',
        {
          appName: state.requiredApp,
          version: state.requiredVersion,
        },
      )}
    />
  );
};
