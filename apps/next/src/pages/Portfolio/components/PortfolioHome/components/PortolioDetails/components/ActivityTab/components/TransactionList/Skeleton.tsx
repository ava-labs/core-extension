import { NoScrollStack } from '@/components/NoScrollStack';
import { Skeleton } from '@avalabs/k2-alpine';

export const TransactionListSkeleton = () => {
  return (
    <NoScrollStack stackProps={{ gap: 1, py: 2, overflow: 'clip' }}>
      <Skeleton variant="rounded" height={16} width="10ch" animation="wave" />
      <Skeleton variant="rounded" height={42} animation="wave" width="98%" />
      <Skeleton variant="rounded" height={42} animation="wave" width="98%" />
    </NoScrollStack>
  );
};
