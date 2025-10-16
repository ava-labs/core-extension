import { useEffect, useCallback, useState } from 'react';

export const useIsIntersecting = (options?: IntersectionObserverInit) => {
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

    const observer = new IntersectionObserver(checkIntersection, options);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [checkIntersection, element, options]);

  return { ref: setElement, isIntersecting, isObserving: !!element };
};
