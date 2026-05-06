import {
  Box,
  Link,
  Stack,
  styled,
  Tooltip,
  type TooltipProps,
  Typography,
} from '@avalabs/k2-alpine';
import { LinkItem } from '@avalabs/vm-module-types';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarningAmber } from 'react-icons/md';

import { TxDetailsRow } from './DetailRow';

type LinkDetailProps = {
  item: LinkItem;
};

export const LinkDetail = ({ item }: LinkDetailProps) => {
  const { t } = useTranslation();
  const [isTruncated, setIsTruncated] = useState(false);

  const onTextMounted = useCallback(
    (node: HTMLSpanElement | null) => {
      if (node) {
        setIsTruncated(node.scrollWidth > node.offsetWidth);
      }
    },
    // We want to re-evaluate truncation when the URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.value.url],
  );

  if (isExtensionItself(item.value.url)) {
    return null;
  }

  const fullUrl = item.value.url;
  const hostname = getWebsiteDomain(fullUrl);
  const truncationHintLabel = t('URL is truncated. Hover to see full address.');

  return (
    <TxDetailsRow label={item.label}>
      <Tooltip title={fullUrl} slotProps={tooltipSlotProps} arrow>
        <UrlContainer>
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
            <TruncatedUrl
              ref={onTextMounted}
              variant="body3"
              color="text.primary"
            >
              {hostname}
            </TruncatedUrl>
          </UrlLink>
          {isTruncated && (
            <TruncationHint aria-label={truncationHintLabel}>
              <MdWarningAmber size={16} />
            </TruncationHint>
          )}
        </UrlContainer>
      </Tooltip>
    </TxDetailsRow>
  );
};

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
