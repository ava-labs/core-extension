import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/**
 * Pixels of slack allowed when deciding whether a scroller reached its end.
 * Accounts for sub-pixel rounding of scrollTop / scrollHeight across zoom levels.
 */
export const SCROLL_END_TOLERANCE_PX = 4;

const canScrollVertically = (element: HTMLElement) => {
  if (element.scrollHeight - element.clientHeight <= SCROLL_END_TOLERANCE_PX) {
    return false;
  }
  const { overflowY } = window.getComputedStyle(element);
  return overflowY === 'auto' || overflowY === 'scroll';
};

type FullScrollReview<T extends HTMLElement> = {
  containerRef: RefObject<T | null>;
  hasReviewedAll: boolean;
};

/**
 * Tracks every vertically scrollable element inside `containerRef` (the
 * container itself included) and reports whether the user has scrolled each of
 * them to the end. Content that fits without scrolling counts as reviewed.
 *
 * The furthest point reached is remembered per scroller, so scrolling back up
 * or re-measuring does not re-lock the user; only content that grows beyond
 * the furthest point already reached does.
 */
export const useFullScrollReview = <
  T extends HTMLElement = HTMLDivElement,
>(): FullScrollReview<T> => {
  const containerRef = useRef<T>(null);
  const furthestReached = useRef(new WeakMap<Element, number>());
  const [hasReviewedAll, setHasReviewedAll] = useState(false);

  const evaluate = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const elements = [
      container,
      ...Array.from(container.querySelectorAll<HTMLElement>('*')),
    ];

    let allReviewed = true;
    for (const element of elements) {
      if (!canScrollVertically(element)) {
        continue;
      }
      const reached = Math.max(
        furthestReached.current.get(element) ?? 0,
        element.scrollTop + element.clientHeight,
      );
      furthestReached.current.set(element, reached);

      if (reached < element.scrollHeight - SCROLL_END_TOLERANCE_PX) {
        allReviewed = false;
      }
    }

    setHasReviewedAll(allReviewed);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let isScheduled = false;
    let frame = 0;
    const scheduleEvaluate = () => {
      if (isScheduled) {
        return;
      }
      isScheduled = true;
      frame = window.requestAnimationFrame(() => {
        isScheduled = false;
        evaluate();
      });
    };

    evaluate();

    // Scroll events do not bubble, so listen in the capture phase to catch
    // scrolling of any nested scroller (outer page and inner message box).
    container.addEventListener('scroll', scheduleEvaluate, true);
    window.addEventListener('resize', scheduleEvaluate);

    const mutationObserver = new MutationObserver(scheduleEvaluate);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(scheduleEvaluate);
    resizeObserver?.observe(container);

    return () => {
      if (isScheduled) {
        window.cancelAnimationFrame(frame);
      }
      container.removeEventListener('scroll', scheduleEvaluate, true);
      window.removeEventListener('resize', scheduleEvaluate);
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, [evaluate]);

  return { containerRef, hasReviewedAll };
};
