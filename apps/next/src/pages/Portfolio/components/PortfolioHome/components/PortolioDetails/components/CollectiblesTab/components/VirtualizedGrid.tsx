import { Box } from '@avalabs/k2-alpine';
import { useRef, useState, useLayoutEffect, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { FormattedCollectible } from '../CollectiblesTab';

const COLUMNS = 3;
const GUTTER = 10;

export function VirtualizedGrid({
  items,
  cellRenderer,
}: {
  items: FormattedCollectible[];
  cellRenderer: (
    item: FormattedCollectible,
    index: number,
    virtualizer: ReturnType<typeof useVirtualizer>,
  ) => React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState(0);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      // Calculate column width: total width minus gutters between columns (no left/right gutters)
      setColumnWidth((width - GUTTER * (COLUMNS - 1)) / COLUMNS);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Find the scroll container by data attribute
  const getScrollElement = useCallback(() => {
    return document.querySelector('[data-scroll-container]');
  }, []);

  // Calculate scrollMargin to align virtualizer with external scroll container
  useLayoutEffect(() => {
    const scrollElement = getScrollElement();
    if (!scrollElement || !containerRef.current) return;

    const update = () => {
      const scrollRect = scrollElement.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      const scrollTop =
        scrollElement === document.documentElement
          ? window.scrollY || document.documentElement.scrollTop
          : scrollElement.scrollTop;
      // Distance from the top edge of the scroll area to the container top, in scroll coordinates
      setScrollMargin(containerRect.top - scrollRect.top + scrollTop);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(scrollElement);
    ro.observe(containerRef.current);

    // Listen to scroll events
    scrollElement.addEventListener('scroll', update, { passive: true });

    return () => {
      ro.disconnect();
      scrollElement.removeEventListener('scroll', update);
    };
  }, [getScrollElement]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement,
    estimateSize: () => 92,
    lanes: COLUMNS,
    gap: GUTTER,
    overscan: 5,
    scrollMargin,
  });

  // Create a key that changes when items change (for filters, sort, showHidden toggle)
  // This ensures we remeasure when items are reordered or filtered
  const itemsKey = useMemo(
    () => items.map((item) => item.uniqueCollectibleId).join(','),
    [items],
  );

  // Remeasure all items when items change (filters, sort, showHidden toggle)
  useLayoutEffect(() => {
    virtualizer.measure();
  }, [itemsKey, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();

  if (columnWidth === 0) {
    return <Box ref={containerRef} sx={{ width: '100%' }} />;
  }

  return (
    <Box
      ref={containerRef}
      key={itemsKey}
      sx={{ position: 'relative', width: '100%' }}
    >
      <Box
        sx={{
          height: `${totalHeight}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((vi) => {
          const item = items[vi.index];
          if (!item) return null;
          // Calculate left position: column position * (column width + gutter) - no initial gutter
          const left = vi.lane * (columnWidth + GUTTER);
          const top = vi.start - scrollMargin;

          return (
            <Box
              key={item.uniqueCollectibleId}
              data-index={vi.index}
              sx={{
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                width: `${columnWidth}px`,
              }}
            >
              {cellRenderer(item, vi.index, virtualizer)}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
