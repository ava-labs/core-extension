import {
  CircularProgress,
  Skeleton,
  Stack,
  StackProps,
  Typography,
} from '@avalabs/k2-alpine';

export const AccountInfoSkeleton = (props: StackProps) => {
  return (
    <Stack {...props}>
      <Typography variant="body3">
        <Skeleton variant="text" width={150} />
      </Typography>
      <Stack
        position="relative"
        overflow="visible"
        maxWidth="75%"
        width="fit-content"
        rowGap={0.25}
      >
        <Stack direction="row" alignItems="center" mt={-0.5}>
          <Typography variant="h2">
            <Skeleton variant="text" width={150} />
          </Typography>
          <CircularProgress size={16} />
        </Stack>

        <Typography variant="h2">
          <Skeleton variant="text" width={120} />
        </Typography>
      </Stack>

      <Skeleton variant="rounded" height={17} sx={{ mb: 0.5 }} width={85} />
    </Stack>
  );
};
