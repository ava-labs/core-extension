import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

type ConfirmAccountRemovalDialogProps = DialogProps & {
  onConfirm(): void;
  isMultiple: boolean;
  isDeleting: boolean;
};

export const ConfirmAccountRemovalDialog = ({
  onClose,
  onConfirm,
  isMultiple,
  isDeleting,
  ...props
}: ConfirmAccountRemovalDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      onClose={onClose}
      PaperProps={{
        sx: { m: 2 },
      }}
      {...props}
    >
      <DialogTitle>
        <Typography variant="h5">{t('Are You Sure?')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {isMultiple
            ? t(
                'Clicking “Delete” will permanently remove the selected accounts from Core. To re-add them, you will need to enter the private keys again.'
              )
            : t(
                'Clicking “Delete” will permanently remove the selected account from Core. To re-add it, you will need to enter its private key again.'
              )}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="large"
          disabled={isDeleting}
          isLoading={isDeleting}
        >
          {t('Delete')}
        </Button>
        <Button onClick={onClose} variant="text" disabled={isDeleting}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
