import {
  RefreshIcon,
  Skeleton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import styled, { css, keyframes, useTheme } from 'styled-components';

interface AccountBalanceProps {
  refreshBalance: () => void;
  balanceTotalUSD: number | null;
  isBalanceLoading: boolean;
}

const RefreshIconAnimationKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const RefreshIconAnimation = css`
  animation: 1.5s ease-in-out ${RefreshIconAnimationKeyframes} infinite;
`;

const RefreshIconWrapper = styled.div<{ isLoading?: boolean }>`
  ${({ isLoading }) => (isLoading ? RefreshIconAnimation : '')};
  display: inline-block;
`;

export function AccountBalance({
  refreshBalance,
  balanceTotalUSD,
  isBalanceLoading,
}: AccountBalanceProps) {
  const theme = useTheme();
  const { currency, currencyFormatter } = useSettingsContext();

  return (
    <VerticalFlex
      justify="space-between"
      onClick={(e) => {
        e.stopPropagation();
        refreshBalance();
      }}
    >
      {isBalanceLoading ? (
        <Skeleton width="60px" height="12px" />
      ) : (
        <Typography size={12}>
          {currencyFormatter(balanceTotalUSD || 0).replace(currency, '')}
        </Typography>
      )}

      <Typography align="right">
        <RefreshIconWrapper isLoading={isBalanceLoading}>
          <RefreshIcon height="10px" color={theme.colors.text1} />
        </RefreshIconWrapper>
      </Typography>
    </VerticalFlex>
  );
}
