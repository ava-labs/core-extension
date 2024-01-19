import { Tooltip, Typography } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import { truncateAddress } from '@avalabs/utils-sdk';

export function ApproveSendDetails({
  fromAddress,
  toAddress,
}: {
  fromAddress: string;
  toAddress: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <TxDetailsRow label={t('From')}>
        <Tooltip placement="top" title={fromAddress}>
          <Typography variant="caption">
            {truncateAddress(fromAddress)}
          </Typography>
        </Tooltip>
      </TxDetailsRow>
      <TxDetailsRow label={t('To')}>
        <Tooltip placement="top" title={toAddress}>
          <Typography variant="caption">
            {truncateAddress(toAddress)}
          </Typography>
        </Tooltip>
      </TxDetailsRow>
    </>
  );
}