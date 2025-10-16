import { useEffect, useRef, useState } from 'react';

export function useContainerHeight<E extends HTMLElement>(
  initialHeight?: number,
) {
  const containerRef = useRef<E>(null);
  const [height, setHeight] = useState(initialHeight ?? 0);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [height, containerRef] as const;
}
