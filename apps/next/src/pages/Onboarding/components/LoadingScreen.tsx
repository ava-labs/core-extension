import { FC } from 'react';
import { CircularProgress, Stack, StackProps } from '@avalabs/k2-alpine';

export const LoadingScreen: FC<StackProps> = (props) => (
  <Stack
    data-testid="loading-screen"
    width="100%"
    height="100%"
    justifyContent="center"
    alignItems="center"
    {...props}
  >
    <CircularProgress />
  </Stack>
);
