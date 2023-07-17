import { useTranslation } from 'react-i18next';
import { Divider, Typography } from '@avalabs/k2-components';

import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';

import { TruncatedIdentifier } from './TruncatedIdentifier';
import { AvaxAmount } from './AvaxAmount';
import { Avalanche } from '@avalabs/wallets-sdk';

type AddValidatorProps = {
  tx: Avalanche.AddValidatorTx;
  avaxPrice: number;
};

export function AddValidator({ tx, avaxPrice }: AddValidatorProps) {
  const { t } = useTranslation();
  const { nodeID, fee, start, end, stake } = tx;
  const startDate = new Date(parseInt(start) * 1000);
  const endDate = new Date(parseInt(end) * 1000);

  return (
    <>
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Staking Details')} />
        <ApprovalSectionBody sx={{ justifyContent: 'start', py: 2.25 }}>
          <TxDetailsRow label={t('Node ID')}>
            <TruncatedIdentifier identifier={nodeID} />
          </TxDetailsRow>
          <TxDetailsRow label={t('Stake Amount')}>
            <AvaxAmount amount={stake} avaxPrice={avaxPrice} />
          </TxDetailsRow>
          <TxDetailsRow label={t('Delegation Fee')}>
            <Typography variant="caption">{fee / 10000}%</Typography>
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
            <AvaxAmount amount={0n} avaxPrice={avaxPrice} />
          </TxDetailsRow>
        </ApprovalSectionBody>
      </ApprovalSection>
    </>
  );
}
