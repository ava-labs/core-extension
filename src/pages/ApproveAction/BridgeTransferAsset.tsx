import { Action } from '@src/background/services/actions/models';
import { useTranslation } from 'react-i18next';
import { Stack, Typography, Divider } from '@avalabs/k2-components';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import { NetworkLogo } from '@src/components/common/NetworkLogo';
import { TokenAmount } from '@src/components/common/TokenAmount';
import Big from 'big.js';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

export function BridgeTransferAsset({ action }: { action: Action }) {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();
  const { displayData } = action;

  const fiatValue: Big | undefined =
    displayData.token?.priceUSD &&
    new Big(displayData.amountStr).times(displayData.token.priceUSD);

  return (
    <Stack sx={{ flexGrow: 1, width: 1 }}>
      <Typography
        component="h1"
        sx={{ mt: 1.5, mb: 3.5, fontSize: 24, fontWeight: 'bold' }}
      >
        {t('Bridge Approval')}
      </Typography>
      <ApprovalSection>
        <ApprovalSectionHeader
          label={t('Transaction Details')}
        ></ApprovalSectionHeader>
        <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
          <TxDetailsRow label={t('App')}>
            <Typography variant="caption">
              {action.site?.domain ?? ''}
            </Typography>
          </TxDetailsRow>
          <TxDetailsRow label={t('From')}>
            <Typography variant="caption">
              {displayData.sourceNetwork?.chainName}
            </Typography>
            <NetworkLogo
              src={displayData.sourceNetwork?.logoUri}
              width="16px"
              height="16px"
              defaultSize={16}
            />
          </TxDetailsRow>
          <TxDetailsRow label={t('To')}>
            <Typography variant="caption">
              {displayData.targetNetwork?.chainName}
            </Typography>
            <NetworkLogo
              src={displayData.targetNetwork?.logoUri}
              width="16px"
              height="16px"
              defaultSize={16}
            />
          </TxDetailsRow>
        </ApprovalSectionBody>
      </ApprovalSection>
      <ApprovalSection sx={{ mt: 3 }}>
        <ApprovalSectionHeader
          label={t('Balance Change')}
        ></ApprovalSectionHeader>
        <ApprovalSectionBody sx={{ p: 2 }}>
          <TxDetailsRow label={t('Transaction Type')}>
            <Typography variant="caption">{t('Bridge')}</Typography>
          </TxDetailsRow>
          <Divider sx={{ mb: 1 }} />
          <TokenAmount
            token={displayData.token}
            amount={displayData.amountStr}
            fiatValue={fiatValue ? currencyFormatter(fiatValue.toNumber()) : ''}
          />
        </ApprovalSectionBody>
      </ApprovalSection>
    </Stack>
  );
}
