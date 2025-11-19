import { NoScrollStack } from '@/components/NoScrollStack';
import { Skeleton } from '@avalabs/k2-alpine';

export const TransactionListSkeleton = () => {
  return (
    <NoScrollStack gap={1} py={2}>
      <Skeleton variant="rounded" height={16} width="10ch" />
      <Skeleton variant="rounded" height={42} />
      <Skeleton variant="rounded" height={42} />
      <Skeleton variant="rounded" height={42} />
    </NoScrollStack>
  );
};
