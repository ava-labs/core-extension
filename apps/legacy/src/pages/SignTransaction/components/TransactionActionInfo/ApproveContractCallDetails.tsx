import { Tooltip, Typography } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { TxDetailsRow } from '@/components/common/approval/TxDetailsRow';
import { truncateAddress } from '@avalabs/core-utils-sdk';

export function ApproveContractCallDetails({
  fromAddress,
  contract,
}: {
  fromAddress: string;
  contract?: {
    address: string;
    protocol?: {
      id: string;
      name: string;
      logoUri: string;
    };
  };
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
      {contract?.address && (
        <TxDetailsRow label={t('Contract')}>
          <Tooltip placement="top" title={contract.address}>
            <Typography variant="caption">
              {truncateAddress(contract.address)}
            </Typography>
          </Tooltip>
        </TxDetailsRow>
      )}
      {contract?.protocol && (
        <TxDetailsRow label={t('Protocol')}>
          <Typography variant="caption">{contract.protocol.name}</Typography>
        </TxDetailsRow>
      )}
    </>
  );
}
