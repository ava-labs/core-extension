import { useCallback, useEffect, useState } from 'react';

export const useIsIntersecting = (options) => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const isIntersectingCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsIntersecting(entry?.isIntersecting ?? false);
    },
    []
  );

  useEffect(() => {
    const { ref } = options;
    let observerRefValue = null;

    const observer = new IntersectionObserver(isIntersectingCallback);

    if (ref.current) {
      observerRefValue = ref.current;
      observer.observe(ref.current);
    }

    return () => {
      if (observerRefValue) observer.unobserve(observerRefValue);
    };
  }, [isIntersectingCallback, options]);

  return isIntersecting;
};
