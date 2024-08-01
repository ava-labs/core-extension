import { Tooltip, Typography } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import { truncateAddress } from '@avalabs/core-utils-sdk';

export function ApproveTokenDetails({
  spender,
}: {
  spender: {
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
      <TxDetailsRow label={t('Spender')}>
        <Tooltip placement="top" title={spender.address}>
          <Typography variant="caption">
            {truncateAddress(spender.address)}
          </Typography>
        </Tooltip>
      </TxDetailsRow>

      {spender.protocol && (
        <TxDetailsRow label={t('Protocol')}>
          <Typography variant="caption" sx={{ color: 'text.primary' }}>
            {spender.protocol.name}
          </Typography>
        </TxDetailsRow>
      )}
    </>
  );
}
