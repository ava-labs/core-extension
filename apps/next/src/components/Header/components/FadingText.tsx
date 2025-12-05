import { Typography, styled, TypographyProps } from '@avalabs/k2-alpine';
import { forwardRef, useEffect, useRef, useState } from 'react';

// Base styled component for fading text
const FadingTextBase = styled(Typography)<{ isTruncated?: boolean }>(
  ({ isTruncated }) => ({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    ...(isTruncated && {
      maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
    }),
  }),
);

// Text that fades out only when truncated
export const FadingText = forwardRef<
  HTMLSpanElement,
  TypographyProps & { children?: React.ReactNode }
>((props, ref) => {
  const innerRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const element = innerRef.current;
      if (element) {
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkTruncation();

    const resizeObserver = new ResizeObserver(checkTruncation);
    if (innerRef.current) {
      resizeObserver.observe(innerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [props.children]);

  return (
    <FadingTextBase
      {...props}
      ref={(node) => {
        (innerRef as React.MutableRefObject<HTMLSpanElement | null>).current =
          node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      isTruncated={isTruncated}
    />
  );
});

FadingText.displayName = 'FadingText';
