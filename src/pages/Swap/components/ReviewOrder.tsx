import { OptimalRate } from 'paraswap-core';
import {
  CaretIcon,
  ComponentSize,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  Overlay,
  PrimaryButton,
  SecondaryButton,
  TextButton,
  TokenCard,
  Typography,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { DetailsContent } from './TransactionDetails';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { TokenIcon } from '../utils';
import { SwapRefreshTimer } from './SwapRefreshTimer';
import { SwapLoadingSpinnerIcon } from './SwapLoadingSpinnerIcon';

interface ReviewOrderProps {
  fromToken?: TokenWithBalance;
  toToken?: TokenWithBalance;
  destAmount: string;
  onClose: () => void;
  onConfirm: () => void;
  optimalRate?: OptimalRate;
  fee: number | string;
  onEdit?: () => void;
  slippage?: string;
  onTimerExpire?: () => void;
  isLoading?: boolean;
  rateValueInput: string;
}

const ReviewOrderOverlay = styled(Overlay)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg1};
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px 16px;
`;

const Header = styled(HorizontalFlex)`
  width: 100%;
  margin-bottom: 16px;
`;

const TokenCardContainer = styled.div`
  margin-bottom: 16px;
  width: 100%;
`;

const getBalanceDisplayValue = (amount?: string, decimals?: number) => {
  if (!amount || !decimals) {
    return 0;
  }
  const value = parseInt(amount, 10) / Math.pow(10, decimals);
  return value;
};

export function ReviewOrder({
  fromToken,
  toToken,
  destAmount,
  onClose,
  onConfirm,
  optimalRate,
  fee,
  onEdit,
  slippage,
  onTimerExpire,
  isLoading,
  rateValueInput,
}: ReviewOrderProps) {
  const theme = useTheme();

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

      {isLoading ? (
        <HorizontalFlex align="center" width="100%" justify="center">
          <SwapLoadingSpinnerIcon />
        </HorizontalFlex>
      ) : (
        <ReviewOrderContent
          fromToken={fromToken}
          toToken={toToken}
          destAmount={destAmount}
          onClose={onClose}
          onConfirm={onConfirm}
          optimalRate={optimalRate}
          fee={fee}
          onEdit={onEdit}
          slippage={slippage}
          rateValueInput={rateValueInput}
        />
      )}
    </ReviewOrderOverlay>
  );
}

function ReviewOrderContent({
  fromToken,
  toToken,
  destAmount,
  onClose,
  onConfirm,
  optimalRate,
  fee,
  onEdit,
  slippage,
  rateValueInput,
}: ReviewOrderProps) {
  const { currencyFormatter } = useSettingsContext();
  const fromTokenData = {
    amount: rateValueInput === 'to' ? optimalRate?.srcAmount : destAmount,
    decimals:
      rateValueInput === 'to'
        ? optimalRate?.srcDecimals
        : optimalRate?.destDecimals,
    balanceUSD:
      rateValueInput === 'to' ? optimalRate?.srcUSD : optimalRate?.destUSD,
  };

  const toTokenData = {
    amount: rateValueInput === 'from' ? optimalRate?.srcAmount : destAmount,
    decimals:
      rateValueInput === 'from'
        ? optimalRate?.srcDecimals
        : optimalRate?.destDecimals,
    balanceUSD:
      rateValueInput === 'from' ? optimalRate?.srcUSD : optimalRate?.destUSD,
  };
  const rate =
    rateValueInput === 'to'
      ? parseInt(optimalRate?.destAmount || '0', 10) /
        parseInt(optimalRate?.srcAmount || '0', 10)
      : parseInt(optimalRate?.srcAmount || '0', 10) /
        parseInt(optimalRate?.destAmount || '0', 10);

  return (
    <>
      {fromToken && (
        <TokenCardContainer>
          <Typography size={16} height="24px">
            From
          </Typography>
          <TokenCard
            name={fromToken.symbol}
            symbol={fromToken.symbol}
            balanceDisplayValue={getBalanceDisplayValue(
              fromTokenData?.amount,
              fromTokenData?.decimals
            )}
            balanceUSD={fromTokenData?.balanceUSD}
            currencyFormatter={currencyFormatter}
          >
            <TokenIcon token={fromToken} />
          </TokenCard>
        </TokenCardContainer>
      )}
      {toToken && (
        <TokenCardContainer>
          <Typography size={16} height="24px">
            To
          </Typography>
          <TokenCard
            name={toToken.symbol}
            symbol={toToken.symbol}
            balanceDisplayValue={getBalanceDisplayValue(
              toTokenData?.amount,
              toTokenData?.decimals
            )}
            balanceUSD={toTokenData?.balanceUSD}
            currencyFormatter={currencyFormatter}
          >
            <TokenIcon token={toToken} />
          </TokenCard>
        </TokenCardContainer>
      )}
      <HorizontalSeparator margin="0 0 16px 0" />
      <DetailsContent
        fromTokenSymbol={fromToken?.symbol}
        toTokenSymbol={toToken?.symbol}
        rate={rate}
        fee={fee}
        walletFee={optimalRate?.partnerFee}
        onEdit={onEdit}
        slippage={slippage}
      />
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
  );
}
