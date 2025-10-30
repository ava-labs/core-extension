import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  MasonryCellProps,
} from 'react-virtualized';
import { Scrollbars } from 'react-custom-scrollbars-2';

const DEFAULT_GUTTER_SIZE = 10;

export function VirtualisedMasonry({
  columnWidth,
  itemCount,
  cellContentRenderer,
}: {
  columnWidth: number;
  itemCount: number;
  cellContentRenderer: (index: number) => React.ReactNode;
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const masonryRef = useRef<Masonry>(null);
  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        defaultHeight: 120,
        defaultWidth: columnWidth,
        fixedWidth: true,
      }),
    [],
  );

  const cellPositioner = useMemo(() => {
    return createMasonryCellPositioner({
      cellMeasurerCache: cache,
      columnCount: 3,
      columnWidth: columnWidth,
      spacer: DEFAULT_GUTTER_SIZE,
    });
  }, [cache, columnWidth]);

  useEffect(() => {
    cache.clearAll();
    cellPositioner.reset({
      columnCount: Math.max(
        1,
        Math.floor(
          // last column has no gutter
          (size.width + DEFAULT_GUTTER_SIZE) /
            (columnWidth + DEFAULT_GUTTER_SIZE),
        ),
      ),
      columnWidth: columnWidth,
      spacer: DEFAULT_GUTTER_SIZE,
    });
    masonryRef.current?.clearCellPositions();
  }, [size, cellPositioner, cache, columnWidth]);

  const cellRenderer = ({ index, key, parent, style }: MasonryCellProps) => {
    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div style={style}>{cellContentRenderer(index)}</div>
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer onResize={setSize}>
      {({ width, height }) => {
        return (
          <Scrollbars autoHide style={{ width, height }}>
            <Masonry
              ref={masonryRef}
              autoHeight={true}
              cellCount={itemCount}
              cellMeasurerCache={cache}
              cellPositioner={cellPositioner}
              cellRenderer={cellRenderer}
              height={height}
              width={width}
            />
          </Scrollbars>
        );
      }}
    </AutoSizer>
  );
}
