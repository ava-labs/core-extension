import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { Moonpay } from '@avalabs/blizzard-sdk';
import { useDialog } from '@avalabs/react-components';

const moonpayURL = async (address: string) => {
  const moonAPI = new Moonpay({ baseUrl: 'https://blizzard.avax.network' });
  return await moonAPI.getUrl(address);
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
  const { activeAccount } = useAccountsContext();
  const { showDialog, clearDialog } = useDialog();
  const onBuyClick = () => {
    activeAccount &&
      moonpayURL(activeAccount?.addressC)
        .then((res) => {
          const moonpayBuyURL = res.data.url;
          showDialog({
            title: 'Attention',
            body: "Clicking “Continue” will take you to a page powered by our partner MoonPay, use is subject to MoonPay's terms and policies",
            confirmText: 'Yes',
            width: '343px',
            onConfirm: () => {
              clearDialog();
              moonpayBuyURL && openMiniWindow(moonpayBuyURL);
            },
            cancelText: 'Back',
            onCancel: () => {
              clearDialog();
            },
          });
        })
        .catch(() => {
          showDialog({
            title: 'Service Unavailable',
            body: 'Buy is currently under maintenance. Service will resume shortly.',
            confirmText: 'Close',
            width: '343px',
            onConfirm: () => {
              clearDialog();
            },
          });
        });
  };
  return { onBuyClick };
};
