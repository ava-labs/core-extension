import { FC } from 'react';
import { Alert, AlertType } from '@avalabs/vm-module-types';
import { FiAlertCircle } from 'react-icons/fi';
import { Stack, Box, Typography } from '@avalabs/k2-alpine';

type NoteWarningProps = {
  alert: Alert;
};
const COLOR_BY_ALERT_TYPE: Record<AlertType, string> = {
  [AlertType.DANGER]: 'error.main',
  [AlertType.WARNING]: 'warning.main',
  [AlertType.INFO]: 'info.main',
};

export const NoteWarning: FC<NoteWarningProps> = ({ alert }) => (
  <Stack
    direction="row"
    width="100%"
    px={2}
    mb={2}
    alignItems="center"
    color={COLOR_BY_ALERT_TYPE[alert.type] ?? 'error.main'}
    gap={1}
  >
    <Box flexShrink={0}>
      <FiAlertCircle size={20} />
    </Box>
    <Stack>
      <Typography variant="body3" fontWeight={500}>
        {alert.details.title}
      </Typography>
      <Typography variant="body3">{alert.details.description}</Typography>
    </Stack>
  </Stack>
);
