import { CircularProgress, Stack } from '@avalabs/k2-alpine';

export const LoadingScreen = () => {
  return (
    <Stack
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={48} />
    </Stack>
  );
};
