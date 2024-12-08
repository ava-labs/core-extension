import { useCallback, useState } from 'react';
import {
  Chip,
  ChipProps,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';

import { WalletDetails } from '@src/background/services/wallet/models';
import { WalletTypeIcon } from '@src/pages/Accounts/components/WalletTypeIcon';

type WalletChipProps = ChipProps & {
  walletDetails: WalletDetails;
};

export const WalletChip = ({
  walletDetails,
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
            {walletDetails.name}
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
