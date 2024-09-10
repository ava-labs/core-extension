import {
  Link,
  LinkIcon,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import {
  type AddressItem,
  type CurrencyItem,
  type DetailItem,
  type LinkItem,
  type TextItem,
  DetailItemType,
} from '@avalabs/vm-module-types';
import { TokenUnit } from '@avalabs/core-utils-sdk';

import { AccountDetails } from '@src/pages/SignTransaction/components/ApprovalTxDetails';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

import { TxDetailsRow } from './TxDetailsRow';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { runtime } from 'webextension-polyfill';

export const TransactionDetailItem = ({ item }: { item: DetailItem }) => {
  if (typeof item === 'string') {
    return <PlainTextInfo item={item} />;
  }

  switch (item.type) {
    case DetailItemType.TEXT:
      return <TextInfo item={item} />;

    case DetailItemType.ADDRESS:
      return <AddressInfo item={item} />;

    case DetailItemType.LINK:
      return <LinkInfo item={item} />;

    case DetailItemType.CURRENCY:
      return <CurrencyInfo item={item} />;

    default:
      return null;
  }
};

const PlainTextInfo = ({ item }: { item: string }) => (
  <Typography variant="body2">{item}</Typography>
);

const TextInfo = ({ item }: { item: TextItem }) => (
  <TxDetailsRow label={item.label}>
    <Typography variant="caption">{item.value}</Typography>
  </TxDetailsRow>
);

const LinkInfo = ({ item }: { item: LinkItem }) => {
  const url = new URL(item.value.url);

  const isLinkToExtensionItself = url.hostname === runtime.id;

  // Do not link to ourselves
  if (isLinkToExtensionItself) {
    return null;
  }

  return (
    <TxDetailsRow label={item.label}>
      <Tooltip title={url.href}>
        <Stack direction="row" gap={0.5}>
          <Link
            href={url.href}
            target="_blank"
            rel="noreferrer"
            sx={{
              display: 'inline-flex',
              color: 'text.primary',
            }}
          >
            <LinkIcon size={14} />
          </Link>
          <Typography
            variant="caption"
            sx={{
              color: 'text.primary',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {url.hostname}
          </Typography>
        </Stack>
      </Tooltip>
    </TxDetailsRow>
  );
};

const AddressInfo = ({ item }: { item: AddressItem }) => (
  <AccountDetails label={item.label} address={item.value} />
);

const CurrencyInfo = ({ item }: { item: CurrencyItem }) => {
  const { currencyFormatter } = useSettingsContext();
  const { getTokenPrice } = useBalancesContext();
  const token = new TokenUnit(item.value, item.maxDecimals, item.symbol);
  const tokenPrice = getTokenPrice(item.symbol);

  return (
    <TxDetailsRow label={item.label}>
      <Stack>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'right',
            fontWeight: 'fontWeightSemibold',
          }}
        >
          {token.toDisplay()} {token.getSymbol()}
        </Typography>
        {tokenPrice ? (
          <Typography
            variant="caption"
            sx={{
              textAlign: 'right',
              color: 'text.secondary',
            }}
          >
            {currencyFormatter(
              tokenPrice * token.toDisplay({ asNumber: true })
            )}
          </Typography>
        ) : null}
      </Stack>
    </TxDetailsRow>
  );
};
