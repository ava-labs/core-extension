import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  AlertCircleIcon,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@avalabs/k2-components';

import {
  ExportState,
  useSeedlessMnemonicExport,
} from '@src/hooks/useSeedlessMnemonicExport';
import { useSeedlessMfa } from '@src/hooks/useSeedlessMfa';
import { TOTPChallenge } from '@src/components/common/seedless/components/TOTPChallenge';
import { FIDOChallenge } from '@src/components/common/seedless/components/FIDOChallenge';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { ExportPending } from '@src/components/common/seedless/components/ExportPending';
import { PhraseReadyToExport } from '@src/components/common/seedless/components/PhraseReadyToExport';
import { MfaRequestType } from '@src/background/services/seedless/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SeedlessExportAnalytics } from '@src/background/services/seedless/seedlessAnalytics';

export const SeedlessExportPopup = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const {
    mfaChallenge,
    submitTotp,
    submitFido,
    isVerifying,
    error: mfaError,
  } = useSeedlessMfa();
  const {
    state,
    initExport,
    cancelExport,
    completeExport,
    progress,
    timeLeft,
    mnemonic,
  } = useSeedlessMnemonicExport();

  const handleResignation = useCallback(() => {
    capture(SeedlessExportAnalytics.Resigned).finally(window.close);
  }, [capture]);

  const showMfaChallenge =
    Boolean(mfaChallenge) &&
    (state === ExportState.Initiating || state === ExportState.Exporting);

  return (
    <>
      {state === ExportState.Error && (
        <Stack sx={{ width: 1, height: 1, p: 2 }}>
          <Stack
            sx={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <AlertCircleIcon size={48} color="error.light" />
            <Typography variant="h5">
              {t('Sorry, an unknown error occurred.')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('Please try again later or contact Core support.')}
            </Typography>
          </Stack>
          <Button color="primary" size="large" onClick={window.close} fullWidth>
            {t('Close')}
          </Button>
        </Stack>
      )}
      {state !== ExportState.Error && (
        <>
          <Stack sx={{ width: 1, height: 1, px: 2 }}>
            <PageTitle
              variant={PageTitleVariant.PRIMARY}
              showBackButton={false}
            >
              {t('Export Recovery Phrase')}
            </PageTitle>
            {(state === ExportState.Pending ||
              state === ExportState.Cancelling) && (
              <ExportPending
                progress={progress}
                timeLeft={timeLeft}
                cancelExport={async () => {
                  await cancelExport();
                  window.close();
                }}
                isCancelling={state === ExportState.Cancelling}
                showCloseWindowButton
              />
            )}
            {(state === ExportState.ReadyToExport ||
              state === ExportState.Exporting ||
              state === ExportState.Exported) && (
              <PhraseReadyToExport
                completeExport={completeExport}
                isDecrypting={state === ExportState.Exporting}
                mnemonic={mnemonic}
              />
            )}
          </Stack>
          <Dialog
            open={showMfaChallenge}
            PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
          >
            {mfaChallenge?.type === MfaRequestType.Totp && (
              <TOTPChallenge
                onSubmit={submitTotp}
                isLoading={isVerifying}
                error={mfaError}
              />
            )}
            {mfaChallenge?.type === MfaRequestType.Fido && (
              <>
                <DialogTitle>{t('Waiting for Confirmation')}</DialogTitle>
                <DialogContent>
                  <FIDOChallenge
                    completeFidoChallenge={submitFido}
                    isLoading={isVerifying}
                    error={mfaError}
                  />
                </DialogContent>
              </>
            )}
          </Dialog>
          <Dialog
            open={state === ExportState.NotInitiated}
            PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
          >
            <DialogTitle>{t('Waiting Period')}</DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                <Trans
                  i18nKey="It will take <b>2 days</b> to retrieve your recovery phrase. You will only have <b>48 hours</b> to copy your recovery phrase once the 2 day waiting period is over."
                  components={{
                    b: <b />,
                  }}
                />
              </Typography>
            </DialogContent>
            <DialogActions sx={{ pt: 0 }}>
              <Button
                color="primary"
                size="large"
                fullWidth
                onClick={initExport}
                data-testid="seedless-export-recovery-phrase-confirm-export"
              >
                {t('Next')}
              </Button>
              <Button
                variant="text"
                size="large"
                onClick={handleResignation}
                data-testid="seedless-export-recovery-phrase-resign"
              >
                {t('Cancel')}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};
