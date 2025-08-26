import { Stack, StackProps, Typography } from '@avalabs/k2-alpine';

type TxDetailsRowProps = StackProps & {
  label: string;
};

export const TxDetailsRow = ({
  label,
  children,
  ...rest
}: TxDetailsRowProps) => (
  <Stack
    direction="row"
    gap={1}
    px={2}
    py={0.5}
    minHeight={36}
    alignItems="center"
    justifyContent="space-between"
    {...rest}
  >
    <Typography variant="body3">{label}</Typography>
    {children}
  </Stack>
);
