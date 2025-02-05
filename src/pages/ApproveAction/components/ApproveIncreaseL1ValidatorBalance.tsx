import { useTranslation } from 'react-i18next';

import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';

import { AvaxAmount } from './AvaxAmount';
import type { Avalanche } from '@avalabs/core-wallets-sdk';
import { TruncatedIdentifier } from './TruncatedIdentifier';

export function ApproveIncreaseL1ValidatorBalance({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.IncreaseL1ValidatorBalanceTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();

  const { txFee, balance, validationId } = tx;

  return (
    <>
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Details')} />
        <ApprovalSectionBody sx={{ justifyContent: 'start', py: 2.25 }}>
          <TxDetailsRow label={t('Validation ID')}>
            <TruncatedIdentifier identifier={validationId} />
          </TxDetailsRow>
          <TxDetailsRow label={t('Increase by amount')}>
            <AvaxAmount amount={balance} avaxPrice={avaxPrice} />
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
