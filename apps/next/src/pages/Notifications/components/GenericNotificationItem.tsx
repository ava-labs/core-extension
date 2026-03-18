import { FC } from 'react';
import { AppNotification } from '@core/types';
import { NotificationListItem } from './NotificationListItem';
import { NotificationIcon } from './NotificationIcon';

type GenericNotificationItemProps = {
  notification: AppNotification;
  showSeparator: boolean;
  accessoryType: 'chevron' | 'none';
  onClick?: () => void;
};

export const GenericNotificationItem: FC<GenericNotificationItemProps> = ({
  notification,
  showSeparator,
  accessoryType,
  onClick,
}) => {
  return (
    <NotificationListItem
      title={notification.title}
      subtitle={notification.body}
      icon={<NotificationIcon notification={notification} />}
      timestamp={notification.timestamp}
      showSeparator={showSeparator}
      accessoryType={accessoryType}
      onClick={onClick}
    />
  );
};
