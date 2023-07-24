import {
  LoadingDotsIcon,
  Stack,
  Typography,
  styled,
} from '@avalabs/k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useTranslation } from 'react-i18next';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { useState } from 'react';
import { BuyService, BuyDialog } from '@src/pages/Buy/BuyDialog';
import { useCoinbasePay } from '@src/hooks/useCoinbasePay';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

const PayBox = styled(Stack)`
  background-color: ${({ theme }) => theme.palette.grey[850]};
  border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
  padding: 24px 0;
  width: 165px;
  height: 164px;
  align-items: center;
  cursor: pointer;
`;

const Logo = styled('img')`
  height: 64px;
  width: 64px;
  margin-top: 24px;
`;

const moonpayURL = async (address: string): Promise<{ url: string }> => {
  return await fetch(`${process.env.PROXY_URL}/moonpay/${address}`).then(
    (response) => response.json()
  );
};

export const Buy = () => {
  const [openBuyDialog, setOpenBuyDialog] = useState<boolean>(false);
  const [buyService, setBuyService] = useState<BuyService>();
  const [buyUnavailable, setBuyUnavailable] = useState(false);
  const [buyServiceURL, setBuyServiceURL] = useState('');

  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const { featureFlags } = useFeatureFlagContext();
  const { coinbaseUrlByAddress } = useCoinbasePay();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const getBuyUrl = async (service: BuyService) => {
    let serviceURL = '';
    setBuyUnavailable(false);
    if (!activeAccount) return null;

    if (service === BuyService.MOONPAY) {
      const moonPay = await moonpayURL(activeAccount?.addressC);
      moonPay.url ? (serviceURL = moonPay.url) : (serviceURL = 'error');
    }

    if (service === BuyService.COINBASE) {
      serviceURL = coinbaseUrlByAddress(activeAccount?.addressC);
    }

    if (
      !featureFlags[FeatureGates.BUY_COINBASE] &&
      service === BuyService.COINBASE
    ) {
      setBuyUnavailable(true);
    } else if (
      (!featureFlags[FeatureGates.BUY_MOONPAY] &&
        service === BuyService.MOONPAY) ||
      serviceURL === 'error'
    ) {
      setBuyUnavailable(true);
    } else {
      setBuyServiceURL(serviceURL);
    }
  };

  const onBuyClick = async (service: BuyService) => {
    await getBuyUrl(service);
    setBuyService(service);
    setOpenBuyDialog(true);
  };

  if (!network) {
    return <LoadingDotsIcon />;
  }

  if (!featureFlags[FeatureGates.BUY]) {
    return <FunctionIsOffline functionName="Buy" />;
  }

  return (
    <Stack
      sx={{
        alignItems: 'center',
        width: '100%',
      }}
    >
      <PageTitle>{t('Buy')}</PageTitle>

      <Stack
        sx={{
          mt: 11,
        }}
      >
        <Typography
          align="center"
          variant="subtitle1"
          sx={{ fontWeight: 'fontWeightBold' }}
        >
          {t('Continue with...')}
        </Typography>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'center',
            mt: 3,
          }}
        >
          <PayBox
            margin="0 16px 0 0"
            onClick={() => {
              onBuyClick(BuyService.MOONPAY);
            }}
            data-testid="buy-moonpay-button"
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 'fontWeightSemibold',
                lineHeight: '24px',
              }}
            >
              {t('Moonpay')}
            </Typography>
            <Logo src="images/logos/moonpay.svg" />
          </PayBox>
          <PayBox
            onClick={() => {
              onBuyClick(BuyService.COINBASE);
            }}
            data-testid="buy-coinbase-button"
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 'fontWeightSemibold',
                lineHeight: '24px',
              }}
            >
              {t('Coinbase Pay')}
            </Typography>
            <Logo src="images/logos/coinbase.svg" />
          </PayBox>
        </Stack>
      </Stack>

      <BuyDialog
        openDialog={openBuyDialog}
        closeDialog={() => setOpenBuyDialog(false)}
        buyService={buyService}
        buyServiceURL={buyServiceURL}
        buyUnavailable={buyUnavailable}
      />
    </Stack>
  );
};
