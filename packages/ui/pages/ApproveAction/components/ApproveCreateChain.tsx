import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@avalabs/core-k2-components';

import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from 'packages/ui/src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from 'packages/ui/src/components/common/approval/TxDetailsRow';

import { AvaxAmount } from './AvaxAmount';
import { TruncatedIdentifier } from './TruncatedIdentifier';
import { BlockchainGenesisFile } from './BlockchainGenesisFile';
import { Avalanche } from '@avalabs/core-wallets-sdk';

export function ApproveCreateChain({
  tx,
  avaxPrice,
}: {
  tx: Avalanche.CreateChainTx;
  avaxPrice: number;
}) {
  const { t } = useTranslation();
  const { chainID, chainName, vmID, genesisData, txFee } = tx;

  const [isGenesisFileShown, setIsGenesisFileShown] = useState(false);

  return (
    <>
      {isGenesisFileShown && (
        <BlockchainGenesisFile
          data={genesisData}
          onClose={() => setIsGenesisFileShown(false)}
        />
      )}
      <ApprovalSection sx={{ gap: 1 }}>
        <ApprovalSectionHeader label={t('Blockchain Details')} />
        <ApprovalSectionBody sx={{ justifyContent: 'start', py: 2.25 }}>
          <TxDetailsRow label={t('Blockchain Name')}>
            <Typography variant="caption">{chainName}</Typography>
          </TxDetailsRow>
          <TxDetailsRow label={t('Blockchain ID')}>
            <TruncatedIdentifier identifier={chainID} />
          </TxDetailsRow>
          <TxDetailsRow label={t('Genesis File')}>
            <Button
              variant="text"
              size="small"
              onClick={() => setIsGenesisFileShown(true)}
            >
              {t('View')}
            </Button>
          </TxDetailsRow>
          <TxDetailsRow label={t('Virtual Machine ID')}>
            <TruncatedIdentifier identifier={vmID} />
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
