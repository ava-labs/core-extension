import { NoScrollStack } from '@/components/NoScrollStack';
import { Box, CircularProgress, Skeleton } from '@avalabs/k2-alpine';

/** Centered spinner while activity history is loading (network switch or initial load). */
export const ActivityHistoryLoadingIndicator = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      mt: 5,
    }}
  >
    <CircularProgress size={24} />
  </Box>
);

export const TransactionListSkeleton = () => {
  return (
    <NoScrollStack stackProps={{ gap: 1, py: 2, overflow: 'clip' }}>
      <Skeleton variant="rounded" height={16} width="10ch" animation="wave" />
      <Skeleton variant="rounded" height={42} animation="wave" width="98%" />
      <Skeleton variant="rounded" height={42} animation="wave" width="98%" />
    </NoScrollStack>
  );
};
