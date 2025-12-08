import {
  Link,
  LinkIcon,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import {
  type AddressItem,
  type CurrencyItem,
  type DetailItem,
  type LinkItem,
  type TextItem,
  DetailItemType,
  FundsRecipientItem,
} from '@avalabs/vm-module-types';

import { useSettingsContext, useTokenPrice } from '@core/ui';
import { AccountDetails } from '@/pages/SignTransaction/components/ApprovalTxDetails';

import { useAccountsContext } from '@core/ui';
import { useContactsContext } from '@core/ui';
import { truncateAddress } from '@core/common';
import { runtime } from 'webextension-polyfill';
import { TxDetailsRow } from './TxDetailsRow';

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

    case DetailItemType.FUNDS_RECIPIENT:
      return <FundsRecipientInfo item={item} />;

    default:
      return null;
  }
};

const PlainTextInfo = ({ item }: { item: string }) => (
  <Typography variant="body2">{item}</Typography>
);

const TextInfo = ({ item }: { item: TextItem }) => (
  <TxDetailsRow label={item.label}>
    <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
      {item.value}
    </Typography>
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

const FundsRecipientInfo = ({ item }: { item: FundsRecipientItem }) => {
  const { currencyFormatter } = useSettingsContext();
  const { getContactByAddress } = useContactsContext();
  const { getAccount } = useAccountsContext();

  const token = new TokenUnit(item.amount, item.maxDecimals, item.symbol);
  const tokenPrice = useTokenPrice(item.symbol);
  const contact = getAccount(item.label) ?? getContactByAddress(item.label);

  return (
    <TxDetailsRow
      label={
        <Tooltip title={item.label}>
          <Typography variant="caption" color="text.secondary">
            {contact?.name || truncateAddress(item.label)}
          </Typography>
        </Tooltip>
      }
    >
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
              tokenPrice * token.toDisplay({ asNumber: true }),
            )}
          </Typography>
        ) : null}
      </Stack>
    </TxDetailsRow>
  );
};

const CurrencyInfo = ({ item }: { item: CurrencyItem }) => {
  const { currencyFormatter } = useSettingsContext();
  const token = new TokenUnit(item.value, item.maxDecimals, item.symbol);
  const tokenPrice = useTokenPrice(item.symbol);

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
              tokenPrice * token.toDisplay({ asNumber: true }),
            )}
          </Typography>
        ) : null}
      </Stack>
    </TxDetailsRow>
  );
};
