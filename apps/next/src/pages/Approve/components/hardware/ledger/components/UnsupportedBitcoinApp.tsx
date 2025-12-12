import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';

import { StateComponentProps } from '../types';
import { ErrorState } from './ErrorState';

export const UnsupportedBitcoinApp: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();

  if (state.state !== 'unsupported-btc-version') {
    return null;
  }

  return (
    <ErrorState
      px={0}
      title={t('Unsupported Bitcoin app')}
      description={
        <Stack gap={1} pt={2}>
          <Typography variant="caption">
            {t(
              'This version of the Bitcoin app ({{ currentVersion }}) is not supported.',
              { currentVersion: state.currentVersion },
            )}
          </Typography>
          <Typography variant="caption">
            <Trans
              i18nKey="You will need to use the backward-compatible<br> <b>Bitcoin Recovery</b> app."
              components={{ b: <b />, br: <br /> }}
            />
          </Typography>
          <Typography variant="caption" mt={2}>
            <Trans i18nKey="Click the button below to understand why and what to do." />
          </Typography>
        </Stack>
      }
      action={
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => alert('link to support page?')}
        >
          {t('Bitcoin Recovery app')}
        </Button>
      }
    />
  );
};
