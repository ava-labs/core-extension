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
    columnWidth: number,
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
      const newColumnWidth = (width - GUTTER * (COLUMNS - 1)) / COLUMNS;
      setColumnWidth(newColumnWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);

    // Also listen to window resize as a fallback
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
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

  // Memoize estimateSize to ensure it uses the latest columnWidth value
  const estimateSize = useMemo(() => () => columnWidth || 92, [columnWidth]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement,
    estimateSize,
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

  const virtualItems = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();

  // Remeasure all items when items change (filters, sort, showHidden toggle) or column width changes (window resize)
  useLayoutEffect(() => {
    if (columnWidth > 0) {
      // Use requestAnimationFrame to ensure DOM has updated before measuring
      requestAnimationFrame(() => {
        // Measure all items to recalculate layout
        virtualizer.measure();
      });
    }
  }, [itemsKey, columnWidth, virtualizer]);

  if (columnWidth === 0) {
    return <Box ref={containerRef} sx={{ width: '100%' }} />;
  }

  return (
    <Box
      ref={containerRef}
      key={`${itemsKey}-${columnWidth}`}
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
              {cellRenderer(item, vi.index, virtualizer, columnWidth)}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
