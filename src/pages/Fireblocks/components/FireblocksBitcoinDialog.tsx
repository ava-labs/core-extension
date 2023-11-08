import {
  Dialog,
  DialogTitle,
  Typography,
  DialogActions,
  Button,
  DialogContent,
  toast,
} from '@avalabs/k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { AccountsTab } from '@src/pages/Accounts/Accounts';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

type FireblocksBitcoinDialogProps = {
  accountId: string;
};

export const FireblocksBitcoinDialog = ({
  accountId,
}: FireblocksBitcoinDialogProps) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const history = useHistory();

  return (
    <Dialog open>
      <DialogTitle>
        <Typography variant="h5">{t('Connect Bitcoin Wallet?')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t(
            'Core supports Bitcoin via Fireblocks with a few extra steps. If you choose to skip, you will not be able to bridge or use the Bitcoin Network.'
          )}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            capture('ImportWithFireblocks_BTC_Started');
            history.push(`/fireblocks/connect-bitcoin/${accountId}`);
          }}
          variant="contained"
          size="large"
        >
          {t('Next')}
        </Button>
        <Button
          onClick={() => {
            capture('ImportWithFireblocks_BTC_Skipped');
            toast.success(t('New Account Added!'), { duration: 2000 });
            history.push(`/accounts?activeTab=${AccountsTab.Imported}`);
          }}
          variant="text"
        >
          {t('Skip')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
