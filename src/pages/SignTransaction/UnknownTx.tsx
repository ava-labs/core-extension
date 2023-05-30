import { TransactionDisplayValues } from '@src/background/services/transactions/models';
import { useTranslation } from 'react-i18next';
import {
  CodeIcon,
  IconButton,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from './components/ApprovalSection';
import {
  AccountDetails,
  ContractDetails,
  NetworkDetails,
} from './components/ApprovalTxDetails';
import { TxDetailsRow } from './components/TxDetailsRow';

export function UnknownTx({
  fromAddress,
  toAddress,
  network,
  displayValue,
  name: transactionType,
  setShowRawTransactionData,
}: TransactionDisplayValues) {
  const { t } = useTranslation();
  const hasTokenAmount = Boolean(displayValue);
  const txSummaryHeader = hasTokenAmount
    ? t('Balance Change')
    : t('Transaction Summary');

  return (
    <Stack sx={{ width: '100%', gap: 3, pt: 1 }}>
      <ApprovalSection>
        <ApprovalSectionHeader label={t('Transaction Details')}>
          <IconButton
            size="small"
            sx={{ px: 0, minWidth: 'auto' }}
            onClick={() => setShowRawTransactionData(true)}
          >
            <CodeIcon />
          </IconButton>
        </ApprovalSectionHeader>
        <ApprovalSectionBody sx={{ py: 1 }}>
          {fromAddress && <AccountDetails address={fromAddress} />}
          {toAddress && (
            <ContractDetails contractAddress={toAddress} network={network} />
          )}
          {network && <NetworkDetails network={network} />}
        </ApprovalSectionBody>
      </ApprovalSection>
      <ApprovalSection>
        <ApprovalSectionHeader label={txSummaryHeader} />
        <ApprovalSectionBody divider={null} sx={{ gap: 1, py: 1 }}>
          <TxDetailsRow label={t('Transaction Type')}>
            <Typography variant="caption">
              {!toAddress ? t('Contract deployment') : transactionType}
            </Typography>
          </TxDetailsRow>
          {hasTokenAmount && (
            <TxDetailsRow label={t('Token Amount')}>
              <Typography variant="caption">{displayValue}</Typography>
            </TxDetailsRow>
          )}
        </ApprovalSectionBody>
      </ApprovalSection>
    </Stack>
  );
}
