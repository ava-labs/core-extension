import { FC } from 'react';
import { Alert } from '@avalabs/vm-module-types';
import { FiAlertCircle } from 'react-icons/fi';
import { Stack, Box, Typography } from '@avalabs/k2-alpine';

type NoteWarningProps = {
  alert: Alert;
};

export const NoteWarning: FC<NoteWarningProps> = ({ alert }) => (
  <Stack
    direction="row"
    width="100%"
    px={2}
    mb={2}
    alignItems="center"
    color="error.main"
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
