import { useEffect, useRef, useCallback } from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  MasonryCellProps,
} from 'react-virtualized';
import { FormattedCollectible } from '../CollectiblesTab';

const DEFAULT_GUTTER_SIZE = 10;
const DEFAULT_COLUMN_WIDTH = 200;
const DEFAULT_HEIGHT = 92;

export function VirtualisedMasonry({
  columnWidth = DEFAULT_COLUMN_WIDTH,
  items,
  cellContentRenderer,
}: {
  columnWidth?: number;
  items: FormattedCollectible[];
  cellContentRenderer?: (
    index: number,
    onImageLoaded?: () => void,
  ) => React.ReactNode;
}) {
  const masonryRef = useRef<Masonry>(null);

  // Create stable cache - never recreate it
  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: DEFAULT_HEIGHT,
      defaultWidth: columnWidth,
      fixedWidth: true,
    }),
  ).current;

  // Create stable cellPositioner
  const cellPositioner = useRef(
    createMasonryCellPositioner({
      cellMeasurerCache: cache,
      columnCount: 3,
      columnWidth: columnWidth,
      spacer: DEFAULT_GUTTER_SIZE,
    }),
  ).current;

  // Reset when items change
  useEffect(() => {
    cache.clearAll();
    cellPositioner.reset({
      columnCount: 3,
      columnWidth: columnWidth,
      spacer: DEFAULT_GUTTER_SIZE,
    });
    if (masonryRef.current) {
      masonryRef.current.clearCellPositions();
      masonryRef.current.recomputeCellPositions();
    }
  }, [items.length, cache, cellPositioner, columnWidth]);

  // Stable cellRenderer - access items/cellContentRenderer from closure
  const cellRenderer = useCallback(
    ({ index, key, parent, style }: MasonryCellProps) => {
      return (
        <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
          {({ measure, registerChild }) => (
            <div style={style} ref={registerChild}>
              {cellContentRenderer ? cellContentRenderer(index, measure) : null}
            </div>
          )}
        </CellMeasurer>
      );
    },
    [cache, cellContentRenderer],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AutoSizer>
        {({ width, height }) => {
          if (!width || !height) {
            return null;
          }

          return (
            <Masonry
              ref={masonryRef}
              autoHeight={false}
              cellCount={items.length}
              cellMeasurerCache={cache}
              cellPositioner={cellPositioner}
              cellRenderer={cellRenderer}
              height={height}
              width={width}
              overscanByPixels={100}
            />
          );
        }}
      </AutoSizer>
    </div>
  );
}
