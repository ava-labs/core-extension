import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import { TruncatedIdentifier } from './TruncatedIdentifier';
import { AvaxAmount } from './AvaxAmount';
import type { Avalanche } from '@avalabs/core-wallets-sdk';

export function RemoveSubnetValidatorView({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.RemoveSubnetValidatorTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { txFee, nodeID, subnetID } = tx;

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
