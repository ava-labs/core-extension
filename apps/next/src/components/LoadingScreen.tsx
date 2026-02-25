import { CircularProgress, Stack, StackProps } from '@avalabs/k2-alpine';

export const LoadingScreen = (props: StackProps) => {
  return (
    <Stack
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <CircularProgress size={48} color="info" />
    </Stack>
  );
};
