import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';

import { StateComponentProps } from '../types';
import { ErrorState } from './ErrorState';
import { FiExternalLink } from 'react-icons/fi';

export const UnsupportedBitcoinApp: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();

  if (state.state !== 'unsupported-btc-version') {
    return null;
  }

  return (
    <ErrorState
      px={2}
      title={t('Unsupported Ledger application')}
      description={
        <Stack gap={1} pt={2}>
          <Typography variant="caption">
            {t(
              'Due to changes from Ledger, your current Bitcoin app (version {{currentVersion}}) is not supported by Core.',
              { currentVersion: state.currentVersion },
            )}
          </Typography>
          <Typography variant="caption">
            <Trans
              i18nKey="To continue you will need to use the backward compatible <b>Bitcoin Recovery</b> app."
              components={{ b: <b /> }}
              values={{
                currentVersion: state.currentVersion,
              }}
            />
          </Typography>
        </Stack>
      }
      action={
        <Stack gap={0.5}>
          <Button
            component="a"
            target="_blank"
            rel="noreferrer"
            size="extension"
            variant="contained"
            color="primary"
            endIcon={<FiExternalLink size={14} />}
            href="https://support.core.app/en/articles/13145665-why-doesn-t-my-bitcoin-ledger-application-work-with-core"
          >
            {t('Learn more')}
          </Button>
        </Stack>
      }
    />
  );
};
