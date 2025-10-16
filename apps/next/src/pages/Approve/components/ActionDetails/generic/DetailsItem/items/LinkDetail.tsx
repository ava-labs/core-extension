import { Box, Link, Stack } from '@avalabs/k2-alpine';
import { LinkItem } from '@avalabs/vm-module-types';

import { OverflowingTypography } from '@/components/OverflowingTypography';

import { TxDetailsRow } from './DetailRow';

type LinkDetailProps = {
  item: LinkItem;
};

export const LinkDetail = ({ item }: LinkDetailProps) => {
  if (isExtensionItself(item.value.url)) {
    // Let's not link to the extension itself.
    return null;
  }

  return (
    <TxDetailsRow label={item.label}>
      <Stack direction="row" gap={0.5} alignItems="center" textAlign="right">
        <Box
          width={20}
          height={20}
          sx={{
            backgroundImage: `url(${item.value.icon})`,
            backgroundSize: 'contain',
          }}
        />
        <Link
          href={item.value.url}
          overflow="hidden"
          target="_blank"
          rel="noopener noreferrer"
        >
          <OverflowingTypography variant="body3" color="text.primary">
            {getWebsiteDomain(item.value.url)}
          </OverflowingTypography>
        </Link>
      </Stack>
    </TxDetailsRow>
  );
};

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
