import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-components';

import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';

import { TruncatedIdentifier } from './TruncatedIdentifier';
import { AvaxAmount } from './AvaxAmount';
import { Avalanche } from '@avalabs/wallets-sdk';

export function ApproveCreateSubnet({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.CreateSubnetTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { threshold, controlKeys, txFee } = tx;

  return (
    <>
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Subnet Details')} />
        <ApprovalSectionBody sx={{ justifyContent: 'start', py: 2.25 }}>
          <TxDetailsRow
            label={controlKeys.length > 1 ? t('Owners') : t('Owner')}
          >
            <Stack sx={{ gap: 0.5 }}>
              {controlKeys.map((key) => (
                <TruncatedIdentifier key={key} identifier={key} size={14} />
              ))}
            </Stack>
          </TxDetailsRow>
          {controlKeys.length > 1 && (
            <TxDetailsRow label={t('Signature Threshold')}>
              <Typography variant="caption">
                {threshold}/{controlKeys.length}
              </Typography>
            </TxDetailsRow>
          )}
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
