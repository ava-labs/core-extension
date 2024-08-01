import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

import { StyledNumberList } from '@src/components/common/StyledNumberList';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { ConnectionIndicatorK2 } from '@src/components/common/ConnectionIndicatorK2';

import { useAppTypeFromParams } from './hooks/useAppTypeFromParams';

export function LedgerConnect() {
  const { t } = useTranslation();
  const { hasLedgerTransport, appType, popDeviceSelection } =
    useLedgerContext();
  const requiredAppType = useAppTypeFromParams();

  useEffect(() => {
    popDeviceSelection();
    // Do this exactly once, all retries should be initiated by the user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectedWithCorrectApp =
    hasLedgerTransport && appType === requiredAppType;

  return (
    <Stack sx={{ height: 1, px: 2 }}>
      <Typography variant="h4">{t('Ledger Status')}</Typography>

      <Card sx={{ my: 1 }}>
        <CardContent>
          <Stack sx={{ flexGrow: 1 }}>
            <Stack
              direction="row"
              sx={{
                width: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography>{t('Status')}</Typography>
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <ConnectionIndicatorK2
                  connected={hasLedgerTransport}
                  size={8}
                />
                <Typography sx={{ ml: 1 }} color="text.secondary">
                  {hasLedgerTransport ? t('Connected') : t('Disconnected')}
                </Typography>
              </Stack>
            </Stack>
            {hasLedgerTransport && (
              <Stack
                direction="row"
                sx={{
                  width: 1,
                  mt: 2,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>{t('Application')}</Typography>
                <Typography sx={{ ml: 1 }} color="text.secondary">
                  {appType}
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Stack>
            {connectedWithCorrectApp ? (
              <Stack sx={{ width: 1 }}>
                <Typography
                  sx={{ fontWeight: 'fontWeightSemibold', mb: 2, py: 1 }}
                >
                  {t('To Continue:')}
                </Typography>
                <Stack direction="row">
                  <StyledNumberList>{t('1.')}</StyledNumberList>
                  <Typography sx={{ mb: 3 }}>
                    {t('Click close below.')}
                  </Typography>
                </Stack>

                <Stack direction="row">
                  <StyledNumberList>{t('2.')}</StyledNumberList>
                  <Typography sx={{ mb: 3 }}>
                    {t('Open Core in your browser.')}
                  </Typography>
                </Stack>

                <Stack direction="row">
                  <StyledNumberList>{t('3.')}</StyledNumberList>
                  <Typography>
                    {t('Reenter the transaction details and try again.')}
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <Stack sx={{ width: 1 }}>
                <Typography
                  sx={{ fontWeight: 'fontWeightSemibold', mb: 2, py: 1 }}
                >
                  {t('To Connect:')}
                </Typography>
                <Stack direction="row">
                  <StyledNumberList>{t('1.')}</StyledNumberList>
                  <Typography sx={{ mb: 3 }}>
                    {t('Connect the Ledger device to your computer.')}
                  </Typography>
                </Stack>

                <Stack direction="row">
                  <StyledNumberList>{t('2.')}</StyledNumberList>
                  <Typography sx={{ mb: 3 }}>
                    {t('Enter your PIN and access your device.')}
                  </Typography>
                </Stack>

                <Stack direction="row">
                  <StyledNumberList>{t('3.')}</StyledNumberList>
                  <Typography>
                    <Trans
                      i18nKey="Ensure you have installed the latest <typography>{{requiredAppType}} App</typography> and open it on your device."
                      values={{
                        requiredAppType: requiredAppType,
                      }}
                      components={{
                        typography: (
                          <Typography
                            component="span"
                            sx={{ fontWeight: 'fontWeightSemibold' }}
                          />
                        ),
                      }}
                    />
                  </Typography>
                </Stack>

                <Typography sx={{ mt: 3, py: 1 }}>
                  <Trans
                    i18nKey={
                      'If you do not have the <typography>{{requiredAppType}} App</typography> on your Ledger, please add it through the Ledger Live app manager.'
                    }
                    values={{
                      requiredAppType: requiredAppType,
                    }}
                    components={{
                      typography: (
                        <Typography
                          component="span"
                          sx={{ fontWeight: 'fontWeightSemibold' }}
                        />
                      ),
                    }}
                  />
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Stack sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        <Button
          size="large"
          fullWidth
          onClick={() => {
            if (connectedWithCorrectApp) {
              window.close();
            } else {
              popDeviceSelection();
            }
          }}
        >
          {connectedWithCorrectApp ? t('Close') : t('Retry')}
        </Button>
      </Stack>
    </Stack>
  );
}
