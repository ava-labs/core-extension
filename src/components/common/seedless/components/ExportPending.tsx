import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  toast,
} from '@avalabs/k2-components';

import { ArcProgress } from '@src/components/common/ArcProgress';

type Props = {
  progress: number;
  timeLeft: string;
  cancelExport: () => Promise<void>;
  isCancelling: boolean;
  showCloseWindowButton?: boolean;
};

export const ExportPending = ({
  progress,
  timeLeft,
  cancelExport,
  isCancelling,
  showCloseWindowButton,
}: Props) => {
  const { t } = useTranslation();

  const [isCancelPromptVisible, setIsCancelPromptVisible] = useState(false);

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
        px: 2,
        pt: 4,
        pb: 3,
        textAlign: 'center',
      }}
    >
      <Stack
        sx={{
          flexGrow: 1,
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArcProgress size={150} value={progress} thickness={8} />
        <Typography variant="h5">
          <Trans
            i18nKey="<capitalize>{{timeLeft}}</capitalize> Remaining"
            components={{
              capitalize: <span style={{ textTransform: 'capitalize' }} />,
            }}
            values={{
              timeLeft,
            }}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(
            'Your recovery phrase is loading. You will receive a notification when it is done. Please check back in a little while.'
          )}
        </Typography>
      </Stack>
      <Stack sx={{ width: 1, gap: 1 }}>
        {showCloseWindowButton && (
          <Button color="primary" size="large" fullWidth onClick={window.close}>
            {t('Close')}
          </Button>
        )}
        <Button
          color="secondary"
          variant={showCloseWindowButton ? 'text' : 'contained'}
          size="large"
          fullWidth
          onClick={() => setIsCancelPromptVisible(true)}
          data-testid="seedless-export-recovery-phrase-init-cancellation"
        >
          {t('Cancel Export')}
        </Button>
      </Stack>
      <Dialog
        open={isCancelPromptVisible}
        PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
      >
        <DialogTitle>{t('Confirm Cancel?')}</DialogTitle>
        <DialogContent>
          {t('Canceling will require you to restart the 2 day waiting period.')}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            size="large"
            fullWidth
            onClick={async () => {
              await cancelExport();

              toast.error(t('Export Cancelled'));
            }}
            isDisabled={isCancelling}
            isLoading={isCancelling}
            data-testid="seedless-export-recovery-phrase-confirm-cancellation"
          >
            {t('Confirm')}
          </Button>
          <Button
            variant="text"
            size="large"
            onClick={() => setIsCancelPromptVisible(false)}
            data-testid="seedless-export-recovery-phrase-cancel-cancellation"
          >
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
