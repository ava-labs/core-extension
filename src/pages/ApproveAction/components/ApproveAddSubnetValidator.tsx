import { Divider, Typography } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import { TruncatedIdentifier } from './TruncatedIdentifier';
import { AvaxAmount } from './AvaxAmount';
import { Avalanche } from '@avalabs/core-wallets-sdk';

export function AddSubnetValidatorView({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.AddSubnetValidatorTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { txFee, nodeID, start, end, subnetID, stake } = tx;
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);

  return (
    <>
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Staking Details')} />
        <ApprovalSectionBody sx={{ justifyContent: 'start', py: 2.25 }}>
          <TxDetailsRow label={t('Subnet ID')}>
            <TruncatedIdentifier identifier={subnetID} />
          </TxDetailsRow>
          <TxDetailsRow label={t('Node ID')}>
            <TruncatedIdentifier identifier={nodeID} />
          </TxDetailsRow>
          <TxDetailsRow label={t('Stake Amount')}>
            <AvaxAmount amount={stake} avaxPrice={avaxPrice} />
          </TxDetailsRow>

          <Divider sx={{ my: 1.25 }} />

          <TxDetailsRow label={t('Start Date')}>
            <Typography variant="caption">
              {startDate.toLocaleString()}
            </Typography>
          </TxDetailsRow>

          <TxDetailsRow label={t('End Date')}>
            <Typography variant="caption">
              {endDate.toLocaleString()}
            </Typography>
          </TxDetailsRow>
        </ApprovalSectionBody>
      </ApprovalSection>
      <ApprovalSection>
        <ApprovalSectionHeader label={t('Network Fee')} />
        <ApprovalSectionBody>
          <TxDetailsRow label={t('Fee Amount')}>
            <AvaxAmount amount={txFee} avaxPrice={avaxPrice} />
          </TxDetailsRow>
        </ApprovalSectionBody>
      </ApprovalSection>
    </>
  );
}
