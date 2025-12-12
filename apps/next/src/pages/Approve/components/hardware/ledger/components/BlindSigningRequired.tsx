import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { StateComponentProps } from '../types';
import { ErrorState } from './ErrorState';

export const BlindSigningRequired: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();

  if (state.state !== 'blind-signing-required') {
    return null;
  }

  return (
    <ErrorState
      title={t('Blind signing required')}
      description={t(
        'Please go to {{appName}} app settings on your Ledger device and enable blind signing',
        {
          appName: state.requiredApp,
        },
      )}
    />
  );
};
