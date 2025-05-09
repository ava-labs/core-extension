import {
  Card,
  CircularProgress,
  Grow,
  IconButton,
  Stack,
  Typography,
  XIcon,
} from '@avalabs/core-k2-components';

export const SwapPendingToast = ({ onDismiss, children }) => (
  <Grow in>
    <Card sx={{ width: 250, position: 'relative', p: 2 }}>
      <IconButton
        sx={{ position: 'absolute', top: 4, right: 4 }}
        onClick={onDismiss}
      >
        <XIcon size={16} />
      </IconButton>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
        <Typography variant="h6">{children}</Typography>
        <CircularProgress size={12} sx={{ ml: 1 }} color="primary" />
      </Stack>
    </Card>
  </Grow>
);
