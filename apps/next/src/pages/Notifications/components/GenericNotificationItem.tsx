import { FC } from 'react';
import { AppNotification } from '@core/types';
import { NotificationListItem } from './NotificationListItem';
import { NotificationIcon } from './NotificationIcon';
import { hasActionableUrl } from '../lib/hasActionableUrl';
import { openNewTab } from '@core/common';

type GenericNotificationItemProps = {
  notification: AppNotification;
  showSeparator: boolean;
};

export const GenericNotificationItem: FC<GenericNotificationItemProps> = ({
  notification,
  showSeparator,
}) => {
  const url = hasActionableUrl(notification)
    ? notification.deepLinkUrl
    : undefined;

  return (
    <NotificationListItem
      title={notification.title}
      subtitle={notification.body}
      icon={<NotificationIcon notification={notification} />}
      timestamp={notification.timestamp}
      showSeparator={showSeparator}
      accessoryType={url ? 'link' : 'none'}
      onClick={url ? () => openNewTab({ url }) : undefined}
    />
  );
};
