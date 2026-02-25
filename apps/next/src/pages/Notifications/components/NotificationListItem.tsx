import { FC, ReactNode } from 'react';
import { Box, Divider, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { format, isToday } from 'date-fns';
import { MdChevronRight } from 'react-icons/md';

type NotificationListItemProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: React.JSX.Element;
  timestamp?: number;
  showSeparator?: boolean;
  accessoryType?: 'chevron' | 'none';
  onClick?: () => void;
};

export const NotificationListItem: FC<NotificationListItemProps> = ({
  title,
  subtitle,
  icon,
  timestamp,
  showSeparator = true,
  accessoryType = 'chevron',
  onClick,
}) => {
  const theme = useTheme();

  const formattedTime =
    timestamp !== undefined
      ? isToday(new Date(timestamp))
        ? format(new Date(timestamp), 'h:mm a')
        : format(new Date(timestamp), 'MMM d')
      : undefined;

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? { backgroundColor: theme.palette.action.hover }
          : undefined,
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.5} minHeight={45}>
        {icon && (
          <Box flexShrink={0} display="flex">
            {icon}
          </Box>
        )}
        <Stack
          direction="row"
          flex={1}
          alignItems="center"
          justifyContent="space-between"
          gap={1.5}
          py={1}
          minWidth={0}
        >
          <Stack flexGrow={1} minWidth={0} gap={0.25}>
            <Typography variant="subtitle2" noWrap color="text.primary">
              {title}
            </Typography>
            {subtitle &&
              (typeof subtitle === 'string' ? (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {subtitle}
                </Typography>
              ) : (
                subtitle
              ))}
          </Stack>
          <Stack direction="row" alignItems="center" gap={1} flexShrink={0}>
            {formattedTime && (
              <Typography variant="caption" color="text.secondary">
                {formattedTime}
              </Typography>
            )}
            {accessoryType === 'chevron' && (
              <MdChevronRight size={12} color={theme.palette.text.secondary} />
            )}
          </Stack>
        </Stack>
      </Stack>
      {showSeparator && <Divider sx={{ ml: 5.5 }} />}
    </Box>
  );
};
