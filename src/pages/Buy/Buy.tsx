import {
  VerticalFlex,
  LoadingIcon,
  HorizontalFlex,
  Typography,
} from '@avalabs/react-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BuyService, useBuyClick } from '@src/hooks/useBuyClick';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';

const PayBox = styled(VerticalFlex)`
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 8px;
  padding: 24px 0;
  width: 165px;
  height: 164px;
  align-items: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 64px;
  width: 64px;
  margin-top: 24px;
`;

export const Buy = () => {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const { onBuyClick } = useBuyClick();
  const { featureFlags } = useFeatureFlagContext();

  if (!network) {
    return <LoadingIcon />;
  }

  if (!featureFlags[FeatureGates.BUY]) {
    return <FunctionIsOffline functionName="Buy" />;
  }

  return (
    <VerticalFlex width="100%" align="center">
      <PageTitle>{t('Buy')}</PageTitle>
      <VerticalFlex marginTop="90px">
        <Typography align="center" weight={600} size={16} height={'24px'}>
          {t('Continue with...')}
        </Typography>
        <HorizontalFlex marginTop="24px">
          <PayBox
            margin="0 16px 0 0"
            onClick={(e) => {
              e.preventDefault();
              onBuyClick(BuyService.MOONPAY);
            }}
            data-testid="buy-moonpay-button"
          >
            <Typography weight={600} size={18} height={'28px'}>
              {t('Moonpay')}
            </Typography>
            <Logo src="images/logos/moonpay.svg" />
          </PayBox>
          <PayBox
            onClick={(e) => {
              e.preventDefault();
              onBuyClick(BuyService.COINBASE);
            }}
            data-testid="buy-coinbase-button"
          >
            <Typography weight={600} size={18} height={'28px'}>
              {t('Coinbase Pay')}
            </Typography>
            <Logo src="images/logos/coinbase.svg" />
          </PayBox>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
};
