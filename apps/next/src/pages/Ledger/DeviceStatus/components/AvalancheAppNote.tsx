import { InTextLink } from '@/components/InTextLink';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export const AvalancheAppNote: FC = () => {
  const { t } = useTranslation();
  return (
    <Stack gap={1} px={2}>
      <Typography variant="caption">
        {t(
          'If you do not have the Avalanche app on your Ledger, please add it through Ledger Wallet app manager.',
        )}
      </Typography>
      <Typography variant="caption">
        <Trans
          defaults="More instructions can be found <InTextLink>here</InTextLink>"
          components={{
            InTextLink: (
              <InTextLink
                target="_blank"
                href="https://support.ledger.com"
                rel="noreferrer"
              />
            ),
          }}
        />
      </Typography>
    </Stack>
  );
};
