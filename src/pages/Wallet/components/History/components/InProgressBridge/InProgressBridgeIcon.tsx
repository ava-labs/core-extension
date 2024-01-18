import {
  BridgeIcon,
  CircularProgress,
  Stack,
  useTheme,
} from '@avalabs/k2-components';
export interface InProgressBridgeIconProp {
  value: number;
  hasError?: boolean;
}
export function InProgressBridgeIcon({
  value,
  hasError,
}: InProgressBridgeIconProp) {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        position: 'relative',
        display: 'inline-flex',
        borderRadius: '50%',
        backgroundColor: theme.palette.grey[800],
        height: 32,
        width: 32,
      }}
    >
      <CircularProgress
        variant="determinate"
        size={32}
        thickness={2}
        value={hasError ? 100 : value}
        disableShrink={false}
        color={hasError ? 'error' : 'secondary'}
      />
      <Stack
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 32,
          width: 32,
        }}
      >
        <BridgeIcon
          size={theme.spacing(2)}
          sx={{
            color: hasError
              ? theme.palette.error.main
              : theme.palette.secondary.main,
          }}
        />
      </Stack>
    </Stack>
  );
}
