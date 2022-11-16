import { OptimalRate } from 'paraswap-core';
import {
  HorizontalFlex,
  Overlay,
  Typography,
  VerticalFlex,
  TokenCard,
  HorizontalSeparator,
  SecondaryButton,
  PrimaryButton,
  ComponentSize,
  SubTextTypography,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { SwapRefreshTimer } from '../SwapRefreshTimer';
import { ReviewLoading } from './ReviewLoading';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SlippageToolTip } from '../SlippageToolTip';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { TokenIcon } from '../../utils';
import { PageTitle } from '@src/components/common/PageTitle';
import { BigNumber } from 'ethers';
import Big from 'big.js';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { bnToLocaleString } from '@avalabs/utils-sdk';
import { BN } from 'bn.js';
import { useTranslation } from 'react-i18next';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

export interface ReviewOrderProps {
  fromToken: TokenWithBalance;
  toToken: TokenWithBalance;
  onClose: () => void;
  onConfirm: () => void;
  optimalRate: OptimalRate;
  gasLimit: number;
  gasPrice: BigNumber;
  slippage: string;
  onTimerExpire: () => void;
  isLoading: boolean;
  rateValueInput: 'from' | 'to' | '';
  rate: number;
}

const ReviewOrderOverlay = styled(Overlay)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg1};
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px 0 24px;
`;

const DetailsRow = styled(HorizontalFlex)`
  justify-content: space-between;
  width: 100%;
  margin: 8px 0;
  align-items: center;
`;

const DetailLabel = styled(Typography)`
  font-size: 12px;
  line-height: 15px;
`;

const DetailValue = styled(Typography)`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
`;

export function ReviewOrder({
  fromToken,
  toToken,
  onClose,
  onConfirm,
  optimalRate,
  gasLimit,
  gasPrice,
  slippage,
  onTimerExpire,
  isLoading,
  rate,
}: ReviewOrderProps) {
  const { t } = useTranslation();
  const { network } = useNetworkContext();
  const { currencyFormatter } = useSettingsContext();
  const tokenPrice = useNativeTokenPrice(network);
  useLedgerDisconnectedDialog(onClose);

  return (
    <ReviewOrderOverlay>
      <HorizontalFlex
        justify="space-between"
        width="100%"
        align="center"
        padding="0 16px 0 0"
      >
        <PageTitle onBackClick={onClose}>{t('Review Order')}</PageTitle>
        {onTimerExpire && (
          <SwapRefreshTimer secondsTimer={59} onExpire={onTimerExpire} />
        )}
      </HorizontalFlex>

      {isLoading && (
        <VerticalFlex width="100%" justify="center">
          <ReviewLoading />
        </VerticalFlex>
      )}
      {!isLoading && (
        <VerticalFlex padding="0 16px" grow="1" width="100%">
          <Typography size={14} height="24px">
            {t('From')}
          </Typography>
          <TokenCard
            name={fromToken.symbol}
            symbol={fromToken.symbol}
            balanceDisplayValue={bnToLocaleString(
              new BN(optimalRate?.srcAmount || '0'),
              optimalRate?.srcDecimals
            )}
            balanceUSD={optimalRate?.srcUSD}
            currencyFormatter={currencyFormatter}
          >
            <TokenIcon token={fromToken} />
          </TokenCard>

          <Typography size={14} height="24px">
            {t('To')}
          </Typography>
          <TokenCard
            name={toToken.symbol}
            symbol={toToken.symbol}
            balanceDisplayValue={bnToLocaleString(
              new BN(optimalRate?.destAmount || '0'),
              optimalRate?.destDecimals
            )}
            balanceUSD={optimalRate?.destUSD}
            currencyFormatter={currencyFormatter}
          >
            <TokenIcon token={toToken} />
          </TokenCard>
          <HorizontalSeparator margin="16px 0" />
          <VerticalFlex grow="1" width="100%">
            <DetailsRow>
              <DetailLabel>{t('Rate')}</DetailLabel>
              <DetailValue size={14} height="17px" weight={600}>
                1 {fromToken?.symbol} ≈ {rate?.toFixed(4)} {toToken?.symbol}
              </DetailValue>
            </DetailsRow>
            <DetailsRow data-testid="swap-review-slippage">
              <HorizontalFlex>
                <DetailLabel margin="0 8px 0 0">
                  {t('Slippage tolerance')}
                </DetailLabel>
                <SlippageToolTip />
              </HorizontalFlex>
              <DetailValue size={14} height="17px" weight={600}>
                {slippage || 0}%
              </DetailValue>
            </DetailsRow>
            <DetailsRow data-testid="swap-review-network-fee">
              <HorizontalFlex>
                <DetailLabel margin="0 8px 0 0">{t('Network Fee')}</DetailLabel>
                <TransactionFeeTooltip
                  gasPrice={gasPrice}
                  gasLimit={gasLimit}
                  network={network}
                />
              </HorizontalFlex>
              <DetailValue>
                {new Big(gasPrice.toString())
                  .mul(gasLimit)
                  .div(10 ** 18)
                  .toFixed(6)}{' '}
                AVAX
              </DetailValue>
            </DetailsRow>
            <DetailsRow data-testid="swap-review-wallet-fee">
              <DetailLabel>{t('Avalanche Wallet Fee')}</DetailLabel>
              <VerticalFlex align="flex-end">
                <DetailValue>{optimalRate.partnerFee} AVAX</DetailValue>
                <SubTextTypography size={12} height="15px" margin="4px 0 0">
                  {optimalRate.partnerFee &&
                    tokenPrice &&
                    currencyFormatter(
                      Number(optimalRate.partnerFee) * tokenPrice
                    )}
                </SubTextTypography>
              </VerticalFlex>
            </DetailsRow>
          </VerticalFlex>
          <HorizontalFlex
            grow="1"
            align="flex-end"
            justify="space-between"
            width="100%"
          >
            <SecondaryButton
              data-testid="swap-cancel-button"
              width="168px"
              onClick={onClose}
              size={ComponentSize.LARGE}
            >
              {t('Cancel')}
            </SecondaryButton>
            <PrimaryButton
              data-testid="swap-now-button"
              width="168px"
              size={ComponentSize.LARGE}
              onClick={onConfirm}
            >
              {t('Swap Now')}
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      )}
    </ReviewOrderOverlay>
  );
}
