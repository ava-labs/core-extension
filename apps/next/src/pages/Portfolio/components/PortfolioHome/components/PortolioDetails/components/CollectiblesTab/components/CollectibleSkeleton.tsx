import { Skeleton } from '@avalabs/k2-alpine';
import { VirtualisedMasonry } from './VirtualisedMasonry';

const heights = [130, 100, 120, 120, 120, 120];
const DEFAULT_COLUMN_WIDTH = 92;

export function CollectibleSkeleton() {
  const cellRenderer = (index: number) => {
    return (
      <Skeleton
        variant="rounded"
        width={92}
        height={heights[index]}
        key={index}
      />
    );
  };

  return (
    <VirtualisedMasonry
      columnWidth={DEFAULT_COLUMN_WIDTH}
      itemCount={heights.length}
      cellContentRenderer={cellRenderer}
    />
  );
}
