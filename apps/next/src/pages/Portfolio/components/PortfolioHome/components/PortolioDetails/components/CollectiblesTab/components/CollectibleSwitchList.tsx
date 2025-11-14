import { Box } from '@avalabs/k2-alpine';
import { FC, useMemo, memo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { FormattedCollectible } from '../CollectiblesTab';
import { Divider } from '@/pages/Portfolio/components/ManageTokens/components/Divider';
import { CollectibleListItem } from './CollectibleListItem';
import { useContainerHeight } from '@/pages/Portfolio/components/ManageTokens/hooks/useContainerHeight';

interface Props {
  collectibles: FormattedCollectible[];
  hiddenCollectibles: Set<string>;
  toggleCollectible: (collectible: FormattedCollectible) => void;
  filter?: string;
}

export const CollectibleSwitchList: FC<Props> = ({
  collectibles,
  hiddenCollectibles,
  toggleCollectible,
  filter,
}) => {
  const [height, containerRef] = useContainerHeight<HTMLDivElement>(400);

  const filtered = useMemo(
    () =>
      filter
        ? collectibles.filter((collectible) => {
            const normalizedFilter = filter.toLowerCase();
            return (
              collectible.name?.toLowerCase().includes(normalizedFilter) ||
              collectible.collectionName
                ?.toLowerCase()
                .includes(normalizedFilter) ||
              collectible.symbol?.toLowerCase().includes(normalizedFilter)
            );
          })
        : collectibles,
    [filter, collectibles],
  );

  const itemData = useMemo(
    () => ({
      collectibles: filtered,
      hiddenCollectibles,
      toggleCollectible,
    }),
    [filtered, hiddenCollectibles, toggleCollectible],
  );

  return (
    <Box height={1} ref={containerRef}>
      <FixedSizeList
        height={height}
        width="100%"
        itemData={itemData}
        itemCount={filtered.length}
        itemSize={54}
        overscanCount={5}
        style={{ overflow: 'auto', scrollbarWidth: 'none' }}
      >
        {RowRenderer}
      </FixedSizeList>
    </Box>
  );
};

type RowData = {
  collectibles: FormattedCollectible[];
  hiddenCollectibles: Set<string>;
  toggleCollectible: (collectible: FormattedCollectible) => void;
};

const RowRenderer: FC<ListChildComponentProps<RowData>> = memo(
  function RowRenderer({ index, data, style }) {
    const collectible = data.collectibles[index]!;
    const isHidden = data.hiddenCollectibles.has(
      collectible.uniqueCollectibleId,
    );

    return (
      <div key={collectible.uniqueCollectibleId} style={style}>
        <Divider first={index === 0} />
        <CollectibleListItem
          collectible={collectible}
          isHidden={isHidden}
          onToggle={data.toggleCollectible}
        />
      </div>
    );
  },
);
