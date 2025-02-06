import { useTranslation } from 'react-i18next';

import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';

import { AvaxAmount } from './AvaxAmount';
import type { Avalanche } from '@avalabs/core-wallets-sdk';

export function ApproveRegisterL1Validator({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.RegisterL1ValidatorTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { txFee, balance } = tx;

  return (
    <>
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Details')} />
        <ApprovalSectionBody sx={{ justifyContent: 'start', py: 2.25 }}>
          <TxDetailsRow label={t('Initial balance')}>
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
