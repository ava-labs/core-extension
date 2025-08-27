import { styled } from '@avalabs/k2-alpine';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useDynamicFontSize = ({
  maxWidth,
  minFontSize,
  maxFontSize,
  text,
}: {
  maxWidth: number;
  minFontSize: number;
  maxFontSize: number;
  text: string;
}) => {
  const element = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    if (!element.current) {
      return;
    }

    let suggestedFontSize = maxFontSize;

    // Find the largest font-size that will fit in the input
    while (true) {
      element.current.textContent = text;
      element.current.style.fontSize = `${suggestedFontSize}px`;

      if (
        element.current.offsetWidth > maxWidth &&
        suggestedFontSize > minFontSize
      ) {
        suggestedFontSize -= 0.5; // Fonts scale nicely with fractional values
      } else {
        break;
      }
    }

    setFontSize(suggestedFontSize);
  }, [element, text, maxWidth, minFontSize, maxFontSize]);

  const measureElement = useCallback(
    () => <MeasureElement ref={element}>{text}</MeasureElement>,
    [text],
  );
  return {
    fontSize,
    measureElement,
  };
};

const MeasureElement = styled('div')({
  userSelect: 'none',
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  padding: 0,
  visibility: 'hidden',
  // background: 'rgba(255, 0, 0, 0.3)', // Uncomment for easier debugging
});
