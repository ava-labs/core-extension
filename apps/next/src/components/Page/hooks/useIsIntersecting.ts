import { useEffect, useCallback, useState } from 'react';

export const useIsIntersecting = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const checkIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsIntersecting(entry?.isIntersecting ?? false);
    },
    [],
  );

  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(checkIntersection);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [checkIntersection, element]);

  return { ref: setElement, isIntersecting };
};
