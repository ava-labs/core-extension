import { useTranslation } from 'react-i18next';

import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@/components/common/approval/TxDetailsRow';

import { AvaxAmount } from './AvaxAmount';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { TruncatedIdentifier } from './TruncatedIdentifier';

export function ApproveDisableL1Validator({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.DisableL1ValidatorTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();

  const { txFee, validationId } = tx;

  return (
    <>
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Details')} />
        <ApprovalSectionBody sx={{ justifyContent: 'start', py: 2.25 }}>
          <TxDetailsRow label={t('Validation ID')}>
            <TruncatedIdentifier identifier={validationId} />
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
