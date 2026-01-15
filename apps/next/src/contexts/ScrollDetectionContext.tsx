import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

type ScrollDetectionContextType = {
  isAtTop: boolean;
};

const ScrollDetectionContext = createContext<ScrollDetectionContextType>({
  isAtTop: true,
});

export const useScrollDetectionContext = () =>
  useContext(ScrollDetectionContext);

export const ScrollDetectionProvider = ({ children }: PropsWithChildren) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const container = document.querySelector(
      '[data-scroll-container="portfolio-content"]',
    );

    if (!container) {
      return;
    }

    setIsAtTop(container.scrollTop <= 5);

    const sentinel = document.createElement('div');

    sentinel.setAttribute('data-scroll-sentinel', 'true');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.height = '1px';
    sentinel.style.width = '1px';
    sentinel.style.pointerEvents = 'none';

    if (getComputedStyle(container).position === 'static') {
      (container as HTMLElement).style.position = 'relative';
    }

    container.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }
        setIsAtTop(entry.isIntersecting);
      },
      {
        root: null, // viewport
        threshold: 1, // fully visible = at top
        rootMargin: '5px 0px 0px 0px', // 5px above the sentinel
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <ScrollDetectionContext.Provider value={{ isAtTop }}>
      {children}
    </ScrollDetectionContext.Provider>
  );
};
