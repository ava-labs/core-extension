import {
  ComponentSize,
  HorizontalFlex,
  HorizontalSeparator,
  PrimaryButton,
  SecondaryButton,
  TokenCard,
  Typography,
} from '@avalabs/react-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import styled from 'styled-components';
import { TokenIcon } from '../../utils';
import { DetailsContent } from '../TransactionDetails';
import { ReviewOrderProps } from './ReviewOrder';

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

export function ReviewOrderContent({
  fromToken,
  toToken,
  onClose,
  onConfirm,
  optimalRate,
  fee,
  onEdit,
  slippage,
}: ReviewOrderProps) {
  const { currencyFormatter } = useSettingsContext();
  const fromTokenData = {
    amount: optimalRate?.srcAmount,
    decimals: optimalRate?.srcDecimals,
    balanceUSD: optimalRate?.srcUSD,
  };

  const toTokenData = {
    amount: optimalRate?.destAmount,
    decimals: optimalRate?.destDecimals,
    balanceUSD: optimalRate?.destUSD,
  };
  const rate =
    parseInt(optimalRate?.destAmount || '0', 10) /
    parseInt(optimalRate?.srcAmount || '0', 10);

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
