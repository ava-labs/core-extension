import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  REQUIRED_FIRMWARE_VERSION_FOR_XP_SIGNING,
  StateComponentProps,
} from '../types';
import { ErrorState } from './ErrorState';
import { Button, OutboundIcon } from '@avalabs/k2-alpine';
import { openNewTab } from '@core/common';

export const IncorrectVersionForXP: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();
  if (state !== 'incorrect-version-for-xp') {
    return null;
  }

  return (
    <ErrorState
      title={t('Update Required')}
      description={t(
        'Signing X-P Chain transactions requires firmware version {{version}} or higher.',
        {
          version: REQUIRED_FIRMWARE_VERSION_FOR_XP_SIGNING,
        },
      )}
      action={
        <Button
          variant="contained"
          color="primary"
          size="extension"
          endIcon={<OutboundIcon size={16} />}
          onClick={() =>
            openNewTab({
              url: 'https://keyst.one/firmware',
            })
          }
        >
          {t('Visit Keystone to Update')}
        </Button>
      }
    />
  );
};
