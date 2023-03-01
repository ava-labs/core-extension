import {
  BridgeIcon,
  CircularProgress,
  Stack,
  useTheme,
} from '@avalabs/k2-components';
export interface InProgressBridgeIconProp {
  value: number;
}
export function InProgressBridgeIcon({ value }: InProgressBridgeIconProp) {
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
        value={value}
        disableShrink={false}
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
            color: theme.palette.secondary.main,
          }}
        />
      </Stack>
    </Stack>
  );
}
