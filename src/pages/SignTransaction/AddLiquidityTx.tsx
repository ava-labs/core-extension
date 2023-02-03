import { useTranslation } from 'react-i18next';
import {
  CodeIcon,
  IconButton,
  PlusIcon,
  Stack,
  useTheme,
} from '@avalabs/k2-components';

import { AddLiquidityDisplayData } from '@src/contracts/contractParsers/models';
import {
  TokenWithAmountAndValue,
  TxBalanceChange,
} from './components/TxBalanceChange';
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

const PoolTokenDivider = () => (
  <PlusIcon size={20} sx={{ px: 0.75, py: 1.75 }} />
);

export function AddLiquidityTx({
  poolTokens,
  toAddress,
  fromAddress,
  setShowRawTransactionData,
  network,
}: AddLiquidityDisplayData) {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  const tokensFormatted = poolTokens.map<TokenWithAmountAndValue>((p) => ({
    ...p,
    amount: p.amountDepositedDisplayValue,
    value: Number(p.amountUSDValue),
  }));

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
        <ApprovalSectionBody sx={{ py: spacing(1) }}>
          {fromAddress && <AccountDetails address={fromAddress} />}
          {toAddress && (
            <ContractDetails contractAddress={toAddress} network={network} />
          )}
          {network && <NetworkDetails network={network} />}
        </ApprovalSectionBody>
      </ApprovalSection>
      <TxBalanceChange
        tokens={tokensFormatted}
        transactionType={t('Pool')}
        divider={<PoolTokenDivider />}
      />
    </Stack>
  );
}
