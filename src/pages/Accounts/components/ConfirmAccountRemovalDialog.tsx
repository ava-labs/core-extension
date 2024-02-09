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
      PaperProps={{
        sx: { m: 2 },
      }}
      sx={{ textAlign: 'center' }}
      {...props}
    >
      <DialogTitle>
        <Typography variant="h5">
          {isMultiple ? t('Delete Accounts?') : t('Delete Account?')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {isMultiple
            ? t(
                'Deleting the accounts will remove any information associated with them.'
              )
            : t(
                'Deleting the account will remove any information associated with it.'
              )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ gap: 1 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="large"
          disabled={isDeleting}
          isLoading={isDeleting}
          data-testid="delete-account-confirm-button"
        >
          {t('Delete')}
        </Button>
        <Button
          onClick={onClose}
          variant="text"
          disabled={isDeleting}
          data-testid="delete-account-cancel-button"
        >
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
