import {
  DetailItemType,
  Transfer,
  TransferListItem,
} from '@avalabs/vm-module-types';
import { Divider, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { NetworkWithCaipId } from '@core/types';
import { NoScrollStack } from '@/components/NoScrollStack';
import { AddressDetail } from './AddressDetail';
import { CurrencyDetail } from './CurrencyDetail';
import { DateDetail } from './DateDetail';
import { TxDetailsRow } from './DetailRow';

type TransferListDetailProps = {
  item: TransferListItem;
  network: NetworkWithCaipId;
};

const MAX_HEIGHT = 260;

const _isLocked = (seconds?: number): seconds is number =>
  seconds !== undefined && seconds * 1000 > Date.now();

const TransferRows = ({
  transfer,
  network,
}: {
  transfer: Transfer;
  network: NetworkWithCaipId;
}) => {
  const { t } = useTranslation();
  const {
    addresses,
    amount,
    assetId,
    symbol,
    decimals,
    assetName,
    threshold,
    lockedUntil,
    stakeableLockedUntil,
    isNativeToken,
  } = transfer;

  return (
    <>
      {addresses.length === 0 ? (
        <TxDetailsRow label={t('To')}>
          <Typography variant="body3" color="text.secondary">
            {t('Unknown — unable to parse output')}
          </Typography>
        </TxDetailsRow>
      ) : (
        addresses.map((address) => (
          <AddressDetail
            key={address}
            item={{
              label: t('To'),
              type: DetailItemType.ADDRESS,
              value: address,
            }}
            network={network}
          />
        ))
      )}
      {symbol && decimals !== undefined ? (
        <CurrencyDetail
          item={{
            label: t('Amount'),
            type: DetailItemType.CURRENCY,
            value: amount,
            maxDecimals: decimals,
            symbol,
            isNativeToken,
          }}
          network={network}
        />
      ) : (
        // unknown asset, show raw value and asset id
        <>
          <TxDetailsRow label={t('Amount')}>
            <Typography variant="body3">{amount.toString()}</Typography>
          </TxDetailsRow>
          <TxDetailsRow label={t('Asset')} alignItems="start">
            <Typography
              variant="mono"
              color="text.secondary"
              sx={{ minWidth: 0, textAlign: 'right', wordBreak: 'break-all' }}
            >
              {assetId}
            </Typography>
          </TxDetailsRow>
        </>
      )}
      {assetName && (
        <TxDetailsRow label={t('Asset')}>
          <Typography variant="body3">{assetName}</Typography>
        </TxDetailsRow>
      )}
      {threshold !== undefined && threshold > 1 && (
        <TxDetailsRow label={t('Signatures required')}>
          <Typography variant="body3">
            {threshold}/{addresses.length}
          </Typography>
        </TxDetailsRow>
      )}
      {_isLocked(lockedUntil) && (
        <DateDetail
          item={{
            label: t('Locked until'),
            type: DetailItemType.DATE,
            value: String(lockedUntil),
          }}
        />
      )}
      {_isLocked(stakeableLockedUntil) && (
        <DateDetail
          item={{
            label: t('Staking only until'),
            type: DetailItemType.DATE,
            value: String(stakeableLockedUntil),
          }}
        />
      )}
    </>
  );
};

export const TransferListDetail = ({
  item,
  network,
}: TransferListDetailProps) => {
  const transfers = item.value;

  return (
    <NoScrollStack autoHeight autoHeightMax={MAX_HEIGHT}>
      <Stack width="100%" pb={1}>
        {transfers.map((transfer, index) => (
          <Stack key={index}>
            {index > 0 && <Divider sx={{ marginInline: 2, my: 0.5 }} />}
            <TransferRows transfer={transfer} network={network} />
          </Stack>
        ))}
      </Stack>
    </NoScrollStack>
  );
};
