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
import { TokenIcon } from './utils';

interface ReviewOrderProps {
  fromToken?: TokenWithBalance;
  toToken?: TokenWithBalance;
  destAmount: string;
  onClose: () => void;
  onConfirm: () => void;
  optimalRate: OptimalRate;
  fee: number | string;
  onEdit?: () => void;
  slippage?: string;
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

const getBalanceDisplayValue = (amount: string, decimals: number) => {
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
}: ReviewOrderProps) {
  const theme = useTheme();
  const { currencyFormatter } = useSettingsContext();

  return (
    <ReviewOrderOverlay>
      <Header>
        <TextButton onClick={onClose}>
          <CaretIcon
            height="20px"
            direction={IconDirection.LEFT}
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography size={24} weight={700} height="29px" margin="0 0 0 24px">
          Review Order
        </Typography>
      </Header>

      {fromToken && (
        <TokenCardContainer>
          <Typography size={16} height="24px">
            From
          </Typography>
          <TokenCard
            name={fromToken.symbol}
            symbol={fromToken.symbol}
            balanceDisplayValue={getBalanceDisplayValue(
              optimalRate.srcAmount,
              optimalRate.srcDecimals
            )}
            balanceUSD={optimalRate?.srcUSD}
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
              destAmount,
              optimalRate.destDecimals
            )}
            balanceUSD={optimalRate?.destUSD}
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
        rate={parseInt(destAmount, 10) / parseInt(optimalRate?.srcAmount, 10)}
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
    </ReviewOrderOverlay>
  );
}
