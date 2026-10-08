import {
  DetailItemType,
  Transfer,
  TransferListItem,
} from '@avalabs/vm-module-types';
import { Divider, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { NetworkWithCaipId } from '@core/types';
import { AddressDetail } from './AddressDetail';
import { CurrencyDetail } from './CurrencyDetail';
import { DateDetail } from './DateDetail';
import { TxDetailsRow } from './DetailRow';
import { TextDetail } from './TextDetail';

type TransferListDetailProps = {
  item: TransferListItem;
  network: NetworkWithCaipId;
};

type LockedUntil = Transfer['lockedUntil'];

const _isLocked = (
  lockedUntil: LockedUntil,
): lockedUntil is NonNullable<LockedUntil> =>
  lockedUntil === 'indefinitely' ||
  (lockedUntil !== undefined && lockedUntil * 1000 > Date.now());

const _shouldDisplayThreshold = (
  addresses: string[],
  threshold?: number,
): threshold is number =>
  threshold !== undefined && (threshold > 1 || addresses.length > 1);

const LockedUntilRow = ({
  label,
  lockedUntil,
}: {
  label: string;
  lockedUntil: NonNullable<LockedUntil>;
}) => {
  const { t } = useTranslation();

  return lockedUntil === 'indefinitely' ? (
    <TextDetail
      item={{
        label,
        type: DetailItemType.TEXT,
        value: t('Indefinitely'),
        alignment: 'horizontal',
      }}
    />
  ) : (
    <DateDetail
      item={{ label, type: DetailItemType.DATE, value: String(lockedUntil) }}
    />
  );
};

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
    isStaked,
    stakedUntil,
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
        addresses.map((address, index) => (
          <AddressDetail
            key={address}
            item={{
              label:
                addresses.length > 1
                  ? t('To ({{index}}/{{total}})', {
                      index: index + 1,
                      total: addresses.length,
                    })
                  : t('To'),
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
      {isStaked &&
        (stakedUntil === undefined ? (
          <TxDetailsRow label={t('Staked')}>
            <Typography variant="body3">
              {t('Until the validator stops')}
            </Typography>
          </TxDetailsRow>
        ) : (
          <LockedUntilRow label={t('Staked until')} lockedUntil={stakedUntil} />
        ))}
      {_shouldDisplayThreshold(addresses, threshold) && (
        <TxDetailsRow label={t('Signatures required')}>
          <Typography variant="body3">
            {addresses.length > 0
              ? `${threshold}/${addresses.length}`
              : threshold}
          </Typography>
        </TxDetailsRow>
      )}
      {_isLocked(lockedUntil) && (
        <LockedUntilRow label={t('Locked until')} lockedUntil={lockedUntil} />
      )}
      {_isLocked(stakeableLockedUntil) && (
        <LockedUntilRow
          label={t('Staking only until')}
          lockedUntil={stakeableLockedUntil}
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
    <Stack width="100%" pb={1}>
      {transfers.map((transfer, index) => (
        <Stack key={index}>
          {index > 0 && <Divider sx={{ marginInline: 2, my: 0.5 }} />}
          <TransferRows transfer={transfer} network={network} />
        </Stack>
      ))}
    </Stack>
  );
};
