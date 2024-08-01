import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onReject: () => void;
  onContinue: () => void;
};

export const ExcessiveBurnWarningDialog = ({
  open,
  onReject,
  onContinue,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      showCloseIcon={false}
      PaperProps={{
        sx: { m: 2 },
      }}
    >
      <DialogTitle align="center">{t('Caution!')}</DialogTitle>
      <DialogContent sx={{ px: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          {t(
            'The inputs of this transaction are greater than the output. Continuing will cause you to lose funds associated with this UTXO.'
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2, pt: 1, pb: 2 }}>
        <Button color="primary" size="large" fullWidth onClick={onReject}>
          {t('Reject Transaction')}
        </Button>
        <Button variant="text" size="large" onClick={onContinue}>
          {t('Continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
