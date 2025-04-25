import { useTranslation } from 'react-i18next';
import { Divider, Stack, Typography } from '@avalabs/core-k2-components';

import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@/components/common/approval/TxDetailsRow';

import { TruncatedIdentifier } from './TruncatedIdentifier';
import { AvaxAmount } from './AvaxAmount';
import { Avalanche } from '@avalabs/core-wallets-sdk';

export function ApproveConvertSubnetToL1({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.ConvertSubnetToL1Tx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { txFee, chainID, managerAddress, subnetID, validators } = tx;

  return (
    <>
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Subnet Details')} />
        <ApprovalSectionBody sx={{ justifyContent: 'start', py: 2.25 }}>
          <TxDetailsRow label={t('Subnet ID')}>
            <TruncatedIdentifier identifier={subnetID} size={14} />
          </TxDetailsRow>
          <TxDetailsRow label={t('Chain ID')}>
            <TruncatedIdentifier identifier={chainID} size={14} />
          </TxDetailsRow>
          <TxDetailsRow label={t('Manager Address')}>
            <TruncatedIdentifier identifier={managerAddress} size={14} />
          </TxDetailsRow>
        </ApprovalSectionBody>
      </ApprovalSection>
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Validators')} />
        <ApprovalSectionBody
          sx={{ justifyContent: 'start', py: 2.25 }}
          divider={<Divider sx={{ my: 1.5 }} />}
        >
          {validators.map(
            ({
              balance,
              stake,
              nodeId,
              remainingBalanceOwners,
              deactivationOwners,
            }) => (
              <Stack key={nodeId} sx={{ gap: 0.5 }}>
                <TxDetailsRow label={t('Node ID')}>
                  <TruncatedIdentifier identifier={nodeId} size={14} />
                </TxDetailsRow>
                <TxDetailsRow label={t('Balance')}>
                  <AvaxAmount amount={balance} avaxPrice={avaxPrice} />
                </TxDetailsRow>
                <TxDetailsRow label={t('Stake')}>
                  <AvaxAmount amount={stake} avaxPrice={avaxPrice} />
                </TxDetailsRow>
                <Stack sx={{ gap: 1, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('Owners Able to Deactivate')}
                  </Typography>
                  <Stack sx={{ pl: 2, gap: 0.5 }}>
                    {deactivationOwners.map((address) => (
                      <TruncatedIdentifier
                        key={address}
                        identifier={address}
                        size={14}
                      />
                    ))}
                  </Stack>
                </Stack>
                <Stack sx={{ gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('Owners of the Remaining Balance')}
                  </Typography>
                  <Stack sx={{ pl: 2, gap: 0.5 }}>
                    {remainingBalanceOwners.map((address) => (
                      <TruncatedIdentifier
                        key={address}
                        identifier={address}
                        size={14}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            ),
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
