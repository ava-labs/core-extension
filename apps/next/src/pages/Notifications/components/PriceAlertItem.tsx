import { FC } from 'react';
import { Typography } from '@avalabs/k2-alpine';
import { AppNotification, isPriceAlertNotification } from '@core/types';
import { NotificationListItem } from './NotificationListItem';
import { NotificationIcon } from './NotificationIcon';

type PriceAlertItemProps = {
  notification: AppNotification;
  showSeparator: boolean;
  accessoryType: 'chevron' | 'none';
  onClick?: () => void;
};

const getTitle = (notification: AppNotification): string => {
  if (!isPriceAlertNotification(notification)) return notification.title;
  const { tokenSymbol, currentPrice } = notification.data ?? {};
  if (!tokenSymbol || currentPrice === undefined) return notification.title;
  return `${tokenSymbol.toUpperCase()} reached $${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PriceSubtitle: FC<{ notification: AppNotification }> = ({
  notification,
}) => {
  if (!isPriceAlertNotification(notification)) return null;
  const { currentPrice, priceChangePercent } = notification.data ?? {};
  if (priceChangePercent === undefined) return null;

  const priceChangeAmount =
    currentPrice !== undefined
      ? (currentPrice * priceChangePercent) / 100
      : undefined;
  const isPositive = priceChangePercent >= 0;
  const sign = isPositive ? '+' : '';
  const color = isPositive ? 'success.main' : 'error.main';

  return (
    <Typography variant="caption" component="span">
      {priceChangeAmount !== undefined && (
        <Typography variant="caption" component="span" color={color}>
          {`${sign}$${Math.abs(priceChangeAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `}
        </Typography>
      )}
      <Typography variant="caption" component="span" color="text.primary">
        {`${Math.abs(priceChangePercent).toFixed(2)}%`}
      </Typography>
    </Typography>
  );
};

export const PriceAlertItem: FC<PriceAlertItemProps> = ({
  notification,
  showSeparator,
  accessoryType,
  onClick,
}) => {
  return (
    <NotificationListItem
      title={getTitle(notification)}
      subtitle={<PriceSubtitle notification={notification} />}
      icon={<NotificationIcon notification={notification} />}
      timestamp={notification.timestamp}
      showSeparator={showSeparator}
      accessoryType={accessoryType}
      onClick={onClick}
    />
  );
};
