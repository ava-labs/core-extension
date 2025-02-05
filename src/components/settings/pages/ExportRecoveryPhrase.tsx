import { useTranslation } from 'react-i18next';
import {
  Stack,
  List,
  ListItem,
  ListItemText,
  Chip,
  styled,
  Divider,
  Alert,
  AlertTitle,
  AlertContent,
  Button,
  InfoCircleIcon,
  Typography,
  Skeleton,
  CheckCircleIcon,
} from '@avalabs/core-k2-components';
import { useCallback, useState } from 'react';

import {
  ExportState,
  useSeedlessMnemonicExport,
} from '@src/hooks/useSeedlessMnemonicExport';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SeedlessExportAnalytics } from '@src/background/services/seedless/seedlessAnalytics';

import { SettingsHeader } from '../SettingsHeader';
import type { SettingsPageProps } from '../models';

import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { ExportPending } from '@src/components/common/seedless/components/ExportPending';
import { ExportError } from '@src/components/common/seedless/components/ExportError';

const ListItemBadge = styled(Chip)`
  font-size: 16px;
  padding: 2px 4px;
  width: 24px;
  height: 24px;
`;

export function ExportRecoveryPhrase({
  goBack,
  navigateTo,
  width,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { error, state, progress, timeLeft, cancelExport } =
    useSeedlessMnemonicExport();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleNextClick = useCallback(async () => {
    const popup = await openExtensionNewWindow('seedless-export');

    if (popup.state) {
      setIsPopupOpen(true);
      capture(SeedlessExportAnalytics.PopupOpened);

      const subscription = popup.removed.subscribe(() => {
        setIsPopupOpen(false);
      });

      return () => subscription.unsubscribe();
    }
  }, [capture]);

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Recovery Phrase')}
      />
      {(state === ExportState.Pending || state === ExportState.Cancelling) && (
        <ExportPending
          progress={progress}
          timeLeft={timeLeft}
          isCancelling={state === ExportState.Cancelling}
          cancelExport={cancelExport}
        />
      )}
      {state === ExportState.Error && (
        <ExportError error={error} onRetry={handleNextClick} onClose={goBack} />
      )}
      {state === ExportState.ReadyToExport && (
        <Stack
          sx={{
            width: 1,
            px: 2,
            mt: -2,
            gap: 1,
            justifyContent: 'space-between',
            flexGrow: 1,
            pb: 3,
          }}
        >
          <Stack
            sx={{
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              flexGrow: 1,
            }}
          >
            <CheckCircleIcon sx={{ color: 'success.main' }} size={80} />
            <Typography variant="h5">
              {t('Your recovery phrase is ready')}
            </Typography>
            <Typography variant="body2">
              {t('Click below to decrypt it.')}
            </Typography>
          </Stack>
          <Button
            color="primary"
            size="large"
            fullWidth
            disabled={state !== ExportState.ReadyToExport}
            onClick={handleNextClick}
            data-testid="seedless-export-recovery-phrase-start-decryption-flow"
          >
            {t('Decrypt Recovery Phrase')}
          </Button>
        </Stack>
      )}
      {state === ExportState.Loading && (
        <Stack sx={{ gap: 1, px: 2, mt: 2 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Stack>
      )}
      {state === ExportState.NotInitiated && (
        <>
          <List sx={{ listStyle: 'decimal' }}>
            <ListItem sx={{ gap: 1.5 }}>
              <ListItemBadge label="1." />
              <ListItemText primary={t('Login with your social account')} />
            </ListItem>
            <ListItem sx={{ gap: 1.5 }}>
              <ListItemBadge label="2." />
              <ListItemText primary={t('Verify recovery method')} />
            </ListItem>
            <ListItem sx={{ gap: 1.5 }}>
              <ListItemBadge label="3." />
              <ListItemText primary={t('Wait 2 days to retrieve phrase')} />
            </ListItem>
          </List>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Stack
            sx={{
              px: 2,
              pb: 3,
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
          >
            <Alert severity="warning" icon={<InfoCircleIcon />}>
              <AlertTitle>{t('2 Day Waiting Period')}</AlertTitle>
              <AlertContent sx={{ lineHeight: 1.66 }}>
                {t(
                  'For your safety there is a 2 day waiting period to retrieve a phrase.',
                )}
              </AlertContent>
            </Alert>
            <Button
              color="primary"
              onClick={handleNextClick}
              fullWidth
              size="large"
              disabled={isPopupOpen}
              isLoading={isPopupOpen}
              data-testid="seedless-export-recovery-phrase-start-export-flow"
            >
              {t('Next')}
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}
