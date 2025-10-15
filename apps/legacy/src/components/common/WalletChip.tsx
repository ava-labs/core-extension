import { useCallback, useState } from 'react';
import {
  Chip,
  ChipProps,
  CircularProgress,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';

import { WalletDetails } from '@core/types';
import { WalletTypeIcon } from '@/pages/Accounts/components/WalletTypeIcon';

type WalletChipProps = ChipProps & {
  walletDetails: WalletDetails;
  walletBalance?: string;
  isWalletBalanceLoading?: boolean;
};

export const WalletChip = ({
  walletDetails,
  walletBalance,
  isWalletBalanceLoading,
  sx,
  ...props
}: WalletChipProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  const onLabelChange = useCallback((label: HTMLSpanElement) => {
    if (label?.parentElement) {
      setIsOverflowing(
        label.parentElement.scrollWidth > label.parentElement.offsetWidth,
      );
    }
  }, []);

  return (
    <Tooltip title={isOverflowing ? walletDetails.name : ''} placement="bottom">
      <Chip
        icon={
          <WalletTypeIcon
            walletDetails={walletDetails}
            size={16}
            sx={{ flexShrink: 0 }}
          />
        }
        label={
          <Typography variant="caption" ref={onLabelChange}>
            {walletDetails.name}:{' '}
            {isWalletBalanceLoading ? (
              <CircularProgress size={10} color="primary" sx={{ ml: '2px' }} />
            ) : (
              walletBalance
            )}
          </Typography>
        }
        size="small"
        sx={[
          { gap: 0.5, backgroundColor: 'grey.850' },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      />
    </Tooltip>
  );
};
