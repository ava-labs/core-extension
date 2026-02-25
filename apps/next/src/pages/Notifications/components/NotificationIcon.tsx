import { FC } from 'react';
import { Box, useTheme } from '@avalabs/k2-alpine';
import { MdCallMade, MdCheck, MdTrendingUp } from 'react-icons/md';
import {
  AppNotification,
  BalanceChangeEventSchema,
  isBalanceChangeNotification,
} from '@core/types';
import { useNetworkContext } from '@core/ui';
import CoreLogoDark from '@/images/core.svg';
import CoreLogoLight from '@/images/core-light.svg';
import { ChainBadge } from '@/components/ChainBadge';

const ICON_SIZE = 32;
const CHAIN_BADGE_SIZE = 14;

type NotificationIconProps = {
  notification: AppNotification;
};

export const NotificationIcon: FC<NotificationIconProps> = ({
  notification,
}) => {
  const theme = useTheme();
  const { getNetwork } = useNetworkContext();
  const iconColor = theme.palette.text.primary;
  const isNews = notification.type === 'NEWS';
  const isLightMode = theme.palette.mode === 'light';

  const renderBalanceChangeIcon = () => {
    if (!isBalanceChangeNotification(notification)) {
      return <MdCallMade size={16} color={iconColor} />;
    }
    const event = notification.data?.event;
    if (
      event === BalanceChangeEventSchema.enum.BALANCES_SPENT ||
      event === BalanceChangeEventSchema.enum.BALANCES_TRANSFERRED
    ) {
      return <MdCallMade size={16} color={iconColor} />;
    }
    if (event === BalanceChangeEventSchema.enum.ALLOWANCE_APPROVED) {
      return <MdCheck size={16} color={iconColor} />;
    }
    // Received: rotate ArrowOutward 90° to point down-left
    return (
      <Box sx={{ transform: 'rotate(180deg)', display: 'flex' }}>
        <MdCallMade size={16} color={iconColor} />
      </Box>
    );
  };

  const renderIcon = () => {
    switch (notification.type) {
      case 'BALANCE_CHANGES':
        return renderBalanceChangeIcon();
      case 'PRICE_ALERTS':
        return <MdTrendingUp size={16} color={iconColor} />;
      case 'NEWS':
      default:
        return (
          <img
            src={isLightMode ? CoreLogoLight : CoreLogoDark}
            alt="Core"
            width={24}
            height={7}
          />
        );
    }
  };

  const renderChainBadge = () => {
    if (!isBalanceChangeNotification(notification)) return null;
    const chainId = notification.data?.chainId;
    if (!chainId) return null;

    const network = getNetwork(Number(chainId));
    if (!network) return null;

    return (
      <Box
        sx={{
          position: 'absolute',
          bottom: -2,
          right: -2,
        }}
      >
        <ChainBadge coreChainId={Number(chainId)} size={CHAIN_BADGE_SIZE} />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: ICON_SIZE,
        height: ICON_SIZE,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: '50%',
          backgroundColor: isNews
            ? isLightMode
              ? '#28282E'
              : '#FFFFFF'
            : theme.palette.action.hover,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {renderIcon()}
      </Box>
      {renderChainBadge()}
    </Box>
  );
};
