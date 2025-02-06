import { useCallback, useRef, useState } from 'react';
import {
  RefreshIcon,
  Skeleton,
  Stack,
  Typography,
  styled,
  IconButton,
  Button,
  Grow,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import type { AccountType } from '@src/background/services/accounts/models';
import { useAccountManager } from './providers/AccountManagerProvider';

interface AccountBalanceProps {
  refreshBalance: () => void;
  balanceTotalUSD: number | null;
  isBalanceLoading: boolean;
  accountType: AccountType;
  isActive: boolean;
  isHovered: boolean;
}

const AnimatedRefreshIcon = styled(RefreshIcon, {
  shouldForwardProp: (prop) => prop !== 'isSpinning',
})<{ isSpinning: boolean }>`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    75% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  animation: ${({ isSpinning }) =>
    isSpinning ? '1.5s ease-in-out spin infinite' : 'none'};
`;

const commonTransitionProps = {
  timeout: 200,
  easing: 'ease-in-out',
  appear: false,
};

export function AccountBalance({
  refreshBalance,
  balanceTotalUSD,
  isBalanceLoading,
  accountType,
  isActive,
  isHovered,
}: AccountBalanceProps) {
  const { t } = useTranslation();
  const { isManageMode } = useAccountManager();
  const { currency, currencyFormatter } = useSettingsContext();
  const [skeletonWidth, setSkeletonWidth] = useState(30);
  const balanceTextRef = useRef<HTMLSpanElement>();
  const { capture } = useAnalyticsContext();

  const hasBalance = balanceTotalUSD !== null;

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      // Match the skeleton width to the old balance's width (or the "View Balance" button)
      if (balanceTextRef.current) {
        setSkeletonWidth(balanceTextRef.current?.offsetWidth);
      }

      await refreshBalance();

      // Match the skeleton width to the fresh balance's width.
      if (balanceTextRef.current) {
        setSkeletonWidth(balanceTextRef.current?.offsetWidth);
      }
    },
    [refreshBalance],
  );

  const onRefreshClicked = useCallback(
    (e: React.MouseEvent) => {
      handleClick(e);
      capture('AccountSelectorRefreshBalanceClicked', {
        type: accountType,
      });
    },
    [handleClick, capture, accountType],
  );

  const onViewBalanceClicked = useCallback(
    (e: React.MouseEvent) => {
      handleClick(e);
      capture('AccountSelectorViewBalanceClicked', {
        type: accountType,
      });
    },
    [handleClick, capture, accountType],
  );

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '16px',
        gap: 0.4,
      }}
      style={{ minWidth: skeletonWidth }}
    >
      <Grow {...commonTransitionProps} in={isBalanceLoading}>
        <Skeleton
          height={16}
          width={isBalanceLoading ? skeletonWidth : 0}
          sx={{
            position: 'absolute',
            right: 0,
            transition: 'all ease-in-out 0.2s',
          }}
        />
      </Grow>
      <Grow
        {...commonTransitionProps}
        in={!hasBalance && !isBalanceLoading}
        mountOnEnter
        unmountOnExit
      >
        <Button
          ref={balanceTextRef}
          variant="text"
          data-testid="view-balance-button"
          size="small"
          disableRipple
          onClick={onViewBalanceClicked}
        >
          {t('View Balance')}
        </Button>
      </Grow>

      <Grow
        {...commonTransitionProps}
        in={hasBalance && isHovered && !isBalanceLoading && !isManageMode}
        mountOnEnter
        unmountOnExit
      >
        <IconButton
          size="small"
          onClick={onRefreshClicked}
          data-testid="account-balance-refresh"
          sx={{ p: 0.25 }}
        >
          <AnimatedRefreshIcon size={16} isSpinning={isBalanceLoading} />
        </IconButton>
      </Grow>

      <Grow
        {...commonTransitionProps}
        in={hasBalance && !isBalanceLoading}
        mountOnEnter
        unmountOnExit
      >
        <Typography
          ref={balanceTextRef}
          variant="body1"
          color={isActive ? 'text.primary' : 'text.secondary'}
        >
          {currencyFormatter(balanceTotalUSD ?? 0).replace(currency, '')}
        </Typography>
      </Grow>
    </Stack>
  );
}
