import { AddressItem } from '@avalabs/vm-module-types';
import {
  IconButton,
  OutboundIcon,
  Stack,
  Tooltip,
  truncateAddress,
  Typography,
} from '@avalabs/k2-alpine';

import { useAccountsContext } from '@core/ui';

import { OverflowingTypography } from '@/components/OverflowingTypography';

import { TxDetailsRow } from './DetailRow';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getExplorerAddressByNetwork } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

type AddressDetailProps = {
  item: AddressItem;
  network: NetworkWithCaipId;
  forceLabel?: boolean;
};

export const AddressDetail = ({
  item,
  network,
  forceLabel = false,
}: AddressDetailProps) => {
  const { t } = useTranslation();
  const { getAccount } = useAccountsContext();
  const account = getAccount(item.value);
  const explorerLink = getExplorerAddressByNetwork(
    network,
    item.value,
    'address',
  );

  const label = useMemo(() => {
    if (account) {
      if (item.label === 'Account') {
        return t('From');
      } else if (item.label === 'Contract') {
        return t('To');
      }
    }
    return item.label;
  }, [account, item.label, t]);

  if (forceLabel) {
    return (
      <TxDetailsRow label={label}>
        <Stack textAlign="right">
          <OverflowingTypography variant="body3" color="text.secondary">
            {truncateAddress(item.value, 10)}
          </OverflowingTypography>
        </Stack>
      </TxDetailsRow>
    );
  }
  return (
    <TxDetailsRow label={label}>
      <Stack textAlign="right">
        {account && (
          <OverflowingTypography variant="body3" color="text.primary">
            {account.name}
          </OverflowingTypography>
        )}
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Typography variant="mono" color="text.secondary">
            {truncateAddress(item.value, 10)}
          </Typography>
          {!account && (
            <Tooltip title={t('View in Explorer')} arrow>
              <IconButton
                sx={{ padding: 0.25 }}
                size="small"
                onClick={async () => {
                  window.open(explorerLink, '_blank', 'noreferrer');
                }}
                data-testid="explorer-link"
              >
                <OutboundIcon size={16} viewBox="0 0 24 24" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </TxDetailsRow>
  );
};
