import { Skeleton } from '@avalabs/core-k2-components';
import { CollectibleWrapper } from './CollectibleWrapper';

export function CollectibleSkeleton() {
  return (
    <CollectibleWrapper>
      {Array.from({ length: 4 }, (_: unknown, i: number) => (
        <Skeleton
          variant="rectangular"
          sx={{
            width: '164px',
            height: '164px',
            mb: 2,
          }}
          key={i}
        />
      ))}{' '}
    </CollectibleWrapper>
  );
}
