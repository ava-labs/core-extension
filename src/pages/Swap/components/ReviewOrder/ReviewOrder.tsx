import { OptimalRate } from 'paraswap-core';
import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  Overlay,
  TextButton,
  Typography,
  VerticalFlex,
  TokenCard,
  HorizontalSeparator,
  SecondaryButton,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { SwapRefreshTimer } from '../SwapRefreshTimer';
import { ReviewLoading } from './ReviewLoading';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { GasPrice } from '@src/background/services/gas/models';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { SlippageToolTip } from '../SlippageToolTip';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { TokenIcon } from '../../utils';

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
}

const ReviewOrderOverlay = styled(Overlay)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg1};
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
`;

const Header = styled(HorizontalFlex)`
  width: 100%;
  margin-bottom: 16px;
`;

const DetailsRow = styled(HorizontalFlex)`
  justify-content: space-between;
  width: 100%;
  margin: 16px 0;
  align-items: center;
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
}: ReviewOrderProps) {
  const theme = useTheme();
  const { currencyFormatter } = useSettingsContext();
  useLedgerDisconnectedDialog();

  const rate =
    parseInt(optimalRate?.destAmount || '0', 10) /
    parseInt(optimalRate?.srcAmount || '0', 10);

  return (
    <ReviewOrderOverlay>
      <Header>
        <HorizontalFlex justify="space-between" width="100%" align="center">
          <HorizontalFlex>
            <TextButton onClick={onClose}>
              <CaretIcon
                height="20px"
                direction={IconDirection.LEFT}
                color={theme.colors.icon1}
              />
            </TextButton>
            <Typography
              size={24}
              weight={700}
              height="29px"
              margin="0 0 0 24px"
            >
              Review Order
            </Typography>
          </HorizontalFlex>
          {onTimerExpire && (
            <SwapRefreshTimer secondsTimer={59} onExpire={onTimerExpire} />
          )}
        </HorizontalFlex>
      </Header>

      {isLoading && (
        <VerticalFlex width="100%" justify="center">
          <ReviewLoading />
        </VerticalFlex>
      )}
      {!isLoading && (
        <>
          <VerticalFlex width="100%">
            <Typography size={16} height="24px">
              From
            </Typography>
            <TokenCard
              name={fromToken.symbol}
              symbol={fromToken.symbol}
              balanceDisplayValue={Utils.bnToLocaleString(
                new BN(optimalRate?.srcAmount || '0'),
                optimalRate?.srcDecimals
              )}
              balanceUSD={optimalRate?.srcUSD}
              currencyFormatter={currencyFormatter}
            >
              <TokenIcon token={fromToken} />
            </TokenCard>
          </VerticalFlex>
          <VerticalFlex width="100%">
            <Typography size={16} height="24px">
              To
            </Typography>
            <TokenCard
              name={toToken.symbol}
              symbol={toToken.symbol}
              balanceDisplayValue={Utils.bnToLocaleString(
                new BN(optimalRate?.destAmount || '0'),
                optimalRate?.destDecimals
              )}
              balanceUSD={optimalRate?.destUSD}
              currencyFormatter={currencyFormatter}
            >
              <TokenIcon token={toToken} />
            </TokenCard>
          </VerticalFlex>
          <HorizontalSeparator margin="16px 0" />
          <VerticalFlex grow="1" width="100%">
            <DetailsRow>
              <VerticalFlex>
                <Typography>Rate</Typography>
              </VerticalFlex>
              <VerticalFlex>
                <Typography>
                  1 {fromToken?.symbol} ~ {rate?.toFixed(4)} {toToken?.symbol}
                </Typography>
              </VerticalFlex>
            </DetailsRow>
            <DetailsRow>
              <VerticalFlex>
                <HorizontalFlex>
                  <Typography margin="0 16px 0 0">
                    Slippage tolerance
                  </Typography>
                  <SlippageToolTip />
                </HorizontalFlex>
              </VerticalFlex>
              <VerticalFlex>
                <Typography>{slippage || 0}%</Typography>
              </VerticalFlex>
            </DetailsRow>
            <DetailsRow>
              <VerticalFlex>
                <HorizontalFlex>
                  <Typography margin="0 16px 0 0">Network Fee</Typography>
                  <TransactionFeeTooltip
                    gasPrice={gasPrice?.bn}
                    gasLimit={gasLimit as any}
                  />
                </HorizontalFlex>
              </VerticalFlex>
              <VerticalFlex>
                <Typography>
                  {Number(
                    Utils.bnToLocaleString(
                      gasPrice.bn.mul(new BN(gasLimit)),
                      18
                    )
                  ).toFixed(6)}{' '}
                  AVAX
                </Typography>
              </VerticalFlex>
            </DetailsRow>
            <DetailsRow>
              <VerticalFlex>
                <Typography size={14} height="17px">
                  Avalanche Wallet Fee
                </Typography>
              </VerticalFlex>
              <VerticalFlex>
                <Typography>{optimalRate.partnerFee} AVAX</Typography>
              </VerticalFlex>
            </DetailsRow>
          </VerticalFlex>
          <HorizontalFlex justify="space-between" width="100%">
            <SecondaryButton
              onClick={onClose}
              size={ComponentSize.LARGE}
              margin="8px"
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size={ComponentSize.LARGE}
              margin="8px"
              onClick={onConfirm}
            >
              Confirm
            </PrimaryButton>
          </HorizontalFlex>
        </>
      )}
    </ReviewOrderOverlay>
  );
}
