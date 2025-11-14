import {
  CircularProgress,
  CircularProgressProps,
  Stack,
  Typography,
  TypographyProps,
} from '@avalabs/k2-alpine';
import { FC, PropsWithChildren } from 'react';

export const InProgress: FC<
  PropsWithChildren<{
    textSize: TypographyProps['variant'];
    loaderSize?: CircularProgressProps['size'];
  }>
> = ({ children, textSize, loaderSize }) => {
  return (
    <Stack
      width={1}
      height={1}
      gap={2}
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={loaderSize} />
      <Typography variant={textSize}>{children}</Typography>
    </Stack>
  );
};
