import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertContent,
  AlertTriangleIcon,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  toast,
} from '@avalabs/core-k2-components';

import { SeedlessExportAnalytics } from '@core/types';
import { useAnalyticsContext } from '@core/ui';

type Props = {
  isDecrypting: boolean;
  completeExport: () => Promise<void>;
  mnemonic: string;
};

const PLACEHOLDER_MNEMONIC =
  'west mention cat frog interest lighter ponder vast west book tree pen health dupa chip moral enroll chair hub book pioneer fortune can beautiful';

export const PhraseReadyToExport = ({
  completeExport,
  mnemonic,
  isDecrypting,
}: Props) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const [showCloseWarning, setShowCloseWarning] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(mnemonic);
    toast.success('Copied!', { duration: 2000 });
    capture(SeedlessExportAnalytics.PhraseCopied);
  }, [mnemonic, capture]);

  return (
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
      <Stack sx={{ gap: 1 }}>
        <Alert
          severity="warning"
          icon={<AlertTriangleIcon />}
          sx={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            px: 0,
          }}
        >
          <AlertContent sx={{ pl: 0.5, pr: 0 }}>
            <Typography variant="body2">
              {t(
                'Do not share this phrase with anyone! These words can be used to steal all your accounts.',
              )}
            </Typography>
          </AlertContent>
        </Alert>
        <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>
          {t('Recovery Phrase')}
        </Typography>
        <Card sx={{ backgroundColor: 'grey.850' }}>
          <CardContent
            sx={{
              px: 2,
              filter: mnemonic ? 'none' : 'blur(5px)',
              userSelect: mnemonic ? 'auto' : 'none',
            }}
          >
            <Typography variant="body2">
              {mnemonic || PLACEHOLDER_MNEMONIC}
            </Typography>
          </CardContent>
        </Card>
        <Box>
          <Button
            size="small"
            variant="text"
            disabled={isDecrypting}
            isLoading={isDecrypting}
            data-testid={`seedless-export-recovery-phrase-${
              mnemonic ? 'close' : 'decrypt'
            }`}
            onClick={async () => {
              if (mnemonic) {
                setShowCloseWarning(true);
              } else {
                await completeExport();
              }
            }}
          >
            {mnemonic ? t('Hide Recovery Phrase') : t('Show Recovery Phrase')}
          </Button>
        </Box>
      </Stack>
      <Stack sx={{ gap: 1, width: 1 }}>
        <Button
          color="primary"
          size="large"
          fullWidth
          disabled={!mnemonic}
          onClick={handleCopy}
          data-testid="seedless-export-recovery-phrase-copy-mnemonic"
        >
          {t('Copy Recovery Phrase')}
        </Button>
        <Button
          variant="text"
          size="large"
          fullWidth
          onClick={() => setShowCloseWarning(true)}
        >
          {t('Close')}
        </Button>
      </Stack>
      <Dialog open={showCloseWarning}>
        <DialogTitle>{t('Confirm Close?')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {t(
              'Closing the settings menu will require you to restart the 2 day waiting period.',
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            color="primary"
            onClick={window.close}
            data-testid="seedless-export-recovery-phrase-confirm-close"
          >
            {t('Confirm')}
          </Button>
          <Button
            variant="text"
            size="large"
            onClick={() => setShowCloseWarning(false)}
            data-testid="seedless-export-recovery-phrase-cancel-close"
          >
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
