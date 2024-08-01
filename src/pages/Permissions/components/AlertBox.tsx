import {
  Alert,
  AlertContent,
  Typography,
  useTheme,
  RemoveModeratorIcon,
} from '@avalabs/core-k2-components';

interface AlertBoxProps {
  title: string;
  text: string;
}

export function AlertBox({ title, text }: AlertBoxProps) {
  const theme = useTheme();

  return (
    <Alert
      severity="error"
      icon={
        <RemoveModeratorIcon size={24} color={theme.palette.common.black} />
      }
      sx={{
        backgroundColor: 'error.light',
        borderColor: 'transparent',
        px: 2,
        color: 'common.black',
        width: '100%',
      }}
    >
      <AlertContent>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, display: 'block' }}
        >
          {title}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          {text}
        </Typography>
      </AlertContent>
    </Alert>
  );
}
