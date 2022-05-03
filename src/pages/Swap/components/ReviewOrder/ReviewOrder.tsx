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
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { SwapRefreshTimer } from '../SwapRefreshTimer';
import { ReviewLoading } from './ReviewLoading';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { GasPrice } from '@src/background/services/networkFee/models';
import { BN, bnToLocaleString } from '@avalabs/avalanche-wallet-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SlippageToolTip } from '../SlippageToolTip';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { TokenIcon } from '../../utils';
import { PageTitle } from '@src/components/common/PageTitle';
import { useWalletContext } from '@src/contexts/WalletProvider';

export interface ReviewOrderProps {
  fromToken: TokenWithBalance;
  toToken: TokenWithBalance;
  onClose: () => void;
  onConfirm: () => void;
  optimalRate: OptimalRate;
  gasLimit: string;
  gasPrice: GasPrice;
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
  const { currencyFormatter } = useSettingsContext();
  const { avaxToken } = useWalletContext();
  useLedgerDisconnectedDialog(() => {
    onClose();
  });

  return (
    <ReviewOrderOverlay>
      <HorizontalFlex
        justify="space-between"
        width="100%"
        align="center"
        padding="0 16px 0 0"
      >
        <PageTitle onBackClick={onClose}>Review Order</PageTitle>
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
            From
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
            To
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
              <DetailLabel>Rate</DetailLabel>
              <DetailValue size={14} height="17px" weight={600}>
                1 {fromToken?.symbol} ≈ {rate?.toFixed(4)} {toToken?.symbol}
              </DetailValue>
            </DetailsRow>
            <DetailsRow>
              <HorizontalFlex>
                <DetailLabel margin="0 8px 0 0">Slippage tolerance</DetailLabel>
                <SlippageToolTip />
              </HorizontalFlex>
              <DetailValue size={14} height="17px" weight={600}>
                {slippage || 0}%
              </DetailValue>
            </DetailsRow>
            <DetailsRow>
              <HorizontalFlex>
                <DetailLabel margin="0 8px 0 0">Network Fee</DetailLabel>
                <TransactionFeeTooltip
                  gasPrice={gasPrice?.bn}
                  gasLimit={gasLimit as any}
                />
              </HorizontalFlex>
              <DetailValue>
                {Number(
                  bnToLocaleString(gasPrice.bn.mul(new BN(gasLimit)), 18)
                ).toFixed(6)}{' '}
                AVAX
              </DetailValue>
            </DetailsRow>
            <DetailsRow>
              <DetailLabel>Avalanche Wallet Fee</DetailLabel>
              <VerticalFlex align="flex-end">
                <DetailValue>{optimalRate.partnerFee} AVAX</DetailValue>
                <SubTextTypography size={12} height="15px" margin="4px 0 0">
                  {optimalRate.partnerFee &&
                    avaxToken.priceUSD &&
                    currencyFormatter(
                      Number(optimalRate.partnerFee) * avaxToken.priceUSD
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
              width="168px"
              onClick={onClose}
              size={ComponentSize.LARGE}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              width="168px"
              size={ComponentSize.LARGE}
              onClick={onConfirm}
            >
              Swap Now
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      )}
    </ReviewOrderOverlay>
  );
}
