import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { MdCheckCircle } from 'react-icons/md';
import { AppNotification } from '@core/types';

import { getRecurringSwapsPath } from '@/config/routes';

import { NotificationListItem } from './NotificationListItem';
import { NotificationIcon } from './NotificationIcon';
import {
  getRecurringSwapStatusDisplay,
  RECURRING_SWAP_SEVERITY_COLOR,
  RecurringSwapStatusSeverity,
} from '../lib/getRecurringSwapStatus';

type RecurringSwapItemProps = {
  notification: Extract<AppNotification, { type: 'RECURRING_SWAP' }>;
  showSeparator: boolean;
};

const SeverityIcon: Record<
  RecurringSwapStatusSeverity,
  FC<{ size: number; color: string }> | null
> = {
  success: MdCheckCircle,
  neutral: null,
};

export const RecurringSwapItem: FC<RecurringSwapItemProps> = ({
  notification,
  showSeparator,
}) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const theme = useTheme();

  const status = getRecurringSwapStatusDisplay(notification.data?.status, t);
  const Icon = status ? SeverityIcon[status.severity] : null;
  const colorPath = status
    ? RECURRING_SWAP_SEVERITY_COLOR[status.severity]
    : undefined;
  const iconColorBySeverity: Record<RecurringSwapStatusSeverity, string> = {
    success: theme.palette.success.main,
    neutral: theme.palette.text.secondary,
  };
  const iconColor = status ? iconColorBySeverity[status.severity] : '';

  const subtitle = (
    <Stack gap={0.25}>
      <Typography variant="caption" color="text.secondary">
        {notification.body}
      </Typography>
      {status && (
        <Stack direction="row" alignItems="center" gap={0.5}>
          {Icon && <Icon size={12} color={iconColor} />}
          <Typography variant="caption" color={colorPath}>
            {status.label}
          </Typography>
        </Stack>
      )}
    </Stack>
  );

  return (
    <NotificationListItem
      title={notification.title}
      subtitle={subtitle}
      icon={<NotificationIcon notification={notification} />}
      timestamp={notification.timestamp}
      showSeparator={showSeparator}
      accessoryType="chevron"
      onClick={() => push(getRecurringSwapsPath())}
    />
  );
};
