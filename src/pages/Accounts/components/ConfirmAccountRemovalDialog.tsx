import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from '@avalabs/core-k2-components';
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
                'Removing the accounts will delete all local accounts information stored on this computer. Your assets on chain will remain on chain.',
              )
            : t(
                'Removing the account will delete all local  account information stored on this computer. Your assets on chain will remain on chain.',
              )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ gap: 1 }}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          variant="contained"
          size="large"
          disabled={isDeleting}
          isLoading={isDeleting}
          data-testid="delete-account-confirm-button"
        >
          {t('Delete')}
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClose?.(e, 'backdropClick');
          }}
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
