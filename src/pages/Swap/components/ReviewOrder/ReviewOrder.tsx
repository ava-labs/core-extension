import { OptimalRate } from 'paraswap-core';
import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  Overlay,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { SwapRefreshTimer } from '../SwapRefreshTimer';
import { ReviewLoading } from './ReviewLoading';
import { ReviewOrderContent } from './ReviewOrderContent';

export interface ReviewOrderProps {
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
  rateValueInput: 'from' | 'to' | '';
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
        <VerticalFlex width="100%" justify="center">
          <ReviewLoading />
        </VerticalFlex>
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
