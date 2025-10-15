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
  const truncateWalletName =
    walletDetails.name && walletDetails.name.length > 12
      ? `${walletDetails.name.slice(0, 9)}...`
      : walletDetails.name;

  return (
    <Tooltip
      title={
        truncateWalletName?.includes('...')
          ? `${walletDetails.name}: ${walletBalance ?? ''}`
          : ''
      }
      placement="bottom"
    >
      <Chip
        icon={
          <WalletTypeIcon
            walletDetails={walletDetails}
            size={16}
            sx={{ flexShrink: 0 }}
          />
        }
        label={
          <Typography variant="caption">
            {truncateWalletName}:{' '}
            {isWalletBalanceLoading ? (
              <CircularProgress size={10} color="primary" sx={{ ml: '2px' }} />
            ) : (
              walletBalance
            )}
          </Typography>
        }
        size="small"
        sx={[
          {
            gap: 0.5,
            backgroundColor: 'grey.850',
            '& .MuiChip-label': {
              overflow: 'hidden',
              textOverflow: 'clip',
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      />
    </Tooltip>
  );
};
