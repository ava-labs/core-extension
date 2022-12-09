import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useDialog } from '@avalabs/react-components';
import { useTranslation } from 'react-i18next';
import { useCoinbasePay } from './useCoinbasePay';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { useCallback } from 'react';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export enum BuyService {
  COINBASE = 'Coinbase Pay',
  MOONPAY = 'Moonpay',
}

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
  const { coinbaseUrlByAddress } = useCoinbasePay();
  const { featureFlags } = useFeatureFlagContext();
  const { capture } = useAnalyticsContext();

  const renderError = useCallback(() => {
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
  }, [clearDialog, showDialog, t]);

  const renderBuyDialog = useCallback(
    (buyService: BuyService, buyServiceURL: string) => {
      showDialog({
        title: t('Attention'),
        body: t(
          "Clicking “Continue” will take you to a page powered by our partner {{buyService}}, use is subject to {{buyService}}'s terms and policies",
          {
            buyService: buyService,
          }
        ),
        confirmText: t('Yes'),
        width: '343px',
        onConfirm: () => {
          clearDialog();
          capture(`${buyService}BuyClicked`);
          buyServiceURL && openMiniWindow(buyServiceURL);
        },
        cancelText: t('Back'),
        onCancel: () => {
          clearDialog();
        },
      });
    },
    [clearDialog, showDialog, t, capture]
  );

  const onBuyClick = async (buyService: BuyService) => {
    let buyServiceURL = '';
    if (!activeAccount) return null;

    if (buyService === BuyService.MOONPAY) {
      const moonPay = await moonpayURL(activeAccount?.addressC);
      moonPay.url ? (buyServiceURL = moonPay.url) : (buyServiceURL = 'error');
    }

    if (buyService === BuyService.COINBASE) {
      buyServiceURL = coinbaseUrlByAddress(activeAccount?.addressC);
    }

    if (
      !featureFlags[FeatureGates.BUY_COINBASE] &&
      buyService === BuyService.COINBASE
    ) {
      renderError();
    } else if (
      (!featureFlags[FeatureGates.BUY_MOONPAY] &&
        buyService === BuyService.MOONPAY) ||
      buyServiceURL === 'error'
    ) {
      renderError();
    } else {
      renderBuyDialog(buyService, buyServiceURL);
    }
  };

  return { onBuyClick };
};
