import type { DialogProps } from '@avalabs/core-k2-components';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

type DuplicatedAccountDialogProps = DialogProps & {
  onConfirm(): void;
};

export function DuplicatedAccountDialog({
  onClose,
  onConfirm,
  ...props
}: DuplicatedAccountDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog
      PaperProps={{
        sx: { m: 2 },
      }}
      sx={{ textAlign: 'center' }}
      {...props}
    >
      <DialogTitle>
        <Typography variant="h5">{t('Import Duplicate Account?')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {t(
            'This account has already been imported, do you want to continue?',
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ gap: 1 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="large"
          data-testid="import-private-key-confirm-button"
        >
          {t('Import')}
        </Button>
        <Button
          onClick={onClose}
          variant="text"
          data-testid="import-private-key-cancel-button"
        >
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
