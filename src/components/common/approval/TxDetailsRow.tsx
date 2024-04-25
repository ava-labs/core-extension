import { Stack, Typography, useTheme } from '@avalabs/k2-components';

type TxDetailsRowProps = { label: string };

export const TxDetailsRow: React.FC<TxDetailsRowProps> = ({
  children,
  label,
}) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 1,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          minHeight: theme.spacing(2),
          minWidth: '0px',
          wordWrap: 'break-word',
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};
