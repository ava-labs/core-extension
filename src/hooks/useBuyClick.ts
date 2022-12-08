import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useDialog } from '@avalabs/react-components';
import { useTranslation } from 'react-i18next';

const moonpayURL = async (address: string): Promise<{ url: string }> => {
  return await fetch(`${process.env.PROXY_URL}/moonpay/${address}`).then(
    (response) => response.json()
  );
};

const openMiniWindow = (url: string) => {
  window.open(
    url,
    'target',
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

export const useBuyClick = () => {
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { showDialog, clearDialog } = useDialog();
  const { t } = useTranslation();

  const onBuyClick = () => {
    activeAccount &&
      moonpayURL(activeAccount?.addressC)
        .then((res) => {
          const moonpayBuyURL = res.url;
          showDialog({
            title: t('Attention'),
            body: t(
              "Clicking “Continue” will take you to a page powered by our partner MoonPay, use is subject to MoonPay's terms and policies"
            ),
            confirmText: t('Yes'),
            width: '343px',
            onConfirm: () => {
              clearDialog();
              moonpayBuyURL && openMiniWindow(moonpayBuyURL);
            },
            cancelText: t('Back'),
            onCancel: () => {
              clearDialog();
            },
          });
        })
        .catch(() => {
          showDialog({
            title: t('Service Unavailable'),
            body: t(
              'Buy is currently under maintenance. Service will resume shortly.'
            ),
            confirmText: t('Close'),
            width: '343px',
            onConfirm: () => {
              clearDialog();
            },
          });
        });
  };
  return { onBuyClick };
};
