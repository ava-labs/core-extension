import { useTranslation } from 'react-i18next';

import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from 'packages/ui/src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from 'packages/ui/src/components/common/approval/TxDetailsRow';

import { AvaxAmount } from './AvaxAmount';
import { Avalanche } from '@avalabs/core-wallets-sdk';

export function ApproveSetL1ValidatorWeight({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.SetL1ValidatorWeightTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { txFee } = tx;

  return (
    <>
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
