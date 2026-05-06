import {
  Box,
  keyframes,
  Link,
  Stack,
  styled,
  Tooltip,
  type TooltipProps,
  Typography,
} from '@avalabs/k2-alpine';
import { LinkItem } from '@avalabs/vm-module-types';
import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarningAmber } from 'react-icons/md';

import { TxDetailsRow } from './DetailRow';

type LinkDetailProps = {
  item: LinkItem;
};

export const LinkDetail = ({ item }: LinkDetailProps) => {
  const { t } = useTranslation();
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowPx, setOverflowPx] = useState(0);

  // We observe the rendered text element so the overflow distance stays
  // accurate when (a) the URL changes and (b) the available width changes
  // — most notably when the truncation indicator is added/removed, which
  // itself shrinks the available space for the URL.
  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) {
      return;
    }

    const measure = () => {
      const overflow = node.scrollWidth - node.offsetWidth;
      const next = overflow > 0 ? overflow : 0;
      setOverflowPx((prev) => (prev === next ? prev : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [item.value.url]);

  if (isExtensionItself(item.value.url)) {
    return null;
  }

  const fullUrl = item.value.url;
  const hostname = getWebsiteDomain(fullUrl);
  const isTruncated = overflowPx > 0;
  const truncationHintLabel = t('URL is truncated. Hover to see full address.');
  const marqueeStyle: CSSProperties | undefined = isTruncated
    ? ({
        '--marquee-distance': `-${overflowPx}px`,
        '--marquee-duration': `${getMarqueeDuration(overflowPx)}s`,
      } as CSSProperties)
    : undefined;

  return (
    <TxDetailsRow label={item.label}>
      <UrlContainer>
        <Tooltip title={fullUrl} slotProps={tooltipSlotProps} arrow>
          <UrlBlock>
            {item.value.icon && (
              <Favicon
                sx={{ backgroundImage: `url(${item.value.icon})` }}
                role="presentation"
              />
            )}
            <UrlLink
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('Open {{url}} in a new tab', { url: fullUrl })}
            >
              <TruncatedUrl ref={textRef} variant="body3" color="text.primary">
                {isTruncated ? (
                  <MarqueeText data-marquee="true" style={marqueeStyle}>
                    {hostname}
                  </MarqueeText>
                ) : (
                  hostname
                )}
              </TruncatedUrl>
            </UrlLink>
          </UrlBlock>
        </Tooltip>
        {isTruncated && (
          <Tooltip title={truncationHintLabel} arrow>
            <TruncationHint aria-label={truncationHintLabel}>
              <MdWarningAmber size={16} />
            </TruncationHint>
          </Tooltip>
        )}
      </UrlContainer>
    </TxDetailsRow>
  );
};

// Round-trip at ~30 px/s plus ~2s of pauses at each end so the user has time
// to read both ends of the URL before it scrolls back.
const getMarqueeDuration = (overflowPx: number) =>
  Math.max(6, (overflowPx * 2) / 30 + 2);

const bounceMarquee = keyframes`
  0%, 12% {
    transform: translateX(0);
  }
  50%, 62% {
    transform: translateX(var(--marquee-distance, 0));
  }
  100% {
    transform: translateX(0);
  }
`;

const tooltipSlotProps: TooltipProps['slotProps'] = {
  tooltip: {
    sx: { wordBreak: 'break-all' },
  },
};

const UrlContainer = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  flex: 1,
  minWidth: 0,
  justifyContent: 'flex-end',
  textAlign: 'right',
  // Pause the marquee whenever the user hovers anywhere on the URL row
  // (favicon, link, warning icon) so they can read it at rest.
  '&:hover [data-marquee="true"], &:focus-within [data-marquee="true"]': {
    animationPlayState: 'paused',
  },
});

// Wraps the favicon + link as a single hover surface for the URL tooltip.
// It must shrink to share space with the truncation indicator.
const UrlBlock = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  minWidth: 0,
  overflow: 'hidden',
});

const Favicon = styled(Box)({
  width: 20,
  height: 20,
  flexShrink: 0,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
});

const UrlLink = styled(Link)({
  overflow: 'hidden',
  minWidth: 0,
  display: 'block',
});

const TruncatedUrl = styled(Typography)({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  display: 'block',
});

// Inline child that gets the marquee transform. Keeping the transform on a
// child rather than on TruncatedUrl itself means TruncatedUrl's clip
// rectangle stays put — only the text inside slides — so each frame of the
// animation actually reveals new characters.
const MarqueeText = styled('span')({
  display: 'inline-block',
  whiteSpace: 'nowrap',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${bounceMarquee} var(--marquee-duration, 8s) ease-in-out infinite`,
  },
});

const TruncationHint = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  color: theme.palette.warning.main,
  lineHeight: 1,
}));

const isExtensionItself = (link: string) => {
  try {
    const url = new URL(link);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
};

const getWebsiteDomain = (link: string) => {
  try {
    const url = new URL(link);
    return url.hostname;
  } catch {
    return link;
  }
};
