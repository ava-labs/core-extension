import { Stack, Typography, useTheme } from '@avalabs/k2-components';

type TxDetailsRowProps = { label: string };

export const TxDetailsRow: React.FC<TxDetailsRowProps> = ({
  children,
  label,
}) => {
  const theme = useTheme();

  return (
    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Typography
        component="span"
        sx={{ fontSize: 'body3.fontSize', color: 'text.secondary' }}
      >
        {label}
      </Typography>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          height: theme.spacing(2),
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};
