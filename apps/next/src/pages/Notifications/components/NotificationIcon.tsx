import { ComponentType, FC } from 'react';
import { Box, useTheme, withThemeInvert } from '@avalabs/k2-alpine';
import { MdCallMade, MdCheck, MdTrendingUp } from 'react-icons/md';
import {
  AppNotification,
  BalanceChangeEvent,
  isBalanceChangeNotification,
} from '@core/types';
import { useNetworkContext } from '@core/ui';
import CoreLogoDark from '@/images/core.svg';
import CoreLogoLight from '@/images/core-light.svg';
import { ChainBadge } from '@/components/ChainBadge';

const InvertedBox = withThemeInvert(Box);

const ICON_SIZE = 32;
const CHAIN_BADGE_SIZE = 14;

const ReceivedIcon: ComponentType<{ size: number; color: string }> = (
  props,
) => (
  <Box sx={{ transform: 'rotate(180deg)', display: 'flex' }}>
    <MdCallMade {...props} />
  </Box>
);

const IconForEvent: Record<
  BalanceChangeEvent,
  ComponentType<{ size: number; color: string }>
> = {
  BALANCES_SPENT: MdCallMade,
  BALANCES_TRANSFERRED: MdCallMade,
  ALLOWANCE_APPROVED: MdCheck,
  BALANCES_RECEIVED: ReceivedIcon,
};

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

  const renderIcon = () => {
    switch (notification.type) {
      case 'BALANCE_CHANGES': {
        const event = isBalanceChangeNotification(notification)
          ? notification.data?.event
          : undefined;
        const IconComponent = event ? IconForEvent[event] : MdCallMade;
        return <IconComponent size={16} color={iconColor} />;
      }
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
      {isNews ? (
        <InvertedBox
          sx={(invertedTheme) => ({
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: '50%',
            backgroundColor: invertedTheme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          {renderIcon()}
        </InvertedBox>
      ) : (
        <Box
          sx={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: '50%',
            backgroundColor: theme.palette.action.hover,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderIcon()}
        </Box>
      )}
      {renderChainBadge()}
    </Box>
  );
};
