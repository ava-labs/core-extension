import { Stack, Typography, Button } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import Dialog from '@src/components/common/Dialog';
import { Languages } from '@src/background/services/settings/models';
import { useLanguage } from '@src/hooks/useLanguages';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export enum BuyService {
  COINBASE = 'Coinbase Pay',
  MOONPAY = 'Moonpay',
}

const openMiniWindow = (url: string) => {
  window.open(
    url,
    '_blank',
    `toolbar=no,
        location=no,
        status=no,
        menubar=no,
        scrollbars=yes,
        resizable=yes,
        width=430px,
        height=650px,`
  );
};

export const BuyDialog = ({
  buyService,
  openDialog,
  closeDialog,
  buyServiceURL,
  buyUnavailable,
}: {
  buyService: BuyService | undefined;
  openDialog: boolean;
  closeDialog: () => void;
  buyServiceURL: string;
  buyUnavailable: boolean;
}) => {
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const supportedLanguageLabel =
    currentLanguage?.code !== Languages.EN
      ? t('{{buyService}} only supports English.', { buyService })
      : '';

  const buyDialogContent = (
    <Stack sx={{ justifyContent: 'center', width: '100%' }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        {t('Attention')}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
        {t(
          "Clicking “Continue” will take you to a page powered by our partner {{buyService}}, use is subject to {{buyService}}'s terms and policies. {{supportedLanguageLabel}}",
          {
            buyService,
            supportedLanguageLabel,
          }
        )}
      </Typography>
      <Stack
        sx={{
          mt: 3,
        }}
      >
        <Button
          sx={{ mb: 1 }}
          onClick={() => {
            closeDialog();
            capture(`${buyService}BuyClicked`);
            buyServiceURL && openMiniWindow(buyServiceURL);
          }}
        >
          {t('Continue')}
        </Button>
        <Button variant="text" onClick={closeDialog}>
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
  const buyUnavailableDialogContent = (
    <Stack sx={{ justifyContent: 'center', width: '100%' }}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        {t('Service Unavailable')}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
        {t('Buy is currently under maintenance. Service will resume shortly.')}
      </Typography>
      <Stack
        sx={{
          mt: 3,
        }}
      >
        <Button sx={{ mb: 1 }} onClick={closeDialog}>
          {t('Close')}
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Dialog
      open={openDialog}
      onClose={closeDialog}
      content={buyUnavailable ? buyUnavailableDialogContent : buyDialogContent}
      bgColorDefault={true}
    />
  );
};
