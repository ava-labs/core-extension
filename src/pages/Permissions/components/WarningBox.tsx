import {
  Alert,
  AlertContent,
  Typography,
  useTheme,
  GppMaybeIcon,
} from '@avalabs/k2-components';

interface WarningBoxProps {
  title: string;
  text: string;
}

export function WarningBox({ title, text }: WarningBoxProps) {
  const theme = useTheme();
  return (
    <Alert
      severity="warning"
      icon={<GppMaybeIcon size={24} color={theme.palette.common.black} />}
      sx={{
        backgroundColor: 'warning.light',
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
