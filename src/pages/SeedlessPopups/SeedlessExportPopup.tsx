import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
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
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { ExportPending } from '@src/components/common/seedless/components/ExportPending';
import { PhraseReadyToExport } from '@src/components/common/seedless/components/PhraseReadyToExport';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { SeedlessExportAnalytics } from '@src/background/services/seedless/seedlessAnalytics';
import { ExportError } from '@src/components/common/seedless/components/ExportError';

export const SeedlessExportPopup = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { renderMfaPrompt } = useSeedlessMfa();
  const {
    state,
    error,
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

  return (
    <>
      {state === ExportState.Error && (
        <ExportError
          error={error}
          onRetry={initExport}
          onClose={window.close}
        />
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
          {(state === ExportState.Initiating ||
            state === ExportState.Exporting) &&
            renderMfaPrompt()}
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
