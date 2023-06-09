import {
  Box,
  Stack,
  StackProps,
  Typography,
  useTheme,
} from '@avalabs/k2-components';

type ApprovalSectionHeaderProps = {
  label: string;
};

export const ApprovalSectionHeader: React.FC<ApprovalSectionHeaderProps> = ({
  label,
  children,
}) => (
  <Stack
    sx={{
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Typography component="h2" variant="body2" sx={{ fontWeight: 'semibold' }}>
      {label}
    </Typography>
    <Box>{children}</Box>
  </Stack>
);

export const ApprovalSectionBody = ({ sx = {}, ...rest }: StackProps) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        p: 2,
        gap: 1,
        ...(typeof sx === 'function' ? sx(theme) : sx),
      }}
      {...rest}
    />
  );
};

export const ApprovalSection = ({ sx = {}, ...rest }: StackProps) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '100%',
        gap: 0.5,
        ...(typeof sx === 'function' ? sx(theme) : sx),
      }}
      {...rest}
    />
  );
};
